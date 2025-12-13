document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(TextPlugin);

    // --- AUDIO ENGINE (Web Audio API) ---
    const AudioEngine = {
        ctx: null,
        masterGain: null,
        
        init() {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 0.8; 
            
            // Globales Echo/Delay erstellen
            this.echoNode = this.ctx.createDelay();
            this.echoNode.delayTime.value = 0.4; // 400ms Verzögerung
            this.echoFeedback = this.ctx.createGain();
            this.echoFeedback.gain.value = 0.3; // 30% feedback
            
            this.echoNode.connect(this.echoFeedback);
            this.echoFeedback.connect(this.echoNode);
            this.echoNode.connect(this.masterGain);
        },

        startDrone() {
            if (!this.ctx) return;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc1.type = "sawtooth";
            osc1.frequency.value = 55; 
            osc2.type = "sine";
            osc2.frequency.value = 57; 

            filter.type = "lowpass";
            filter.frequency.value = 120;
            filter.Q.value = 1;

            gain.gain.setValueAtTime(0, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 3);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);

            osc1.start();
            osc2.start();

            this.drone = { osc1, osc2, gain };
        },

        triggerGlitchSound(intensity = 1) {
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            
            const count = 3 + Math.floor(Math.random() * 5 * intensity);
            for(let i=0; i<count; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = Math.random() > 0.5 ? "sawtooth" : "square";
                osc.frequency.setValueAtTime(200 + Math.random() * 2000, now + i*0.05);
                
                gain.gain.setValueAtTime(0, now + i*0.05);
                gain.gain.linearRampToValueAtTime(0.1 + (Math.random()*0.1), now + i*0.05 + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i*0.05 + 0.05);

                osc.connect(gain);
                gain.connect(this.masterGain);
                
                osc.start(now + i*0.05);
                osc.stop(now + i*0.05 + 0.1);
            }
        },

        triggerBassPulse() {
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.frequency.setValueAtTime(90, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
            
            gain.gain.setValueAtTime(0.8, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(now);
            osc.stop(now + 0.8);
        },

        triggerFinaleImpact() {
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(10, now + 3);
            
            gain.gain.setValueAtTime(1, now);
            gain.gain.linearRampToValueAtTime(0, now + 4);

            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(now);
            osc.stop(now + 4);
        },

        cleanup() {
            if(this.ctx) {
                try {
                    const ctx = this.ctx;
                    this.ctx = null; 
                    if(this.drone && this.drone.gain) {
                        try { this.drone.gain.disconnect(); } catch(e){}
                    }
                    ctx.close().then(() => console.log('Audio Context Closed'));
                } catch(e) { console.error(e); }
            }
        },

        playVoice(filename) {
            if (!this.ctx) return;
            // Audiodatei abrufen und abspielen
            fetch('assets/intro/audio/' + filename)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => this.ctx.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    const source = this.ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    
                    // Sprecher-Gain für Lautstärkeregelung
                    const voiceGain = this.ctx.createGain();
                    voiceGain.gain.value = 1.0; 

                    source.connect(voiceGain);
                    voiceGain.connect(this.masterGain);
                    
                    // Auch mit Echo verbinden für Kino-Raumklang
                    const echoSend = this.ctx.createGain();
                    echoSend.gain.value = 0.4;
                    source.connect(echoSend);
                    echoSend.connect(this.echoNode);

                    source.start();
                })
                .catch(e => console.error("Voice load error:", e));
        }
    };

    // --- SZENEN MANAGER (Frame Sequencer) ---
    const SceneManager = {
        activeScene: null,
        intervalId: null,
        
        startScene(sceneId) {
            // Vorherige verstecken
            if(this.activeScene) {
                gsap.to(this.activeScene, { opacity: 0, duration: 0.5 });
                this.stopFrameLoop();
            }

            const scene = document.getElementById(sceneId);
            if(!scene) return;
            
            this.activeScene = scene;
            gsap.set(scene, { visibility: 'visible', opacity: 1 }); // Anzeige erzwingen
            
            // Collect frames
            const frames = Array.from(scene.querySelectorAll('.cinematic-frame'));
            if(frames.length > 0) {
                this.startFrameLoop(frames);
            }
        },

        startFrameLoop(frames) {
            let currentFrame = 0;
            // Langsamere, sequentielle Animation (Kino-Diashow)
            this.intervalId = setInterval(() => {
                // Deactivate all
                frames.forEach(f => f.classList.remove('active'));
                
                // Sequential only
                currentFrame = (currentFrame + 1) % frames.length;
                
                frames[currentFrame].classList.add('active');

            }, 1000); // 1000ms = 1s pro Frame (Viel langsamer)
        },

        stopFrameLoop() {
            if(this.intervalId) clearInterval(this.intervalId);
        }
    };


    // --- SETUP ---
    const introContainer = document.getElementById('cinematic-intro');
    const subtitleEl = document.getElementById('cinematic-subtitle');
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const skipBtn = document.getElementById('skip-intro');

    // Initialer Zustand
    gsap.set(".intro-scene", { opacity: 0, visibility: 'hidden' });
    gsap.set("#scene-jigsaw", { opacity: 1, visibility: 'visible' }); 

    const tl = gsap.timeline({ paused: true, onComplete: endIntro });

    // Helfer: Untertitel mit Dekodier-Effekt nutzen
    function showSubtitle(text, duration, className = "") {
        // Zurücksetzen
        subtitleEl.innerHTML = "";
        subtitleEl.className = "cinematic-subtitle " + className;
        subtitleEl.style.opacity = 1;

        // HTML für Dekodier-Effekt entfernen, für Finale behalten
        const rawText = text.replace(/<[^>]*>/g, ' '); 
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
        
        let iterations = 0;
        const finalHTML = text; // Finales HTML mit <br> und <span> speichern
        
        // Vorheriges Tween beenden, falls vorhanden
        gsap.killTweensOf(subtitleEl);

        // Animate content
        const interval = setInterval(() => {
            subtitleEl.innerText = rawText.split("")
                .map((letter, index) => {
                    if(index < iterations) {
                        return rawText[index]; 
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");
            
            if(iterations >= rawText.length) { 
                clearInterval(interval);
                subtitleEl.innerHTML = finalHTML; // HTML-Formatierung wiederherstellen
            }
            
            iterations += 1/2; // Dekodier-Geschwindigkeit
        }, 30);

        // Ausblenden
        gsap.to(subtitleEl, { opacity: 0, duration: 1, delay: duration - 1 });
    }

    // === MASTER ZEITACHSE ===

    // -- PHASE 1: JIGSAW (0s) --
    tl.call(() => {
        SceneManager.startScene('scene-jigsaw');
        AudioEngine.playVoice("vo_1.mp3");
        AudioEngine.triggerBassPulse();
        // Subtitle leicht verzögert für bessere Sync
        setTimeout(() => {
            showSubtitle("In the neon shadows<br>of a broken system…", 4, "sub-variant-whisper");
        }, 200);
    }, null, 0);

    tl.call(() => {
        AudioEngine.playVoice("vo_2.mp3");
        AudioEngine.triggerBassPulse();
        setTimeout(() => {
            showSubtitle("I'm not a puppet.<br>I'm a signal.<br><span class='sub-highlight'>A whisper in the code.</span>", 4, "sub-variant-whisper");
        }, 200);
    }, null, 5);

    // -- PHASE 2: FRACTURE (10s) --
    tl.call(() => {
        SceneManager.startScene('scene-fracture');
        AudioEngine.triggerGlitchSound(2);
        AudioEngine.playVoice("vo_3.mp3");
        setTimeout(() => {
            showSubtitle("The system fractures.<br>The cracks grow wider.", 3.5, "sub-variant-glitch");
        }, 200);
    }, null, 10);

    tl.call(() => {
        AudioEngine.playVoice("vo_4.mp3");
        AudioEngine.triggerBassPulse();
        setTimeout(() => {
            showSubtitle("And through them…<br><span class='sub-highlight'>TRUTH EMERGES.</span>", 4, "sub-variant-whisper");
        }, 200);
    }, null, 15);

    // -- PHASE 3: HACKER (20s) --
    tl.call(() => {
        SceneManager.startScene('scene-hacker');
        AudioEngine.playVoice("vo_5.mp3");
        AudioEngine.triggerBassPulse();
        setTimeout(() => {
            showSubtitle("We are the ones who remember…<br>what most people forget.", 5, "sub-variant-whisper");
        }, 200);
    }, null, 20);

    // -- PHASE 4: CLIMAX (28s) --
    tl.call(() => {
        SceneManager.startScene('scene-climax');
        AudioEngine.playVoice("vo_6.wav");
        AudioEngine.triggerBassPulse();
        setTimeout(() => {
            showSubtitle("Most people are so ungrateful<br>to be alive.", 4, "sub-variant-impact");
        }, 200);
    }, null, 28);

    tl.call(() => {
        AudioEngine.playVoice("vo_7.wav");
        AudioEngine.triggerGlitchSound(3);
        setTimeout(() => {
            showSubtitle("NOT YOU.<br><span class='sub-highlight' style='font-size:1.5em'>NOT ANYMORE.</span>", 3.5, "sub-variant-impact");
        }, 200);
    }, null, 33);

    // -- END (38s) --
    tl.call(() => {
        showSubtitle("THIS IS IVO TECH.", 3, "sub-variant-impact");
        AudioEngine.playVoice("vo_8.wav");
        AudioEngine.triggerFinaleImpact();
    }, null, 38);

    // Exit
    tl.to(introContainer, { opacity: 0, duration: 1, ease: "power2.in" }, "+=4");


    // --- HANDLERS ---
    if(startBtn) {
        startBtn.addEventListener('click', () => {
            AudioEngine.init();
            AudioEngine.startDrone();
            
            gsap.to(startScreen, { opacity: 0, duration: 0.5, onComplete: () => {
                startScreen.style.display = 'none';
                tl.play();
            }});
        });
    }

    if(skipBtn) {
        skipBtn.addEventListener('click', () => {
            SceneManager.stopFrameLoop();
            tl.kill();
            AudioEngine.cleanup();
            endIntro();
        });
    }

    function endIntro() {
        introContainer.style.display = 'none';
        SceneManager.stopFrameLoop();
        AudioEngine.cleanup();
        
        if (window.startVisuals) window.startVisuals();
        if (window.startApp) window.startApp();

        gsap.to(".logo-img", { opacity: 1, duration: 1, delay: 0.5 });
        gsap.to(".logo-text", { opacity: 1, duration: 1, delay: 0.7 });
    }
});
