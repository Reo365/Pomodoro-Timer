document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const htmlElement = document.getElementById('app-html');
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const langToggleButton = document.getElementById('lang-toggle-btn');
    const languageSelector = document.getElementById('language-selector');
    const langOptionButtons = document.querySelectorAll('.lang-option-btn');
    const themeSelector = document.getElementById('theme-selector');
    const themeOptionButtons = document.querySelectorAll('.theme-option-btn');

    const M_TENS = document.getElementById('minutes-tens');
    const M_ONES = document.getElementById('minutes-ones');
    const S_TENS = document.getElementById('seconds-tens');
    const S_ONES = document.getElementById('seconds-ones');
    const digitContainers = [M_TENS, M_ONES, S_TENS, S_ONES];

    const modeButtons = document.querySelectorAll('.mode-btn');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const totalFocusDisplay = document.getElementById('total-focus-display');
    const modeIndicator = document.querySelector('.mode-indicator'); // New DOM element

    // --- App State ---
    let intervalId = null;
    let isPaused = true;
    let currentMode = 'pomodoro';
    let totalSeconds = 0;
    let totalFocusedSeconds = 0;
    let lastResetDate = '';
    let currentThemePreference = 'auto';

    const DURATIONS = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
    };

    const TRANSLATIONS = {
        'ko': {
            'home': '홈',
            'themeToggle': '테마 전환',
            'themeAuto': '자동',
            'themeLight': '라이트',
            'themeDark': '다크',
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
            'themeAuto': 'Auto',
            'themeLight': 'Light',
            'themeDark': 'Dark',
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
        translateElements(htmlElement.lang);
    }

    function setLanguage(lang) {
        htmlElement.lang = lang;
        localStorage.setItem('langPreference', lang);
        translateElements(lang);
    }

    function translateElements(lang) {
        const t = TRANSLATIONS[lang];
        document.querySelector('.about-link').textContent = t.home;
        themeToggleButton.textContent = t.themeToggle;

        themeOptionButtons.forEach(button => {
            const themePref = button.dataset.themePref;
            if (themePref === 'auto') button.textContent = t.themeAuto;
            else if (themePref === 'light') button.textContent = t.themeLight;
            else if (themePref === 'dark') button.textContent = t.themeDark;
        });
        
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

    function updateModeIndicatorPosition() {
        if (!modeIndicator || modeButtons.length === 0) return;

        const activeButton = document.querySelector(`.mode-btn[data-mode="${currentMode}"]`);
        if (activeButton) {
            const modeContainer = activeButton.closest('.timer-modes');
            if (!modeContainer) return; // Should not happen if .mode-btn is inside .timer-modes

            const containerRect = modeContainer.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();

            // Calculate position relative to the parent (.timer-modes)
            const translateX = buttonRect.left - containerRect.left;
            const indicatorWidth = buttonRect.width;

            modeIndicator.style.transform = `translateX(${translateX}px)`;
            modeIndicator.style.width = `${indicatorWidth}px`;

            // Also manage active class on buttons for text color
            modeButtons.forEach(btn => {
                btn.classList.toggle('active', btn === activeButton);
            });
        }
    }


    function switchMode(mode) {
        if (!modeButtons.length) return;
        currentMode = mode;
        localStorage.setItem('currentMode', currentMode);
        
        // Update the indicator position immediately
        updateModeIndicatorPosition();

        resetTimer();
    }

    function updateTotalFocusDisplay() {
        if (!totalFocusDisplay) return;
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

        themeToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            themeSelector.classList.toggle('visible');
            languageSelector.classList.remove('visible');
        });

        themeOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const themePref = e.target.dataset.themePref;
                applyTheme(themePref);
                themeSelector.classList.remove('visible');
            });
        });

        langToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            languageSelector.classList.toggle('visible');
            themeSelector.classList.remove('visible');
        });

        langOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                setLanguage(e.target.dataset.lang);
                languageSelector.classList.remove('visible');
            });
        });

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

        // Recalculate indicator position on window resize to handle responsiveness
        window.addEventListener('resize', () => {
            if (document.getElementById('minutes-tens')) { // Only if timer elements are present
                updateModeIndicatorPosition();
            }
        });
    }

    function init() {
        currentMode = localStorage.getItem('currentMode') || 'pomodoro';
        totalFocusedSeconds = parseInt(localStorage.getItem('totalFocusedSeconds')) || 0;
        lastResetDate = localStorage.getItem('lastResetDate') || '';
        const savedTheme = localStorage.getItem('themePreference') || 'auto';
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

        applyTheme(savedTheme);
        setLanguage(savedLang);

        if (document.getElementById('minutes-tens')) {
            switchMode(currentMode);
            updateModeIndicatorPosition(); // Ensure indicator is positioned correctly on load
        }
        updateTotalFocusDisplay();
    }

    init();
});