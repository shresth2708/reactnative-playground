import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Code, Bug, Lightbulb, TestTube, RefreshCw, X, Minimize2, Maximize2, Copy, Check, FileCode } from 'lucide-react';
import { usePlaygroundStore } from '../store/playgroundStore';

interface CodeBlock {
  language: string;
  code: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  codeBlocks?: CodeBlock[];
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI coding assistant powered by Gemini. I can help you:\n\n• Generate React Native components\n• Explain code\n• Debug issues\n• Improve code quality\n• Generate tests\n• Suggest refactoring\n\nHow can I help you today?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [pendingSuggestion, setPendingSuggestion] = useState<{ code: string; messageId: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, openTabs, activeTabId, files, updateFileContent, createFile } = usePlaygroundStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('ai:response', ({ message, error }) => {
      setIsLoading(false);
      if (error) {
        addMessage('assistant', `Error: ${error}`);
      } else {
        addMessage('assistant', message);
      }
    });

    socket.on('ai:generated', ({ code, error }) => {
      setIsLoading(false);
      if (error) {
        addMessage('assistant', `Error: ${error}`);
      } else {
        addMessage('assistant', `Here's the generated code:\n\n\`\`\`typescript\n${code}\n\`\`\``);
      }
    });

    socket.on('ai:explained', ({ explanation, error }) => {
      setIsLoading(false);
      if (error) {
        addMessage('assistant', `Error: ${error}`);
      } else {
        addMessage('assistant', explanation);
      }
    });

    socket.on('ai:debugged', ({ solution, error }) => {
      setIsLoading(false);
      if (error) {
        addMessage('assistant', `Error: ${error}`);
      } else {
        addMessage('assistant', solution);
      }
    });

    socket.on('ai:improved', ({ improvements, error }) => {
      setIsLoading(false);
      if (error) {
        addMessage('assistant', `Error: ${error}`);
      } else {
        addMessage('assistant', improvements);
      }
    });

    socket.on('ai:tested', ({ tests, error }) => {
      setIsLoading(false);
      if (error) {
        addMessage('assistant', `Error: ${error}`);
      } else {
        addMessage('assistant', `Here are the generated tests:\n\n\`\`\`typescript\n${tests}\n\`\`\``);
      }
    });

    socket.on('ai:refactored', ({ suggestions, error }) => {
      setIsLoading(false);
      if (error) {
        addMessage('assistant', `Error: ${error}`);
      } else {
        addMessage('assistant', suggestions);
      }
    });

    return () => {
      socket.off('ai:response');
      socket.off('ai:generated');
      socket.off('ai:explained');
      socket.off('ai:debugged');
      socket.off('ai:improved');
      socket.off('ai:tested');
      socket.off('ai:refactored');
    };
  }, [socket]);

  const extractCodeBlocks = (content: string): CodeBlock[] => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const blocks: CodeBlock[] = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      blocks.push({
        language: match[1] || 'typescript',
        code: match[2].trim(),
      });
    }

    return blocks;
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const codeBlocks = role === 'assistant' ? extractCodeBlocks(content) : [];
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: Date.now(),
      codeBlocks,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const applyCodeToEditor = (code: string) => {
    const activeTab = openTabs.find((tab) => tab.id === activeTabId);
    if (activeTab) {
      updateFileContent(activeTab.fileId, code);
      addMessage('assistant', '✅ Code applied to ' + activeTab.name);
    } else {
      // Create new file if no active tab
      const fileName = 'GeneratedComponent.tsx';
      createFile(fileName);
      setTimeout(() => {
        const newTab = openTabs.find((tab) => tab.name === fileName);
        if (newTab) {
          updateFileContent(newTab.fileId, code);
        }
      }, 100);
      addMessage('assistant', '✅ Code applied to new file: ' + fileName);
    }
    setPendingSuggestion(null);
  };

  const suggestCodeApplication = (code: string, messageId: string) => {
    setPendingSuggestion({ code, messageId });
  };

  const sendMessage = () => {
    if (!input.trim() || !socket || isLoading) return;

    addMessage('user', input);
    setIsLoading(true);

    // Get current code context
    const activeTab = openTabs.find((tab) => tab.id === activeTabId);
    const context = {
      code: activeTab?.content,
      files: files,
    };

    socket.emit('ai:chat', { message: input, context });
    setInput('');
  };

  const quickAction = (action: string, description: string) => {
    if (!socket || isLoading) return;

    const activeTab = openTabs.find((tab) => tab.id === activeTabId);
    if (!activeTab) {
      addMessage('assistant', 'Please open a file first.');
      return;
    }

    addMessage('user', description);
    setIsLoading(true);

    switch (action) {
      case 'explain':
        socket.emit('ai:explain', { code: activeTab.content });
        break;
      case 'debug':
        socket.emit('ai:debug', { code: activeTab.content });
        break;
      case 'improve':
        socket.emit('ai:improve', { code: activeTab.content });
        break;
      case 'test':
        socket.emit('ai:test', { code: activeTab.content });
        break;
      case 'refactor':
        socket.emit('ai:refactor', { code: activeTab.content });
        break;
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 w-14 h-14 bg-gradient-to-r from-lime-500 to-green-500 rounded-full shadow-lg shadow-lime-500/20 flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 animate-pulse"
      >
        <Bot className="w-6 h-6 text-black" />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${
        isExpanded ? 'inset-4' : 'bottom-4 right-4 w-96 h-[600px]'
      } bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-lime-500/10 flex flex-col z-50 transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-r from-lime-500/20 to-green-500/20 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <h3 className="font-semibold text-white">AI Assistant</h3>
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4 text-white" /> : <Maximize2 className="w-4 h-4 text-white" />}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-slate-700/50 bg-slate-800/80">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => quickAction('explain', 'Explain this code')}
            className="px-3 py-1.5 text-xs bg-lime-500/20 hover:bg-lime-500/30 text-lime-400 rounded-lg flex items-center gap-1.5 transition-all duration-200 font-medium"
            disabled={isLoading}
          >
            <Code className="w-3 h-3" />
            Explain
          </button>
          <button
            onClick={() => quickAction('debug', 'Debug this code')}
            className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center gap-1.5 transition-all duration-200 font-medium"
            disabled={isLoading}
          >
            <Bug className="w-3 h-3" />
            Debug
          </button>
          <button
            onClick={() => quickAction('improve', 'Improve this code')}
            className="px-3 py-1.5 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg flex items-center gap-1.5 transition-all duration-200 font-medium"
            disabled={isLoading}
          >
            <Lightbulb className="w-3 h-3" />
            Improve
          </button>
          <button
            onClick={() => quickAction('test', 'Generate tests')}
            className="px-3 py-1.5 text-xs bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg flex items-center gap-1.5 transition-all duration-200 font-medium"
            disabled={isLoading}
          >
            <TestTube className="w-3 h-3" />
            Test
          </button>
          <button
            onClick={() => quickAction('refactor', 'Suggest refactoring')}
            className="px-3 py-1.5 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg flex items-center gap-1.5 transition-all duration-200 font-medium"
            disabled={isLoading}
          >
            <RefreshCw className="w-3 h-3" />
            Refactor
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <div className="p-3">
                <div className="text-sm whitespace-pre-wrap break-words">
                  {message.content.split(/```[\s\S]*?```/).map((text, i) => (
                    <span key={i}>{text}</span>
                  ))}
                </div>
              </div>
              
              {/* Code Blocks */}
              {message.codeBlocks && message.codeBlocks.length > 0 && (
                <div className="space-y-2 px-3 pb-3">
                  {message.codeBlocks.map((block, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-600">
                      {/* Code Header */}
                      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-600">
                        <span className="text-xs text-gray-400 font-mono">{block.language}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(block.code, `${message.id}-${index}`)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Copy code"
                          >
                            {copiedCode === `${message.id}-${index}` ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => suggestCodeApplication(block.code, message.id)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Apply to editor"
                          >
                            <FileCode className="w-4 h-4 text-blue-400" />
                          </button>
                        </div>
                      </div>
                      {/* Code Content */}
                      <pre className="p-3 overflow-x-auto text-xs">
                        <code className="text-gray-100 font-mono">{block.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="px-3 pb-2">
                <div className="text-xs opacity-50">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="bg-gray-700 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Code Suggestion Approval */}
      {pendingSuggestion && (
        <div className="mx-4 mb-2 p-3 bg-blue-900/50 border border-blue-500 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-100">Apply this code to your editor?</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => applyCodeToEditor(pendingSuggestion.code)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
              >
                ✓ Accept
              </button>
              <button
                onClick={() => setPendingSuggestion(null)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
              >
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
