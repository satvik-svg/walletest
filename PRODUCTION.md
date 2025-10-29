# Production Configuration for Mobile WebView Deployment

## 🚨 IMPORTANT: Before Deploying to Production

### 1. WalletConnect Project ID ✅ CONFIGURED

**✅ Your WalletConnect Project ID is already configured:**
- Project ID: `b44324dfdc73cf8c242cf797293a14fc`
- Status: Ready for production use
- No further action needed for WalletConnect setup

### 2. Mobile App WebView Configuration

#### iOS Configuration (Info.plist)
```xml
<!-- Add to your Info.plist for wallet deep links -->
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>metamask</string>
    <string>trust</string>
    <string>cbwallet</string>
    <string>rainbow</string>
    <string>zerion</string>
    <string>wc</string>
</array>

<!-- Allow arbitrary loads for WalletConnect (if needed) -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

#### iOS WebView Code (Swift)
```swift
import WebKit

class WalletWebViewController: UIViewController {
    @IBOutlet weak var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Configure webview for wallet connections
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []
        
        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        
        // Enable JavaScript
        webView.configuration.preferences.javaScriptEnabled = true
        
        // Load your hosted website
        let url = URL(string: "https://your-domain.com")!
        webView.load(URLRequest(url: url))
        
        view.addSubview(webView)
    }
}

extension WalletWebViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        if let url = navigationAction.request.url {
            // Handle wallet deep links
            if url.scheme == "metamask" || url.scheme == "trust" || url.scheme == "cbwallet" {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                decisionHandler(.cancel)
                return
            }
        }
        
        decisionHandler(.allow)
    }
}
```

#### Android Configuration (AndroidManifest.xml)
```xml
<!-- Add to your AndroidManifest.xml -->
<application>
    <!-- ... your app configuration ... -->
    
    <!-- Intent filters for wallet deep links -->
    <activity android:name=".WalletWebActivity">
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="wc" />
        </intent-filter>
    </activity>
</application>

<!-- Permissions -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

#### Android WebView Code (Kotlin)
```kotlin
class WalletWebActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        webView = WebView(this)
        setContentView(webView)
        
        // Configure WebView for wallet connections
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            setSupportMultipleWindows(true)
            javaScriptCanOpenWindowsAutomatically = true
        }
        
        // Handle wallet deep links
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString()
                
                when {
                    url?.startsWith("metamask://") == true ||
                    url?.startsWith("trust://") == true ||
                    url?.startsWith("cbwallet://") == true -> {
                        try {
                            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        } catch (e: Exception) {
                            // Handle case where wallet app is not installed
                        }
                        return true
                    }
                }
                return false
            }
        }
        
        // Load your hosted website
        webView.loadUrl("https://your-domain.com")
    }
}
```

### 3. Hosting Requirements

#### HTTPS Required
- WalletConnect requires HTTPS in production
- Use services like:
  - Netlify (easy deployment)
  - Vercel (optimized for static sites)
  - AWS S3 + CloudFront
  - Your own server with SSL certificate

#### CORS Configuration
If hosting on your own server, ensure proper CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### 4. Security Considerations

#### Content Security Policy
Add to your HTML `<head>`:
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
    connect-src 'self' https: wss: ws:;
    img-src 'self' https: data:;
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdn.jsdelivr.net;
">
```

#### Environment Variables
For production, use environment variables:
```javascript
const PROJECT_ID = process.env.WALLETCONNECT_PROJECT_ID || '2f05ae7f1116030fde2d36508f472bfb';
```

### 5. Testing Checklist

Before production deployment:

- [ ] Replace demo Project ID with your own
- [ ] Test on actual mobile devices (iOS/Android)
- [ ] Verify wallet connections work in your app's webview
- [ ] Test deep linking to wallet apps
- [ ] Ensure HTTPS hosting
- [ ] Test with different wallets (MetaMask, Trust, Coinbase)
- [ ] Verify error handling and user feedback
- [ ] Test network switching functionality
- [ ] Check performance on slower mobile connections

### 6. Monitoring and Analytics

Consider adding:
- Error tracking (Sentry, Bugsnag)
- Analytics (Google Analytics, Mixpanel)
- WalletConnect analytics (built-in option)
- Performance monitoring

### 7. Deployment Scripts

#### Quick Deploy to Netlify:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd /Users/satviiikkk/walletconnect_check
netlify deploy --prod --dir .
```

#### Quick Deploy to Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd /Users/satviiikkk/walletconnect_check
vercel --prod
```

### 8. Support for Different Wallet Types

The current implementation supports:
- **WalletConnect v2** (via Reown Kit)
- **Injected providers** (MetaMask, Trust, etc.)
- **Mobile deep linking**
- **Multiple EVM chains**

### 9. Troubleshooting Common Issues

1. **"Project ID invalid"** - You need your own Project ID
2. **Deep links not working** - Check URL scheme configuration
3. **WebView not loading** - Ensure JavaScript is enabled
4. **CORS errors** - Check your hosting CORS settings
5. **Wallet not detected** - Ensure proper mobile wallet configuration

---

**Remember:** The demo Project ID `2f05ae7f1116030fde2d36508f472bfb` is for testing only and has rate limits. Replace it with your own Project ID from https://cloud.walletconnect.com/ before production deployment.