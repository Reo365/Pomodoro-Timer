# Pomodoro Timer (뽀모도로 타이머)

A simple and efficient web-based Pomodoro timer application designed to help you improve focus and productivity.
집중력과 생산성을 향상시키기 위해 고안된 간단하고 효율적인 웹 기반 뽀모도로 타이머 애플리케이션입니다.

## 🌐 웹사이트 (Website)

[https://pomodoro.64bit.kr/](https://pomodoro.64bit.kr/)

## 🌟 Features (주요 기능)

*   **Pomodoro & Short Break Modes:** Easily switch between 25-minute focus sessions and 5-minute short breaks.
    (**뽀모도로 및 짧은 휴식 모드:** 25분 집중 세션과 5분 짧은 휴식 시간 사이를 쉽게 전환할 수 있습니다.)
*   **Responsive Design:** Optimized for seamless experience across various devices and screen sizes.
    (**반응형 디자인:** 다양한 장치 및 화면 크기에서 원활한 경험을 위해 최적화되었습니다.)
*   **Dynamic Theme Switching:** Supports Light, Dark, and Dim themes to reduce eye strain and adapt to your environment.
    (**동적 테마 전환:** 눈의 피로를 줄이고 환경에 맞게 라이트, 다크, 딤 테마를 지원합니다.)
*   **Multi-language Support:** Toggle between Korean (한국어) and English (English) for a personalized experience.
    (**다국어 지원:** 개인화된 경험을 위해 한국어와 영어 사이를 전환할 수 있습니다.)
*   **Total Focus Time Tracking:** Keeps a record of your cumulative focus time, resetting daily to motivate new achievements.
    (**총 집중 시간 추적:** 누적 집중 시간을 기록하고 매일 초기화하여 새로운 목표 달성을 동기 부여합니다.)
*   **Stylized Digit Animations:** Visually engaging animations for the timer digits.
    (**스타일화된 숫자 애니메이션:** 타이머 숫자에 시각적으로 매력적인 애니메이션을 제공합니다.)
*   **Interactive Glow Effects:** Subtle glow effects on interactive elements enhance the user experience.
    (**인터랙티브 글로우 효과:** 인터랙티브 요소의 미묘한 글로우 효과가 사용자 경험을 향상시킵니다.)
*   **Customizable Durations:** (Implicitly from `timer.js` `DURATIONS` object, though not exposed in UI yet, good to mention potential).
    (**사용자 정의 가능한 시간:** (`timer.js`의 `DURATIONS` 객체에서 암시적으로, 아직 UI에 노출되지는 않았지만 잠재적으로 언급할 가치가 있습니다.)


## 🚀 Technologies Used (사용 기술)

*   **HTML5:** Structure and content. (구조 및 콘텐츠.)
*   **CSS3:** Styling and animations (minified with `cssnano`). (스타일링 및 애니메이션 (`cssnano`로 압축됨).)
*   **JavaScript:** Core application logic, timer functionality, theme management, and internationalization (minified with `terser`). (핵심 애플리케이션 로직, 타이머 기능, 테마 관리 및 국제화 (`terser`로 압축됨).)
*   **Node.js & npm:** For managing development dependencies and running build scripts. (개발 종속성 관리 및 빌드 스크립트 실행용.)

## 🛠️ Setup and Installation (설정 및 설치)

To get a local copy up and running, follow these simple steps.
로컬 환경에서 프로젝트를 설정하고 실행하려면 다음 간단한 단계를 따르세요.

### Prerequisites (필수 조건)

*   Node.js (LTS version recommended) (Node.js (LTS 버전 권장))
*   npm (comes with Node.js) (npm (Node.js에 포함됨))

### Installation (설치)

1.  **Clone the repository:** (저장소 복제:)
    ```bash
    git clone https://github.com/Reo365/Pomodoro-Timer.git
    cd Pomodoro-Timer
    ```
2.  **Install NPM packages:** (NPM 패키지 설치:)
    ```bash
    npm install
    ```
3.  **Build the project (minify CSS and JS):** (프로젝트 빌드 (CSS 및 JS 압축):)
    ```bash
    npm run build
    ```
    This command will generate `style.min.css`, `common.min.js`, and `timer.min.js` from their respective source files.
    (이 명령은 각 소스 파일로부터 `style.min.css`, `common.min.js`, `timer.min.js`를 생성합니다.)

## 🚀 Usage (사용법)

Simply open `index.html` in your web browser.
`index.html` 파일을 웹 브라우저에서 엽니다.

*   **Start/Pause:** Click the central play/pause button to start or pause the timer.
    (**시작/일시정지:** 중앙의 재생/일시정지 버튼을 클릭하여 타이머를 시작하거나 일시정지합니다.)
*   **Reset:** Click the reset button to set the timer back to the current mode's default duration.
    (**초기화:** 초기화 버튼을 클릭하여 타이머를 현재 모드의 기본 시간으로 되돌립니다.)
*   **Switch Modes:** Use the "집중" (Focus) and "휴식" (Break) buttons to change between Pomodoro and Short Break modes.
    (**모드 전환:** "집중" 및 "휴식" 버튼을 사용하여 뽀모도로 모드와 짧은 휴식 모드 사이를 전환합니다.)
*   **Theme Switcher:** Use the theme icons in the header to change the application's visual theme (Light, Dark, Dim).
    (**테마 전환:** 헤더의 테마 아이콘을 사용하여 애플리케이션의 시각적 테마(라이트, 다크, 딤)를 변경합니다.)
*   **Language Switcher:** Click the globe icon in the header to toggle between Korean and English.
    (**언어 전환:** 헤더의 지구본 아이콘을 클릭하여 한국어와 영어 사이를 전환합니다.)

## 🗺️ Sitemap (사이트맵)

The sitemap for the website can be found at: `sitemap.xml` (relative path) or `https://pomodoro.64bit.kr/sitemap.xml` (absolute path, if hosted).
(웹사이트 사이트맵은 다음에서 찾을 수 있습니다: `sitemap.xml` (상대 경로) 또는 `https://pomodoro.64bit.kr/sitemap.xml` (호스팅된 경우 절대 경로).)

## 🤝 Contributing (기여하기)

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.
(기여를 환영합니다! 개선 사항이나 새로운 기능에 대한 제안이 있다면 이슈를 열거나 풀 리퀘스트를 제출해주세요.)

## 📄 License (라이선스)

This project is licensed under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International Public License (CC BY-NC-ND 4.0)**.
(이 프로젝트는 **크리에이티브 커먼즈 저작자표시-비영리-변경금지 4.0 국제 공개 라이선스(CC BY-NC-ND 4.0)**에 따라 라이선스됩니다.)

**In summary, this means:** (요약하자면 다음을 의미합니다:)
*   You must give appropriate credit. (적절한 출처를 표기해야 합니다.)
*   You may not use the material for commercial purposes. (이 자료를 상업적 목적으로 사용할 수 없습니다.)
*   If you remix, transform, or build upon the material, you may not distribute the modified material. You may only share the work in its original form. (자료를 리믹스, 변형하거나 기반으로 하여 제작하는 경우, 수정된 자료를 배포할 수 없습니다. 원본 형태 그대로만 공유할 수 있습니다.)

For more details, please see the `LICENSE` file.
(자세한 내용은 `LICENSE` 파일을 참조하세요.)
