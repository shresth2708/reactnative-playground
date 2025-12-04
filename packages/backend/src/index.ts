import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { BundlerService } from './services/bundler.js';
import { AIAgent } from './services/aiAgent.js';
import { database } from './services/database.js';
import { authService } from './services/auth.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  'http://localhost:3000',
  'https://nsthack-frontend-azey.vercel.app',
  'https://www.nsthack-frontend-azey.vercel.app'
];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

const bundler = new BundlerService();
const aiAgents = new Map<string, AIAgent>(); // One agent per socket connection
const sharedProjects = new Map<string, any>(); // Fallback in-memory storage

// Connect to MongoDB
database.connect();

// Auth middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = authService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.userId = decoded.userId;
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await authService.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Playground routes
app.post('/api/playgrounds', authMiddleware, async (req: any, res) => {
  try {
    const { name, files } = req.body;
    const playgroundId = await authService.savePlayground(req.userId, name, files);
    res.json({ success: true, playgroundId });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/playgrounds', authMiddleware, async (req: any, res) => {
  try {
    const playgrounds = await authService.getUserPlaygrounds(req.userId);
    res.json({ success: true, playgrounds });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/playgrounds/:id', authMiddleware, async (req: any, res) => {
  try {
    const playground = await authService.getPlayground(req.params.id, req.userId);
    if (!playground) {
      return res.status(404).json({ error: 'Playground not found' });
    }
    res.json({ success: true, playground });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.put('/api/playgrounds/:id', authMiddleware, async (req: any, res) => {
  try {
    const { name, files } = req.body;
    await authService.updatePlayground(req.params.id, req.userId, name, files);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/playgrounds/:id', authMiddleware, async (req: any, res) => {
  try {
    await authService.deletePlayground(req.params.id, req.userId);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Collaboration room routes
app.post('/api/rooms', authMiddleware, async (req: any, res) => {
  try {
    const { roomId, name, files } = req.body;
    const roomDbId = await authService.saveCollaborationRoom(roomId, name, req.userId, files);
    res.json({ success: true, roomId: roomDbId });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/rooms', authMiddleware, async (req: any, res) => {
  try {
    const rooms = await authService.getUserRooms(req.userId);
    res.json({ success: true, rooms });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/rooms/:roomId', async (req, res) => {
  try {
    const room = await authService.getRoom(req.params.roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ success: true, room });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// REST API for sharing
app.post('/api/share', async (req, res) => {
  const { shareId, projectData } = req.body;
  
  // Try MongoDB first
  if (database.isConnected()) {
    const saved = await database.saveProject(shareId, projectData);
    if (saved) {
      res.json({ success: true, shareId, storage: 'mongodb' });
      return;
    }
  }
  
  // Fallback to in-memory
  sharedProjects.set(shareId, {
    ...projectData,
    createdAt: Date.now(),
    views: 0,
  });
  res.json({ success: true, shareId, storage: 'memory' });
});

app.get('/api/share/:shareId', async (req, res) => {
  const { shareId } = req.params;
  
  // Try MongoDB first
  if (database.isConnected()) {
    const project = await database.getProject(shareId);
    if (project) {
      res.json({ success: true, project });
      return;
    }
  }
  
  // Fallback to in-memory
  const project = sharedProjects.get(shareId);
  if (project) {
    project.views++;
    res.json({ success: true, project });
  } else {
    res.status(404).json({ success: false, error: 'Project not found' });
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Create AI agent for this connection
  const aiAgent = new AIAgent();
  aiAgents.set(socket.id, aiAgent);

  socket.on('code:update', async ({ code, files }) => {
    try {
      console.log('Bundling code...', files ? `with ${files.length} files` : 'single file');
      const bundledCode = await bundler.bundle(code, files);
      socket.emit('bundle:ready', { code: bundledCode });
      socket.emit('console:log', {
        type: 'info',
        message: `✓ Bundle compiled successfully ${files ? `(${files.length} files)` : ''}`
      });
    } catch (error: any) {
      console.error('Bundle error:', error);
      socket.emit('bundle:ready', {
        error: error.message || 'Failed to bundle code'
      });
      socket.emit('console:log', {
        type: 'error',
        message: `✗ ${error.message || 'Bundle failed'}`
      });
    }
  });

  // AI Agent endpoints
  socket.on('ai:chat', async ({ message, context }) => {
    try {
      const agent = aiAgents.get(socket.id);
      if (!agent) {
        socket.emit('ai:response', { error: 'AI agent not initialized' });
        return;
      }

      const response = await agent.chat(message, context);
      socket.emit('ai:response', { message: response });
    } catch (error: any) {
      console.error('AI chat error:', error);
      socket.emit('ai:response', { error: error.message });
    }
  });

  socket.on('ai:generate', async ({ description, type }) => {
    try {
      const agent = aiAgents.get(socket.id);
      if (!agent) {
        socket.emit('ai:generated', { error: 'AI agent not initialized' });
        return;
      }

      const code = await agent.generateCode(description, type);
      socket.emit('ai:generated', { code });
    } catch (error: any) {
      console.error('AI generate error:', error);
      socket.emit('ai:generated', { error: error.message });
    }
  });

  socket.on('ai:explain', async ({ code }) => {
    try {
      const agent = aiAgents.get(socket.id);
      if (!agent) {
        socket.emit('ai:explained', { error: 'AI agent not initialized' });
        return;
      }

      const explanation = await agent.explainCode(code);
      socket.emit('ai:explained', { explanation });
    } catch (error: any) {
      console.error('AI explain error:', error);
      socket.emit('ai:explained', { error: error.message });
    }
  });

  socket.on('ai:debug', async ({ code, error }) => {
    try {
      const agent = aiAgents.get(socket.id);
      if (!agent) {
        socket.emit('ai:debugged', { error: 'AI agent not initialized' });
        return;
      }

      const solution = await agent.debugCode(code, error);
      socket.emit('ai:debugged', { solution });
    } catch (error: any) {
      console.error('AI debug error:', error);
      socket.emit('ai:debugged', { error: error.message });
    }
  });

  socket.on('ai:improve', async ({ code }) => {
    try {
      const agent = aiAgents.get(socket.id);
      if (!agent) {
        socket.emit('ai:improved', { error: 'AI agent not initialized' });
        return;
      }

      const improvements = await agent.improveCode(code);
      socket.emit('ai:improved', { improvements });
    } catch (error: any) {
      console.error('AI improve error:', error);
      socket.emit('ai:improved', { error: error.message });
    }
  });

  socket.on('ai:test', async ({ code }) => {
    try {
      const agent = aiAgents.get(socket.id);
      if (!agent) {
        socket.emit('ai:tested', { error: 'AI agent not initialized' });
        return;
      }

      const tests = await agent.generateTests(code);
      socket.emit('ai:tested', { tests });
    } catch (error: any) {
      console.error('AI test error:', error);
      socket.emit('ai:tested', { error: error.message });
    }
  });

  socket.on('ai:refactor', async ({ code }) => {
    try {
      const agent = aiAgents.get(socket.id);
      if (!agent) {
        socket.emit('ai:refactored', { error: 'AI agent not initialized' });
        return;
      }

      const suggestions = await agent.suggestRefactoring(code);
      socket.emit('ai:refactored', { suggestions });
    } catch (error: any) {
      console.error('AI refactor error:', error);
      socket.emit('ai:refactored', { error: error.message });
    }
  });

  socket.on('ai:clear', () => {
    const agent = aiAgents.get(socket.id);
    if (agent) {
      agent.clearHistory();
      socket.emit('ai:cleared', { success: true });
    }
  });

  // Video call signaling
  socket.on('video:call-user', ({ targetUserId, offer }) => {
    console.log(`Video call from ${socket.id} to ${targetUserId}`);
    io.to(targetUserId).emit('video:incoming-call', {
      callerUserId: socket.id,
      callerUserName: socket.data?.userName || 'Anonymous',
      offer
    });
  });

  socket.on('video:answer-call', ({ targetUserId, answer }) => {
    io.to(targetUserId).emit('video:call-answered', { answer });
  });

  socket.on('video:ice-candidate', ({ targetUserId, candidate }) => {
    io.to(targetUserId).emit('video:ice-candidate', { candidate });
  });

  socket.on('video:end-call', ({ targetUserId }) => {
    io.to(targetUserId).emit('video:call-ended');
  });

  socket.on('video:reject-call', ({ targetUserId }) => {
    io.to(targetUserId).emit('video:call-ended');
  });

  // Collaboration endpoints
  socket.on('collaboration:join', async ({ roomId, userName, color, userId }) => {
    console.log(`User ${userName} joining room ${roomId}`);

    // Set socket data FIRST before joining room
    socket.data = { userName, color, roomId, userId };

    // Join the room
    socket.join(roomId);

    // Save to database if user is authenticated
    if (userId && database.isConnected()) {
      try {
        // Check if room exists, if not create it
        const existingRoom = await authService.getRoom(roomId);
        if (!existingRoom) {
          await authService.saveCollaborationRoom(roomId, `Room ${roomId.substring(0, 8)}`, userId, []);
        } else {
          await authService.joinCollaborationRoom(roomId, userId, userName);
        }
      } catch (error) {
        console.error('Failed to save room join:', error);
      }
    }

    const user = {
      id: socket.id,
      name: userName,
      color,
    };

    // Notify others in room that new user joined
    socket.to(roomId).emit('collaboration:user-joined', user);

    // Send existing users to new user (including themselves)
    io.in(roomId).fetchSockets().then((sockets) => {
      const users = sockets.map((s: any) => ({
        id: s.id,
        name: s.data?.userName || 'Anonymous',
        color: s.data?.color || '#4ECDC4',
      }));
      console.log(`Sending ${users.length} users to ${userName}:`, users.map(u => u.name));
      socket.emit('collaboration:users', users);
    });
  });

  socket.on('collaboration:leave', ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('collaboration:user-left', {
      userId: socket.id,
      userName: socket.data?.userName || 'Anonymous',
    });
  });

  socket.on('collaboration:chat', ({ roomId, message }) => {
    console.log(`Chat from ${socket.data?.userName} in room ${roomId}: ${message}`);
    const chatMessage = {
      id: Date.now().toString(),
      userId: socket.id,
      userName: socket.data?.userName || 'Anonymous',
      message,
      timestamp: Date.now(),
    };
    // Broadcast to ALL users in room (including sender)
    io.in(roomId).emit('collaboration:chat-message', chatMessage);
  });

  socket.on('collaboration:code-change', async ({ roomId, fileId, content }) => {
    console.log(`Code change in room ${roomId}, file ${fileId}, broadcasting to others`);
    socket.to(roomId).emit('collaboration:code-updated', { fileId, content });

    // Update activity
    if (socket.data?.userId && database.isConnected()) {
      try {
        await authService.updateRoomActivity(roomId, socket.data.userId);
      } catch (error) {
        console.error('Failed to update room activity:', error);
      }
    }

    // Update shared project if this is a share room
    if (sharedProjects.has(roomId)) {
      const project = sharedProjects.get(roomId);
      if (project && project.files) {
        // Update file in project
        const updateFileInTree = (nodes: any[]): any[] => {
          return nodes.map((node: any) => {
            if (node.id === fileId) {
              return { ...node, content };
            }
            if (node.children) {
              return { ...node, children: updateFileInTree(node.children) };
            }
            return node;
          });
        };
        project.files = updateFileInTree(project.files);
        sharedProjects.set(roomId, project);
      }
    }
  });

  socket.on('collaboration:cursor', ({ roomId, cursor }) => {
    socket.to(roomId).emit('collaboration:cursor-update', {
      userId: socket.id,
      cursor,
    });
  });

  // File locking
  socket.on('file:lock', ({ roomId, fileId }) => {
    io.in(roomId).emit('file:locked', {
      fileId,
      userId: socket.id,
      userName: socket.data?.userName || 'Anonymous',
    });
  });

  socket.on('file:unlock', ({ roomId, fileId }) => {
    io.in(roomId).emit('file:unlocked', { fileId });
  });

  // Terminal command execution with persistent working directory
  if (!socket.data) socket.data = {};
  socket.data.terminalCwd = socket.data.terminalCwd || '/project';

  socket.on('terminal:command', async ({ command }) => {
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const path = await import('path');
      const fs = await import('fs');
      const execAsync = promisify(exec);

      console.log(`Executing command: ${command} in ${socket.data.terminalCwd}`);

      const cmd = command.trim();

      // Handle clear
      if (cmd === 'clear') {
        socket.emit('terminal:output', { output: '', cwd: socket.data.terminalCwd });
        return;
      }

      // Handle cd command
      if (cmd.startsWith('cd ')) {
        const targetDir = cmd.substring(3).trim();

        // Handle virtual paths
        if (targetDir === '/' || targetDir === '~' || targetDir === '/project') {
          socket.data.terminalCwd = '/project';
          socket.emit('terminal:output', { output: '', cwd: '/project' });
          return;
        }

        // Handle relative paths in virtual filesystem
        const validDirs = ['components', 'utils', 'node_modules', '..'];
        if (validDirs.includes(targetDir)) {
          if (targetDir === '..') {
            socket.data.terminalCwd = '/project';
          } else {
            socket.data.terminalCwd = `/project/${targetDir}`;
          }
          socket.emit('terminal:output', { output: '', cwd: socket.data.terminalCwd });
          return;
        }

        socket.emit('terminal:output', {
          output: `cd: ${targetDir}: No such directory`,
          cwd: socket.data.terminalCwd
        });
        return;
      }

      // Handle ls command for virtual filesystem
      if (cmd === 'ls' || cmd === 'ls -la' || cmd === 'ls -l') {
        let output = '';
        if (socket.data.terminalCwd === '/project') {
          output = `package.json
app.json
App.tsx
components/
utils/
node_modules/
.gitignore
README.md`;
        } else if (socket.data.terminalCwd === '/project/components') {
          output = '(empty directory - create files here)';
        } else if (socket.data.terminalCwd === '/project/utils') {
          output = '(empty directory - create files here)';
        } else if (socket.data.terminalCwd === '/project/node_modules') {
          output = 'react/\nreact-native/\n(installed packages)';
        }
        socket.emit('terminal:output', { output, cwd: socket.data.terminalCwd });
        return;
      }

      // Handle pwd
      if (cmd === 'pwd') {
        socket.emit('terminal:output', {
          output: socket.data.terminalCwd,
          cwd: socket.data.terminalCwd
        });
        return;
      }

      // Handle cat for virtual files
      if (cmd.startsWith('cat ')) {
        const filename = cmd.substring(4).trim();
        
        if (filename === 'package.json' && socket.data.terminalCwd === '/project') {
          const packageJson = {
            name: 'react-native-playground',
            version: '1.0.0',
            main: 'App.tsx',
            scripts: {
              start: 'expo start',
              android: 'expo start --android',
              ios: 'expo start --ios',
              web: 'expo start --web'
            },
            dependencies: {
              'react': '^18.2.0',
              'react-native': '^0.72.0',
              'expo': '~49.0.0'
            }
          };
          socket.emit('terminal:output', { 
            output: JSON.stringify(packageJson, null, 2),
            cwd: socket.data.terminalCwd 
          });
          return;
        }
        
        if (filename === 'app.json' && socket.data.terminalCwd === '/project') {
          const appJson = {
            expo: {
              name: 'React Native Playground',
              slug: 'rn-playground',
              version: '1.0.0',
              platforms: ['ios', 'android', 'web']
            }
          };
          socket.emit('terminal:output', { 
            output: JSON.stringify(appJson, null, 2),
            cwd: socket.data.terminalCwd 
          });
          return;
        }
        
        if (filename === 'App.tsx' && socket.data.terminalCwd === '/project') {
          socket.emit('terminal:output', {
            output: '// App.tsx - Main application file\nimport React from \'react\';\nimport { View, Text } from \'react-native\';\n\nexport default function App() {\n  return <View><Text>Hello!</Text></View>;\n}',
            cwd: socket.data.terminalCwd
          });
          return;
        }
        
        if (filename === 'README.md' && socket.data.terminalCwd === '/project') {
          socket.emit('terminal:output', { 
            output: '# React Native Playground\n\nWeb-based React Native development.\n\n## Commands\n- npm install <pkg>\n- ls, cat, pwd, cd',
            cwd: socket.data.terminalCwd 
          });
          return;
        }
        
        socket.emit('terminal:output', {
          output: `cat: ${filename}: No such file or directory`,
          cwd: socket.data.terminalCwd
        });
        return;
      }

      // Handle npm install - update package.json after install
      if (cmd.startsWith('npm install ') || cmd.startsWith('npm i ')) {
        try {
          const { stdout, stderr } = await execAsync(command, {
            cwd: process.cwd(),
            timeout: 60000,
            maxBuffer: 1024 * 1024
          });

          const output = stdout + (stderr ? '\n' + stderr : '');
          
          // Read actual package.json from backend
          const packageJsonPath = path.join(process.cwd(), 'package.json');
          if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            
            // Send updated package.json to frontend
            socket.emit('file:update', {
              fileId: 'package-json',
              content: JSON.stringify(packageJson, null, 2)
            });
          }
          
          socket.emit('terminal:output', {
            output: output + '\n✓ package.json updated',
            cwd: socket.data.terminalCwd
          });
          return;
        } catch (error: any) {
          socket.emit('terminal:output', {
            output: `Error: ${error.message}`,
            cwd: socket.data.terminalCwd
          });
          return;
        }
      }

      // Handle git commands
      if (cmd.startsWith('git ')) {
        try {
          const { stdout, stderr } = await execAsync(command, {
            cwd: process.cwd(),
            timeout: 30000,
            maxBuffer: 1024 * 1024
          });

          const output = stdout + (stderr ? '\n' + stderr : '');
          socket.emit('terminal:output', {
            output: output || 'Git command executed',
            cwd: socket.data.terminalCwd
          });
          return;
        } catch (error: any) {
          socket.emit('terminal:output', {
            output: `Error: ${error.message}`,
            cwd: socket.data.terminalCwd
          });
          return;
        }
      }

      // For other commands, execute in real backend directory
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 30000,
        maxBuffer: 1024 * 1024
      });

      const output = stdout + (stderr ? '\n' + stderr : '');
      socket.emit('terminal:output', {
        output: output || 'Command executed successfully',
        cwd: socket.data.terminalCwd
      });
    } catch (error: any) {
      console.error('Terminal command error:', error);
      socket.emit('terminal:output', {
        output: `Error: ${error.message}`,
        cwd: socket.data.terminalCwd
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    aiAgents.delete(socket.id);

    // Notify room members
    if (socket.data?.roomId) {
      socket.to(socket.data.roomId).emit('collaboration:user-left', {
        userId: socket.id,
        userName: socket.data.userName || 'Anonymous',
      });
    }
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
