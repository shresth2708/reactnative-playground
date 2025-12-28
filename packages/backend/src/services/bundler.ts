import { transform } from '@babel/standalone';

interface FileModule {
  id: string;
  name: string;
  content: string;
  exports?: any;
}

export class BundlerService {
  private modules: Map<string, FileModule> = new Map();

  async bundle(code: string, files?: FileModule[]): Promise<string> {
    try {
      // Store all files for multi-file support
      if (files) {
        files.forEach(file => {
          this.modules.set(file.name, file);
        });
      }

      // Transform React Native code to web-compatible code
      const webCode = this.transformToWeb(code);

      // Transpile with Babel using classic JSX runtime (no jsx-runtime import needed)
      const result = transform(webCode, {
        presets: [
          ['react', { runtime: 'classic', pragma: 'React.createElement' }],
          ['typescript', {
            onlyRemoveTypeImports: true,
            allowDeclareFields: true,
            allowNamespaces: true
          }]
        ],
        plugins: [
          ['proposal-class-properties', { loose: true }],
          ['proposal-object-rest-spread', { loose: true, useBuiltIns: true }],
          'proposal-optional-chaining',
          'proposal-nullish-coalescing-operator'
        ],
        filename: 'App.tsx',
        sourceType: 'module',
        retainLines: false,
        compact: false,
      });

      if (!result.code) {
        throw new Error('Transpilation failed');
      }

      // Return the bundled code with multi-file support
      return this.wrapInModule(result.code);
    } catch (error: any) {
      console.error('Bundle error:', error);
      throw new Error(`Bundle failed: ${error.message}`);
    }
  }

  private transformToWeb(code: string): string {
    // Remove React Native imports since we'll provide polyfills
    let webCode = code.replace(
      /import\s*{[^}]*}\s*from\s*['"]react-native['"]\s*;?/g,
      ''
    );

    // Check if user already has React import
    const hasReactImport = /import\s+React(?:\s*,\s*{[^}]*})?\s+from\s+['"]react['"]/i.test(webCode);

    // Remove user's React import - we'll add our own
    webCode = webCode.replace(
      /import\s+React(?:\s*,\s*{[^}]*})?\s+from\s+['"]react['"]\s*;?/gi,
      ''
    );

    // Handle relative imports (./components/Button)
    webCode = webCode.replace(
      /import\s+{([^}]+)}\s+from\s+['"]\.\/(.*?)['"]\s*;?/g,
      (match, imports, path) => {
        return `// Multi-file import: ${path} - ${imports}`;
      }
    );

    // Add comprehensive React Native Web polyfills (React import only once)
    const polyfills = `
      import React from 'https://esm.sh/react@18.3.1';
      import ReactDOM from 'https://esm.sh/react-dom@18.3.1';
      
      // Advanced style converter with all React Native properties
      const convertStyle = (rnStyle) => {
        if (!rnStyle) return {};
        
        // Handle array of styles
        if (Array.isArray(rnStyle)) {
          return Object.assign({}, ...rnStyle.map(s => convertStyle(s)));
        }
        
        const webStyle = {};
        for (const key in rnStyle) {
          const value = rnStyle[key];
          
          // Convert flex: 1 to flex: '1 1 0%'
          if (key === 'flex' && typeof value === 'number') {
            webStyle.flex = value === 1 ? '1 1 0%' : \`\${value} 1 0%\`;
          }
          // Convert fontWeight numbers to strings
          else if (key === 'fontWeight' && typeof value === 'number') {
            webStyle.fontWeight = String(value);
          }
          // Convert numeric values to px (except unitless properties)
          else if (typeof value === 'number' && !['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink'].includes(key)) {
            webStyle[key] = \`\${value}px\`;
          }
          // Pass through everything else
          else {
            webStyle[key] = value;
          }
        }
        return webStyle;
      };
      
      // React Native Web polyfills
      const View = ({ style, children, ...props }) => {
        const webStyle = {
          display: 'flex',
          flexDirection: 'column',
          ...convertStyle(style)
        };
        return React.createElement('div', { style: webStyle, ...props }, children);
      };

      const Text = ({ style, children, ...props }) => {
        const webStyle = {
          fontFamily: 'system-ui, -apple-system, sans-serif',
          ...convertStyle(style)
        };
        return React.createElement('span', { style: webStyle, ...props }, children);
      };

      const TouchableOpacity = ({ style, onPress, children, activeOpacity, ...props }) => {
        const [isPressed, setIsPressed] = React.useState(false);
        
        const webStyle = {
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'opacity 0.2s',
          opacity: isPressed ? (activeOpacity || 0.7) : 1,
          ...convertStyle(style)
        };
        
        const handleMouseDown = () => setIsPressed(true);
        const handleMouseUp = () => setIsPressed(false);
        const handleMouseLeave = () => setIsPressed(false);
        
        return React.createElement('div', { 
          style: webStyle, 
          onClick: onPress,
          onMouseDown: handleMouseDown,
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseLeave,
          ...props 
        }, children);
      };

      const StyleSheet = {
        create: (styles) => styles,
        flatten: (style) => style,
        compose: (...styles) => Object.assign({}, ...styles)
      };

      // ScrollView component
      const ScrollView = ({ style, children, horizontal, ...props }) => {
        const webStyle = {
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          flexDirection: horizontal ? 'row' : 'column',
          ...convertStyle(style)
        };
        return React.createElement('div', { style: webStyle, ...props }, children);
      };

      // Image component
      const Image = ({ source, style, resizeMode, ...props }) => {
        const webStyle = {
          objectFit: resizeMode || 'cover',
          ...convertStyle(style)
        };
        const src = typeof source === 'object' ? source.uri : source;
        return React.createElement('img', { src, style: webStyle, ...props });
      };

      // TextInput component
      const TextInput = ({ style, value, onChangeText, placeholder, secureTextEntry, multiline, ...props }) => {
        const webStyle = {
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          outline: 'none',
          ...convertStyle(style)
        };
        
        const handleChange = (e) => {
          if (onChangeText) onChangeText(e.target.value);
        };
        
        const element = multiline ? 'textarea' : 'input';
        const inputProps = {
          style: webStyle,
          value,
          onChange: handleChange,
          placeholder,
          type: secureTextEntry ? 'password' : 'text',
          ...props
        };
        
        return React.createElement(element, inputProps);
      };

      // FlatList component
      const FlatList = ({ data, renderItem, keyExtractor, style, ...props }) => {
        const webStyle = {
          overflow: 'auto',
          ...convertStyle(style)
        };
        
        return React.createElement('div', { style: webStyle, ...props },
          data && data.map((item, index) => {
            const key = keyExtractor ? keyExtractor(item, index) : index;
            return renderItem({ item, index, separators: {} });
          })
        );
      };

      // ActivityIndicator component
      const ActivityIndicator = ({ size, color, style, ...props }) => {
        const webStyle = {
          width: size === 'large' ? '36px' : '20px',
          height: size === 'large' ? '36px' : '20px',
          border: '3px solid #f3f3f3',
          borderTop: \`3px solid \${color || '#3498db'}\`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          ...convertStyle(style)
        };
        
        return React.createElement('div', { style: webStyle, ...props });
      };

      // Modal component
      const Modal = ({ visible, transparent, animationType, children, onRequestClose, ...props }) => {
        if (!visible) return null;
        
        const overlayStyle = {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: transparent ? 'rgba(0,0,0,0.5)' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        };
        
        return React.createElement('div', { style: overlayStyle, onClick: onRequestClose, ...props },
          React.createElement('div', { onClick: (e) => e.stopPropagation() }, children)
        );
      };

      // Pressable component (modern TouchableOpacity)
      const Pressable = ({ style, onPress, children, ...props }) => {
        const [isPressed, setIsPressed] = React.useState(false);
        
        const computedStyle = typeof style === 'function' 
          ? style({ pressed: isPressed })
          : style;
        
        const webStyle = {
          cursor: 'pointer',
          userSelect: 'none',
          ...convertStyle(computedStyle)
        };
        
        return React.createElement('div', {
          style: webStyle,
          onClick: onPress,
          onMouseDown: () => setIsPressed(true),
          onMouseUp: () => setIsPressed(false),
          onMouseLeave: () => setIsPressed(false),
          ...props
        }, typeof children === 'function' ? children({ pressed: isPressed }) : children);
      };

      // SafeAreaView component
      const SafeAreaView = ({ style, children, ...props }) => {
        const webStyle = {
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
          paddingRight: 'env(safe-area-inset-right)',
          ...convertStyle(style)
        };
        return React.createElement('div', { style: webStyle, ...props }, children);
      };

      // Dimensions API
      const Dimensions = {
        get: (dim) => {
          if (dim === 'window') {
            return {
              width: window.innerWidth,
              height: window.innerHeight,
              scale: window.devicePixelRatio || 1,
              fontScale: 1
            };
          }
          return {
            width: window.screen.width,
            height: window.screen.height,
            scale: window.devicePixelRatio || 1,
            fontScale: 1
          };
        },
        addEventListener: (event, handler) => {
          if (event === 'change') {
            window.addEventListener('resize', handler);
          }
        },
        removeEventListener: (event, handler) => {
          if (event === 'change') {
            window.removeEventListener('resize', handler);
          }
        }
      };

      // Animated API (basic implementation)
      const Animated = {
        Value: class {
          constructor(value) {
            this._value = value;
            this._listeners = [];
          }
          setValue(value) {
            this._value = value;
            this._listeners.forEach(listener => listener({ value }));
          }
          addListener(callback) {
            this._listeners.push(callback);
          }
          removeAllListeners() {
            this._listeners = [];
          }
        },
        timing: (value, config) => ({
          start: (callback) => {
            const { toValue, duration = 300 } = config;
            const startValue = value._value;
            const startTime = Date.now();
            
            const animate = () => {
              const now = Date.now();
              const progress = Math.min((now - startTime) / duration, 1);
              value.setValue(startValue + (toValue - startValue) * progress);
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else if (callback) {
                callback({ finished: true });
              }
            };
            
            requestAnimationFrame(animate);
          }
        }),
        View: View,
        Text: Text,
        Image: Image
      };

      // Platform API polyfill for web
      const Platform = {
        OS: 'web',
        Version: 1,
        select: (obj) => {
          if (obj.web !== undefined) return obj.web;
          if (obj.default !== undefined) return obj.default;
          return undefined;
        },
        isTV: false,
        isTesting: false
      };

      // Add CSS for animations
      if (!document.getElementById('rn-animations')) {
        const style = document.createElement('style');
        style.id = 'rn-animations';
        style.textContent = \`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        \`;
        document.head.appendChild(style);
      }
    `;

    return polyfills + '\n' + webCode;
  }

  private wrapInModule(code: string): string {
    // Extract all import statements (must be at top level)
    const importRegex = /import\s+.*?from\s+['"][^'"]+['"];?\s*\n?/g;
    const imports = code.match(importRegex) || [];
    const codeWithoutImports = code.replace(importRegex, '').trim();

    // Ensure we have the required imports
    const hasReactImport = imports.some(imp => imp.includes('react@18.3.1'));
    const hasReactDOMImport = imports.some(imp => imp.includes('react-dom@18.3.1'));

    // Build final module with imports at top
    return `
${imports.join('\n')}

${codeWithoutImports}

// Render the app to the DOM
(function() {
  const root = document.getElementById('root');
  if (root && typeof App !== 'undefined') {
    try {
      const appElement = React.createElement(App);
      ReactDOM.createRoot(root).render(appElement);
    } catch (error) {
      console.error('Render error:', error);
      root.innerHTML = '<div style="padding: 20px; color: red;">Error rendering app: ' + error.message + '</div>';
    }
  } else {
    console.error('Root element or App not found', { root, App: typeof App });
  }
})();
    `.trim();
  }
}
