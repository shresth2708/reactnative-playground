import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCTxQVOQshw8nYI-BZRFntov88bAOA-x3o';

export class AIAgent {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  async chat(message: string, context?: { code?: string; files?: any[] }): Promise<string> {
    try {
      // Build context-aware prompt
      let prompt = message;

      if (context?.code) {
        prompt = `Current code:\n\`\`\`typescript\n${context.code}\n\`\`\`\n\nUser question: ${message}`;
      }

      if (context?.files && context.files.length > 0) {
        const fileList = context.files.map(f => `- ${f.name}`).join('\n');
        prompt = `Project files:\n${fileList}\n\n${prompt}`;
      }

      // Add conversation history for context
      const messages = [
        {
          role: 'system',
          content: `You are an expert React Native developer assistant. You help developers write better code, debug issues, explain concepts, and generate React Native components. Always provide practical, working code examples. Be concise but thorough.`,
        },
        ...this.conversationHistory.slice(-10), // Keep last 10 messages for context
        {
          role: 'user',
          content: prompt,
        },
      ];

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      });

      const response = await result.response;
      const aiResponse = response.text() || 'Sorry, I could not generate a response.';

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      );

      // Keep history manageable
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return aiResponse;
    } catch (error: any) {
      console.error('AI Agent error:', error);
      return `Error: ${error.message || 'Failed to get AI response'}`;
    }
  }

  async generateCode(description: string, type: 'component' | 'screen' | 'hook' | 'utility'): Promise<string> {
    try {
      const prompts = {
        component: `Generate a React Native component based on this description: ${description}\n\nProvide complete, production-ready TypeScript code with proper types, styles, and best practices.`,
        screen: `Generate a React Native screen component based on this description: ${description}\n\nInclude navigation setup, proper layout, and TypeScript types.`,
        hook: `Generate a custom React hook based on this description: ${description}\n\nProvide TypeScript implementation with proper types and error handling.`,
        utility: `Generate a utility function based on this description: ${description}\n\nProvide TypeScript implementation with proper types, error handling, and JSDoc comments.`,
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompts[type] }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 3000,
        },
      });

      const response = await result.response;
      return response.text() || 'Failed to generate code';
    } catch (error: any) {
      console.error('Code generation error:', error);
      return `Error: ${error.message}`;
    }
  }

  async explainCode(code: string): Promise<string> {
    try {
      const prompt = `Explain this React Native code in detail:\n\n\`\`\`typescript\n${code}\n\`\`\`\n\nProvide a clear explanation of what it does, how it works, and any best practices or improvements.`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      return response.text() || 'Failed to explain code';
    } catch (error: any) {
      console.error('Code explanation error:', error);
      return `Error: ${error.message}`;
    }
  }

  async debugCode(code: string, error?: string): Promise<string> {
    try {
      let prompt = `Debug this React Native code:\n\n\`\`\`typescript\n${code}\n\`\`\`\n\n`;

      if (error) {
        prompt += `Error message: ${error}\n\n`;
      }

      prompt += `Identify issues, explain what's wrong, and provide the corrected code.`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      return response.text() || 'Failed to debug code';
    } catch (error: any) {
      console.error('Code debugging error:', error);
      return `Error: ${error.message}`;
    }
  }

  async improveCode(code: string): Promise<string> {
    try {
      const prompt = `Improve this React Native code:\n\n\`\`\`typescript\n${code}\n\`\`\`\n\nSuggest improvements for:\n- Performance\n- Readability\n- Best practices\n- TypeScript types\n- Error handling\n\nProvide the improved code with explanations.`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      return response.text() || 'Failed to improve code';
    } catch (error: any) {
      console.error('Code improvement error:', error);
      return `Error: ${error.message}`;
    }
  }

  async generateTests(code: string): Promise<string> {
    try {
      const prompt = `Generate comprehensive tests for this React Native code:\n\n\`\`\`typescript\n${code}\n\`\`\`\n\nProvide Jest and React Testing Library tests with proper setup, test cases, and assertions.`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      return response.text() || 'Failed to generate tests';
    } catch (error: any) {
      console.error('Test generation error:', error);
      return `Error: ${error.message}`;
    }
  }

  async suggestRefactoring(code: string): Promise<string> {
    try {
      const prompt = `Suggest refactoring for this React Native code:\n\n\`\`\`typescript\n${code}\n\`\`\`\n\nProvide specific refactoring suggestions with before/after examples.`;

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      return response.text() || 'Failed to suggest refactoring';
    } catch (error: any) {
      console.error('Refactoring suggestion error:', error);
      return `Error: ${error.message}`;
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}
