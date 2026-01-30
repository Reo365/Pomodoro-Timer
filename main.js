document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const htmlElement = document.getElementById('app-html');
    const langToggleButton = document.querySelector('.lang-toggle-btn');

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

    // Add these helper functions for theme handling
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function applyTheme(theme, save = true) {
        // Remove existing theme classes
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-dim');

        let themeToApply = theme;
        if (theme === 'auto') {
            themeToApply = getSystemTheme();
        }

        document.body.classList.add(`theme-${themeToApply}`);

        // Update theme radio button visual state
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.checked = (radio.value === theme);
        });

        if (save) {
            localStorage.setItem('themePreference', theme);
        }
    }

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
        if (!M_TENS) return; // M_TENS is the first element in digitContainers, check once
        const minutes = Math.floor(secondsValue / 60);
        const seconds = secondsValue % 60;

        const digits = [
            Math.floor(minutes / 10), // M_TENS
            minutes % 10,           // M_ONES
            Math.floor(seconds / 10), // S_TENS
            seconds % 10            // S_ONES
        ];
        const digitHeight = digitContainers[0].clientHeight; // Assume all digit containers have the same height

        digitContainers.forEach((container, index) => {
            container.firstElementChild.style.transform = `translateY(-${digits[index] * digitHeight}px)`;
        });
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

            if (!animate) {
                modeIndicator.style.transition = 'none'; // Disable transition for instant positioning
            } else {
                modeIndicator.style.transition = ''; // Re-enable CSS transition
            }
            modeIndicator.style.transform = `translateX(${indicatorTranslateX}px)`;
            modeIndicator.style.width = `${indicatorWidth}px`;

            // Update active class on buttons for text color
            modeButtons.forEach(btn => {
                btn.classList.toggle('active', btn === activeButton);
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

        // --- Language selector toggle ---
        if (langToggleButton) {
            langToggleButton.addEventListener('click', () => {
                const currentLang = htmlElement.lang;
                const newLang = currentLang === 'ko' ? 'en' : 'ko';
                setLanguage(newLang);
            });
        }

        // --- Theme switcher events ---
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                applyTheme(e.target.value);
            });
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
        const savedTheme = localStorage.getItem('themePreference') || 'light'; // Load saved theme

        const today = new Date().toISOString().slice(0, 10);
        if (lastResetDate !== today) {
            totalFocusedSeconds = 0;
            localStorage.setItem('totalFocusedSeconds', '0');
            lastResetDate = today;
            localStorage.setItem('lastResetDate', today);
        }

        createDigitReels();
        setupEventListeners();

        // The early script already applied the class, here we ensure the radio buttons are checked
        // and handle any initial theme logic not covered by the early script if needed.
        applyTheme(savedTheme, false); // Apply theme (don't save again)

        if (document.getElementById('minutes-tens')) {
            updateModeIndicatorPosition(false); // Initial position without animation
            switchMode(currentMode); // This sets up the correct timer duration and ensures indicator is positioned
        }
        updateTotalFocusDisplay();
    }

    init();
});