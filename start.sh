#!/bin/bash

# Multi-Chain Wallet Tester - Quick Setup Script

echo "🚀 Setting up Multi-Chain Wallet Tester..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the walletconnect_check directory"
    exit 1
fi

echo "✅ Found project files"

# Function to start server based on available tools
start_server() {
    echo "🌐 Starting local server..."
    
    # Try Python 3 first
    if command -v python3 &> /dev/null; then
        echo "📡 Using Python 3 HTTP server..."
        python3 -m http.server 8080
    elif command -v python &> /dev/null; then
        echo "📡 Using Python HTTP server..."
        python -m http.server 8080
    elif command -v node &> /dev/null && command -v npx &> /dev/null; then
        echo "📡 Using Node.js serve..."
        npx serve -s . -p 8080
    else
        echo "❌ Error: No suitable server found. Please install Python or Node.js"
        echo "💡 Or manually serve the files using your preferred method"
        exit 1
    fi
}

# Display instructions
echo "
📱 Multi-Chain Wallet Tester Setup Complete!

🎯 Supported Wallets:
   • Reown Kit (EVM/Ethereum) - WalletConnect v2
   • Phantom (Solana)
   • Petra (Aptos)

🚀 Quick Start:
   1. Server will start on http://localhost:8080
   2. Open in your browser or mobile device
   3. Test wallet connections

📱 Mobile Testing:
   • Use your phone's browser: http://YOUR_IP:8080
   • Or integrate into your mobile app's webview

⚡ Ready to start? Press CTRL+C to stop server when done.
"

# Start the server
start_server