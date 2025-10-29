// Mobile optimization and detection utilities

class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isWebView = this.detectWebView();
        this.init();
    }

    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    }

    detectWebView() {
        const userAgent = navigator.userAgent;
        
        // iOS WebView detection
        const isIOSWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(userAgent);
        
        // Android WebView detection  
        const isAndroidWebView = /Android.*wv\)|.*Version\/.*Chrome/i.test(userAgent);
        
        return isIOSWebView || isAndroidWebView;
    }

    init() {
        if (this.isMobile) {
            document.body.classList.add('mobile-device');
        }
        
        if (this.isWebView) {
            document.body.classList.add('webview');
            // Show WebView-specific wallet buttons
            const webviewActions = document.getElementById('webview-actions');
            if (webviewActions) {
                webviewActions.style.display = 'block';
            }
        }

        // Add mobile-specific optimizations
        this.optimizeForMobile();
        this.handleOrientationChange();
        this.optimizeScrolling();
    }

    optimizeForMobile() {
        if (!this.isMobile) return;

        // Prevent zoom on inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0';
                }
            });
            
            input.addEventListener('blur', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.content = 'width=device-width, initial-scale=1';
                }
            });
        });

        // Add haptic feedback for buttons (if available)
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Recalculate layout after orientation change
                window.scrollTo(0, 0);
            }, 500);
        });
    }

    optimizeScrolling() {
        // Smooth scrolling for mobile
        if (this.isMobile) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }

        // Prevent overscroll bounce on iOS
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.results-container')) {
                return; // Allow scrolling in results container
            }
            
            // Prevent overscroll on body
            if (document.body.scrollHeight <= window.innerHeight) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Helper method to get device info for debugging
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            isMobile: this.isMobile,
            isWebView: this.isWebView,
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1,
            orientation: screen.orientation?.type || 'unknown'
        };
    }
}

// Initialize mobile optimizer when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimizer = new MobileOptimizer();
    
    // Log device info for debugging
    console.log('Device Info:', window.mobileOptimizer.getDeviceInfo());
    
    // Add device info to wallet tester results
    if (window.walletTester) {
        setTimeout(() => {
            const deviceInfo = window.mobileOptimizer.getDeviceInfo();
            window.walletTester.logResult('info', 
                `Device: ${deviceInfo.isMobile ? 'Mobile' : 'Desktop'}, ` +
                `WebView: ${deviceInfo.isWebView ? 'Yes' : 'No'}, ` +
                `Screen: ${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`
            );
        }, 1000);
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileOptimizer;
}