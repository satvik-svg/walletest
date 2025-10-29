class WalletTester {
    constructor() {
        this.wallets = {
            evm: null,
            solana: null,
            aptos: null
        };
        this.connections = {
            evm: false,
            solana: false,
            aptos: false
        };
        
        this.initializeApp();
    }

    async initializeApp() {
        await this.initializeReownKit();
        this.initializePhantom();
        this.initializePetra();
        this.setupEventListeners();
        this.updateUI();
        
        console.log('Wallet Tester initialized');
        this.logResult('info', 'Wallet Tester initialized successfully');
    }

    // Reown Kit (EVM) Integration
    async initializeReownKit() {
        try {
            // Production WalletConnect Project ID
            const PROJECT_ID = 'b44324dfdc73cf8c242cf797293a14fc'; // Your WalletConnect project ID
            
            // Check if Reown AppKit is available
            if (typeof window.reown !== 'undefined' || typeof window.AppKit !== 'undefined') {
                // Initialize Reown Kit with mobile-optimized settings
                const { createAppKit } = window.reown || window.AppKit || {};
                
                if (createAppKit) {
                    this.wallets.evm = createAppKit({
                        projectId: PROJECT_ID,
                        networks: [
                            {
                                id: 1,
                                name: 'Ethereum',
                                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                                rpcUrls: { default: { http: ['https://ethereum.publicnode.com'] } }
                            },
                            {
                                id: 137,
                                name: 'Polygon',
                                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                                rpcUrls: { default: { http: ['https://polygon-rpc.com'] } }
                            },
                            {
                                id: 56,
                                name: 'BSC',
                                nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                                rpcUrls: { default: { http: ['https://bsc-dataseed1.binance.org'] } }
                            }
                        ],
                        metadata: {
                            name: 'Wallet Tester',
                            description: 'Multi-chain wallet testing app for mobile',
                            url: window.location.origin,
                            icons: ['https://walletconnect.com/walletconnect-logo.png']
                        },
                        // Mobile-specific configurations
                        featuredWalletIds: [
                            'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
                            '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
                            'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet
                        ],
                        enableAnalytics: false, // Set to true for production analytics
                        enableOnramp: false,    // Enable if you want fiat on-ramp
                        allowUnsupportedChains: false
                    });
                    
                    console.log('Reown Kit initialized with mobile optimizations');
                    this.logResult('success', 'WalletConnect (Reown Kit) ready for mobile webview');
                }
            } else {
                console.warn('Reown Kit not available, using fallback WalletConnect');
                await this.initializeWalletConnect();
            }
        } catch (error) {
            console.error('Error initializing Reown Kit:', error);
            this.logResult('error', `Reown Kit initialization failed: ${error.message}`);
        }
    }

    async initializeWalletConnect() {
        try {
            const PROJECT_ID = 'b44324dfdc73cf8c242cf797293a14fc'; // Your WalletConnect project ID
            
            // Fallback to Web3Modal if Reown Kit is not available
            if (typeof window.Web3Modal !== 'undefined') {
                const { Web3Modal } = window.Web3Modal;
                
                this.wallets.evm = new Web3Modal({
                    projectId: PROJECT_ID,
                    chains: [1, 137, 56], // Ethereum, Polygon, BSC
                    metadata: {
                        name: 'Wallet Tester',
                        description: 'Multi-chain wallet testing app for mobile webview',
                        url: window.location.origin,
                        icons: ['https://walletconnect.com/walletconnect-logo.png']
                    },
                    // Mobile webview optimizations
                    mobileWallets: [
                        {
                            id: 'metamask',
                            name: 'MetaMask',
                            links: {
                                native: 'metamask://',
                                universal: 'https://metamask.app.link'
                            }
                        },
                        {
                            id: 'trust',
                            name: 'Trust Wallet',
                            links: {
                                native: 'trust://',
                                universal: 'https://link.trustwallet.com'
                            }
                        },
                        {
                            id: 'coinbase',
                            name: 'Coinbase Wallet',
                            links: {
                                native: 'cbwallet://',
                                universal: 'https://go.cb-w.com'
                            }
                        }
                    ],
                    desktopWallets: [],
                    walletImages: {},
                    explorerRecommendedWalletIds: 'NONE',
                    enableExplorer: true,
                    termsConditionsUrl: undefined,
                    privacyPolicyUrl: undefined
                });
                
                console.log('Web3Modal initialized as fallback for mobile webview');
                this.logResult('success', 'WalletConnect (Web3Modal) fallback ready');
            }
        } catch (error) {
            console.error('Error initializing WalletConnect:', error);
            this.logResult('error', `WalletConnect fallback failed: ${error.message}`);
        }
    }

    // Phantom (Solana) Integration
    initializePhantom() {
        try {
            if (window.phantom && window.phantom.solana) {
                this.wallets.solana = window.phantom.solana;
                console.log('Phantom wallet detected');
            } else {
                console.warn('Phantom wallet not detected');
                this.logResult('warning', 'Phantom wallet not detected. Please install Phantom.');
            }
        } catch (error) {
            console.error('Error initializing Phantom:', error);
            this.logResult('error', `Phantom initialization failed: ${error.message}`);
        }
    }

    // Petra (Aptos) Integration
    initializePetra() {
        try {
            if (window.petra || window.aptos) {
                this.wallets.aptos = window.petra || window.aptos;
                console.log('Petra wallet detected');
            } else {
                console.warn('Petra wallet not detected');
                this.logResult('warning', 'Petra wallet not detected. Please install Petra.');
            }
        } catch (error) {
            console.error('Error initializing Petra:', error);
            this.logResult('error', `Petra initialization failed: ${error.message}`);
        }
    }

    // Event Listeners Setup
    setupEventListeners() {
        // EVM connections
        document.getElementById('connect-evm').addEventListener('click', () => this.connectEVM());
        document.getElementById('disconnect-evm').addEventListener('click', () => this.disconnectEVM());

        // Solana connections
        document.getElementById('connect-solana').addEventListener('click', () => this.connectSolana());
        document.getElementById('disconnect-solana').addEventListener('click', () => this.disconnectSolana());

        // Aptos connections
        document.getElementById('connect-aptos').addEventListener('click', () => this.connectAptos());
        document.getElementById('disconnect-aptos').addEventListener('click', () => this.disconnectAptos());

        // Test actions
        document.getElementById('sign-evm').addEventListener('click', () => this.signMessageEVM());
        document.getElementById('sign-solana').addEventListener('click', () => this.signMessageSolana());
        document.getElementById('sign-aptos').addEventListener('click', () => this.signMessageAptos());

        document.getElementById('send-evm').addEventListener('click', () => this.sendTransactionEVM());
        document.getElementById('send-solana').addEventListener('click', () => this.sendTransactionSolana());
        document.getElementById('send-aptos').addEventListener('click', () => this.sendTransactionAptos());

        // Clear results
        document.getElementById('clear-results').addEventListener('click', () => this.clearResults());
    }

    // EVM Wallet Functions
    async connectEVM() {
        try {
            this.updateConnectionStatus('evm', 'connecting');
            
            if (this.wallets.evm && this.wallets.evm.open) {
                await this.wallets.evm.open();
                // Listen for connection events if available
                if (this.wallets.evm.subscribeAccount) {
                    this.wallets.evm.subscribeAccount((account) => {
                        if (account) {
                            this.connections.evm = true;
                            this.updateWalletInfo('evm', {
                                address: account.address,
                                chain: 'Ethereum',
                                balance: '0 ETH' // Would need to fetch actual balance
                            });
                        }
                    });
                }
                
                this.logResult('success', 'EVM wallet connection initiated');
            } else if (window.ethereum) {
                // Fallback to injected provider
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    this.connections.evm = true;
                    this.updateWalletInfo('evm', {
                        address: accounts[0],
                        chain: 'Ethereum',
                        balance: '0 ETH'
                    });
                    this.logResult('success', `Connected to EVM wallet: ${accounts[0]}`);
                }
            } else {
                throw new Error('No EVM wallet available');
            }
        } catch (error) {
            console.error('EVM connection error:', error);
            this.logResult('error', `EVM connection failed: ${error.message}`);
            this.updateConnectionStatus('evm', 'disconnected');
        }
    }

    async disconnectEVM() {
        try {
            if (this.wallets.evm && this.wallets.evm.disconnect) {
                await this.wallets.evm.disconnect();
            }
            this.connections.evm = false;
            this.updateConnectionStatus('evm', 'disconnected');
            this.logResult('info', 'Disconnected from EVM wallet');
        } catch (error) {
            console.error('EVM disconnect error:', error);
            this.logResult('error', `EVM disconnect failed: ${error.message}`);
        }
    }

    // Solana Wallet Functions
    async connectSolana() {
        try {
            this.updateConnectionStatus('solana', 'connecting');
            
            if (this.wallets.solana) {
                const response = await this.wallets.solana.connect();
                this.connections.solana = true;
                
                this.updateWalletInfo('solana', {
                    address: response.publicKey.toString(),
                    network: 'Mainnet',
                    balance: '0 SOL'
                });
                
                this.logResult('success', `Connected to Phantom: ${response.publicKey.toString()}`);
            } else {
                throw new Error('Phantom wallet not available');
            }
        } catch (error) {
            console.error('Solana connection error:', error);
            this.logResult('error', `Solana connection failed: ${error.message}`);
            this.updateConnectionStatus('solana', 'disconnected');
        }
    }

    async disconnectSolana() {
        try {
            if (this.wallets.solana) {
                await this.wallets.solana.disconnect();
            }
            this.connections.solana = false;
            this.updateConnectionStatus('solana', 'disconnected');
            this.logResult('info', 'Disconnected from Phantom wallet');
        } catch (error) {
            console.error('Solana disconnect error:', error);
            this.logResult('error', `Solana disconnect failed: ${error.message}`);
        }
    }

    // Aptos Wallet Functions
    async connectAptos() {
        try {
            this.updateConnectionStatus('aptos', 'connecting');
            
            if (this.wallets.aptos) {
                const response = await this.wallets.aptos.connect();
                this.connections.aptos = true;
                
                this.updateWalletInfo('aptos', {
                    address: response.address,
                    network: 'Mainnet',
                    balance: '0 APT'
                });
                
                this.logResult('success', `Connected to Petra: ${response.address}`);
            } else {
                throw new Error('Petra wallet not available');
            }
        } catch (error) {
            console.error('Aptos connection error:', error);
            this.logResult('error', `Aptos connection failed: ${error.message}`);
            this.updateConnectionStatus('aptos', 'disconnected');
        }
    }

    async disconnectAptos() {
        try {
            if (this.wallets.aptos) {
                await this.wallets.aptos.disconnect();
            }
            this.connections.aptos = false;
            this.updateConnectionStatus('aptos', 'disconnected');
            this.logResult('info', 'Disconnected from Petra wallet');
        } catch (error) {
            console.error('Aptos disconnect error:', error);
            this.logResult('error', `Aptos disconnect failed: ${error.message}`);
        }
    }

    // Message Signing Functions
    async signMessageEVM() {
        if (!this.connections.evm) {
            this.logResult('error', 'EVM wallet not connected');
            return;
        }

        try {
            const message = document.getElementById('message-input').value;
            let signature;

            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, accounts[0]]
                });
            }

            this.logResult('success', `EVM message signed: ${signature}`);
        } catch (error) {
            this.logResult('error', `EVM signing failed: ${error.message}`);
        }
    }

    async signMessageSolana() {
        if (!this.connections.solana) {
            this.logResult('error', 'Solana wallet not connected');
            return;
        }

        try {
            const message = document.getElementById('message-input').value;
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await this.wallets.solana.signMessage(encodedMessage);
            
            this.logResult('success', `Solana message signed: ${Array.from(signature.signature).join(',')}`);
        } catch (error) {
            this.logResult('error', `Solana signing failed: ${error.message}`);
        }
    }

    async signMessageAptos() {
        if (!this.connections.aptos) {
            this.logResult('error', 'Aptos wallet not connected');
            return;
        }

        try {
            const message = document.getElementById('message-input').value;
            const signature = await this.wallets.aptos.signMessage({
                message: message,
                nonce: Date.now().toString()
            });
            
            this.logResult('success', `Aptos message signed: ${signature.signature}`);
        } catch (error) {
            this.logResult('error', `Aptos signing failed: ${error.message}`);
        }
    }

    // Transaction Functions
    async sendTransactionEVM() {
        this.logResult('info', 'EVM transaction functionality would require additional setup');
    }

    async sendTransactionSolana() {
        this.logResult('info', 'Solana transaction functionality would require additional setup');
    }

    async sendTransactionAptos() {
        this.logResult('info', 'Aptos transaction functionality would require additional setup');
    }

    // UI Update Functions
    updateConnectionStatus(chain, status) {
        const statusElement = document.getElementById(`${chain}-status`);
        const indicator = statusElement.querySelector('.status-indicator');
        const text = statusElement.querySelector('span:last-child');
        
        indicator.className = `status-indicator ${status}`;
        text.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        
        this.updateUI();
    }

    updateWalletInfo(chain, info) {
        document.getElementById(`${chain}-address`).textContent = 
            info.address.substring(0, 6) + '...' + info.address.substring(info.address.length - 4);
        document.getElementById(`${chain}-chain`).textContent = info.chain;
        document.getElementById(`${chain}-balance`).textContent = info.balance;
        
        document.getElementById(`${chain}-info`).style.display = 'block';
        this.updateUI();
    }

    updateUI() {
        ['evm', 'solana', 'aptos'].forEach(chain => {
            const connectBtn = document.getElementById(`connect-${chain}`);
            const disconnectBtn = document.getElementById(`disconnect-${chain}`);
            
            if (this.connections[chain]) {
                connectBtn.style.display = 'none';
                disconnectBtn.style.display = 'flex';
            } else {
                connectBtn.style.display = 'flex';
                disconnectBtn.style.display = 'none';
                document.getElementById(`${chain}-info`).style.display = 'none';
            }
        });
    }

    logResult(type, message) {
        const resultsContainer = document.getElementById('results');
        const placeholder = resultsContainer.querySelector('.placeholder');
        
        if (placeholder) {
            placeholder.remove();
        }

        const entry = document.createElement('div');
        entry.className = `result-entry ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        entry.innerHTML = `
            <div class="result-timestamp">[${timestamp}]</div>
            <div>${message}</div>
        `;
        
        resultsContainer.appendChild(entry);
        resultsContainer.scrollTop = resultsContainer.scrollHeight;
    }

    clearResults() {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '<p class="placeholder">Test results will appear here...</p>';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.walletTester = new WalletTester();
});

// Handle wallet detection on load and when wallets are installed
window.addEventListener('load', () => {
    // Check for wallets periodically in case they're installed after page load
    setTimeout(() => {
        if (window.walletTester) {
            window.walletTester.initializePhantom();
            window.walletTester.initializePetra();
        }
    }, 2000);
});