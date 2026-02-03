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

            'privacy_h2': 'Privacy Policy',
            'privacy_p_intro': 'Our <strong>\'Pomodoro Timer\'</strong> (hereinafter referred to as \'this service\') highly values your personal information and strictly adheres to relevant laws and regulations, including the 「Personal Information Protection Act」 and 「Act on Promotion of Information and Communications Network Utilization and Information Protection, etc.」. This Privacy Policy is established to clearly inform you about what information this service collects, how the collected information is used, and what efforts are made to protect personal information.',
            'privacy_h3_collection': '1. Purpose of Personal Information Collection and Use',
            'privacy_p_collection': 'This service is a web-based Pomodoro timer designed to help users improve productivity. <strong>We do not directly collect or store any personally identifiable information (e.g., name, email address, phone number, etc.).</strong> All functions of this service operate without personally identifiable information, prioritizing the protection of your privacy.',
            'privacy_h3_non_personal': '2. Collection and Use of Non-Personal Information',
            'privacy_p_non_personal_intro': 'This service stores the following non-personal information in your browser\'s Local Storage to improve user experience and provide functionality. This information cannot be used to identify or specify users and is maintained only within the browser.',
            'privacy_li_theme': '<strong>Theme Settings:</strong> Your selected dark/light mode settings (auto, light, dark) are saved in Local Storage to help maintain the same theme settings when you revisit the website.',
            'privacy_li_total_time': '<strong>Total Focus Time Record:</strong> The total time (in minutes and seconds) you have focused using this service is stored in Local Storage. This information is used solely for the purpose of providing productivity statistics and motivation for you, and is automatically reset at midnight based on your timezone. This information cannot identify you personally.',
            'privacy_h3_cookies': '3. Cookies and Similar Technologies',
            'privacy_p_cookies_intro': 'This service may use cookies and similar technologies to provide a better environment for users and to analyze website operations.',
            'privacy_li_adsense': '<strong>Google AdSense:</strong> This service displays advertisements through Google AdSense. Google AdSense may use cookies to provide advertisements tailored to user interests. In this process, Google and its partners may display advertisements based on your website visit history and other website visit information. For more information on Google\'s use of cookies, please refer to the <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">Google Advertising Policies & Terms</a>.',
            'privacy_li_cookies_reject': 'Users can refuse cookie collection or use the cookie deletion function through their web browser settings. However, if you refuse cookie collection, there may be some inconvenience in using certain services.',
            'privacy_h3_third_party': '4. Provision of Third-Party Services',
            'privacy_p_third_party': 'This service does not provide or share any user information with third parties other than Google AdSense. Information collection and use through Google AdSense are subject to Google\'s policies.',
            'privacy_h3_retention': '5. Retention and Destruction of Personal Information',
            'privacy_p_retention': 'Since this service does not collect personally identifiable information, it does not have a separate personal information destruction procedure. Non-personal information stored in Local Storage can be deleted at any time by the user directly deleting data in their web browser settings or by resetting the browser.',
            'privacy_h3_rights': '6. User Rights and How to Exercise Them',
            'privacy_p_rights': 'Users have the right to access or delete non-personal information stored in this service\'s Local Storage at any time. This can be done directly through the web browser\'s developer tools or settings menu.',
            'privacy_h3_security': '7. Efforts to Protect Personal Information',
            'privacy_p_security_intro': 'This service makes the following technical and administrative efforts to prevent personal information infringement and ensure the security of user information:',
            'privacy_li_no_pii': 'No collection of personally identifiable information: We fundamentally block the risk of information leakage by not collecting personally identifiable information in the first place.',
            'privacy_li_secure_server': 'Secure server operation: The service uses standard security protocols to provide a secure web environment.',
            'privacy_li_regular_check': 'Regular system inspection: We strive to check and improve the security vulnerabilities of the service.',
            'privacy_h3_contact': '8. Inquiries',
            'privacy_p_contact': 'If you have any questions or opinions about this Privacy Policy, please feel free to send an email to <a href="mailto:jeonggyeom01@gmail.com">jeonggyeom01@gmail.com</a>.',
            'privacy_h3_notification': '9. Obligation to Notify',
            'privacy_p_notification': 'This Privacy Policy may be changed due to changes in relevant laws and regulations, guidelines, or internal policies of this service. In the event of changes, we will immediately notify through this website, and significant changes will be clearly announced so that users can easily recognize them.',
            'privacy_p_effective_date': 'This Privacy Policy is effective from <strong>January 28, 2026</strong>.',

            'terms_h2': 'Terms of Service',
            'terms_p_intro': 'Thank you for using our <strong>\'Pomodoro Timer\'</strong> (hereinafter referred to as \'this service\' or \'we\'). These Terms of Service (hereinafter referred to as \'these Terms\') aim to define the rights, obligations, and responsibilities between us and the users (hereinafter referred to as \'Members\') regarding the use of this service. Your use of this service is considered an acceptance and agreement to all conditions specified in these Terms and the Privacy Policy, so please read these Terms carefully before using the service.',
            'terms_h3_service': '1. Provision of Service',
            'terms_p_service': '1.1 This service primarily aims to provide web-based Pomodoro timer functions and related information.\n1.2 This service is provided free of charge to Members without a separate registration process.\n1.3 This service may change or terminate service content at any time, in which case it will be announced through this website.',
            'terms_h3_agreement': '2. Agreement to Use of Service',
            'terms_p_agreement': '2.1 Your use of this service is considered an acceptance and agreement to all conditions specified in these Terms and the Privacy Policy.\n2.2 If you do not agree to these Terms, you cannot use this service.',
            'terms_h3_obligations': '3. Your Obligations',
            'terms_p_obligations_intro': '3.1 Members must comply with relevant laws and regulations, the provisions of these Terms, usage guides, and precautions notified by this service, and must not engage in any act that interferes with the operations of this service.\n3.2 Members must not use this service for illegal or inappropriate purposes. The following acts are strictly prohibited:',
            'terms_li_copyright': 'Infringement of copyrights or other rights of other Members or third parties',
            'terms_li_defamation': 'Defamation or damage to the reputation of other Members or third parties',
            'terms_li_falsehood': 'Dissemination of false information or acts that interfere with the business of others',
            'terms_li_malware': 'Dissemination of malicious programs such as computer viruses',
            'terms_li_interference': 'Acts that interfere with the operation of this service or pose a threat to the service',
            'terms_li_illegal': 'Other acts deemed illegal or inappropriate',
            'terms_h3_privacy': '4. Protection of Personal Information',
            'terms_p_privacy': '4.1 This service does not directly collect or store any personally identifiable information of Members.\n4.2 Non-personal information (e.g., theme settings) generated during service use is stored in the Member\'s browser\'s Local Storage, and is used solely for the purpose of providing service functions and improving user convenience. This information cannot identify individuals.\n4.3 When displaying advertisements through Google AdSense, Google may collect information using cookies. For more details, please refer to the <a href="privacy.html">Privacy Policy</a>.',
            'terms_h3_ip': '5. Intellectual Property Rights',
            'terms_p_ip': '5.1 Copyrights and other intellectual property rights to all content (text, design, images, audio, video, etc.) included in this service belong to the service provider.\n5.2 Members may not copy, distribute, display, sell, publish, or use the content of this service for any other purpose without the prior written consent of this service.',
            'terms_h3_disclaimer': '6. Disclaimer',
            'terms_p_disclaimer': '6.1 This service is a web-based service, and unpredictable technical failures or service interruptions may cause damage to Members. We strive to resolve such issues to the best of our ability, but we do not make any express or implied warranties regarding the stability, accuracy, or reliability of the service.\n6.2 This service is provided \'as is\', and disclaims all warranties, including suitability for a particular purpose, freedom from viruses and errors.\n6.3 We are not responsible for any direct, indirect, incidental, punitive damages, etc., arising from the Member\'s use of this service. (However, this excludes cases where liability cannot be denied by relevant laws and regulations.)',
            'terms_h3_changes': '7. Changes to Terms',
            'terms_p_changes': '7.1 This service may revise these Terms as necessary for operational, technical, or legal reasons.\n7.2 If the terms are revised, we will announce it through this website at least 7 days before the effective date of the revised terms. However, if the terms are revised to be unfavorable to Members, we will notify at least 30 days in advance.\n7.3 If a Member does not explicitly reject the revised terms or continues to use this service after the effective date of the changed terms, it is considered that the Member has agreed to the revised terms.',
            'terms_h3_governing_law': '8. Governing Law and Jurisdiction',
            'terms_p_governing_law': '8.1 The laws of the Republic of Korea shall apply to the interpretation of these Terms and disputes arising between this service and Members.\n8.2 For lawsuits arising from the use of the service, the court according to the procedures prescribed by relevant laws and regulations shall have jurisdiction.',
            'terms_h3_contact': '9. Inquiries',
            'terms_p_contact': 'If you have any questions or opinions about these Terms, please feel free to send an email to <a href="mailto:jeonggyeom01@gmail.com">jeonggyeom01@gmail.com</a>.',
            'terms_p_effective_date': 'These Terms of Service are effective from <strong>January 28, 2026</strong>.',

            'contact_h2': 'Contact Us',
            'contact_p_intro': 'If you have any questions, opinions, suggestions, or technical issues regarding our \'Pomodoro Timer\', please feel free to contact us. Your valuable feedback greatly helps us improve our service.',
            'contact_h3_email': '1. Email Inquiry',
            'contact_p_email_intro': 'The quickest and most efficient way to contact us is via email. Please send us detailed information to the email address below, and we will respond as quickly as possible after review.',
            'contact_p_email_info': 'When making inquiries, including the following information will help us assist you more promptly:',
            'contact_li_type': 'Inquiry type (e.g., feature suggestion, bug report, general inquiry, etc.)',
            'contact_li_details': 'Detailed inquiry (screenshots or relevant information are helpful)',
            'contact_h3_response_time': '2. Estimated Response Time',
            'contact_p_response_time': 'We strive to respond to all inquiries within 24 business hours. Inquiries on weekends or holidays will be processed sequentially on the next business day.',
            'contact_h3_feedback': '4. Feedback and Suggestions',
            'contact_p_feedback': 'We always listen to your feedback and suggestions. If you have any ideas for making our service better, please let us know. Your opinions are a great strength in the development of this service.',
            'contact_p_thanks': 'Thank you for using our service.'
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


    };

    document.addEventListener('DOMContentLoaded', window.initCommon);
})();