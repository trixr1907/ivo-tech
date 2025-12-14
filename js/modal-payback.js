// IVO TECH - AUTOCOUPON MODAL ENGINE
// "AUTOMATED COUPON ACTIVATION DEMO"
// Visualizes the browser extension in action

const ModalPaybackEngine = {
    container: null,
    demoInterval: null,
    animationFrame: null,
    isRunning: false,
    
    // Demo timing configuration
    timing: {
        cursorStart: 1000,      // Cursor appears after 1s
        cursorHover: 2000,      // Cursor hovers at 2s
        buttonClick: 2250,      // Button clicks at 2.25s
        shockwave: 2500,        // Shockwave at 2.5s
        couponDelay: 100,       // Delay between coupon activations
        couponStagger: 50,      // Stagger between coupons
        loopDuration: 8000      // Total loop duration
    },

    init(containerEl) {
        if (!containerEl) return;
        this.container = containerEl;
        console.log("[AUTOCOUPON MODAL] Initializing Demo...");
        
        this.buildUI();
        this.startDemo();
    },

    buildUI() {
        // Inject complete demo UI
        this.container.innerHTML = `
            <!-- Background Ambient Glow -->
            <div class="payback-ambient-glow"></div>
            
            <!-- Coupon Grid Background -->
            <div class="payback-grid-container" id="payback-grid">
                <!-- Will be populated by JS -->
            </div>
            
            <!-- Main Widget -->
            <div class="payback-widget">
                <!-- Success Badge -->
                <div class="payback-success-badge" id="payback-success-badge">
                    <svg style="width:16px;height:16px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                    ALL COUPONS ACTIVATED
                </div>
                
                <!-- Widget Header -->
                <div class="payback-widget-header">
                    <div class="payback-logo-box">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div class="payback-title-group">
                        <h3>AutoCoupon</h3>
                        <p>by Ivo Tech</p>
                    </div>
                </div>
                
                <!-- Main Button -->
                <button class="payback-main-btn" id="payback-main-btn" type="button">
                    <svg style="width:24px;height:24px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ACTIVATE COUPONS
                </button>
                
                <!-- Footer -->
                <div class="payback-logo-footer">IVO TECH EDITION</div>
            </div>
            
            <!-- Animated Cursor -->
            <div class="payback-cursor" id="payback-cursor"></div>
        `;
        
        // Populate coupon grid
        const grid = this.container.querySelector('#payback-grid');
        if (grid) {
            for (let i = 0; i < 16; i++) {
                const coupon = document.createElement('div');
                coupon.className = 'payback-coupon-card';
                coupon.innerHTML = `
                    <div class="payback-coupon-label">10x POINTS</div>
                    <div class="payback-activate-btn-fake">Activate</div>
                `;
                grid.appendChild(coupon);
            }
        }
    },

    startDemo() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const btn = this.container.querySelector('#payback-main-btn');
        const badge = this.container.querySelector('#payback-success-badge');
        const cursor = this.container.querySelector('#payback-cursor');
        const coupons = this.container.querySelectorAll('.payback-coupon-card');
        
        // Reset state
        this.resetDemo();
        
        // Start cursor animation
        setTimeout(() => {
            if (cursor) cursor.classList.add('active');
        }, this.timing.cursorStart);
        
        // Hover effect
        setTimeout(() => {
            if (btn) {
                btn.style.transform = "translateY(-2px)";
                btn.style.boxShadow = "0 6px 30px rgba(0, 243, 255, 0.6)";
            }
        }, this.timing.cursorHover);
        
        // Click down
        setTimeout(() => {
            if (btn) btn.style.transform = "scale(0.95)";
        }, this.timing.buttonClick);
        
        // Click release & activation
        setTimeout(() => {
            if (btn) btn.style.transform = "scale(1)";
            
            // Trigger shockwave
            this.createShockwave();
            
            // Show success badge
            if (badge) badge.classList.add('show');
            
            // Update button
            if (btn) {
                btn.innerHTML = `
                    <svg style="width:24px;height:24px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    DONE
                `;
                btn.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            }
            
            // Activate coupons in cascade
            coupons.forEach((coupon, index) => {
                setTimeout(() => {
                    coupon.classList.add('active');
                    const fakeBtn = coupon.querySelector('.payback-activate-btn-fake');
                    if (fakeBtn) {
                        fakeBtn.textContent = 'ACTIVATED';
                        fakeBtn.style.color = 'black';
                        fakeBtn.style.fontWeight = '800';
                    }
                }, this.timing.couponDelay + (index * this.timing.couponStagger));
            });
            
        }, this.timing.shockwave);
        
        // Loop the demo
        this.demoInterval = setTimeout(() => {
            this.startDemo();
        }, this.timing.loopDuration);
    },

    createShockwave() {
        const shockwave = document.createElement('div');
        shockwave.className = 'payback-shockwave';
        this.container.appendChild(shockwave);
        
        // Remove after animation
        setTimeout(() => {
            if (shockwave && shockwave.parentNode) {
                shockwave.parentNode.removeChild(shockwave);
            }
        }, 1500);
    },

    resetDemo() {
        const btn = this.container.querySelector('#payback-main-btn');
        const badge = this.container.querySelector('#payback-success-badge');
        const cursor = this.container.querySelector('#payback-cursor');
        const coupons = this.container.querySelectorAll('.payback-coupon-card');
        
        // Reset button
        if (btn) {
            btn.innerHTML = `
                <svg style="width:24px;height:24px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ACTIVATE COUPONS
            `;
            btn.style.background = 'linear-gradient(90deg, #00f3ff 0%, #bd00ff 100%)';
            btn.style.transform = '';
            btn.style.boxShadow = '';
        }
        
        // Reset badge
        if (badge) badge.classList.remove('show');
        
        // Reset cursor
        if (cursor) cursor.classList.remove('active');
        
        // Reset coupons
        coupons.forEach(coupon => {
            coupon.classList.remove('active');
            const fakeBtn = coupon.querySelector('.payback-activate-btn-fake');
            if (fakeBtn) {
                fakeBtn.textContent = 'Activate';
                fakeBtn.style.color = '';
                fakeBtn.style.fontWeight = '';
            }
        });
        
        // Remove any existing shockwaves
        const shockwaves = this.container.querySelectorAll('.payback-shockwave');
        shockwaves.forEach(sw => sw.remove());
    },

    dispose() {
        console.log("[AUTOCOUPON MODAL] Cleanup.");
        
        // Stop demo loop
        if (this.demoInterval) {
            clearTimeout(this.demoInterval);
            this.demoInterval = null;
        }
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        this.isRunning = false;
        
        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        this.container = null;
    }
};

window.ModalPaybackEngine = ModalPaybackEngine;
