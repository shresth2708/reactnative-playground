#!/bin/bash

echo "🚀 React Native Playground Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd packages/frontend
npm install
cd ../..
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd packages/backend
npm install
cd ../..
echo ""

echo "✅ Setup complete!"
echo ""
echo "🎉 You're ready to go!"
echo ""
echo "To start the development servers, run:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser."
echo ""
