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
            'copyright': '© 2026 뽀모도로 타이머. 모든 권리 보유.',
            'about_h2_1': '뽀모도로 테크닉과 이 타이머가 제공하는 가치',
            'about_p_1': '현대 사회에서 집중력은 가장 귀중한 자원 중 하나입니다. 수많은 정보와 알림 속에서 우리의 주의는 쉽게 분산되고, 이는 생산성 저하와 스트레스로 이어지기 쉽습니다. <strong data-translate-key="pomodoro_technique">뽀모도로 테크닉</strong>은 이러한 문제에 대한 효과적인 해결책으로, 짧고 집중적인 작업 시간과 그에 따른 짧은 휴식 시간을 반복하여 두뇌의 피로도를 관리하고 지속적인 집중력을 유지하도록 돕는 과학적인 시간 관리 방법론입니다.',
            'pomodoro_technique': '뽀모도로 테크닉',
            'about_h3_1': '뽀모도로 테크닉이란?',
            'about_p_2': '1980년대 후반 프란체스코 시릴로(Francesco Cirillo)가 개발한 뽀모도로 테크닉은 간단하면서도 강력한 효과를 자랑합니다. 이 기법은 토마토 모양의 주방 타이머에서 이름을 따왔으며, 다음과 같은 기본적인 단계로 진행됩니다:',
            'step_1': '<strong>작업 목록 선정:</strong> 오늘 처리할 작업을 명확히 정의합니다.',
            'step_2': '<strong>타이머 설정:</strong> 25분(하나의 뽀모도로)으로 타이머를 설정합니다.',
            'step_3': '<strong>집중 작업:</strong> 타이머가 울릴 때까지 오직 하나의 작업에만 집중합니다. 방해 요소를 철저히 차단합니다.',
            'step_4': '<strong>짧은 휴식:</strong> 25분 후, 5분간 짧은 휴식을 취합니다. 이 시간 동안에는 작업을 완전히 잊고 몸과 마음을 편안하게 합니다.',
            'step_5': '<strong>긴 휴식:</strong> 네 번의 뽀모도로를 마친 후에는 15~30분간의 긴 휴식을 취합니다.',
            'about_p_3': '이러한 반복적인 패턴은 두뇌가 정보를 효율적으로 처리하고, 장시간의 집중으로 인한 피로를 효과적으로 해소하여 학습 및 작업 효율을 극대화하는 데 도움을 줍니다.',
            'about_h3_2': '이 뽀모도로 타이머의 차별점과 기능',
            'about_p_4': '저희 \'뽀모도로 타이머\'는 뽀모도로 테크닉을 일상에 쉽고 효과적으로 통합할 수 있도록 최적화된 웹 기반 애플리케이션입니다. 단순한 타이머를 넘어, 사용자의 생산성 여정을 지원하는 다양한 기능을 제공합니다:',
            'feature_2': '<strong>유연한 모드 전환:</strong> 25분의 \'집중\' 모드와 5분의 \'휴식\' 모드를 버튼 클릭 한 번으로 쉽게 전환할 수 있습니다. 각 모드에 맞춰 배경색이 부드럽게 전환되어 현재 상태를 시각적으로 명확히 알려줍니다.',
            'feature_3': '<strong>세련된 숫자 애니메이션:</strong> 시간이 흘러가는 모습을 시각적으로 아름답게 표현하는 숫자 애니메이션은 사용자가 시간에 대한 감각을 더 잘 인지하고 몰입하는 데 도움을 줍니다.',
            'feature_4': '<strong>다크/라이트 모드 지원:</strong> 사용자의 시각적 피로도를 줄이고 어떤 환경에서도 편안하게 사용할 수 있도록 다크/라이트 테마를 완벽하게 지원합니다. 시스템 설정을 자동으로 감지하며, 수동으로 \'자동\', \'라이트\', \'다크\' 모드를 자유롭게 전환할 수 있습니다.',
            'feature_5': '<strong>총 집중 시간 추적 및 일간 초기화:</strong> 오늘 하루 동안 순수하게 작업에 집중한 총 시간을 분과 초 단위로 정확하게 기록하고 표시합니다. 이 기록은 매일 자정을 기준으로 자동으로 초기화되어, 매일 새로운 마음으로 집중 목표를 설정하고 달성하는 데 동기를 부여합니다. 모든 데이터는 사용자의 로컬 브라우저에 저장되므로 개인 정보 유출 위험이 없습니다.',
            'feature_6': '<strong>강력하고 직관적인 컨트롤:</strong> \'시작\', \'일시정지\', \'재설정\' 버튼으로 타이머를 완벽하게 제어할 수 있습니다. 예상치 못한 방해나 급한 일 발생 시에도 유연하게 대응할 수 있습니다.',
            'about_h3_3': '어떻게 사용해야 할까요?',
            'about_p_5': '이 타이머를 최대한 활용하려면 다음 팁을 따르는 것이 좋습니다:',
            'tip_1': '<strong>방해 요소 제거:</strong> 뽀모도로 세션 시작 전에 알림을 끄고, 방해될 만한 요소를 미리 제거합니다.',
            'tip_2': '<strong>한 가지 작업에 집중:</strong> 25분 동안은 오직 한 가지 작업에만 몰두합니다. 다른 생각이 떠오르면 잠시 메모해두고 세션 후에 처리합니다.',
            'tip_3': '<strong>휴식은 휴식답게:</strong> 5분 휴식 시간에는 작업과 관련된 것을 피하고, 스트레칭, 물 마시기, 창밖 바라보기 등 가벼운 활동으로 재충전합니다.',
            'tip_4': '<strong>꾸준함이 핵심:</strong> 매일 꾸준히 뽀모도로 테크닉을 적용하여 집중하는 습관을 형성합니다.',
            'about_p_6': '저희 \'뽀모도로 타이머\'와 함께라면 당신의 생산성은 한 단계 더 성장할 것입니다. 지금 바로 시작하여 집중의 마법을 경험해 보세요!'
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
            'copyright': '© 2026 Pomodoro Timer. All rights reserved.',
            'about_h2_1': 'The Value of Pomodoro Technique and This Timer',
            'about_p_1': 'In modern society, focus is one of our most valuable resources. Amidst countless information and notifications, our attention is easily dispersed, leading to decreased productivity and stress. The <strong>Pomodoro Technique</strong> is an effective solution to this problem, a scientific time management methodology that helps manage brain fatigue and maintain continuous focus by alternating short, concentrated work periods with short breaks.',
            'pomodoro_technique': 'Pomodoro Technique',
            'about_h3_1': 'What is the Pomodoro Technique?',
            'about_p_2': 'Developed in the late 1980s by Francesco Cirillo, the Pomodoro Technique is simple yet powerful. Named after a tomato-shaped kitchen timer, this method proceeds through the following basic steps:',
            'step_1': '<strong>Select Tasks:</strong> Clearly define the tasks to be completed today.',
            'step_2': '<strong>Set the Timer:</strong> Set the timer for 25 minutes (one Pomodoro).',
            'step_3': '<strong>Focused Work:</strong> Concentrate solely on one task until the timer rings. Strictly eliminate distractions.',
            'step_4': '<strong>Short Break:</strong> After 25 minutes, take a 5-minute short break. During this time, completely forget about work and relax your body and mind.',
            'step_5': '<strong>Long Break:</strong> After completing four Pomodoros, take a long break of 15-30 minutes.',
            'about_p_3': 'This repetitive pattern helps the brain process information efficiently, effectively relieve fatigue from prolonged concentration, and maximize learning and work efficiency.',
            'about_h3_2': 'Distinguishing Features and Functions of This Pomodoro Timer',
            'about_p_4': 'Our \'Pomodoro Timer\' is a web-based application optimized to easily and effectively integrate the Pomodoro Technique into your daily life. Beyond a simple timer, it offers various features to support your productivity journey:',
            'feature_1': '<strong>Intuitive Interface:</strong> Cleanly designed with a minimalist approach to focus on the timer\'s core functionality. Start immediately without complex settings.',
            'feature_2': '<strong>Flexible Mode Switching:</strong> Easily switch between 25-minute \'Focus\' mode and 5-minute \'Break\' mode with a single button click. The background color smoothly transitions with each mode, visually indicating the current state.',
            'feature_3': '<strong>Stylish Number Animation:</strong> The visually appealing number animation showing time passing helps users better perceive time and immerse themselves.',
            'feature_4': '<strong>Dark/Light Mode Support:</strong> Fully supports dark/light themes to reduce eye strain and ensure comfortable use in any environment. It automatically detects system settings, and you can freely switch between \'Auto\', \'Light\', and \'Dark\' modes manually.',
            'feature_5': '<strong>Total Focus Time Tracking & Daily Reset:</strong> Accurately records and displays the total time purely focused on work today in minutes and seconds. This record automatically resets at midnight, motivating you to set and achieve new focus goals daily. All data is stored in your local browser, eliminating personal information leakage risks.',
            'feature_6': '<strong>Powerful and Intuitive Controls:</strong> Fully control the timer with \'Start\', \'Pause\', and \'Reset\' buttons. Flexibly respond to unexpected interruptions or urgent matters.',
            'about_h3_3': 'How to Use It?',
            'about_p_5': 'To maximize the use of this timer, we recommend following these tips:',
            'tip_1': '<strong>Eliminate Distractions:</strong> Before starting a Pomodoro session, turn off notifications and proactively remove any potential distractions.',
            'tip_2': '<strong>Focus on One Task:</strong> For 25 minutes, concentrate solely on one task. If other thoughts arise, jot them down and deal with them after the session.',
            'tip_3': '<strong>Break Like You Mean It:</strong> During the 5-minute break, avoid anything related to work and recharge with light activities like stretching, drinking water, or looking out the window.',
            'tip_4': '<strong>Consistency is Key:</strong> Consistently apply the Pomodoro Technique daily to form a habit of concentration.',
            'about_p_6': 'With our \'Pomodoro Timer\', your productivity will grow to the next level. Start now and experience the magic of focus!'
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
        const homeButton = document.querySelector('.home-btn');
        if (homeButton) homeButton.textContent = t.home;
        
        // Common elements: footer nav links and copyright
        document.querySelectorAll('footer nav a').forEach(link => {
            const key = link.getAttribute('href').replace('.html', '');
            if (t[key]) link.textContent = t[key];
        });
        const footerP = document.querySelector('footer p');
        if (footerP) footerP.textContent = t.copyright;

        // Update document title
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

        // Translate elements on subpages with data-translate-key
        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.getAttribute('data-translate-key');
            if (t[key]) {
                el.innerHTML = t[key];
            }
        });
        
        // Update total focus display if present
        if (totalFocusDisplay) {
            updateTotalFocusDisplay();
        }
    }

    function translateMainPageElements(lang) {
        const t = TRANSLATIONS[lang];
        if (startButton) startButton.title = isPaused ? t.start : t.pause;
        if (resetButton) resetButton.title = t.reset;

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
        const displayString = `${minutes}${TRANSLATIONS[lang]['minutes']} ${seconds}${TRANSLATIONS[lang]['seconds']}`;
        totalFocusDisplay.textContent = displayString;
        console.log(`updateTotalFocusDisplay called: totalFocusedSeconds=${totalFocusedSeconds}, displayString=${displayString}`);
    }



    // --- Drag functionality ---













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

        // Translate common elements on all pages
        translateElements(savedLang);

        // Only initialize timer-specific elements and functions if on the main page
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            if (document.getElementById('minutes-tens')) {


                updateModeIndicatorPosition(false); // Initial position without animation
                switchMode(currentMode); // This sets up the correct timer duration and ensures indicator is positioned
            }
            translateMainPageElements(savedLang); // Translate elements specific to index.html
        }
        updateTotalFocusDisplay();
    }

    init();
});