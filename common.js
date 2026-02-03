// common.js
// Expose global variables and functions for access across different scripts.
(function() {
    window.htmlElement = document.getElementById('app-html');
    
    window.TRANSLATIONS = {
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
            'about_h2_main': '집중력을 높이는 가장 현명한 선택, 뽀모도로 타이머',
            'about_p_intro': '현대 사회의 복잡한 환경 속에서 흐트러지기 쉬운 집중력. <strong data-translate-key="pomodoro_technique">뽀모도로 테크닉</strong>은 짧고 효과적인 작업 주기와 적절한 휴식을 통해 당신의 집중력을 최대로 끌어올리고, 생산성을 극대화하는 검증된 시간 관리 방법입니다. 저희 \'뽀모도로 타이머\'는 이 강력한 테크닉을 웹에서 가장 직관적이고 아름답게 경험할 수 있도록 설계되었습니다.',
            'pomodoro_technique': '뽀모도로 테크닉',
            'about_h3_why': '왜 \'뽀모도로 타이머\'를 선택해야 할까요?',
            'about_p_why_main': '저희 타이머는 단순한 시간 측정 도구를 넘어, 당신의 생산성 여정에 함께하는 파트너입니다.',
            'feature_1': '<strong>직관적이고 아름다운 디자인:</strong> 불필요한 요소를 제거하고, 오직 당신의 집중을 위해 최적화된 깔끔한 인터페이스를 제공합니다.',
            'feature_2': '<strong>스마트한 테마 전환:</strong> 주변 환경에 맞춰 자동으로, 혹은 수동으로 라이트/다크 모드를 전환하여 눈의 피로를 줄여줍니다.',
            'feature_3': '<strong>총 집중 시간 기록:</strong> 매일매일 당신이 순수하게 집중한 시간을 기록하고, 자정에 자동 초기화하여 새로운 시작을 돕습니다. 모든 데이터는 로컬 브라우저에 안전하게 저장됩니다.',
            'feature_4': '<strong>완벽한 컨트롤:</strong> 시작, 일시정지, 재설정 기능을 통해 언제든 타이머를 완벽하게 제어할 수 있습니다.',
            'about_h3_get_started': '지금 바로 시작하세요!',
            'about_p_get_started': '복잡한 설정 없이, 클릭 한 번으로 당신의 집중력을 깨우세요. \'뽀모도로 타이머\'와 함께라면 당신의 매일은 더욱 생산적이고 만족스러워질 것입니다.',
            
            // New content for index.html
            'index_h2_pomodoro_intro': '뽀모도로 타이머: 집중력 향상을 위한 최고의 도구',
            'index_p_pomodoro_what_is': '\'뽀모도로 타이머\'는 시간을 효율적으로 관리하고 생산성을 극대화하기 위한 검증된 시간 관리 방법인 뽀모도로 테크닉을 웹 기반으로 구현한 도구입니다. 25분 집중, 5분 휴식의 반복을 통해 업무나 학습에 대한 몰입도를 높이고 지루함과 피로감을 줄여줍니다.',
            'index_h3_how_to_use': '뽀모도로 테크닉 작동 방식',
            'index_li_step1': '<strong>집중 시간 설정:</strong> 이 타이머를 25분으로 설정하고, 방해받지 않고 오직 한 가지 작업에만 집중합니다.',
            'index_li_step2': '<strong>휴식 시간:</strong> 25분이 끝나면 짧은 5분 휴식을 취합니다. 이 시간 동안에는 완전히 쉬고, 다음 집중 시간을 준비합니다.',
            'index_li_step3': '<strong>반복:</strong> 4번의 뽀모도로(집중 시간)가 끝나면, 20-30분의 긴 휴식을 취하며 재충전합니다.',
            'index_h3_benefits': '뽀모도로 테크닉의 이점',
            'index_li_benefit1': '<strong>집중력 강화:</strong> 짧은 집중 시간은 업무에 대한 저항을 줄이고, 높은 몰입도를 유지하게 돕습니다.',
            'index_li_benefit2': '<strong>생산성 향상:</strong> 시간 제한은 불필요한 작업을 줄이고, 중요한 일에 집중하게 만들어 더 많은 일을 해낼 수 있습니다.',
            'index_li_benefit3': '<strong>번아웃 방지:</strong> 규칙적인 휴식은 정신적, 육체적 피로를 예방하여 장기적인 생산성을 유지하는 데 기여합니다.',
            'index_li_benefit4': '<strong>시간 관리 능력 향상:</strong> 작업 시간을 측정하고 기록하면서 자신의 생산성 패턴을 파악하고 개선할 수 있습니다.',
            'index_h3_tips': '더 효과적인 사용 팁',
            'index_li_tip1': '<strong>방해 요소 제거:</strong> 뽀모도로가 시작되면 모든 알림을 끄고, 집중을 방해하는 요소를 차단하세요.',
            'index_li_tip2': '<strong>작업 목록 준비:</strong> 시작하기 전에 오늘 할 일 목록을 작성하여 무엇에 집중할지 명확히 합니다.',
            'index_li_tip3': '<strong>휴식은 휴식답게:</strong> 짧은 휴식 시간에는 자리에서 일어나 스트레칭을 하거나 물을 마시는 등 가벼운 활동을 하세요. 이메일 확인이나 소셜 미디어는 피하는 것이 좋습니다.',
            'index_p_call_to_action': '지금 바로 \'뽀모도로 타이머\'를 시작하여 당신의 생산성 잠재력을 최대로 끌어올리세요!'

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
            'about_h2_main': 'The Smartest Choice for Boosting Focus, Pomodoro Timer',
            'about_p_intro': 'In today\'s complex world, focus is easily disrupted. The <strong>Pomodoro Technique</strong> is a proven time management method that maximizes your concentration and productivity through short, effective work cycles and appropriate breaks. Our \'Pomodoro Timer\' is designed to provide the most intuitive and beautiful web experience of this powerful technique.',
            'pomodoro_technique': 'Pomodoro Technique',
            'about_h3_why': 'Why Choose the \'Pomodoro Timer\'?',
            'about_p_why_main': 'Our timer is more than just a time measurement tool; it\'s a partner in your productivity journey.',
            'feature_1': '<strong>Intuitive and Beautiful Design:</strong> We\'ve removed unnecessary elements, providing a clean interface optimized solely for your focus.',
            'feature_2': '<strong>Smart Theme Switching:</strong> Automatically or manually switch between light/dark modes to reduce eye strain, adapting to your environment.',
            'feature_3': '<strong>Total Focus Time Tracking:</strong> Records your pure focus time daily, resetting automatically at midnight to help you start fresh. All data is securely stored in your local browser.',
            'feature_4': '<strong>Complete Control:</strong> With Start, Pause, and Reset functions, you have full control over the timer at any time.',
            'about_h3_get_started': 'Start Now!',
            'about_p_get_started': 'Unlock your focus with a single click, no complex settings required. With the \'Pomodoro Timer\', your every day will be more productive and satisfying.',

            // New content for index.html
            'index_h2_pomodoro_intro': 'Pomodoro Timer: Your Ultimate Focus Tool',
            'index_p_pomodoro_what_is': 'The \'Pomodoro Timer\' is a web-based tool implementing the Pomodoro Technique, a proven time management method to boost efficiency. It enhances focus and reduces fatigue by alternating 25-minute work sessions with 5-minute breaks.',
            'index_h3_how_to_use': 'How the Pomodoro Technique Works',
            'index_li_step1': '<strong>Set Focus Time:</strong> Set the timer for 25 minutes and concentrate on a single task without interruptions.',
            'index_li_step2': '<strong>Take a Break:</strong> After 25 minutes, take a short 5-minute break to rest and prepare for the next session.',
            'index_li_step3': '<strong>Repeat:</strong> After four Pomodoros (focus sessions), take a longer break of 20-30 minutes to recharge.',
            'index_h3_benefits': 'Benefits of the Pomodoro Technique',
            'index_li_benefit1': '<strong>Enhanced Concentration:</strong> Short focus periods reduce resistance to tasks and maintain high engagement.',
            'index_li_benefit2': '<strong>Increased Productivity:</strong> Time limits minimize unnecessary tasks, keeping you focused on important work and boosting output.',
            'index_li_benefit3': '<strong>Burnout Prevention:</strong> Regular breaks prevent mental and physical fatigue, contributing to long-term productivity.',
            'index_li_benefit4': '<strong>Improved Time Management:</strong> Tracking work time helps you understand and improve your productivity patterns.',
            'index_h3_tips': 'Tips for Effective Use',
            'index_li_tip1': '<strong>Eliminate Distractions:</strong> Turn off all notifications and block distractions once a Pomodoro begins.',
            'index_li_tip2': '<strong>Prepare Task List:</strong> Before starting, make a list of tasks to clarify what to focus on.',
            'index_li_tip3': '<strong>Real Breaks:</strong> During short breaks, stand up, stretch, or drink water. Avoid checking emails or social media.',
            'index_p_call_to_action': 'Start your \'Pomodoro Timer\' now to unlock your full productivity potential!'
        }
    };

    window.getSystemTheme = function() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    window.applyTheme = function(theme, save = true) {
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-dim');

        let themeToApply = theme;
        if (theme === 'auto') {
            themeToApply = window.getSystemTheme();
        }

        document.body.classList.add(`theme-${themeToApply}`);

        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.checked = (radio.value === theme);
        });

        if (save) {
            localStorage.setItem('themePreference', theme);
        }
    };

    window.setLanguage = function(lang) {
        window.htmlElement.lang = lang;
        localStorage.setItem('langPreference', lang);
        window.translateElements(lang);
    };

    window.translateElements = function(lang) {
        const t = window.TRANSLATIONS[lang];
        const homeButton = document.querySelector('.home-btn');
        if (homeButton) homeButton.textContent = t.home;
        
        document.querySelectorAll('footer nav a').forEach(link => {
            const key = link.getAttribute('href').replace('.html', '');
            if (t[key]) link.textContent = t[key];
        });
        const footerP = document.querySelector('footer p');
        if (footerP) footerP.textContent = t.copyright;

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

        document.querySelectorAll('[data-translate-key]').forEach(el => {
            const key = el.getAttribute('data-translate-key');
            if (t[key]) {
                el.innerHTML = t[key];
            }
        });

        // If total focus display is present and its update function exists, call it
        if (typeof window.updateTotalFocusDisplay === 'function') {
            window.updateTotalFocusDisplay();
        }
    };
    


    window.setupCommonEventListeners = function() {
        const langToggleButton = document.querySelector('.lang-toggle-btn');
        if (langToggleButton) {
            langToggleButton.addEventListener('click', () => {
                const currentLang = window.htmlElement.lang;
                const newLang = currentLang === 'ko' ? 'en' : 'ko';
                window.setLanguage(newLang);
            });
        }

        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                window.applyTheme(e.target.value);
            });
        });

            };

    window.initCommon = function() {
        const savedLang = localStorage.getItem('langPreference') || 'ko';
        const savedTheme = localStorage.getItem('themePreference') || 'light';

        // Apply theme immediately using the global function
        window.applyTheme(savedTheme, false);
        window.setLanguage(savedLang); // This will also call translateElements
        window.setupCommonEventListeners();

        // Lazy load content on scroll for index.html
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            const lazyLoadSection = document.querySelector('.intro-pomodoro-section');
            if (lazyLoadSection) {
                const revealContentOnScroll = () => {
                    // Check if the section is 70% visible in the viewport
                    const rect = lazyLoadSection.getBoundingClientRect();
                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                    const isVisible = rect.top <= viewportHeight * 0.75; // Adjust threshold as needed (e.g., 0.75 for 75% of viewport height)
                    
                    if (isVisible) {
                        lazyLoadSection.style.display = 'block'; // Ensure display is block before making it visible
                        lazyLoadSection.classList.add('is-visible');
                        window.removeEventListener('scroll', revealContentOnScroll);
                    }
                };

                window.addEventListener('scroll', revealContentOnScroll);
            }
        }
    };

    document.addEventListener('DOMContentLoaded', window.initCommon);
})();