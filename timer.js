// timer.js
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
    const modeIndicator = document.querySelector('.mode-indicator');
    const timerModesContainer = document.querySelector('.timer-modes');

    // --- App State ---
    let intervalId = null;
    let isPaused = true;
    let currentMode = 'pomodoro';
    let totalSeconds = 0;
    window.totalFocusedSeconds = 0; // Make global for access from common.js
    let lastResetDate = '';

    // Drag state
    let isDragging = false;
    let dragStartX = 0;
    let initialIndicatorX = 0;
    let indicatorTranslateX = 0;

    const DURATIONS = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
    };

    // --- Core Functions ---

    function createDigitReels() {
        if (!M_TENS) return;
        digitContainers.forEach(container => {
            const reel = document.createElement('div');
            reel.className = 'digit-reel';
            const limit = container.id.includes('seconds-tens') || container.id.includes('minutes-tens') ? 6 : 10;
            for (let i = 0; i < limit; i++) {
                const digit = document.createElement('span');
                digit.textContent = i;
                reel.appendChild(digit);
            }
            container.appendChild(reel);
        });
    }

    function updateDisplay(secondsValue) {
        if (!M_TENS) return;
        const minutes = Math.floor(secondsValue / 60);
        const seconds = secondsValue % 60;

        const digits = [
            Math.floor(minutes / 10),
            minutes % 10,
            Math.floor(seconds / 10),
            seconds % 10
        ];
        const digitHeight = digitContainers[0].clientHeight;

        digitContainers.forEach((container, index) => {
            container.firstElementChild.style.transform = `translateY(-${digits[index] * digitHeight}px)`;
        });
    }

    function startTimer() {
        if (!startButton || !resetButton) return;
        if (!isPaused) return;
        isPaused = false;
        startButton.classList.add('paused');
        startButton.title = window.TRANSLATIONS[window.htmlElement.lang]['pause'];

        let remainingTime = totalSeconds;
        let startTime = Date.now();

        intervalId = setInterval(() => {
            const elapsedTime = Math.round((Date.now() - startTime) / 1000);
            totalSeconds = remainingTime - elapsedTime;

            if (currentMode === 'pomodoro') {
                window.totalFocusedSeconds++;
                localStorage.setItem('totalFocusedSeconds', window.totalFocusedSeconds);
                window.updateTotalFocusDisplay();
            }

            if (totalSeconds < 0) {
                pauseTimer();
                alert(window.TRANSLATIONS[window.htmlElement.lang]['timeUp']);
                switchMode(currentMode === 'pomodoro' ? 'shortBreak' : 'pomodoro');
                return;
            }

            updateDisplay(totalSeconds);
        }, 1000);
    }

    function pauseTimer() {
        if (isPaused) return;
        isPaused = true;
        clearInterval(intervalId);
        intervalId = null;
        startButton.classList.remove('paused');
        startButton.title = window.TRANSLATIONS[window.htmlElement.lang]['start'];
    }

    function resetTimer() {
        if (!startButton || !resetButton) return;
        pauseTimer();
        totalSeconds = DURATIONS[currentMode];
        updateDisplay(totalSeconds);
    }

    function updateModeIndicatorPosition(animate = true) {
        if (!modeIndicator || modeButtons.length === 0 || !timerModesContainer) return;

        const activeButton = document.querySelector(`.mode-btn[data-mode="${currentMode}"]`);
        if (activeButton) {
            const modeContainerRect = timerModesContainer.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();
            const indicatorLeftOffset = parseFloat(getComputedStyle(modeIndicator).left);

            indicatorTranslateX = (buttonRect.left - modeContainerRect.left) - indicatorLeftOffset;
            const indicatorWidth = activeButton.offsetWidth;

            if (!animate) {
                modeIndicator.style.transition = 'none';
            } else {
                modeIndicator.style.transition = '';
            }
            modeIndicator.style.transform = `translateX(${indicatorTranslateX}px)`;
            modeIndicator.style.width = `${indicatorWidth}px`;

            modeButtons.forEach(btn => {
                btn.classList.toggle('active', btn === activeButton);
            });
        }
    }

    function switchMode(mode, fromDrag = false) {
        if (!modeButtons.length) return;
        currentMode = mode;
        localStorage.setItem('currentMode', currentMode);
        
        if (!fromDrag || (fromDrag && mode !== currentMode)) {
             resetTimer();
        }
        updateModeIndicatorPosition();
    }

    window.updateTotalFocusDisplay = function() { // Make global
        if (!totalFocusDisplay) return;
        const lang = window.htmlElement.lang;
        const minutes = Math.floor(window.totalFocusedSeconds / 60);
        const seconds = window.totalFocusedSeconds % 60;

        const formatTimeComponent = (value) => String(value).padStart(2, '0');

        const displayString = `${formatTimeComponent(minutes)}${window.TRANSLATIONS[lang]['minutes']} ${formatTimeComponent(seconds)}${window.TRANSLATIONS[lang]['seconds']}`;
        totalFocusDisplay.textContent = displayString;
        console.log(`updateTotalFocusDisplay called: totalFocusedSeconds=${window.totalFocusedSeconds}, displayString=${displayString}`);
    }

    // --- Drag functionality ---
    function handlePointerDown(e) {
        if (!modeIndicator || e.target !== modeIndicator) return;

        isDragging = true;
        modeIndicator.classList.add('dragging');
        dragStartX = e.clientX;
        const transformMatch = window.getComputedStyle(modeIndicator).transform.match(/translateX\(([^)]+)px\)/);
        initialIndicatorX = transformMatch ? parseFloat(transformMatch[1]) : 0;
        indicatorTranslateX = initialIndicatorX;

        modeIndicator.style.transition = 'none';
        
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    }

    function handlePointerMove(e) {
        if (!isDragging) return;

        e.preventDefault();
        const dragDelta = e.clientX - dragStartX;
        let newTranslateX = initialIndicatorX + dragDelta;

        const modeContainerRect = timerModesContainer.getBoundingClientRect();
        const indicatorWidth = modeIndicator.offsetWidth;

        const minX = 0;
        const maxX = modeContainerRect.width - indicatorWidth;

        indicatorTranslateX = Math.max(minX, Math.min(newTranslateX, maxX));
        modeIndicator.style.transform = `translateX(${indicatorTranslateX}px)`;
    }

    function handlePointerUp(e) {
        if (!isDragging) return;

        isDragging = false;
        modeIndicator.classList.remove('dragging');
        modeIndicator.style.transition = '';

        let closestMode = currentMode;
        let minDistance = Infinity;

        modeButtons.forEach(button => {
            const buttonRect = button.getBoundingClientRect();
            const buttonCenterX = buttonRect.left + (buttonRect.width / 2);
            const indicatorCenterX = modeIndicator.getBoundingClientRect().left + (modeIndicator.offsetWidth / 2);
            
            const distance = Math.abs(buttonCenterX - indicatorCenterX);

            if (distance < minDistance) {
                minDistance = distance;
                closestMode = button.dataset.mode;
            }
        });

        if (closestMode !== currentMode) {
            switchMode(closestMode, true);
        } else {
            updateModeIndicatorPosition();
        }

        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
    }

    function setupTimerEventListeners() {
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (isPaused) startTimer();
                else pauseTimer();
            });
        }

        if (resetButton) {
            resetButton.addEventListener('click', resetTimer);
        }

        if (modeButtons.length) {
            modeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const mode = e.target.dataset.mode;
                    if (mode && mode !== currentMode) {
                        switchMode(mode);
                    }
                });
            });
        }

        window.addEventListener('resize', () => {
            if (document.getElementById('minutes-tens')) {
                updateModeIndicatorPosition();
            }
        });

        if (modeIndicator) {
            modeIndicator.addEventListener('pointerdown', handlePointerDown);
        }
    }

    // --- Timer Initialization ---
    function initTimer() {
        currentMode = localStorage.getItem('currentMode') || 'pomodoro';
        window.totalFocusedSeconds = parseInt(localStorage.getItem('totalFocusedSeconds')) || 0;
        lastResetDate = localStorage.getItem('lastResetDate') || '';
        
        const today = new Date().toISOString().slice(0, 10);
        if (lastResetDate !== today) {
            window.totalFocusedSeconds = 0;
            localStorage.setItem('totalFocusedSeconds', '0');
            lastResetDate = today;
            localStorage.setItem('lastResetDate', today);
        }

        createDigitReels();
        setupTimerEventListeners();

        updateModeIndicatorPosition(false);
        switchMode(currentMode);
        window.updateTotalFocusDisplay(); // Initial call
    }

    // Only initialize timer-specific elements and functions if on the main page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        initTimer();
    }
});
