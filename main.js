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
    const modeIndicator = document.querySelector('.mode-indicator');
    const timerModesContainer = document.querySelector('.timer-modes'); // Parent for mode buttons and indicator

    // --- App State ---
    let intervalId = null;
    let isPaused = true;
    let currentMode = 'pomodoro';
    let totalSeconds = 0;

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
            'about': '소개',
            'privacy': '개인정보 처리방침',
            'terms': '이용 약관',
            'contact': '문의하기',
            'copyright': '© 2026 뽀모도로 타이머. 모든 권리 보유.',
            'about_h2_main': '뽀모도로 타이머',
            'about_p_intro': '현대 사회의 복잡한 환경 속에서 흐트러지기 쉬운 집중력. <strong data-translate-key="pomodoro_technique">뽀모도로 테크닉</strong>은 짧고 효과적인 작업 주기와 적절한 휴식을 통해 당신의 집중력을 최대로 끌어올리고, 생산성을 극대화하는 검증된 시간 관리 방법입니다. 저희 \'뽀모도로 타이머\'는 이 강력한 테크닉을 웹에서 가장 직관적이고 아름답게 경험할 수 있도록 설계되었습니다.',
            'about_h3_why': '왜 \'뽀모도로 타이머\'를 선택해야 할까요?',
            'about_p_why_main': '저희 타이머는 단순한 시간 측정 도구를 넘어, 당신의 생산성 여정에 함께하는 파트너입니다.',
            'feature_1': '<strong>직관적이고 아름다운 디자인:</strong> 불필요한 요소를 제거하고, 오직 당신의 집중을 위해 최적화된 깔끔한 인터페이스를 제공합니다.',
            'feature_2': '<strong>스마트한 테마 전환:</strong> 주변 환경에 맞춰 자동으로, 혹은 수동으로 라이트/다크 모드를 전환하여 눈의 피로를 줄여줍니다.',
            'feature_4': '<strong>완벽한 컨트롤:</strong> 시작, 일시정지, 재설정 기능을 통해 언제든 타이머를 완벽하게 제어할 수 있습니다.',
            'about_h3_get_started': '지금 바로 시작하세요!',
            'about_p_get_started': '복잡한 설정 없이, 클릭 한 번으로 당신의 집중력을 깨우세요. \'뽀모도로 타이머\'와 함께라면 당신의 매일은 더욱 생산적이고 만족스러워질 것입니다.',
            'pomodoro_technique': '뽀모도로 테크닉',
        },
        'en': {
            'home': 'Home',
            'pomodoro': 'Focus',
            'shortBreak': 'Break',
            'start': 'Start',
            'pause': 'Pause',
            'reset': 'Reset',
            'timeUp': 'Time is up!',
            'about': 'About',
            'privacy': 'Privacy Policy',
            'terms': 'Terms of Service',
            'contact': 'Contact Us',
            'copyright': '© 2026 Pomodoro Timer. All rights reserved.',
            'about_h2_main': 'About Pomodoro Timer',
            'about_p_intro': 'In today\'s complex world, focus is a fragile commodity. The <strong>Pomodoro Technique</strong> is a proven time management method that maximizes your concentration and boosts productivity through short, effective work cycles and proper rest. Our \'Pomodoro Timer\' is designed to provide the most intuitive and beautiful web-based experience for this powerful technique.',
            'about_h3_why': 'Why Choose \'Pomodoro Timer\'?',
            'about_p_why_main': 'Our timer is more than just a time-tracking tool; it is a partner in your productivity journey.',
            'feature_1': '<strong>Intuitive and Beautiful Design:</strong> We\'ve eliminated unnecessary elements to provide a clean interface optimized solely for your focus.',
            'feature_2': '<strong>Smart Theme Switching:</strong> Reduce eye strain by automatically or manually switching between light and dark modes to match your environment.',
            'feature_4': '<strong>Complete Control:</strong> You have full control over the timer at all times with start, pause, and reset functions.',
            'about_h3_get_started': 'Get Started Now!',
            'about_p_get_started': 'Awaken your focus with a single click, no complicated setup required. With the \'Pomodoro Timer\', your every day will be more productive and satisfying.',
            'pomodoro_technique': 'Pomodoro Technique',
        }
    };

    // --- Core Functions ---

    function getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme, save = true) {
        document.body.classList.remove('theme-light', 'theme-dark');
        const themeToApply = theme === 'auto' ? getSystemTheme() : theme;
        document.body.classList.add(`theme-${themeToApply}`);
        
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
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.getAttribute('data-translate-key');
            if (t[key]) {
                el.innerHTML = t[key];
            }
        });

        const baseTitle = lang === 'ko' ? '뽀모도로 타이머' : 'Pomodoro Timer';
        const pageSpecificTitles = {
            'about.html': t.about,
            'privacy.html': t.privacy,
            'terms.html': t.terms,
            'contact.html': t.contact,
        };
        const filename = window.location.pathname.split('/').pop();
        const specificTitle = pageSpecificTitles[filename];
        document.title = specificTitle ? `${specificTitle} | ${baseTitle}` : baseTitle;

        // Translate elements that do not use data-translate-key
        const homeButton = document.querySelector('.home-btn');
        if (homeButton) homeButton.textContent = t.home;

        document.querySelectorAll('footer nav a').forEach(link => {
            const key = link.getAttribute('href').replace('.html', '');
            if (t[key]) link.textContent = t[key];
        });

        const footerP = document.querySelector('footer p');
        if (footerP) footerP.textContent = t.copyright;
    }

    function createDigitReels() {
        if (!M_TENS) return;
        digitContainers.forEach(container => {
            if(container) { // Check if container exists
                const reel = document.createElement('div');
                reel.className = 'digit-reel';
                const limit = container.id.includes('seconds-tens') || container.id.includes('minutes-tens') ? 6 : 10;
                for (let i = 0; i < limit; i++) {
                    const digit = document.createElement('span');
                    digit.textContent = i;
                    reel.appendChild(digit);
                }
                container.appendChild(reel);
            }
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
            if (container && container.firstElementChild) { // Check for container and reel
                container.firstElementChild.style.transform = `translateY(-${digits[index] * digitHeight}px)`;
            }
        });
    }

    function startTimer() {
        if (!isPaused) return;
        isPaused = false;
        startButton.classList.add('paused');
        const lang = htmlElement.lang;
        startButton.title = TRANSLATIONS[lang]['pause'];

        let remainingTime = totalSeconds;
        let startTime = Date.now();

        intervalId = setInterval(() => {
            const elapsedTime = Math.round((Date.now() - startTime) / 1000);
            totalSeconds = remainingTime - elapsedTime;

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
        const lang = htmlElement.lang;
        startButton.title = TRANSLATIONS[lang]['start'];
    }

    function resetTimer() {
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
            const indicatorWidth = buttonRect.width;

            modeIndicator.style.transition = animate ? '' : 'none';
            modeIndicator.style.transform = `translateX(${indicatorTranslateX}px)`;
            modeIndicator.style.width = `${indicatorWidth}px`;

            modeButtons.forEach(btn => {
                btn.classList.toggle('active', btn === activeButton);
            });
        }
    }

    function switchMode(mode, fromDrag = false) {
        if (currentMode === mode && !fromDrag) return;
        currentMode = mode;
        localStorage.setItem('currentMode', currentMode);
        resetTimer();
        updateModeIndicatorPosition();
    }

    // --- Event Listeners ---
    function setupCommonEventListeners() {
        langToggleButton.addEventListener('click', () => {
            const newLang = htmlElement.lang === 'ko' ? 'en' : 'ko';
            setLanguage(newLang);
        });

        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                applyTheme(e.target.value);
            });
        });
    }

    function setupTimerEventListeners() {
        if (!startButton) return;

        startButton.addEventListener('click', () => {
            if (isPaused) startTimer();
            else pauseTimer();
        });

        resetButton.addEventListener('click', resetTimer);

        modeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                switchMode(mode);
            });
        });

        window.addEventListener('resize', () => updateModeIndicatorPosition());

        // Drag functionality for mode indicator
        if(modeIndicator) {
            let isDragging = false;
            let dragStartX = 0;
            let initialIndicatorX = 0;

            modeIndicator.addEventListener('pointerdown', (e) => {
                isDragging = true;
                modeIndicator.classList.add('dragging');
                dragStartX = e.clientX;
                const transformMatch = window.getComputedStyle(modeIndicator).transform.match(/translateX\(([^)]+)px\)/);
                initialIndicatorX = transformMatch ? parseFloat(transformMatch[1]) : 0;
                modeIndicator.style.transition = 'none';
                document.addEventListener('pointermove', onPointerMove);
                document.addEventListener('pointerup', onPointerUp);
            });

            function onPointerMove(e) {
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

            function onPointerUp(e) {
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
                switchMode(closestMode, true);
                document.removeEventListener('pointermove', onPointerMove);
                document.removeEventListener('pointerup', onPointerUp);
            }
        }
    }

    // --- Initialization ---
    function init() {
        const savedTheme = localStorage.getItem('themePreference') || 'light';
        const savedLang = localStorage.getItem('langPreference') || 'ko';

        applyTheme(savedTheme, false);
        setLanguage(savedLang);
        setupCommonEventListeners();

        // Page-specific initialization
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            currentMode = localStorage.getItem('currentMode') || 'pomodoro';
            createDigitReels();
            setupTimerEventListeners();
            switchMode(currentMode); 
            updateModeIndicatorPosition(false); // Initial position without animation

            // Set initial button titles based on language
            if(startButton) startButton.title = TRANSLATIONS[savedLang].start;
            if(resetButton) resetButton.title = TRANSLATIONS[savedLang].reset;
        }
    }

    init();
});