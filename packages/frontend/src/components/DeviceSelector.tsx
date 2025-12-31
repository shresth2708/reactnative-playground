import { useState } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { usePlaygroundStore } from '../store/playgroundStore';

const devices = [
  // Web
  { id: 'web-full', name: 'Web (Full)', type: 'web', width: 1920, height: 1080 },
  { id: 'web-laptop', name: 'Laptop', type: 'web', width: 1440, height: 900 },
  { id: 'web-tablet', name: 'Tablet', type: 'web', width: 1024, height: 768 },
  
  // iPhone
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', type: 'ios', width: 393, height: 852 },
  { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', type: 'ios', width: 430, height: 932 },
  { id: 'iphone-14', name: 'iPhone 14', type: 'ios', width: 390, height: 844 },
  { id: 'iphone-se', name: 'iPhone SE', type: 'ios', width: 375, height: 667 },
  
  // iPad
  { id: 'ipad-pro-13', name: 'iPad Pro 13"', type: 'ios', width: 1024, height: 1366 },
  { id: 'ipad-air', name: 'iPad Air', type: 'ios', width: 820, height: 1180 },
  { id: 'ipad-mini', name: 'iPad Mini', type: 'ios', width: 744, height: 1133 },
  
  // Android
  { id: 'pixel-8', name: 'Pixel 8', type: 'android', width: 412, height: 915 },
  { id: 'pixel-7', name: 'Pixel 7', type: 'android', width: 412, height: 915 },
  { id: 'galaxy-s24', name: 'Galaxy S24', type: 'android', width: 360, height: 780 },
  { id: 'galaxy-fold', name: 'Galaxy Fold', type: 'android', width: 884, height: 1104 },
];

export default function DeviceSelector() {
  const { previewMode, setPreviewMode, deviceFrame, setDeviceFrame } = usePlaygroundStore();
  const [showDevices, setShowDevices] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [zoom, setZoom] = useState(100);
  
  const currentDevice = devices.find((d) => d.id === deviceFrame) || devices[3];
  
  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 50));
  
  return (
    <div className="flex items-center gap-2">
      {/* Device Type Selector */}
      <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => setPreviewMode('web')}
          className={`p-2 rounded-md transition-all duration-200 ${
            previewMode === 'web' ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-300'
          }`}
          title="Web"
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPreviewMode('ios')}
          className={`p-2 rounded-md transition-all duration-200 ${
            previewMode === 'ios' ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-300'
          }`}
          title="iOS"
        >
          <Smartphone className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPreviewMode('android')}
          className={`p-2 rounded-md transition-all duration-200 ${
            previewMode === 'android' ? 'bg-lime-500/20 text-lime-400' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-300'
          }`}
          title="Android"
        >
          <Tablet className="w-4 h-4" />
        </button>
      </div>
      
      {/* Device Model Selector */}
      <div className="relative">
        <button
          onClick={() => setShowDevices(!showDevices)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-all duration-200 border border-slate-600/50"
        >
          {currentDevice.name}
        </button>
        
        {showDevices && (
          <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-600/50 rounded-xl shadow-2xl backdrop-blur-xl z-20 min-w-[200px] max-h-[400px] overflow-y-auto">
            {devices
              .filter((d) => d.type === previewMode)
              .map((device) => (
                <button
                  key={device.id}
                  onClick={() => {
                    setDeviceFrame(device.id);
                    setShowDevices(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-slate-700/50 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl ${
                    device.id === deviceFrame ? 'bg-lime-500/20 text-lime-400' : 'text-slate-300'
                  }`}
                >
                  <div>{device.name}</div>
                  <div className="text-xs text-slate-500">
                    {device.width} × {device.height}
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
      
      {/* Orientation Toggle */}
      <button
        onClick={() => setIsLandscape(!isLandscape)}
        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-300 rounded-lg transition-all duration-200"
        title="Rotate"
      >
        <RotateCw className="w-4 h-4" />
      </button>
      
      {/* Zoom Controls */}
      <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-slate-300 rounded-md transition-all duration-200"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400 px-3 min-w-[50px] text-center font-medium">{zoom}%</span>
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-slate-300 rounded-md transition-all duration-200"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
