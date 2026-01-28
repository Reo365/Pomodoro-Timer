document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const htmlElement = document.getElementById('app-html');
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const langToggleButton = document.getElementById('lang-toggle-btn');
    const languageSelector = document.getElementById('language-selector');
    const langOptionButtons = document.querySelectorAll('.lang-option-btn');
    const M_TENS = document.getElementById('minutes-tens');
    const M_ONES = document.getElementById('minutes-ones');
    const S_TENS = document.getElementById('seconds-tens');
    const S_ONES = document.getElementById('seconds-ones');
    const digitContainers = [M_TENS, M_ONES, S_TENS, S_ONES];

    const modeButtons = document.querySelectorAll('.mode-btn');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const totalFocusDisplay = document.getElementById('total-focus-display');
    const backgroundPomodoro = document.querySelector('.background-pomodoro');
    const backgroundShortBreak = document.querySelector('.background-short-break');

    // --- Theme Variables ---
    const THEMES = ['auto', 'light', 'dark'];
    let currentThemePreference = 'auto'; // 'auto', 'light', 'dark'

    // --- Language Variables ---
    const TRANSLATIONS = {
        'ko': {
            'home': '홈',
            'themeToggle': '테마 전환',
            'pomodoro': '집중',
            'shortBreak': '휴식',
            'start': '시작',
            'pause': '일시정지',
            'reset': '초기화',
            'timeUp': '시간이 종료되었습니다!',
            'totalFocusTime': '오늘 총 집중 시간:',
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
            'themeToggle': 'Toggle Theme',
            'pomodoro': 'Focus',
            'shortBreak': 'Break',
            'start': 'Start',
            'pause': 'Pause',
            'reset': 'Reset',
            'timeUp': 'Time is up!',
            'totalFocusTime': 'Total focus time today:',
            'minutes': 'min',
            'seconds': 'sec',
            'about': 'About',
            'privacy': 'Privacy Policy',
            'terms': 'Terms of Service',
            'contact': 'Contact Us',
            'copyright': '© 2026 Pomodoro Timer. All rights reserved.'
        }
    };

    // --- Theme Functions ---
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(themePreference) {
        currentThemePreference = themePreference;
        let themeToApply = themePreference;

        if (themePreference === 'auto') {
            themeToApply = getSystemTheme();
        }

        htmlElement.dataset.theme = themeToApply;
        
        // Update button text
        let buttonText = '';
        switch (themePreference) {
            case 'auto':
                buttonText = '테마: 자동';
                break;
            case 'light':
                buttonText = '테마: 라이트';
                break;
            case 'dark':
                buttonText = '테마: 다크';
                break;
        }
        themeToggleButton.textContent = buttonText;
        saveThemePreference(themePreference);
    }

    function saveThemePreference(themePreference) {
        localStorage.setItem('themePreference', themePreference);
    }

    function getSavedThemePreference() {
        return localStorage.getItem('themePreference');
    }

    function cycleTheme() {
        const currentIndex = THEMES.indexOf(currentThemePreference);
        const nextIndex = (currentIndex + 1) % THEMES.length;
        applyTheme(THEMES[nextIndex]);
    }

    // --- Language Functions ---
    function setLanguage(lang) {
        htmlElement.lang = lang;
        localStorage.setItem('langPreference', lang);
        translateElements(lang);
    }

    function getSavedLanguagePreference() {
        return localStorage.getItem('langPreference') || 'ko'; // Default to Korean
    }

    function toggleLanguage() {
        const currentLang = htmlElement.lang;
        const newLang = currentLang === 'ko' ? 'en' : 'ko';
        setLanguage(newLang);
    }

    function translateElements(lang) {
        // Header
        document.querySelector('.about-link').textContent = TRANSLATIONS[lang]['home'];
        themeToggleButton.textContent = TRANSLATIONS[lang]['themeToggle']; // This will be overwritten by applyTheme
        langToggleButton.textContent = lang === 'ko' ? '🌐' : '🌐'; // Globe icon remains the same

        // Timer Modes
        document.querySelector('.mode-btn[data-mode="pomodoro"]').textContent = TRANSLATIONS[lang]['pomodoro'];
        document.querySelector('.mode-btn[data-mode="shortBreak"]').textContent = TRANSLATIONS[lang]['shortBreak'];

        // Timer Controls
        // startButton.title = TRANSLATIONS[lang][isPaused ? 'start' : 'pause']; // This logic is more complex, handle in start/pause funcs
        resetButton.title = TRANSLATIONS[lang]['reset'];

        // Footer
        document.querySelector('footer nav a[href="about.html"]').textContent = TRANSLATIONS[lang]['about'];
        document.querySelector('footer nav a[href="privacy.html"]').textContent = TRANSLATIONS[lang]['privacy'];
        document.querySelector('footer nav a[href="terms.html"]').textContent = TRANSLATIONS[lang]['terms'];
        document.querySelector('footer nav a[href="contact.html"]').textContent = TRANSLATIONS[lang]['contact'];
        document.querySelector('footer p').textContent = TRANSLATIONS[lang]['copyright'];

        // Update page title
        document.title = lang === 'ko' ? '초집중 뽀모도로 타이머' : 'Hyperfocus Pomodoro Timer';
    }


    // --- State Variables ---
    let totalSeconds = 25 * 60;
    let intervalId = null;
    let isPaused = true;
    let currentMode = localStorage.getItem('currentMode') || 'pomodoro'; // Load from localStorage
    let totalFocusedSeconds = parseInt(localStorage.getItem('totalFocusedSeconds')) || 0;
    let lastResetDate = localStorage.getItem('lastResetDate') || '';

    const DURATIONS = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
    };

    // --- Core Functions ---

    function getTodayDateString() {
        const today = new Date();
        return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    }

    function checkAndResetDaily() {
        const todayDateString = getTodayDateString();
        if (lastResetDate !== todayDateString) {
            totalFocusedSeconds = 0;
            localStorage.setItem('totalFocusedSeconds', totalFocusedSeconds);
            lastResetDate = todayDateString;
            localStorage.setItem('lastResetDate', lastResetDate);
        }
    }

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
                reel.appendChild(digit); // Corrected line
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
        startButton.title = TRANSLATIONS[htmlElement.lang]['pause'];

        // More robust timing with Date.now()
        let expected = Date.now() + 1000;
        intervalId = setTimeout(step, 1000);

        function step() {
            let drift = Date.now() - expected;
            if (drift > 1000) {
                // If the tab was inactive, account for the drift
                const missedSeconds = Math.round(drift / 1000);
                 if (currentMode === 'pomodoro') {
                    totalFocusedSeconds += missedSeconds;
                    localStorage.setItem('totalFocusedSeconds', totalFocusedSeconds);
                }
                totalSeconds -= missedSeconds;
            } else {
                 if (currentMode === 'pomodoro') {
                    totalFocusedSeconds++;
                    localStorage.setItem('totalFocusedSeconds', totalFocusedSeconds);
                }
                totalSeconds--;
            }


            updateDisplay();
            updateTotalFocusDisplay(); // Update total focus display every second

            if (totalSeconds < 0) {
                pauseTimer();
                // Handle timer completion
                alert(TRANSLATIONS[htmlElement.lang]['timeUp']);
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
        startButton.title = TRANSLATIONS[htmlElement.lang]['start'];
    }

    function resetTimer() {
        pauseTimer();
        totalSeconds = DURATIONS[currentMode];
        updateDisplay();
        updateBackgroundClass(true);
    }

    function switchMode(mode) {
        currentMode = mode;
        localStorage.setItem('currentMode', currentMode); // Save to localStorage
        modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        resetTimer();
    }

    function updateTotalFocusDisplay() {
        const lang = htmlElement.lang;
        const minutes = Math.floor(totalFocusedSeconds / 60);
        const seconds = totalFocusedSeconds % 60;
        // Update the parent <p> element's text content, including the prefix
        totalFocusDisplay.parentElement.textContent = `${TRANSLATIONS[lang]['totalFocusTime']} ${minutes}${TRANSLATIONS[lang]['minutes']} ${seconds}${TRANSLATIONS[lang]['seconds']}`;
    }

    // --- Performance Optimizations ---

    function updateBackgroundClass(isReset = false) {
        console.log('updateBackgroundClass called. currentMode:', currentMode);
        backgroundPomodoro.classList.toggle('active', currentMode === 'pomodoro');
        backgroundShortBreak.classList.toggle('active', currentMode === 'shortBreak');
        console.log('backgroundPomodoro active:', backgroundPomodoro.classList.contains('active'));
        console.log('backgroundShortBreak active:', backgroundShortBreak.classList.contains('active'));
    }

    // --- Performance Optimizations ---
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
            
            // Apply to both background layers
            backgroundPomodoro.style.backgroundPosition = `${bgX}% 50%`;
            backgroundShortBreak.style.backgroundPosition = `${bgX}% 50%`;

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

        themeToggleButton.addEventListener('click', cycleTheme);
        
        langToggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate closing
            languageSelector.classList.toggle('visible');
        });

        langOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                setLanguage(lang);
                languageSelector.classList.remove('visible'); // Hide selector after selection
            });
        });

        // Close language selector if clicking outside
        document.addEventListener('click', (e) => {
            if (!languageSelector.contains(e.target) && !langToggleButton.contains(e.target)) {
                languageSelector.classList.remove('visible');
            }
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (currentThemePreference === 'auto') {
                applyTheme('auto');
            }
        });
    }

    // --- Initialization ---
    function init() {
        checkAndResetDaily(); // Check and reset total focus time daily
        createDigitReels();
        updateDisplay();
        // updateTotalFocusDisplay(); // Call after language is set

        updateBackgroundClass(false); // Initial background without transition
        setupEventListeners();
        handleMouseInteraction();

        // Initial theme setup
        const savedTheme = getSavedThemePreference();
        applyTheme(savedTheme || 'auto');

        // Initial language setup
        const savedLang = getSavedLanguagePreference();
        setLanguage(savedLang); // This will also call translateElements
        updateTotalFocusDisplay(); // Call after language is set
        startButton.title = TRANSLATIONS[htmlElement.lang][isPaused ? 'start' : 'pause'];
    }

    init();
});


