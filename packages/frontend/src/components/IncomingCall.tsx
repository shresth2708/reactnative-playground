import { useRef, useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { usePlaygroundStore } from '../store/playgroundStore';

interface IncomingCallProps {
  callerUserId: string;
  callerUserName: string;
  offer: RTCSessionDescriptionInit;
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCall({
  callerUserId,
  callerUserName,
  offer,
  onAccept,
  onReject
}: IncomingCallProps) {
  const { socket } = usePlaygroundStore();
  const [_localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [_remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const handleAccept = async () => {
    if (!socket) return;

    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      peerConnectionRef.current = peerConnection;

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('video:ice-candidate', {
            targetUserId: callerUserId,
            candidate: event.candidate
          });
        }
      };

      // Set remote description and create answer
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Send answer
      socket.emit('video:answer-call', {
        targetUserId: callerUserId,
        answer: peerConnection.localDescription
      });

      setIsAccepted(true);
      onAccept();
    } catch (err) {
      console.error('Error accepting call:', err);
      alert('Could not access camera/microphone');
      onReject();
    }
  };

  const handleReject = () => {
    if (socket) {
      socket.emit('video:reject-call', { targetUserId: callerUserId });
    }
    onReject();
  };

  if (!isAccepted) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Phone className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Incoming Call</h3>
            <p className="text-gray-300">{callerUserName} is calling you</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleReject}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
