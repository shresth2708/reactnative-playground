# React Native Playground

https://nsthack-frontend-azey.vercel.app/

A next-generation React Native playground that allows developers to write, run, and interact with their code in real-time.

## 🎉 What's New in v1.1

✨ **Multi-File Support** - Create unlimited files and folders  
📁 **File Tree** - Organize your code with a proper file structure  
📑 **Multiple Tabs** - Open and edit multiple files simultaneously  
📱 **15+ Devices** - iPhone, iPad, Android, and Web presets  
🔄 **Enhanced UX** - Better navigation, smoother animations  

[See all new features →](./WHATS_NEW.md)

## Features

✨ **Professional Code Editor** - Monaco editor with syntax highlighting, auto-completion, and minimap  
🗂️ **Multi-File Support** - Create files, folders, and organize your project structure  
📑 **Multiple Tabs** - Work on multiple files simultaneously with tab management  
🔥 **Instant Hot Reload** - See changes in under 500ms  
📱 **15+ Device Presets** - iPhone, iPad, Android phones/tablets, and Web  
🎯 **Interactive Preview** - Full touch and gesture support with zoom controls  
📊 **Live Console** - Real-time logs, warnings, and errors  
🎨 **Beautiful UI** - Modern, dark-themed interface with smooth animations  
⚡ **Optimized Performance** - Incremental bundling and WebSocket communication  
📚 **Templates** - Quick-start templates for common patterns  
🔧 **TypeScript** - Full TypeScript support throughout

## Architecture

### Frontend
- **React + TypeScript** - Type-safe UI components
- **Vite** - Lightning-fast development server
- **Monaco Editor** - VSCode-quality code editing
- **Zustand** - Lightweight state management
- **Socket.IO** - Real-time bidirectional communication
- **TailwindCSS** - Utility-first styling

### Backend
- **Node.js + Express** - API server
- **Socket.IO** - WebSocket server
- **Babel** - Code transpilation
- **React Native Web** - Web rendering

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd rn-playground
```

2. Install dependencies:
```bash
npm install
cd packages/frontend && npm install
cd ../backend && npm install
cd ../..
```

3. Start the development servers:
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Project Structure

```
rn-playground/
├── packages/
│   ├── frontend/          # React frontend application
│   │   ├── src/
│   │   │   ├── components/  # UI components
│   │   │   ├── store/       # State management
│   │   │   ├── App.tsx      # Main app component
│   │   │   └── main.tsx     # Entry point
│   │   └── package.json
│   │
│   └── backend/           # Node.js backend server
│       ├── src/
│       │   ├── services/    # Business logic
│       │   └── index.ts     # Server entry point
│       └── package.json
│
├── FEATURES.md            # Detailed feature brainstorm
├── README.md              # This file
└── package.json           # Root package.json
```

## How It Works

### Code Execution Flow

1. **User types code** in Monaco editor
2. **Code is sent** via WebSocket to backend (debounced)
3. **Backend transforms** React Native code to web-compatible code
4. **Babel transpiles** TypeScript/JSX to JavaScript
5. **Bundle is sent** back to frontend
6. **Preview iframe** executes the code
7. **User sees result** in real-time

### Rendering Strategy

The playground uses a **hybrid rendering approach**:

- **React Native Web** for UI components (View, Text, TouchableOpacity)
- **Polyfills** for React Native APIs
- **Direct DOM rendering** in iframe for instant updates

This provides:
- ⚡ Near-instant updates (<100ms)
- 🎯 High compatibility with React Native code
- 🚀 No simulator/emulator overhead

## Development Roadmap

### Phase 1 (MVP) ✅
- [x] Monaco editor integration
- [x] Real-time code execution
- [x] React Native Web preview
- [x] Console output
- [x] WebSocket communication
- [x] Basic UI/UX

### Phase 2 (Coming Soon)
- [ ] Multi-file support
- [ ] NPM package installation
- [ ] Template library
- [ ] Share functionality
- [ ] Export projects
- [ ] Error boundaries

### Phase 3 (Future)
- [ ] iOS simulator integration
- [ ] Android emulator integration
- [ ] Video streaming preview
- [ ] Real-time collaboration
- [ ] GitHub integration
- [ ] Community features

## Performance Optimizations

- **Debounced updates** - Reduce unnecessary bundling
- **Incremental compilation** - Only rebuild changed code
- **WebSocket communication** - Low-latency updates
- **Code splitting** - Lazy load heavy dependencies
- **Caching** - Cache compiled bundles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

- Inspired by [Expo Snack](https://snack.expo.dev/)
- Built with [React Native Web](https://necolas.github.io/react-native-web/)
- Powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
