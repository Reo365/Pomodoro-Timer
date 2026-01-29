document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const htmlElement = document.getElementById('app-html');
    const langToggleButton = document.getElementById('lang-toggle-btn');
    const languageSelector = document.getElementById('language-selector');
    const langOptionButtons = document.querySelectorAll('.lang-option-btn');
    const headerModeSelector = document.querySelector('.header-mode-selector');
    const headerModeButtons = document.querySelectorAll('.header-mode-btn');
    const headerModeIndicator = document.querySelector('.header-mode-indicator');

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
    const timerModesContainer = document.querySelector('.timer-modes'); // Parent for mode buttons and indicator

    // --- App State ---
    let intervalId = null;
    let isPaused = true;
    let currentMode = 'pomodoro';
    let totalSeconds = 0;
    let totalFocusedSeconds = 0;
    let lastResetDate = '';

    // Drag state
    let isDragging = false;
    let dragStartX = 0;
    let initialIndicatorX = 0;
    let indicatorTranslateX = 0; // Current translateX value

    const DURATIONS = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
    };

    const TRANSLATIONS = {
        'ko': {
            'home': '홈',
            'pomodoro': '집중',
            'shortBreak': '휴식',
            'start': '시작',
            'pause': '일시정지',
            'reset': '초기화',
            'timeUp': '시간이 종료되었습니다!',
            'totalFocusTimePrefix': '오늘 총 집중 시간: ',
            'minutes': '분',
            'seconds': '초',
            'about': '소개',
            'privacy': '개인정보 처리방침',
            'terms': '이용 약관',
            'contact': '문의하기',
            'copyright': '© 2026 뽀모도로 타이머. 모든 권리 보유.'
        },
        'en': {
            'home': 'Home',
            'pomodoro': 'Focus',
            'shortBreak': 'Break',
            'start': 'Start',
            'pause': 'Pause',
            'reset': 'Reset',
            'timeUp': 'Time is up!',
            'totalFocusTimePrefix': 'Total focus time today: ',
            'minutes': 'min',
            'seconds': 'sec',
            'about': 'About',
            'privacy': 'Privacy Policy',
            'terms': 'Terms of Service',
            'contact': 'Contact Us',
            'copyright': '© 2026 Pomodoro Timer. All rights reserved.'
        }
    };

    // --- Core Functions ---

    function setLanguage(lang) {
        htmlElement.lang = lang;
        localStorage.setItem('langPreference', lang);
        translateElements(lang);
    }

    function translateElements(lang) {
        const t = TRANSLATIONS[lang];
        const homeButton = document.querySelector('.header-mode-btn[data-mode="home"]');
        if (homeButton) homeButton.textContent = t.home;
        
        const pomodoroModeBtn = document.querySelector('.mode-btn[data-mode="pomodoro"]');
        if (pomodoroModeBtn) pomodoroModeBtn.textContent = t.pomodoro;
        const shortBreakModeBtn = document.querySelector('.mode-btn[data-mode="shortBreak"]');
        if (shortBreakModeBtn) shortBreakModeBtn.textContent = t.shortBreak;
        if (startButton) startButton.title = isPaused ? t.start : t.pause;
        if (resetButton) resetButton.title = t.reset;
        if (totalFocusDisplay) totalFocusDisplay.parentElement.firstChild.textContent = t.totalFocusTimePrefix;

        document.querySelector('footer nav a[href="about.html"]').textContent = t.about;
        document.querySelector('footer nav a[href="privacy.html"]').textContent = t.privacy;
        document.querySelector('footer nav a[href="terms.html"]').textContent = t.terms;
        document.querySelector('footer nav a[href="contact.html"]').textContent = t.contact;
        document.querySelector('footer p').textContent = t.copyright;

        const baseTitle = lang === 'ko' ? '뽀모도로 타이머' : 'Deep Focus Pomodoro';
        const pageSpecificTitles = {
            'about.html': t.about,
            'privacy.html': t.privacy,
            'terms.html': t.terms,
            'contact.html': t.contact,
        };
        const filename = window.location.pathname.split('/').pop();
        const specificTitle = pageSpecificTitles[filename];
        document.title = specificTitle ? `${specificTitle} | ${baseTitle}` : baseTitle;

        updateTotalFocusDisplay();
    }

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
        if (!startButton || !resetButton) return;
        if (!isPaused) return;
        isPaused = false;
        startButton.classList.add('paused');
        startButton.title = TRANSLATIONS[htmlElement.lang]['pause'];

        let remainingTime = totalSeconds;
        let startTime = Date.now();

        intervalId = setInterval(() => {
            const elapsedTime = Math.round((Date.now() - startTime) / 1000);
            totalSeconds = remainingTime - elapsedTime;

            if (currentMode === 'pomodoro') {
                totalFocusedSeconds++;
                localStorage.setItem('totalFocusedSeconds', totalFocusedSeconds);
                updateTotalFocusDisplay();
            }

            if (totalSeconds < 0) {
                pauseTimer();
                alert(TRANSLATIONS[htmlElement.lang]['timeUp']);
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
        startButton.title = TRANSLATIONS[htmlElement.lang]['start'];
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
            const indicatorLeftOffset = parseFloat(getComputedStyle(modeIndicator).left); // Get the 'left' CSS property of the indicator

            indicatorTranslateX = (buttonRect.left - modeContainerRect.left) - indicatorLeftOffset;
            const indicatorWidth = buttonRect.width;

            if (animate) {
                modeIndicator.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
                modeIndicator.style.transition = 'none'; // Disable transition for instant positioning
            }
            modeIndicator.style.transform = `translateX(${indicatorTranslateX}px)`;
            modeIndicator.style.width = `${indicatorWidth}px`;

            // Update active class on buttons for text color
            modeButtons.forEach(btn => {
                btn.classList.toggle('active', btn === activeButton);
            });
        }
    }

    function updateHeaderModeIndicatorPosition(animate = true) {
        if (!headerModeIndicator || headerModeButtons.length === 0 || !headerModeSelector) return;

        // Find the active button in the header (home or lang)
        const activeHeaderButton = document.querySelector('.header-mode-btn.active'); // Assuming 'home' is active by default or set dynamically
        if (activeHeaderButton) {
            const headerContainerRect = headerModeSelector.getBoundingClientRect();
            const buttonRect = activeHeaderButton.getBoundingClientRect();
            const indicatorLeftOffset = parseFloat(getComputedStyle(headerModeIndicator).left);

            const headerIndicatorTranslateX = (buttonRect.left - headerContainerRect.left) - indicatorLeftOffset;
            const headerIndicatorWidth = buttonRect.width;

            if (animate) {
                headerModeIndicator.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
                headerModeIndicator.style.transition = 'none';
            }
            headerModeIndicator.style.transform = `translateX(${headerIndicatorTranslateX}px)`;
            headerModeIndicator.style.width = `${headerIndicatorWidth}px`;

            // Update active class on buttons
            headerModeButtons.forEach(btn => {
                btn.classList.toggle('active', btn === activeHeaderButton);
            });
        }
    }


    function switchMode(mode, fromDrag = false) {
        if (!modeButtons.length) return;
        currentMode = mode;
        localStorage.setItem('currentMode', currentMode);
        
        // Only trigger timer reset if not from drag and if modes actually changed
        // Or if it's explicitly a click, always reset to ensure timer state is correct
        if (!fromDrag || (fromDrag && mode !== currentMode)) {
             resetTimer();
        }
        updateModeIndicatorPosition(); // Update indicator after mode change
    }

    function updateTotalFocusDisplay() {
        if (!totalFocusDisplay) return;
        const lang = htmlElement.lang;
        const minutes = Math.floor(totalFocusedSeconds / 60);
        const seconds = totalFocusedSeconds % 60;
        totalFocusDisplay.textContent = `${minutes}${TRANSLATIONS[lang]['minutes']} ${seconds}${TRANSLATIONS[lang]['seconds']}`;
    }

    // --- Glow Effect Functions ---
    const GLOW_PROXIMITY_THRESHOLD = 150; // px

    function updateGlow(event) {
        const glowElements = document.querySelectorAll('.has-glow-border');
        glowElements.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = event.clientX - centerX;
            const distanceY = event.clientY - centerY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            // Proximity-based opacity and blur
            if (distance < GLOW_PROXIMITY_THRESHOLD) {
                const opacity = 1 - (distance / GLOW_PROXIMITY_THRESHOLD); // Max opacity at center, fades out
                const blur = opacity * 10; // Max blur when close
                
                let angle = Math.atan2(distanceY, distanceX) * 180 / Math.PI;
                angle = angle < 0 ? angle + 360 : angle; // Normalize angle to 0-360

                card.style.setProperty('--glow-angle', angle + 90); // Adjust angle to start from top
                card.style.setProperty('--glow-opacity', opacity);
                card.style.setProperty('--glow-blur', blur);
            } else {
                card.style.setProperty('--glow-opacity', 0);
            }
        });
    }

    function hideGlow(event) {
        const glowElements = document.querySelectorAll('.has-glow-border');
        glowElements.forEach(card => {
            card.style.setProperty('--glow-opacity', 0);
        });
    }

    // --- Drag functionality ---
    function handlePointerDown(e) {
        if (!modeIndicator || e.target !== modeIndicator) return;

        isDragging = true;
        modeIndicator.classList.add('dragging');
        dragStartX = e.clientX;
        // Get the current translateX value
        const transformMatch = window.getComputedStyle(modeIndicator).transform.match(/translateX\(([^)]+)px\)/);
        initialIndicatorX = transformMatch ? parseFloat(transformMatch[1]) : 0;
        indicatorTranslateX = initialIndicatorX; // Initialize current translateX

        modeIndicator.style.transition = 'none'; // Disable transition during drag
        
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    }

    function handlePointerMove(e) {
        if (!isDragging) return;

        e.preventDefault(); // Prevent text selection etc.
        const dragDelta = e.clientX - dragStartX;
        let newTranslateX = initialIndicatorX + dragDelta;

        const modeContainerRect = timerModesContainer.getBoundingClientRect();
        const indicatorWidth = modeIndicator.offsetWidth;

        // Constrain movement within the parent (.timer-modes)
        const minX = 0;
        const maxX = modeContainerRect.width - indicatorWidth;

        indicatorTranslateX = Math.max(minX, Math.min(newTranslateX, maxX));
        modeIndicator.style.transform = `translateX(${indicatorTranslateX}px)`;
    }

    function handlePointerUp(e) {
        if (!isDragging) return;

        isDragging = false;
        modeIndicator.classList.remove('dragging');
        modeIndicator.style.transition = ''; // Re-enable transition

        // Determine which button the indicator is closest to
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
            switchMode(closestMode, true); // Pass true to indicate it's from a drag
        } else {
            // If the mode hasn't changed, snap back to current mode's position
            updateModeIndicatorPosition(); 
        }

        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
    }


    function setupEventListeners() {
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

        // --- Language selectors ---

        if (headerModeButtons.length) {
            headerModeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const mode = e.currentTarget.dataset.mode;
                    if (mode === 'home') {
                        window.location.href = 'index.html'; // Navigate to home page
                    } else if (mode === 'lang') {
                        e.stopPropagation(); // Prevent document click listener from immediately closing it
                        languageSelector.classList.toggle('visible');
                        updateHeaderModeIndicatorPosition(); // Update indicator for active language button
                    }
                });
            });
        }

        langOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                setLanguage(e.target.dataset.lang);
                languageSelector.classList.remove('visible');
            });
        });

        document.addEventListener('click', (e) => {
            if (languageSelector && !languageSelector.contains(e.target) && !document.querySelector('.header-mode-btn[data-mode="lang"]').contains(e.target)) {
                languageSelector.classList.remove('visible');
            }
        });

        // Recalculate indicator position on window resize to handle responsiveness
        window.addEventListener('resize', () => {
            if (document.getElementById('minutes-tens')) {
                updateModeIndicatorPosition();
            }
        });

        // --- Drag Listeners for modeIndicator ---
        if (modeIndicator) {
            modeIndicator.addEventListener('pointerdown', handlePointerDown);
        }

        // --- Glow effect listeners ---
        document.addEventListener('pointermove', updateGlow);
        document.addEventListener('pointerleave', hideGlow);
    }

    function init() {
        currentMode = localStorage.getItem('currentMode') || 'pomodoro';
        totalFocusedSeconds = parseInt(localStorage.getItem('totalFocusedSeconds')) || 0;
        lastResetDate = localStorage.getItem('lastResetDate') || '';
        const savedLang = localStorage.getItem('langPreference') || 'ko';

        const today = new Date().toISOString().slice(0, 10);
        if (lastResetDate !== today) {
            totalFocusedSeconds = 0;
            localStorage.setItem('totalFocusedSeconds', '0');
            lastResetDate = today;
            localStorage.setItem('lastResetDate', today);
        }

        createDigitReels();
        setupEventListeners();

        // Theme and language are now applied by the early scripts in the head to prevent FOUC.
        // applyTheme(savedTheme);
        // setLanguage(savedLang);
        updateHeaderModeIndicatorPosition(false); // Initial position for header mode indicator

        if (document.getElementById('minutes-tens')) {
            updateModeIndicatorPosition(false); // Initial position without animation
            switchMode(currentMode); // This sets up the correct timer duration and ensures indicator is positioned
        }
        updateTotalFocusDisplay();
    }

    init();
});