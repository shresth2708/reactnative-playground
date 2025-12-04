import { MongoClient, Db, Collection } from 'mongodb';
import { authService, User, UserPlayground, CollaborationRoom } from './auth.js';

interface SharedProject {
  shareId: string;
  projectData: any;
  createdAt: number;
  updatedAt: number;
  views: number;
}

class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private projects: Collection<SharedProject> | null = null;
  private users: Collection<User> | null = null;
  private playgrounds: Collection<UserPlayground> | null = null;
  private rooms: Collection<CollaborationRoom> | null = null;
  private connected: boolean = false;

  async connect() {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb+srv://agnik:agnik@1234@cluster0.gxtgz3y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

      this.client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4
        tls: true,
        tlsAllowInvalidCertificates: true, // For development only
      });
      await this.client.connect();

      this.db = this.client.db('rn-playground');
      this.projects = this.db.collection<SharedProject>('projects');
      this.users = this.db.collection<User>('users');
      this.playgrounds = this.db.collection<UserPlayground>('playgrounds');
      this.rooms = this.db.collection<CollaborationRoom>('rooms');

      // Create indexes
      await this.projects.createIndex({ shareId: 1 }, { unique: true });
      await this.projects.createIndex({ createdAt: 1 });
      await this.users.createIndex({ email: 1 }, { unique: true });
      await this.playgrounds.createIndex({ userId: 1 });
      await this.playgrounds.createIndex({ updatedAt: -1 });
      await this.rooms.createIndex({ roomId: 1 }, { unique: true });
      await this.rooms.createIndex({ 'participants.userId': 1 });
      await this.rooms.createIndex({ updatedAt: -1 });

      // Initialize auth service
      authService.setCollections(this.users, this.playgrounds, this.rooms);

      this.connected = true;
      console.log('✓ MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      console.log('⚠ Running without database - using in-memory storage');
      this.connected = false;
    }
  }

  async saveProject(shareId: string, projectData: any): Promise<boolean> {
    if (!this.connected || !this.projects) {
      return false;
    }

    try {
      console.log('Saving project to MongoDB:', shareId, 'with', projectData.files?.length || 0, 'files');
      await this.projects.updateOne(
        { shareId },
        {
          $set: {
            shareId,
            projectData,
            updatedAt: Date.now(),
          },
          $setOnInsert: {
            createdAt: Date.now(),
            views: 0,
          },
        },
        { upsert: true }
      );
      console.log('✓ Project saved to MongoDB');
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      return false;
    }
  }

  async getProject(shareId: string): Promise<any | null> {
    if (!this.connected || !this.projects) {
      return null;
    }

    try {
      console.log('Fetching project from MongoDB:', shareId);
      const project = await this.projects.findOne({ shareId });

      if (project) {
        console.log('✓ Project found with', project.projectData?.files?.length || 0, 'files');
        // Increment view count
        await this.projects.updateOne(
          { shareId },
          { $inc: { views: 1 } }
        );
        return project.projectData;
      }

      console.log('✗ Project not found in MongoDB');
      return null;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  async deleteProject(shareId: string): Promise<boolean> {
    if (!this.connected || !this.projects) {
      return false;
    }

    try {
      await this.projects.deleteOne({ shareId });
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.connected = false;
      console.log('MongoDB disconnected');
    }
  }
}

export const database = new DatabaseService();
