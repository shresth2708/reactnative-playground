import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Collection, ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: number;
  lastLogin?: number;
}

export interface UserPlayground {
  _id?: ObjectId;
  userId: ObjectId;
  name: string;
  files: any[];
  createdAt: number;
  updatedAt: number;
}

export interface CollaborationRoom {
  _id?: ObjectId;
  roomId: string;
  name: string;
  createdBy: ObjectId;
  participants: Array<{
    userId: ObjectId;
    userName: string;
    joinedAt: number;
    lastActive: number;
  }>;
  files: any[];
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export class AuthService {
  private users: Collection<User> | null = null;
  private playgrounds: Collection<UserPlayground> | null = null;
  private rooms: Collection<CollaborationRoom> | null = null;

  setCollections(users: Collection<User>, playgrounds: Collection<UserPlayground>, rooms: Collection<CollaborationRoom>) {
    this.users = users;
    this.playgrounds = playgrounds;
    this.rooms = rooms;
  }

  async register(email: string, password: string, name: string) {
    if (!this.users) throw new Error('Database not initialized');

    const existingUser = await this.users.findOne({ email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      email,
      password: hashedPassword,
      name,
      createdAt: Date.now(),
    };

    const result = await this.users.insertOne(user);
    const token = jwt.sign({ userId: result.insertedId, email }, JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: result.insertedId,
        email,
        name,
      },
    };
  }

  async login(email: string, password: string) {
    if (!this.users) throw new Error('Database not initialized');

    const user = await this.users.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    await this.users.updateOne({ _id: user._id }, { $set: { lastLogin: Date.now() } });

    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    };
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch {
      return null;
    }
  }

  async getUserById(userId: string) {
    if (!this.users) throw new Error('Database not initialized');

    const user = await this.users.findOne({ _id: new ObjectId(userId) });
    if (!user) return null;

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  async savePlayground(userId: string, name: string, files: any[]) {
    if (!this.playgrounds) throw new Error('Database not initialized');

    const playground: UserPlayground = {
      userId: new ObjectId(userId),
      name,
      files,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await this.playgrounds.insertOne(playground);
    return result.insertedId;
  }

  async getUserPlaygrounds(userId: string) {
    if (!this.playgrounds) throw new Error('Database not initialized');

    const playgrounds = await this.playgrounds
      .find({ userId: new ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .toArray();

    return playgrounds.map(p => ({
      id: p._id,
      name: p.name,
      files: p.files,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
  }

  async getPlayground(playgroundId: string, userId: string) {
    if (!this.playgrounds) throw new Error('Database not initialized');

    const playground = await this.playgrounds.findOne({
      _id: new ObjectId(playgroundId),
      userId: new ObjectId(userId),
    });

    if (!playground) return null;

    return {
      id: playground._id,
      name: playground.name,
      files: playground.files,
      createdAt: playground.createdAt,
      updatedAt: playground.updatedAt,
    };
  }

  async updatePlayground(playgroundId: string, userId: string, name: string, files: any[]) {
    if (!this.playgrounds) throw new Error('Database not initialized');

    await this.playgrounds.updateOne(
      { _id: new ObjectId(playgroundId), userId: new ObjectId(userId) },
      { $set: { name, files, updatedAt: Date.now() } }
    );
  }

  async deletePlayground(playgroundId: string, userId: string) {
    if (!this.playgrounds) throw new Error('Database not initialized');

    await this.playgrounds.deleteOne({
      _id: new ObjectId(playgroundId),
      userId: new ObjectId(userId),
    });
  }

  async saveCollaborationRoom(roomId: string, name: string, createdBy: string, files: any[]) {
    if (!this.rooms) throw new Error('Database not initialized');

    const room: CollaborationRoom = {
      roomId,
      name,
      createdBy: new ObjectId(createdBy),
      participants: [{
        userId: new ObjectId(createdBy),
        userName: 'Creator',
        joinedAt: Date.now(),
        lastActive: Date.now(),
      }],
      files,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isActive: true,
    };

    const result = await this.rooms.insertOne(room);
    return result.insertedId;
  }

  async joinCollaborationRoom(roomId: string, userId: string, userName: string) {
    if (!this.rooms) throw new Error('Database not initialized');

    await this.rooms.updateOne(
      { roomId },
      {
        $addToSet: {
          participants: {
            userId: new ObjectId(userId),
            userName,
            joinedAt: Date.now(),
            lastActive: Date.now(),
          },
        },
        $set: { updatedAt: Date.now() },
      }
    );
  }

  async updateRoomActivity(roomId: string, userId: string) {
    if (!this.rooms) throw new Error('Database not initialized');

    await this.rooms.updateOne(
      { roomId, 'participants.userId': new ObjectId(userId) },
      {
        $set: {
          'participants.$.lastActive': Date.now(),
          updatedAt: Date.now(),
        },
      }
    );
  }

  async getUserRooms(userId: string) {
    if (!this.rooms) throw new Error('Database not initialized');

    const rooms = await this.rooms
      .find({ 'participants.userId': new ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .toArray();

    return rooms.map(r => ({
      id: r._id,
      roomId: r.roomId,
      name: r.name,
      participants: r.participants.length,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      isActive: r.isActive,
    }));
  }

  async getRoom(roomId: string) {
    if (!this.rooms) throw new Error('Database not initialized');

    const room = await this.rooms.findOne({ roomId });
    if (!room) return null;

    return {
      id: room._id,
      roomId: room.roomId,
      name: room.name,
      participants: room.participants,
      files: room.files,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
      isActive: room.isActive,
    };
  }

  async updateRoomFiles(roomId: string, files: any[]) {
    if (!this.rooms) throw new Error('Database not initialized');

    await this.rooms.updateOne(
      { roomId },
      { $set: { files, updatedAt: Date.now() } }
    );
  }
}

export const authService = new AuthService();
