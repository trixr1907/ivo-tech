console.log("--> app.js: Loading...");

// --- DEEP TECH DATEN (GLOBAL) ---
window.projectData = {
    "3D STL VIEWER": {
        title: "DLD 3D ENGINE V2",
        status: "ONLINE // V2.0.5",
        tech: "THREE.JS // WEBGL // PHP",
        desc: "Fortschrittliche browserbasierte Geometrie-Analyse-Engine. Erwiesene Fähigkeiten bei sofortiger Volumenberechnung, automatischer Ausrichtung (Lay-Flat-Algorithmus) und Echtzeit-Preiskalkulation basierend auf Materialdichte-Konstanten.",
        specs: [
            { label: "Core", value: "Three.js r128 WebGL Renderer" },
            { label: "Parsers", value: "STLLoader, OBJLoader, 3MFLoader" },
            { label: "Analysis", value: "BufferGeometry Volume Calculation" },
            { label: "Logic", value: "PHP Pricing Matrix (Density/Material)" },
            { label: "UX", value: "OrbitControls // Raycasting" },
            { label: "Latency", value: "< 15ms (Local Math)" }
        ],
        link: "https://viewer.ivo-tech.com"
    },
    "AUTOCOUPON BROWSER": {
        title: "AUTOCOUPON EXTENSION",
        status: "VERFÜGBAR AUF ANFRAGE",
        tech: "TYPESCRIPT // VITE // CHROME EXT",
        desc: "Premium Browser-Extension für automatische Coupon-Aktivierung bei großen Bonus-Partnern. One-Click-Interface im Synthwave-Design aktiviert Dutzende Coupons in Sekundenschnelle. 100% Privacy First - läuft komplett lokal ohne externe Server.",
        specs: [
            { label: "Version", value: "v2.0.0 (MIT License)" },
            { label: "Architektur", value: "TypeScript + Vite Build System" },
            { label: "Injection", value: "ShadowRoot Penetration" },
            { label: "Target", value: "Bonus System Elements" },
            { label: "Heuristics", value: "MutationObserver Surveillance" },
            { label: "Speed", value: "~300ms / Coupon Cycle" },
            { label: "Safety", value: "Human-Like Delay Randomization" },
            { label: "Privacy", value: "100% Local - No External Servers" },
            { label: "Browser", value: "Chrome // Edge // Firefox" }
        ],
        link: "#"
    },
    "AUTOCOUPON APP": {
        title: "AUTOCOUPON ANDROID",
        status: "IN DEVELOPMENT",
        tech: "ANDROID // KOTLIN // WEBVIEW",
        desc: "Native Android-Applikation für die mobile Coupon-Aktivierung. Portierung der bewährten AutoCoupon-Logik auf mobile Endgeräte. Nutzt Material Design 3 für eine moderne UI und verarbeitet Daten zu 100% lokal auf dem Gerät.",
        specs: [
            { label: "Core", value: "Kotlin Native + WebView" },
            { label: "Target", value: "Android SDK 34 (UpsideDownCake)" },
            { label: "Design", value: "Material Design 3 (Dark Mode)" },
            { label: "Speed", value: "Turbo-Mode Integration" },
            { label: "Security", value: "No External Analytics" }
        ],
        link: "#"
    },
    "IVO'S PIZZA": {
        title: "IVO'S PIZZA TEMPLATE",
        status: "LIVE DEMO",
        tech: "HTML5 // CSS3 // RESPONSIVE",
        desc: "Handgemachte Steinofen-Pizza. Authentisches italienisches Homepage-Template mit SOTA-Design. Features: Interaktive Speisekarte mit Filtern, Modal-Bestellsystem, Google Maps Integration und 'Mobile-First' Optimierung.",
        specs: [
            { label: "Frontend", value: "Semantic HTML5 + CSS Variables" },
            { label: "Design", value: "Modern Food Photography" },
            { label: "Features", value: "Sticky Nav, Smooth Scroll, Filter" },
            { label: "Interactive", value: "Order Modal & Maps Embed" },
            { label: "Responsive", value: "Mobile First Grid System" },
            { label: "Performance", value: "Optimized Assets (WebP)" }
        ],
        link: "pizza/index.html"
    }
};

// --- GLOBALER MODAL CONTROLLER ---
window.openProjectModal = function(titleKey) {
    console.log(`[SYSTEM] Accessing Node: ${titleKey}`);
    
    // Sicherheitsprüfung für Daten
    if (!window.projectData || !window.projectData[titleKey]) {
        console.error(`[SYSTEM] ERROR: Data node '${titleKey}' not found.`);
        return;
    }

    const data = window.projectData[titleKey];
    const modal = document.getElementById('project-modal');
    
    // Sicherheitsprüfung für Modal
    if (!modal) {
        console.error("[SYSTEM] CRITICAL: Modal DOM element #project-modal missing.");
        return;
    }

    try {
        // --- BEFÜLLEN ---
        const setTxt = (id, txt) => {
            const el = document.getElementById(id);
            if(el) el.innerText = txt;
        };
        
        setTxt('modal-title', data.title);
        setTxt('modal-status', data.status);
        setTxt('modal-tech', data.tech);
        setTxt('modal-desc', data.desc);
        
        
        const mLink = document.getElementById('modal-link');
        if(mLink) {
            if(titleKey === "AUTOCOUPON BROWSER") {
                // Browser Extension -> GitHub
                mLink.href = "#";
                mLink.textContent = "GITHUB OPEN";
                mLink.onclick = (e) => {
                    e.preventDefault();
                    const githubUrl = "https://github.com/trixr1907/AutoCoupon";
                    window.open(githubUrl, '_blank');
                };
            } else if (titleKey === "AUTOCOUPON APP") {
                // Android App -> Mail Contact
                mLink.href = "#";
                mLink.textContent = "ANFRAGE STELLEN";
                mLink.onclick = (e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText("contact@ivo-tech.com").then(() => {
                        const originalText = mLink.textContent;
                        mLink.textContent = "✓ MAIL KOPIERT";
                        setTimeout(() => { mLink.textContent = originalText; }, 2000);
                    });
                     alert(`Interesse an der AutoCoupon App?\n\nBitte schreiben Sie eine Mail an: contact@ivo-tech.com`);
                };
            } else {
                // Standard-Verhalten für andere Projekte
                mLink.href = data.link;
                mLink.textContent = "INITIALIZE SYSTEM";
                mLink.onclick = null;
            }
        }

        const mImg = document.getElementById('modal-img');
        const m3d = document.getElementById('modal-3d-container');
        const card = document.querySelector(`.project-card[data-title="${titleKey}"]`);
        
        // --- 3D VISUALISIERUNGS-LOGIK ---
        const mPayback = document.getElementById('modal-payback-container');
        const mPizza = document.getElementById('modal-pizza-container');
        
        if (titleKey === "3D STL VIEWER") {
            // 3D-Modus aktivieren
            if(mImg) mImg.style.display = 'none';
            if(mPayback) mPayback.style.display = 'none';
            if(mPizza) mPizza.style.display = 'none';
            if(m3d) {
                m3d.style.display = 'block';
                // Warten bis Modal sichtbar/layoutet ist vor Init
                requestAnimationFrame(() => {
                    if(window.Modal3DEngine) window.Modal3DEngine.init(m3d);
                });
            }
        } else if (titleKey === "AUTOCOUPON BROWSER") {
            // AutoCoupon Demo-Modus aktivieren
            if(mImg) mImg.style.display = 'none';
            if(m3d) {
                m3d.style.display = 'none';
                if(window.Modal3DEngine) window.Modal3DEngine.dispose();
            }
            if(mPizza) mPizza.style.display = 'none';
            if(mPayback) {
                mPayback.style.display = 'flex';
                // Warten bis Modal sichtbar/layoutet ist vor Init
                requestAnimationFrame(() => {
                    if(window.ModalPaybackEngine) window.ModalPaybackEngine.init(mPayback);
                });
            }
        } else if (titleKey === "IVO'S PIZZA") {
            // Pizza iFrame-Modus aktivieren
            if(mImg) mImg.style.display = 'none';
            if(m3d) {
                m3d.style.display = 'none';
                if(window.Modal3DEngine) window.Modal3DEngine.dispose();
            }
            if(mPayback) {
                mPayback.style.display = 'none';
                if(window.ModalPaybackEngine) window.ModalPaybackEngine.dispose();
            }
            if(mPizza) {
                mPizza.style.display = 'block';
                // Warten bis Modal sichtbar/layoutet ist vor Init
                requestAnimationFrame(() => {
                    if(window.ModalPizzaEngine) window.ModalPizzaEngine.init(mPizza);
                });
            }
        } else {
            // Standard Bild-Modus
            if(m3d) {
                m3d.style.display = 'none';
                if(window.Modal3DEngine) window.Modal3DEngine.dispose();
            }
            if(mPayback) {
                mPayback.style.display = 'none';
                if(window.ModalPaybackEngine) window.ModalPaybackEngine.dispose();
            }
            if(mPizza) {
                mPizza.style.display = 'none';
                if(window.ModalPizzaEngine) window.ModalPizzaEngine.dispose();
            }
            if(mImg) {
                mImg.style.display = 'block';
                if (card) mImg.src = card.getAttribute('data-img');
            }
        }

        // --- TECHNISCHE DATEN ---
        let container = document.getElementById('modal-specs');
        if (!container) {
            container = document.createElement('div');
            container.id = 'modal-specs';
            const techEl = document.getElementById('modal-tech');
            if(techEl && techEl.parentNode) techEl.parentNode.insertBefore(container, techEl.nextSibling);
        }

        if (container && data.specs) {
            container.innerHTML = '';
            data.specs.forEach(spec => {
                const div = document.createElement('div');
                div.className = 'spec-item';
                div.innerHTML = `<span class="spec-label">${spec.label}</span> <span class="spec-value">${spec.value}</span>`;
                container.appendChild(div);
            });
        }

        // --- ÖFFNUNGS-SEQUENZ (SOFORT) ---
        modal.style.display = 'flex';
        modal.classList.add('open');
        modal.style.opacity = '1';
        
        console.log(`[SYSTEM] Node ${titleKey} Accessed. Instant Open.`);
    } catch(err) {
        console.error("[SYSTEM] Modal Population Error:", err);
    }
};


document.addEventListener('DOMContentLoaded', () => {
    console.log("--> app.js: DOM Content Loaded");
    
    try {
        if(window.gsap && window.ScrollTrigger && window.TextPlugin) {
            gsap.registerPlugin(ScrollTrigger, TextPlugin);
        } else {
            console.warn("GSAP modules missing or incomplete.");
        }
    } catch(e) { console.error("GSAP Init Error:", e); }

    // --- SYSTEM VARIABLEN ---
    const terminalOutput = document.getElementById('terminal-output');
    const inputField = document.getElementById('command-input');
    const promptLabelEl = document.querySelector('.terminal-input-line .prompt-user');
    const promptLabel = (promptLabelEl && promptLabelEl.textContent) ? promptLabelEl.textContent : 'guest@ivo-tech:~$';
    const prefersReducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);


    // --- SCROLL ANIMATIONEN ---
    function initScrollAnimations() {
        if (!window.gsap) return;
        // Check reduced motion
        if (prefersReducedMotion) return;

        console.log("Initializing Scroll Animations...");

        // Hero Text
        gsap.from(".hero-title .banner-line", {
            y: 50, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power3.out", delay: 0.5
        });

        // Sektionen
        gsap.utils.toArray("section").forEach(section => {
            gsap.from(section.children, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
            });
        });
    }

    // --- TERMINAL LOGIK ---
    if(inputField) {
        inputField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const cmd = this.value;
                this.value = '';
                addToTerminal(cmd, 'prompt');
                processCommand(cmd);
            }
        });

        function processCommand(cmd) {
            const lowerCmd = cmd.toLowerCase().trim();
            switch(lowerCmd) {
                case 'help':
                    addToTerminal("AVAILABLE COMMANDS:", 'system');
                    addToTerminal("- projects: List archives", 'info');
                    addToTerminal("- open [name]: Force Access Node", 'warning');
                    addToTerminal("- contact: Establish uplink", 'info');
                    addToTerminal("- clear: Purge buffer", 'info');
                    break;
                case 'projects':
                    addToTerminal("Loading Archives...", 'system');
                    setTimeout(() => {
                        const pSec = document.getElementById('projects');
                        if(pSec) pSec.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                    break;
                case 'open':
                case 'open viewer':
                    addToTerminal("Forcing override: Accessing Primary Node...", 'warning');
                    window.openProjectModal("3D STL VIEWER");
                    break;
                case 'open autocoupon':
                    window.openProjectModal("AUTOCOUPON BROWSER");
                    break;
                case 'open pizza':
                     window.openProjectModal("IVO'S PIZZA");
                     break;
                case 'contact':
                    addToTerminal("Opening Comms...", 'system');
                    window.location.href = "mailto:contact@ivo-tech.com";
                    break;
                case 'clear':
                    if(terminalOutput) terminalOutput.innerHTML = '';
                    break;
                default:
                    addToTerminal(`Command '${cmd}' not recognized.`, 'error');
            }
        }

        function addToTerminal(text, type = 'normal') {
            if (!terminalOutput) return;
            const line = document.createElement('div');
            line.className = `term-line ${type}`;

            if (type === 'prompt') {
                const prompt = document.createElement('span');
                prompt.className = 'prompt-user';
                prompt.textContent = promptLabel;
                line.appendChild(prompt);
                line.appendChild(document.createTextNode(' ' + text));
            } else {
                line.textContent = text;
            }
            terminalOutput.appendChild(line);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }

    // --- INITIALISIERUNG ---
    try {
        initScrollAnimations();
        
        // --- MODAL EVENT BINDING (SICHER) ---
        const modal = document.getElementById('project-modal');
        const closeBtn = document.getElementById('modal-close');
        const projectCards = document.querySelectorAll('.project-card');

        console.log(`[SYSTEM] Init: Found ${projectCards.length} cards, Modal: ${!!modal}, CloseBtn: ${!!closeBtn}`);

        // 1. ÖFFNUNGS-LOGIK
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const titleKey = card.getAttribute('data-title');
                window.openProjectModal(titleKey);
            });
        });

        // 2. SCHLIESS-LOGIK
        if (modal) {
            const closeModal = () => {
                 console.log("[CLICK] Close Event Triggered");
                 modal.classList.remove('open');
                 // Sofortiges Ausblenden um Blockieren zu verhindern
                 modal.style.display = 'none';
                 // Deckkraft für nächstes Öffnen zurücksetzen
                 modal.style.opacity = '0';
                 // 3D BEREINIGEN
                 if(window.Modal3DEngine) window.Modal3DEngine.dispose();
                 // PAYBACK BEREINIGEN
                 if(window.ModalPaybackEngine) window.ModalPaybackEngine.dispose();
                 // PIZZA BEREINIGEN
                 if(window.ModalPizzaEngine) window.ModalPizzaEngine.dispose();
            };    
            
            if(closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    console.log("[CLICK] Close Button Hit");
                    e.preventDefault(); 
                    e.stopPropagation();
                    closeModal();
                });
                // Cursor-Pointer erzwingen
                closeBtn.style.cursor = 'pointer';
            } else {
                console.error("[SYSTEM] CRITICAL: Close button not found!");
            }

            // Schließen bei Klick auf Hintergrund
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                     console.log("[CLICK] Background Hit");
                     closeModal();
                }
            });
        }

    } catch(e) { console.error("Init Error:", e); }
});

// --- GLOBALER EXPORT FÜR AUFRUF DURCH INTRO ---
window.startApp = () => {
    const main = document.getElementById('main-content');
    if(main) main.classList.remove('hidden');
    
    // Event an interne Logik senden
    const event = new Event('app-start');
    window.dispatchEvent(event);
};
