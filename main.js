document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const M_TENS = document.getElementById('minutes-tens');
    const M_ONES = document.getElementById('minutes-ones');
    const S_TENS = document.getElementById('seconds-tens');
    const S_ONES = document.getElementById('seconds-ones');
    const digitContainers = [M_TENS, M_ONES, S_TENS, S_ONES];

    const modeButtons = document.querySelectorAll('.mode-btn');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const totalFocusDisplay = document.getElementById('total-focus-display');
    const background = document.querySelector('.background');

    // --- State Variables ---
    let totalSeconds = 25 * 60;
    let intervalId = null;
    let isPaused = true;
    let currentMode = 'pomodoro';
    let totalFocusedMinutes = parseInt(localStorage.getItem('totalFocusedMinutes')) || 0;

    const DURATIONS = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
    };

    // --- Core Functions ---

    /**
     * Creates the number reels (0-9) inside the digit containers.
     * This is a one-time setup to avoid DOM manipulation during timer updates.
     */
    function createDigitReels() {
        digitContainers.forEach(container => {
            const reel = document.createElement('div');
            reel.className = 'digit-reel';
            // For minutes-tens, we only need 0-5. For seconds-tens, 0-5.
            const limit = container.id.includes('tens') ? 6 : 10;
            for (let i = 0; i < limit; i++) {
                const digit = document.createElement('span');
                digit.textContent = i;
                reel.appendChild(digit);
            }
            container.appendChild(reel);
        });
    }

    /**
     * Updates the display by transforming the digit reels.
     * This is highly performant as it only changes the CSS transform property.
     */
    function updateDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const mTens = Math.floor(minutes / 10);
        const mOnes = minutes % 10;
        const sTens = Math.floor(seconds / 10);
        const sOnes = seconds % 10;

        const digitHeight = M_TENS.clientHeight;

        M_TENS.firstElementChild.style.transform = `translateY(-${mTens * digitHeight}px)`;
        M_ONES.firstElementChild.style.transform = `translateY(-${mOnes * digitHeight}px)`;
        S_TENS.firstElementChild.style.transform = `translateY(-${sTens * digitHeight}px)`;
        S_ONES.firstElementChild.style.transform = `translateY(-${sOnes * digitHeight}px)`;
    }

    function startTimer() {
        if (isPaused === false) return;
        isPaused = false;
        startButton.classList.add('paused');
        startButton.title = '일시정지';

        // More robust timing with Date.now()
        let expected = Date.now() + 1000;
        intervalId = setTimeout(step, 1000);

        function step() {
            let drift = Date.now() - expected;
            if (drift > 1000) {
                // If the tab was inactive, account for the drift
                const missedSeconds = Math.round(drift / 1000);
                 if (currentMode === 'pomodoro') {
                    totalFocusedMinutes += Math.floor(missedSeconds / 60);
                }
                totalSeconds -= missedSeconds;
            } else {
                 if (currentMode === 'pomodoro') {
                    // Increment focus time every minute that passes
                    if ( (DURATIONS.pomodoro - totalSeconds) % 60 === 0 && (DURATIONS.pomodoro - totalSeconds) > 0) {
                         totalFocusedMinutes++;
                         localStorage.setItem('totalFocusedMinutes', totalFocusedMinutes);
                         updateTotalFocusDisplay();
                    }
                }
                totalSeconds--;
            }


            updateDisplay();

            if (totalSeconds < 0) {
                pauseTimer();
                // Handle timer completion
                alert('시간이 종료되었습니다!');
                switchMode(currentMode === 'pomodoro' ? 'shortBreak' : 'pomodoro');
            } else {
                expected += 1000;
                intervalId = setTimeout(step, Math.max(0, 1000 - drift));
            }
        }
    }

    function pauseTimer() {
        if (isPaused === true) return;
        isPaused = true;
        clearTimeout(intervalId);
        startButton.classList.remove('paused');
        startButton.title = '시작';
    }

    function resetTimer() {
        pauseTimer();
        totalSeconds = DURATIONS[currentMode];
        updateDisplay();
        updateBackground(true);
    }

    function switchMode(mode) {
        currentMode = mode;
        modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        resetTimer();
    }

    function updateTotalFocusDisplay() {
        totalFocusDisplay.textContent = `${totalFocusedMinutes}분`;
    }

    // --- Performance Optimizations ---

    /**
     * Updates background colors. Called only on mode change/reset.
     * The gradual change is handled by a CSS transition, saving resources.
     */
    function updateBackground(isReset = false) {
        const palette = {
            pomodoro: ['#ffafbd', '#a1c4fd'],
            shortBreak: ['#d4fc79', '#a18cd1']
        };
        const [color1, color2] = palette[currentMode];
        
        // If it's a reset, we apply the transition class to make it smooth
        if (isReset) {
            background.style.transition = 'background 2s ease';
        } else {
            background.style.transition = 'none'; // No transition on initial load
        }
        
        document.documentElement.style.setProperty('--bg-color-1', color1);
        document.documentElement.style.setProperty('--bg-color-2', color2);
    }

    /**
     * Subtle background interaction with mouse movement.
     * Uses requestAnimationFrame for efficiency.
     */
    function handleMouseInteraction() {
        let mouseX = 0;
        let targetX = 0;
        const windowHalfX = window.innerWidth / 2;

        function onMouseMove(e) {
            mouseX = (e.clientX - windowHalfX) / windowHalfX; // -1 to 1
        }
        
        function animate() {
            targetX += (mouseX - targetX) * 0.02; // Reduced multiplier for less sensitivity
            const bgX = 50 + (targetX * 10); // Max 10% movement
            background.style.backgroundPosition = `${bgX}% 50%`;
            requestAnimationFrame(animate);
        }
        
        document.addEventListener('mousemove', onMouseMove);
        animate();
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        startButton.addEventListener('click', () => {
            if (isPaused) startTimer();
            else pauseTimer();
        });

        resetButton.addEventListener('click', resetTimer);

        modeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (e.target.dataset.mode !== currentMode) {
                    switchMode(e.target.dataset.mode);
                }
            });
        });
    }

    // --- Initialization ---
    function init() {
        createDigitReels();
        updateDisplay();
        updateTotalFocusDisplay();
        updateBackground(false); // Initial background without transition
        setupEventListeners();
        handleMouseInteraction();
    }

    init();
});
