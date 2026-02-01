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
            'about_p_get_started': '복잡한 설정 없이, 클릭 한 번으로 당신의 집중력을 깨우세요. \'뽀모도로 타이머\'와 함께라면 당신의 매일은 더욱 생산적이고 만족스러워질 것입니다.'
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
            'about_h3_why': 'Why Choose the \'Pomodoro Timer\ его?',
            'about_p_why_main': 'Our timer is more than just a time measurement tool; it\'s a partner in your productivity journey.',
            'feature_1': '<strong>Intuitive and Beautiful Design:</strong> We\'ve removed unnecessary elements, providing a clean interface optimized solely for your focus.',
            'feature_2': '<strong>Smart Theme Switching:</strong> Automatically or manually switch between light/dark modes to reduce eye strain, adapting to your environment.',
            'feature_3': '<strong>Total Focus Time Tracking:</strong> Records your pure focus time daily, resetting automatically at midnight to help you start fresh. All data is securely stored in your local browser.',
            'feature_4': '<strong>Complete Control:</strong> With Start, Pause, and Reset functions, you have full control over the timer at any time.',
            'about_h3_get_started': 'Start Now!',
            'about_p_get_started': 'Unlock your focus with a single click, no complex settings required. With the \'Pomodoro Timer\', your every day will be more productive and satisfying.'
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
    
    window.GLOW_PROXIMITY_THRESHOLD = 150; // px

    window.updateGlow = function(event) {
        const glowElements = document.querySelectorAll('.has-glow-border');
        glowElements.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const distanceX = event.clientX - centerX;
            const distanceY = event.clientY - centerY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < window.GLOW_PROXIMITY_THRESHOLD) {
                const opacity = 1 - (distance / window.GLOW_PROXIMITY_THRESHOLD);
                const blur = opacity * 10;
                
                let angle = Math.atan2(distanceY, distanceX) * 180 / Math.PI;
                angle = angle < 0 ? angle + 360 : angle;

                card.style.setProperty('--glow-angle', angle + 90);
                card.style.setProperty('--glow-opacity', opacity);
                card.style.setProperty('--glow-blur', blur);
            } else {
                card.style.setProperty('--glow-opacity', 0);
            }
        });
    };

    window.hideGlow = function(event) {
        const glowElements = document.querySelectorAll('.has-glow-border');
        glowElements.forEach(card => {
            card.style.setProperty('--glow-opacity', 0);
        });
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

        document.addEventListener('pointermove', window.updateGlow);
        document.addEventListener('pointerleave', window.hideGlow);
    };

    window.initCommon = function() {
        const savedLang = localStorage.getItem('langPreference') || 'ko';
        const savedTheme = localStorage.getItem('themePreference') || 'light';

        // Apply theme immediately using the global function
        window.applyTheme(savedTheme, false);
        window.setLanguage(savedLang); // This will also call translateElements
        window.setupCommonEventListeners();
    };

    document.addEventListener('DOMContentLoaded', window.initCommon);
})();
