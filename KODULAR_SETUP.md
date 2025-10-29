# 📱 Kodular App Configuration for Wallet Deep Links

## 🔧 **IMPORTANT: Update Your Kodular App**

To make the wallet apps open properly, you need to configure your Kodular app to handle wallet deep links.

### 1️⃣ **Add Activity Starter Component**

1. **Go to Kodular Designer**
2. **Connectivity** → **Activity Starter**
3. **Drag to screen** (invisible component)

### 2️⃣ **Add Required Permissions**

In **Screen Properties** → **Other Settings** → **Permissions**:
- ✅ `android.permission.INTERNET`
- ✅ `android.permission.ACCESS_NETWORK_STATE`

### 3️⃣ **Configure WebViewer Events (Blocks)**

**When WebViewer1.PageStarted:**
```blocks
if (contains text: get url, piece: "metamask://")
then
  set ActivityStarter1.Action to "android.intent.action.VIEW"
  set ActivityStarter1.DataUri to get url
  call ActivityStarter1.StartActivity

if (contains text: get url, piece: "trust://")  
then
  set ActivityStarter1.Action to "android.intent.action.VIEW"
  set ActivityStarter1.DataUri to get url
  call ActivityStarter1.StartActivity
  
if (contains text: get url, piece: "cbwallet://")
then
  set ActivityStarter1.Action to "android.intent.action.VIEW"
  set ActivityStarter1.DataUri to get url
  call ActivityStarter1.StartActivity
```

### 4️⃣ **Handle App Not Installed (Optional)**

**When ActivityStarter1.ActivityError:**
```blocks
call Notifier1.ShowAlert
  message: "Wallet app not installed. Please install from Play Store."
```

### 5️⃣ **Alternative: Use Custom URL Scheme Handler**

If the above doesn't work, try this approach:

**When WebViewer1.BeforePageLoad:**
```blocks
if (contains text: get url, piece: "metamask://") OR 
   (contains text: get url, piece: "trust://") OR
   (contains text: get url, piece: "cbwallet://")
then
  set ActivityStarter1.Action to "android.intent.action.VIEW"
  set ActivityStarter1.DataUri to get url
  call ActivityStarter1.StartActivity
  return false  // Prevent WebView from loading the URL
else
  return true   // Allow WebView to load normal URLs
```

### 6️⃣ **Test the Flow**

1. **Build and install your Kodular APK**
2. **Install wallet apps** (MetaMask, Trust Wallet, Coinbase Wallet)
3. **Open your app**
4. **Click "Open MetaMask" button**
5. **MetaMask app should open** ✅

### 🛠️ **Troubleshooting**

**If wallet apps don't open:**

1. **Check wallet app is installed**
2. **Verify Activity Starter is configured**
3. **Test deep links manually** in browser:
   - Type `metamask://` in Chrome address bar
   - Should ask to open MetaMask app

**If still not working:**
- Try the "BeforePageLoad" approach instead of "PageStarted"
- Make sure your Kodular app has internet permission
- Test with different wallet apps

### 📋 **Block Configuration Summary**

```
Components Needed:
✅ WebViewer1 (your main component)
✅ ActivityStarter1 (for opening apps)
✅ Notifier1 (optional, for errors)

Events to Handle:
✅ WebViewer1.PageStarted
✅ ActivityStarter1.ActivityError (optional)

URL Schemes to Handle:
✅ metamask://
✅ trust://  
✅ cbwallet://
```

**After configuring these blocks in your Kodular app, the wallet buttons should properly open the wallet apps on your phone!**