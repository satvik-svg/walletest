# 💰 Multi-Chain Wallet Tester

A mobile-optimized web application for testing wallet connections across multiple blockchain networks. This app is specifically designed for use in mobile webviews to test wallet integrations.

🌐 **Live Demo**: [Deploy on Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/wallet-tester)

## 🚀 Supported Wallets

- **🔗 Reown Kit (EVM/Ethereum)** - WalletConnect v2 integration for Ethereum and EVM-compatible chains
- **👻 Phantom (Solana)** - Native Solana wallet integration  
- **💎 Petra (Aptos)** - Native Aptos wallet integration

## Features

✅ Mobile-optimized responsive design  
✅ Multiple blockchain support  
✅ Wallet connection status indicators  
✅ Message signing capabilities  
✅ Basic transaction testing framework  
✅ Real-time test result logging  
✅ WebView compatible  

## Quick Start

### Option 1: Python Server (Recommended)
```bash
# Navigate to the project directory
cd walletconnect_check

# Start a local server
python3 -m http.server 8080
# or for Python 2:
python -m http.server 8080
```

### Option 2: Node.js Server
```bash
# Install dependencies (optional)
npm install

# Start the server
npm start
# or use serve directly:
npx serve -s . -p 8080
```

### Option 3: Live Development Server
```bash
# Install live-server for auto-reload during development
npm install -g live-server

# Start development server
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:8080`
2. For mobile testing, use your device's browser or webview
3. Connect to the wallets you want to test
4. Use the test functions to verify wallet functionality

## Mobile WebView Integration

This app is optimized for mobile webviews. To integrate into your mobile app:

### iOS (Swift)
```swift
import WebKit

let webView = WKWebView()
let url = URL(string: "http://your-server.com")!
let request = URLRequest(url: url)
webView.load(request)
```

### Android (Kotlin)
```kotlin
val webView = WebView(this)
webView.settings.javaScriptEnabled = true
webView.loadUrl("http://your-server.com")
```

## Wallet Integration Details

### Reown Kit (EVM)
- Uses WalletConnect v2 protocol
- Supports multiple EVM chains
- Fallback to injected providers (MetaMask, etc.)

### Phantom (Solana)
- Detects Phantom wallet extension/app
- Supports Solana mainnet/devnet
- Message signing and basic transactions

### Petra (Aptos)
- Detects Petra wallet extension/app  
- Supports Aptos mainnet/testnet
- Message signing capabilities

## Testing Features

### Connection Tests
- Connect/disconnect wallets
- Display wallet addresses
- Show connection status
- Network information

### Message Signing
- Sign custom messages
- Verify wallet functionality
- Cross-chain compatibility testing

### Transaction Testing (Framework)
- Basic transaction structure
- Ready for extension with actual transaction logic
- Error handling and user feedback

## File Structure

```
walletconnect_check/
├── index.html          # Main HTML structure
├── styles.css          # Mobile-optimized CSS
├── script.js           # Wallet integration logic
├── package.json        # Project configuration
└── README.md          # This file
```

## Development Notes

### Mobile Optimization
- Touch-friendly button sizes (min 44px)
- Responsive grid layouts
- iOS Safari compatibility
- Proper viewport meta tags

### Security Considerations
- Uses public demo project IDs
- No private key handling
- Wallet-native security features
- HTTPS recommended for production

### Browser Compatibility
- Modern mobile browsers
- iOS Safari 12+
- Android Chrome 70+
- WebView components

## Customization

### Adding New Chains
1. Add new wallet detection in `script.js`
2. Create connection logic
3. Update UI components in `index.html`
4. Add styling in `styles.css`

### Styling Changes
- Modify `styles.css` for visual updates
- Responsive breakpoints at 768px and 480px
- CSS custom properties for easy theming

### Functionality Extensions
- Add real transaction capabilities
- Implement balance fetching
- Add more test scenarios
- Integrate additional wallets

## Troubleshooting

### Wallets Not Detected
- Ensure wallets are installed
- Check browser console for errors
- Verify wallet compatibility
- Try refreshing the page

### Connection Issues
- Check network connectivity
- Verify wallet permissions
- Ensure correct network selection
- Clear browser cache if needed

### Mobile WebView Issues
- Enable JavaScript in webview
- Allow wallet app redirections
- Handle deep linking properly
- Test on actual devices

## Production Deployment

### For Production Use:
1. Replace demo project IDs with your own
2. Use HTTPS hosting
3. Configure proper CORS headers
4. Add error tracking
5. Implement analytics

### Hosting Options:
- GitHub Pages (static hosting)
- Netlify/Vercel (with custom domains)
- AWS S3 + CloudFront
- Your own web server

## License

MIT License - feel free to use and modify for your needs.

## Support

For issues and questions:
1. Check browser console for errors
2. Verify wallet installations
3. Test on different devices/browsers
4. Check wallet-specific documentation