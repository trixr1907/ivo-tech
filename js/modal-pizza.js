// IVO TECH - PIZZA HOMEPAGE MODAL ENGINE
// "LIVE DEMO IFRAME"
// Displays the complete Pizza homepage in an interactive iframe

const ModalPizzaEngine = {
    container: null,
    iframe: null,
    
    init(containerEl) {
        if (!containerEl) return;
        this.container = containerEl;
        console.log("[PIZZA MODAL] Initializing iFrame Demo...");
        
        // Inject iFrame UI
        this.container.innerHTML = `
            <div class="pizza-iframe-wrapper">
                <div class="pizza-iframe-header">
                    <span class="pizza-live-badge">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                            <circle cx="6" cy="6" r="6"/>
                        </svg>
                        LIVE TEMPLATE DEMO
                    </span>
                    <a href="pizza/index.html" target="_blank" class="pizza-open-new" rel="noopener noreferrer">
                        Vollbild öffnen ↗
                    </a>
                </div>
                <iframe 
                    id="pizza-demo-iframe" 
                    src="pizza/index.html" 
                    frameborder="0"
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    loading="lazy"
                    title="Ivo's Pizza Homepage Template Demo">
                </iframe>
            </div>
        `;
        
        this.iframe = this.container.querySelector('#pizza-demo-iframe');
        console.log("[PIZZA MODAL] iFrame loaded.");
    },
    
    dispose() {
        console.log("[PIZZA MODAL] Cleanup.");
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.iframe = null;
        this.container = null;
    }
};

window.ModalPizzaEngine = ModalPizzaEngine;
