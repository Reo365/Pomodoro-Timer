document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const htmlElement = document.getElementById('app-html');
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const langToggleButton = document.getElementById('lang-toggle-btn');
    const languageSelector = document.getElementById('language-selector');
    const langOptionButtons = document.querySelectorAll('.lang-option-btn');
    const themeSelector = document.getElementById('theme-selector'); // New
    const themeOptionButtons = document.querySelectorAll('.theme-option-btn'); // New

    const M_TENS = document.getElementById('minutes-tens');
    const M_ONES = document.getElementById('minutes-ones');
    const S_TENS = document.getElementById('seconds-tens');
    const S_ONES = document.getElementById('seconds-ones');
    const digitContainers = [M_TENS, M_ONES, S_TENS, S_ONES];

    const modeButtons = document.querySelectorAll('.mode-btn');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const totalFocusDisplay = document.getElementById('total-focus-display');

    // --- App State ---
    let intervalId = null;
    let isPaused = true;
    let currentMode = 'pomodoro';
    let totalSeconds = 0;
    let totalFocusedSeconds = 0;
    let lastResetDate = '';
    let currentThemePreference = 'auto'; // 'auto', 'light', 'dark'
    // const THEMES = ['auto', 'light', 'dark']; // No longer needed for cycling

    const DURATIONS = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
    };

    const TRANSLATIONS = {
        'ko': {
            'home': '홈',
            'themeToggle': '테마 전환',
            'themeAuto': '자동', // Simplified for option button
            'themeLight': '라이트', // Simplified for option button
            'themeDark': '다크', // Simplified for option button
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
            'themeToggle': 'Toggle Theme',
            'themeAuto': 'Auto', // Simplified for option button
            'themeLight': 'Light', // Simplified for option button
            'themeDark': 'Dark', // Simplified for option button
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

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(themePreference) {
        currentThemePreference = themePreference;
        localStorage.setItem('themePreference', themePreference);
        const themeToApply = themePreference === 'auto' ? getSystemTheme() : themePreference;
        htmlElement.dataset.theme = themeToApply;
        translateElements(htmlElement.lang); // Re-translate to update theme button text
    }

    // Removed cycleTheme function

    function setLanguage(lang) {
        htmlElement.lang = lang;
        localStorage.setItem('langPreference', lang);
        translateElements(lang);
    }

    function translateElements(lang) {
        const t = TRANSLATIONS[lang];
        // Header
        document.querySelector('.about-link').textContent = t.home;
        themeToggleButton.textContent = t.themeToggle; // Base text for the toggle button

        // Update text for theme option buttons
        themeOptionButtons.forEach(button => {
            const themePref = button.dataset.themePref;
            if (themePref === 'auto') button.textContent = t.themeAuto;
            else if (themePref === 'light') button.textContent = t.themeLight;
            else if (themePref === 'dark') button.textContent = t.themeDark;
        });
        
        // Timer
        // These elements may not exist on subpages, so check first
        const pomodoroModeBtn = document.querySelector('.mode-btn[data-mode="pomodoro"]');
        if (pomodoroModeBtn) pomodoroModeBtn.textContent = t.pomodoro;
        const shortBreakModeBtn = document.querySelector('.mode-btn[data-mode="shortBreak"]');
        if (shortBreakModeBtn) shortBreakModeBtn.textContent = t.shortBreak;
        if (startButton) startButton.title = isPaused ? t.start : t.pause;
        if (resetButton) resetButton.title = t.reset;
        if (totalFocusDisplay) totalFocusDisplay.parentElement.firstChild.textContent = t.totalFocusTimePrefix;

        // Footer & Page Title
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

        // Update displays
        updateTotalFocusDisplay();
    }


    function createDigitReels() {
        if (!M_TENS) return; // Only create reels if timer elements exist
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
        if (!M_TENS) return; // Only update display if timer elements exist
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
        if (!startButton || !resetButton) return; // Only run if timer controls exist
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
        if (!startButton || !resetButton) return; // Only run if timer controls exist
        pauseTimer();
        totalSeconds = DURATIONS[currentMode];
        updateDisplay(totalSeconds);
    }

    function switchMode(mode) {
        if (!modeButtons.length) return; // Only run if mode buttons exist
        currentMode = mode;
        localStorage.setItem('currentMode', currentMode);
        modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        resetTimer();
    }

    function updateTotalFocusDisplay() {
        if (!totalFocusDisplay) return; // Only update if element exists
        const lang = htmlElement.lang;
        const minutes = Math.floor(totalFocusedSeconds / 60);
        const seconds = totalFocusedSeconds % 60;
        totalFocusDisplay.textContent = `${minutes}${TRANSLATIONS[lang]['minutes']} ${seconds}${TRANSLATIONS[lang]['seconds']}`;
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

        // Theme Toggle Button
        themeToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            themeSelector.classList.toggle('visible');
            languageSelector.classList.remove('visible'); // Close language selector if open
        });

        // Theme Option Buttons
        themeOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const themePref = e.target.dataset.themePref;
                applyTheme(themePref);
                themeSelector.classList.remove('visible'); // Hide selector after selection
            });
        });


        langToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            languageSelector.classList.toggle('visible');
            themeSelector.classList.remove('visible'); // Close theme selector if open
        });

        langOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                setLanguage(e.target.dataset.lang);
                languageSelector.classList.remove('visible'); // Hide selector after selection
            });
        });

        // Close selectors if clicking outside
        document.addEventListener('click', (e) => {
            if (themeSelector && !themeSelector.contains(e.target) && !themeToggleButton.contains(e.target)) {
                themeSelector.classList.remove('visible');
            }
            if (languageSelector && !languageSelector.contains(e.target) && !langToggleButton.contains(e.target)) {
                languageSelector.classList.remove('visible');
            }
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (currentThemePreference === 'auto') {
                applyTheme('auto');
            }
        });
    }

    function init() {
        // Load preferences
        currentMode = localStorage.getItem('currentMode') || 'pomodoro';
        totalFocusedSeconds = parseInt(localStorage.getItem('totalFocusedSeconds')) || 0;
        lastResetDate = localStorage.getItem('lastResetDate') || '';
        const savedTheme = localStorage.getItem('themePreference') || 'auto';
        const savedLang = localStorage.getItem('langPreference') || 'ko';

        // Daily reset check
        const today = new Date().toISOString().slice(0, 10);
        if (lastResetDate !== today) {
            totalFocusedSeconds = 0;
            localStorage.setItem('totalFocusedSeconds', '0');
            lastResetDate = today;
            localStorage.setItem('lastResetDate', today);
        }

        createDigitReels();
        setupEventListeners();

        // Apply initial settings
        applyTheme(savedTheme);
        setLanguage(savedLang); // This also calls translateElements and updates displays

        // Only switch mode and update timer display if timer elements exist on the page
        if (document.getElementById('minutes-tens')) {
            switchMode(currentMode); // This sets up the correct timer duration and initial display
        }
        updateTotalFocusDisplay(); // Final check on focus display
    }

    init();
});