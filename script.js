






document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    console.log('🎂 Birthday script initialising…');

    
    
    

    
    const LOADING_DURATION_MS = 4000;

    
    const LOADING_FADE_MS = 800;

    
    const TYPEWRITER_SPEED_MS = 50;

    
    const TYPEWRITER_MESSAGE =
        'Thank you for being such an amazing friend. I\u2019m grateful for all the ' +
        'memories we\u2019ve shared, and I hope this year brings you happiness and success.';

    
    const BLOW_THRESHOLD = 80;

    
    const BLOW_SUSTAIN_MS = 150;

    
    const BALLOON_MIN_INTERVAL = 2000;
    const BALLOON_MAX_INTERVAL = 3000;

    
    const EASTER_EGG_POPS = 5;

    
    const EASTER_EGG_COUNTDOWN_S = 10;

    
    const BALLOON_COLORS = [
        '#7c3aed', '#8b5cf6', '#a78bfa', '#6d28d9',
        '#c084fc', '#9333ea', '#ddd6fe', '#ede9fe',
    ];
    const CONFETTI_COLORS = [
        '#7c3aed', '#a78bfa', '#c084fc', '#facc15',
        '#fbbf24', '#f9a8d4', '#ffffff',
    ];
    const FIREWORK_COLORS = [
        '#7c3aed', '#a78bfa', '#c084fc', '#facc15',
        '#fbbf24', '#f9a8d4', '#ffffff', '#e9d5ff',
    ];

    
    
    

    const $loading        = document.getElementById('loading-screen');
    const $loadingBar     = document.querySelector('.loading-progress');
    const $loadingParts   = document.querySelector('.loading-particles');

    const $welcomePage    = document.getElementById('welcome-page');
    const $starsCanvas    = document.querySelector('.stars-canvas');
    const $openSurprise   = document.getElementById('open-surprise');

    const $personalMsg    = document.getElementById('personal-message');
    const $typewriterText = document.getElementById('typewriter-text');
    const $typewriterCur  = document.querySelector('.typewriter-cursor');

    const $cakeSection    = document.getElementById('birthday-cake');
    const $startMic       = document.getElementById('start-mic');
    const $micStatus      = document.getElementById('mic-status');
    const $volumeBar      = document.querySelector('.volume-bar');
    const $candles        = document.querySelectorAll('.candle');
    const $cakeScene      = document.querySelector('.cake-scene');

    const $balloonsBox    = document.getElementById('balloons-container');
    const $easterModal    = document.getElementById('easter-egg-modal');
    const $timerProgress  = document.querySelector('.timer-progress');
    const $timerText      = document.querySelector('.timer-text');

    const $musicToggle    = document.getElementById('music-toggle');
    const $bgMusic        = document.getElementById('bg-music');
    const $celebMusic     = document.getElementById('celebration-music');

    const $fireworksSect  = document.getElementById('fireworks-ending');
    const $fireworksCanvas = document.getElementById('fireworks-canvas');
    const $fwTitle        = document.querySelector('.fw-title');
    const $fwSubtitle     = document.querySelector('.fw-subtitle');

    const $scrollIndicator = document.getElementById('scroll-indicator');
    const $replayBtn      = document.getElementById('replay-btn');

    
    const $galleryModal   = document.getElementById('gallery-modal');
    const $galleryClose   = document.getElementById('gallery-close');
    const $galleryImg     = document.getElementById('gallery-modal-img');
    const $galleryCaption = document.getElementById('gallery-modal-caption');
    const $galleryItems   = document.querySelectorAll('.gallery-item');

    
    
    

    let musicPlaying        = false;   
    let surpriseOpened      = false;   
    let typewriterStarted   = false;   
    let typewriterDone      = false;   
    let candlesBlownOut     = false;   
    let micActive           = false;   
    let balloonPopCount     = 0;       
    let balloonInterval     = null;    
    let fireworksRunning    = false;   
    let fireworksAnimId     = null;    

    
    let audioCtx   = null;
    let analyser   = null;
    let micStream  = null;
    let micRafId   = null;
    let blowStart  = 0;               

    
    
    

    
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    
    function randInt(min, max) {
        return Math.floor(rand(min, max + 1));
    }

    
    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    
    
    

    
    function initLoadingScreen() {
        console.log('⏳ Loading screen starting…');

        
        if ($loadingBar) {
            $loadingBar.style.width = '0%';
            
            void $loadingBar.offsetWidth;
            $loadingBar.style.transition = `width ${LOADING_DURATION_MS}ms ease-in-out`;
            $loadingBar.style.width = '100%';
        }

        
        spawnLoadingParticles();

        
        setTimeout(() => {
            if ($loading) {
                $loading.classList.add('fade-out');
            }
            
            setTimeout(() => {
                if ($loading) {
                    $loading.style.display = 'none';
                }
                showWelcomePage();
            }, LOADING_FADE_MS);
        }, LOADING_DURATION_MS);
    }

    
    function spawnLoadingParticles() {
        if (!$loadingParts) return;

        const PARTICLE_COUNT = 30;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const el = document.createElement('span');
            el.classList.add('particle');
            const size = rand(4, 10);
            el.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, ${rand(0.2, 0.6).toFixed(2)});
                left: ${rand(0, 100).toFixed(1)}%;
                top: ${rand(0, 100).toFixed(1)}%;
                animation: floatParticle ${rand(3, 7).toFixed(1)}s ease-in-out ${rand(0, 3).toFixed(1)}s infinite alternate;
                pointer-events: none;
            `;
            $loadingParts.appendChild(el);
        }

        
        if (!document.getElementById('particle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'particle-keyframes';
            style.textContent = `
                @keyframes floatParticle {
                    0%   { transform: translate(0, 0) scale(1);   opacity: 0.4; }
                    50%  { transform: translate(${randInt(-30, 30)}px, ${randInt(-40, 40)}px) scale(1.3); opacity: 0.8; }
                    100% { transform: translate(${randInt(-20, 20)}px, ${randInt(-30, 30)}px) scale(0.8); opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    
    
    

    
    function generateStars() {
        if (!$starsCanvas) return;
        const STAR_COUNT = 80;

        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const size = rand(1.5, 4);
            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: #fff;
                left: ${rand(0, 100).toFixed(2)}%;
                top: ${rand(0, 100).toFixed(2)}%;
                opacity: ${rand(0.3, 1).toFixed(2)};
                animation: twinkleStar ${rand(2, 5).toFixed(1)}s ease-in-out ${rand(0, 4).toFixed(1)}s infinite alternate;
                pointer-events: none;
            `;
            $starsCanvas.appendChild(star);
        }

        
        if (!document.getElementById('twinkle-keyframes')) {
            const style = document.createElement('style');
            style.id = 'twinkle-keyframes';
            style.textContent = `
                @keyframes twinkleStar {
                    0%   { opacity: 0.2; transform: scale(0.8); }
                    100% { opacity: 1;   transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }

        console.log(`✨ Generated ${STAR_COUNT} stars`);
    }

    
    
    

    
    function showWelcomePage() {
        console.log('🏠 Welcome page shown');
        generateStars();
        startBalloonSpawner();
        attemptAutoplay();
    }

    
    function attemptAutoplay() {
        if (!$bgMusic) return;
        const p = $bgMusic.play();
        if (p && typeof p.catch === 'function') {
            p.then(() => {
                musicPlaying = true;
                $musicToggle && $musicToggle.classList.add('active');
                console.log('🎵 Autoplay succeeded');
            }).catch(() => {
                console.log('🎵 Autoplay blocked — user can start music manually');
            });
        }
    }

    
    function handleOpenSurprise() {
        if (surpriseOpened) return; 
        surpriseOpened = true;
        console.log('🎁 Surprise opened!');

        
        startMusic();

        
        document.querySelectorAll('.hidden-section').forEach(sec => {
            sec.classList.remove('hidden-section');
        });

        
        initIntersectionObserver();

        
        if ($scrollIndicator) {
            $scrollIndicator.classList.remove('hidden');
        }

        
        if ($personalMsg) {
            $personalMsg.scrollIntoView({ behavior: 'smooth' });
        }

        
        fireSmallConfetti();
    }

    if ($openSurprise) {
        $openSurprise.addEventListener('click', handleOpenSurprise);
    }

    
    
    

    let sectionObserver = null;

    
    function initIntersectionObserver() {
        if (sectionObserver) return; 

        const sections = document.querySelectorAll('section.section');

        sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sec = entry.target;
                        sec.classList.add('visible');

                        
                        const fadeEls = sec.querySelectorAll('.fade-in-element');
                        fadeEls.forEach((el, idx) => {
                            setTimeout(() => {
                                el.classList.add('visible');
                            }, idx * 200); 
                        });

                        
                        onSectionVisible(sec);

                        
                        sectionObserver.unobserve(sec);
                    }
                });
            },
            { threshold: 0.15 }
        );

        sections.forEach(sec => sectionObserver.observe(sec));
        console.log('👁️ IntersectionObserver ready');
    }

    
    function onSectionVisible(section) {
        const id = section.id;

        if (id === 'personal-message') {
            startTypewriter();
        } else if (id === 'fireworks-ending') {
            startFireworks();
        }
    }

    
    
    

    
    function startTypewriter() {
        if (typewriterStarted) return;
        typewriterStarted = true;
        console.log('⌨️ Typewriter started');

        if (!$typewriterText) return;
        $typewriterText.textContent = '';

        let charIndex = 0;

        const interval = setInterval(() => {
            if (charIndex < TYPEWRITER_MESSAGE.length) {
                $typewriterText.textContent += TYPEWRITER_MESSAGE[charIndex];
                charIndex++;
            } else {
                clearInterval(interval);
                typewriterDone = true;
                console.log('⌨️ Typewriter finished');

                
                setTimeout(() => {
                    if ($typewriterCur) {
                        $typewriterCur.style.opacity = '0';
                        $typewriterCur.style.transition = 'opacity 0.5s ease';
                    }
                }, 1200);
            }
        }, TYPEWRITER_SPEED_MS);
    }

    
    
    

    
    if ($startMic) {
        $startMic.addEventListener('click', handleMicStart);
    }

    
    async function handleMicStart() {
        
        if (candlesBlownOut) {
            if ($micStatus) $micStatus.textContent = 'You already blew out the candles! 🎉';
            return;
        }
        if (micActive) {
            if ($micStatus) $micStatus.textContent = 'Already listening… blow now! 🎤';
            return;
        }

        try {
            console.log('🎤 Requesting microphone…');
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;

            const source = audioCtx.createMediaStreamSource(micStream);
            source.connect(analyser);

            micActive = true;
            blowStart = 0;

            if ($micStatus) $micStatus.textContent = 'Listening… Blow into the microphone! 💨';
            if ($startMic) $startMic.classList.add('active');

            
            monitorVolume();
            console.log('🎤 Mic active — monitoring volume');
        } catch (err) {
            console.warn('🎤 Microphone error:', err);
            if ($micStatus) {
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    $micStatus.textContent = 'Mic permission denied. Please allow access and try again.';
                } else if (err.name === 'NotFoundError') {
                    $micStatus.textContent = 'No microphone found. Please connect one and try again.';
                } else {
                    $micStatus.textContent = 'Could not access microphone. Please try again.';
                }
            }
        }
    }

    
    function monitorVolume() {
        if (!analyser || candlesBlownOut) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function tick() {
            if (!micActive || candlesBlownOut) return;

            analyser.getByteFrequencyData(dataArray);

            
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
            const avgVolume = sum / bufferLength;

            
            const pct = Math.min((avgVolume / 255) * 100, 100);
            if ($volumeBar) $volumeBar.style.width = pct + '%';

            
            if (avgVolume > BLOW_THRESHOLD) {
                if (blowStart === 0) blowStart = performance.now();
                const elapsed = performance.now() - blowStart;
                if (elapsed >= BLOW_SUSTAIN_MS) {
                    blowOutCandles();
                    return; 
                }
            } else {
                
                blowStart = 0;
            }

            micRafId = requestAnimationFrame(tick);
        }

        micRafId = requestAnimationFrame(tick);
    }

    

    
    async function blowOutCandles() {
        if (candlesBlownOut) return;
        candlesBlownOut = true;
        micActive = false;
        console.log('🕯️ Candles blown out!');

        
        if (micRafId) cancelAnimationFrame(micRafId);

        
        document.body.classList.add('candles-out');

        
        $candles.forEach((candle, i) => {
            setTimeout(() => {
                candle.classList.add('blown');
            }, i * 100);
        });

        
        await sleep(500);
        if ($cakeScene) $cakeScene.classList.add('dark-scene');

        
        await sleep(500);
        fireCelebrationConfetti();

        
        if ($celebMusic) {
            $celebMusic.currentTime = 0;
            $celebMusic.play().catch(() => {});
        }

        
        if ($micStatus) {
            $micStatus.textContent = '🎉 Happy Birthday, Rhiann! Your wish will come true! 🎉';
        }

        
        if ($volumeBar) $volumeBar.style.width = '0%';
        if ($startMic) {
            $startMic.classList.remove('active');
        }

        
        stopMicStream();

        
        await sleep(3000);
        const nextSection = $cakeSection ? $cakeSection.nextElementSibling : null;
        if (nextSection && nextSection.classList.contains('section')) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    
    function stopMicStream() {
        if (micStream) {
            micStream.getTracks().forEach(t => t.stop());
            micStream = null;
        }
        if (audioCtx) {
            audioCtx.close().catch(() => {});
            audioCtx = null;
            analyser = null;
        }
        micActive = false;
    }

    
    
    

    
    function fireSmallConfetti() {
        if (typeof confetti !== 'function') return;
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: CONFETTI_COLORS,
        });
    }

    
    function fireCelebrationConfetti() {
        if (typeof confetti !== 'function') return;

        
        confetti({
            particleCount: 120,
            spread: 100,
            origin: { x: 0.5, y: 0.5 },
            colors: CONFETTI_COLORS,
        });

        
        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 60,
                spread: 60,
                origin: { x: 0, y: 0.6 },
                colors: CONFETTI_COLORS,
            });
        }, 300);

        
        setTimeout(() => {
            confetti({
                particleCount: 80,
                angle: 120,
                spread: 60,
                origin: { x: 1, y: 0.6 },
                colors: CONFETTI_COLORS,
            });
        }, 600);

        
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 160,
                origin: { x: 0.5, y: 0.3 },
                colors: CONFETTI_COLORS,
                gravity: 0.8,
            });
        }, 1000);
    }

    
    
    

    
    function startBalloonSpawner() {
        if (balloonInterval) return; 
        console.log('🎈 Balloon spawner started');

        function spawn() {
            createBalloon();
            
            const nextDelay = rand(BALLOON_MIN_INTERVAL, BALLOON_MAX_INTERVAL);
            balloonInterval = setTimeout(spawn, nextDelay);
        }
        spawn();
    }

    
    function stopBalloonSpawner() {
        if (balloonInterval) {
            clearTimeout(balloonInterval);
            balloonInterval = null;
        }
    }

    
    function createBalloon() {
        if (!$balloonsBox) return;

        const balloon = document.createElement('div');
        balloon.classList.add('balloon');

        const size = randInt(30, 60);
        const duration = rand(8, 15).toFixed(1);
        const color = pick(BALLOON_COLORS);
        const left = rand(2, 92).toFixed(1);

        balloon.style.cssText = `
            position: fixed;
            left: ${left}%;
            bottom: -${size + 20}px;
            width: ${size}px;
            height: ${size * 1.2}px;
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            background: radial-gradient(circle at 35% 30%, ${lightenColor(color, 40)}, ${color});
            cursor: pointer;
            z-index: 50;
            animation: floatBalloon ${duration}s linear forwards;
            filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));
            transition: transform 0.15s ease;
        `;

        
        const string = document.createElement('div');
        string.style.cssText = `
            position: absolute;
            bottom: -${size * 0.4}px;
            left: 50%;
            transform: translateX(-50%);
            width: 1px;
            height: ${size * 0.4}px;
            background: rgba(255,255,255,0.5);
        `;
        balloon.appendChild(string);

        
        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            popBalloon(balloon);
        });

        
        balloon.addEventListener('animationend', () => {
            balloon.remove();
        });

        $balloonsBox.appendChild(balloon);
    }

    
    function popBalloon(balloon) {
        if (balloon.classList.contains('popped')) return; 
        balloon.classList.add('popped');
        balloonPopCount++;
        console.log(`🎈 Balloon popped! (${balloonPopCount}/${EASTER_EGG_POPS})`);

        
        const rect = balloon.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 20,
                spread: 40,
                origin: { x, y },
                colors: CONFETTI_COLORS,
                startVelocity: 15,
                gravity: 1.2,
                scalar: 0.6,
            });
        }

        
        setTimeout(() => balloon.remove(), 400);

        
        if (balloonPopCount >= EASTER_EGG_POPS) {
            triggerEasterEgg();
        }
    }

    
    function lightenColor(hex, amount) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
        const num = parseInt(c, 16);
        let r = Math.min(255, (num >> 16) + amount);
        let g = Math.min(255, ((num >> 8) & 0xff) + amount);
        let b = Math.min(255, (num & 0xff) + amount);
        return `rgb(${r},${g},${b})`;
    }

    
    (function injectBalloonKeyframes() {
        if (document.getElementById('balloon-keyframes')) return;
        const style = document.createElement('style');
        style.id = 'balloon-keyframes';
        style.textContent = `
            @keyframes floatBalloon {
                0%   { transform: translateY(0) rotate(0deg); }
                25%  { transform: translateY(-25vh) rotate(5deg); }
                50%  { transform: translateY(-55vh) rotate(-3deg); }
                75%  { transform: translateY(-80vh) rotate(4deg); }
                100% { transform: translateY(-120vh) rotate(-2deg); }
            }
            .balloon.popped {
                animation: none !important;
                transform: scale(1.6);
                opacity: 0;
                transition: transform 0.25s ease-out, opacity 0.25s ease-out;
            }
        `;
        document.head.appendChild(style);
    })();

    
    
    

    let easterEggTimer = null;

    
    function triggerEasterEgg() {
        console.log('🥚 Easter egg triggered!');

        if (!$easterModal) return;
        $easterModal.classList.add('show');

        let remaining = EASTER_EGG_COUNTDOWN_S;
        if ($timerText) $timerText.textContent = remaining;

        
        const circumference = 2 * Math.PI * 45;
        if ($timerProgress) {
            $timerProgress.style.strokeDasharray = circumference;
            $timerProgress.style.strokeDashoffset = '0';
        }

        easterEggTimer = setInterval(() => {
            remaining--;
            if ($timerText) $timerText.textContent = remaining;

            
            if ($timerProgress) {
                const offset = circumference * ((EASTER_EGG_COUNTDOWN_S - remaining) / EASTER_EGG_COUNTDOWN_S);
                $timerProgress.style.strokeDashoffset = offset;
            }

            if (remaining <= 0) {
                clearInterval(easterEggTimer);
                easterEggTimer = null;
                $easterModal.classList.remove('show');
                balloonPopCount = 0; 
                console.log('🥚 Easter egg dismissed');
            }
        }, 1000);
    }

    
    
    

    
    function startMusic() {
        if (!$bgMusic || musicPlaying) return;
        $bgMusic.play().then(() => {
            musicPlaying = true;
            if ($musicToggle) $musicToggle.classList.add('active');
            console.log('🎵 Music playing');
        }).catch(err => {
            console.warn('🎵 Music play failed:', err);
        });
    }

    
    function toggleMusic() {
        if (!$bgMusic) return;
        if (musicPlaying) {
            $bgMusic.pause();
            musicPlaying = false;
            if ($musicToggle) $musicToggle.classList.remove('active');
            console.log('🎵 Music paused');
        } else {
            startMusic();
        }
    }

    if ($musicToggle) {
        $musicToggle.addEventListener('click', toggleMusic);
    }

    
    
    

    
    class Particle {
        constructor(x, y, color, velocity, size) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.vx = velocity.x;
            this.vy = velocity.y;
            this.size = size || rand(1.5, 3.5);
            this.alpha = 1;
            this.decay = rand(0.012, 0.03);
            this.gravity = 0.04;
        }

        update() {
            this.vx *= 0.98;           
            this.vy += this.gravity;    
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            if (this.alpha < 0) this.alpha = 0;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }

        get alive() {
            return this.alpha > 0.01;
        }
    }

    
    class Firework {
        constructor(canvasW, canvasH) {
            this.x = rand(canvasW * 0.15, canvasW * 0.85);
            this.y = canvasH;
            this.targetY = rand(canvasH * 0.1, canvasH * 0.45);
            this.speed = rand(3, 5);
            this.color = pick(FIREWORK_COLORS);
            this.exploded = false;
            this.particles = [];
            this.trailAlpha = 1;
        }

        update() {
            if (!this.exploded) {
                this.y -= this.speed;
                if (this.y <= this.targetY) {
                    this.explode();
                }
            }
            
            this.particles = this.particles.filter(p => {
                p.update();
                return p.alive;
            });
        }

        explode() {
            this.exploded = true;
            const count = randInt(50, 90);
            for (let i = 0; i < count; i++) {
                const angle = rand(0, Math.PI * 2);
                const speed = rand(1, 5);
                this.particles.push(new Particle(
                    this.x,
                    this.y,
                    pick(FIREWORK_COLORS),
                    { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
                    rand(1.5, 3)
                ));
            }
        }

        draw(ctx) {
            if (!this.exploded) {
                
                ctx.save();
                ctx.globalAlpha = this.trailAlpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }
            
            this.particles.forEach(p => p.draw(ctx));
        }

        get done() {
            return this.exploded && this.particles.length === 0;
        }
    }

    
    function startFireworks() {
        if (fireworksRunning) return;
        fireworksRunning = true;
        console.log('🎆 Fireworks starting!');

        if (!$fireworksCanvas) return;
        const ctx = $fireworksCanvas.getContext('2d');

        
        function resize() {
            if (!$fireworksSect) return;
            $fireworksCanvas.width = $fireworksSect.clientWidth;
            $fireworksCanvas.height = $fireworksSect.clientHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const fireworks = [];
        let lastLaunch = 0;
        let launchInterval = 600;       
        const startTime = performance.now();

        
        if ($fwTitle) {
            $fwTitle.style.transition = 'opacity 1s ease, transform 1s ease';
            $fwTitle.style.opacity = '1';
            $fwTitle.style.transform = 'scale(1)';
        }
        if ($fwSubtitle) {
            setTimeout(() => {
                $fwSubtitle.style.transition = 'opacity 1s ease, transform 1s ease';
                $fwSubtitle.style.opacity = '1';
                $fwSubtitle.style.transform = 'scale(1)';
            }, 600);
        }

        
        let confettiTimerId = setInterval(() => {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 40,
                    spread: 90,
                    origin: { x: rand(0.2, 0.8), y: rand(0.2, 0.5) },
                    colors: CONFETTI_COLORS,
                    gravity: 0.6,
                });
            }
        }, 3000);

        function loop(now) {
            ctx.clearRect(0, 0, $fireworksCanvas.width, $fireworksCanvas.height);

            const elapsed = now - startTime;

            
            if (elapsed > 10000) {
                launchInterval = 1500;
            }

            
            if (now - lastLaunch > launchInterval) {
                fireworks.push(new Firework($fireworksCanvas.width, $fireworksCanvas.height));
                lastLaunch = now;
            }

            
            for (let i = fireworks.length - 1; i >= 0; i--) {
                fireworks[i].update();
                fireworks[i].draw(ctx);
                if (fireworks[i].done) fireworks.splice(i, 1);
            }

            fireworksAnimId = requestAnimationFrame(loop);
        }

        fireworksAnimId = requestAnimationFrame(loop);

        
        window._fwConfettiTimer = confettiTimerId;
    }

    
    function stopFireworks() {
        fireworksRunning = false;
        if (fireworksAnimId) {
            cancelAnimationFrame(fireworksAnimId);
            fireworksAnimId = null;
        }
        if (window._fwConfettiTimer) {
            clearInterval(window._fwConfettiTimer);
            window._fwConfettiTimer = null;
        }
        
        if ($fireworksCanvas) {
            const ctx = $fireworksCanvas.getContext('2d');
            ctx.clearRect(0, 0, $fireworksCanvas.width, $fireworksCanvas.height);
        }
    }

    
    
    

    
    function initScrollIndicator() {
        window.addEventListener('scroll', () => {
            if (!$scrollIndicator) return;

            const scrollBottom = window.innerHeight + window.scrollY;
            const docHeight = document.documentElement.scrollHeight;

            if (scrollBottom >= docHeight - 200) {
                $scrollIndicator.classList.add('hidden');
            } else if (surpriseOpened) {
                $scrollIndicator.classList.remove('hidden');
            }
        }, { passive: true });
    }

    
    
    

    
    function handleReplay() {
        console.log('🔄 Replaying experience…');

        
        window.scrollTo({ top: 0, behavior: 'auto' });

        
        stopFireworks();

        
        stopBalloonSpawner();

        
        stopMicStream();

        
        surpriseOpened    = false;
        typewriterStarted = false;
        typewriterDone    = false;
        candlesBlownOut   = false;
        micActive         = false;
        balloonPopCount   = 0;
        blowStart         = 0;
        musicPlaying      = false;

        
        if ($bgMusic) { $bgMusic.pause(); $bgMusic.currentTime = 0; }
        if ($celebMusic) { $celebMusic.pause(); $celebMusic.currentTime = 0; }
        if ($musicToggle) $musicToggle.classList.remove('active');

        
        document.querySelectorAll('section.section').forEach(sec => {
            if (sec.id !== 'welcome-page') {
                sec.classList.add('hidden-section');
            }
            sec.classList.remove('visible');
        });

        
        document.querySelectorAll('.fade-in-element').forEach(el => {
            el.classList.remove('visible');
        });

        
        document.body.classList.remove('candles-out');
        $candles.forEach(c => c.classList.remove('blown'));
        if ($cakeScene) $cakeScene.classList.remove('dark-scene');
        if ($startMic) $startMic.classList.remove('active');
        if ($micStatus) $micStatus.textContent = '';
        if ($volumeBar) $volumeBar.style.width = '0%';

        
        if ($typewriterText) $typewriterText.textContent = '';
        if ($typewriterCur) {
            $typewriterCur.style.opacity = '1';
            $typewriterCur.style.transition = 'none';
        }

        
        if ($fwTitle) { $fwTitle.style.opacity = '0'; $fwTitle.style.transform = 'scale(0.5)'; }
        if ($fwSubtitle) { $fwSubtitle.style.opacity = '0'; $fwSubtitle.style.transform = 'scale(0.5)'; }

        
        if ($scrollIndicator) $scrollIndicator.classList.add('hidden');

        
        if (sectionObserver) {
            sectionObserver.disconnect();
            sectionObserver = null;
        }

        
        if ($balloonsBox) $balloonsBox.innerHTML = '';

        
        if (easterEggTimer) {
            clearInterval(easterEggTimer);
            easterEggTimer = null;
        }
        if ($easterModal) $easterModal.classList.remove('show');

        
        if ($loading) {
            $loading.style.display = '';
            $loading.classList.remove('fade-out');
        }
        if ($loadingBar) {
            $loadingBar.style.transition = 'none';
            $loadingBar.style.width = '0%';
        }

        
        requestAnimationFrame(() => {
            initLoadingScreen();
        });
    }

    if ($replayBtn) {
        $replayBtn.addEventListener('click', handleReplay);
    }

    
    
    

    
    function initGallery() {
        if (!$galleryItems || !$galleryModal) return;

        $galleryItems.forEach($item => {
            $item.addEventListener('click', () => {
                const img = $item.querySelector('img');
                const caption = $item.querySelector('.gallery-caption');
                if (img && $galleryImg) {
                    $galleryImg.src = img.src;
                }
                if (caption && $galleryCaption) {
                    $galleryCaption.textContent = caption.textContent;
                }
                $galleryModal.classList.add('show');
            });
        });

        if ($galleryClose) {
            $galleryClose.addEventListener('click', () => {
                $galleryModal.classList.remove('show');
            });
        }

        $galleryModal.addEventListener('click', (e) => {
            if (e.target === $galleryModal) {
                $galleryModal.classList.remove('show');
            }
        });
    }

    function initFireworksInteraction() {
        if (!$fireworksSect) return;

        function handlePop(e) {
            if (e.target.closest('#replay-btn')) return;

            let clientX, clientY;
            if (e.type === 'touchstart') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const x = clientX / window.innerWidth;
            const y = clientY / window.innerHeight;

            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 50,
                    spread: 70,
                    origin: { x, y },
                    colors: CONFETTI_COLORS,
                    startVelocity: 30,
                    gravity: 1,
                    scalar: 0.8,
                    zIndex: 1000
                });
            }
        }

        $fireworksSect.addEventListener('click', handlePop);
        $fireworksSect.addEventListener('touchstart', handlePop, { passive: true });
    }

    
    function init() {
        console.log('🚀 Initialising birthday experience');

        
        if ($fwTitle) { $fwTitle.style.opacity = '0'; $fwTitle.style.transform = 'scale(0.5)'; }
        if ($fwSubtitle) { $fwSubtitle.style.opacity = '0'; $fwSubtitle.style.transform = 'scale(0.5)'; }

        
        initScrollIndicator();

        
        initGallery();

        
        initFireworksInteraction();

        
        initLoadingScreen();
    }

    init();
});

