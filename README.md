# Pomodoro Timer

A simple and efficient web-based Pomodoro timer application designed to help you improve focus and productivity.

## 🌟 Features

*   **Pomodoro & Short Break Modes:** Easily switch between 25-minute focus sessions and 5-minute short breaks.
*   **Responsive Design:** Optimized for seamless experience across various devices and screen sizes.
*   **Dynamic Theme Switching:** Supports Light, Dark, and Dim themes to reduce eye strain and adapt to your environment.
*   **Multi-language Support:** Toggle between Korean (한국어) and English (English) for a personalized experience.
*   **Total Focus Time Tracking:** Keeps a record of your cumulative focus time, resetting daily to motivate new achievements.
*   **Stylized Digit Animations:** Visually engaging animations for the timer digits.
*   **Interactive Glow Effects:** Subtle glow effects on interactive elements enhance the user experience.
*   **Customizable Durations:** (Implicitly from `timer.js` `DURATIONS` object, though not exposed in UI yet, good to mention potential).

## 🚀 Technologies Used

*   **HTML5:** Structure and content.
*   **CSS3:** Styling and animations (minified with `cssnano`).
*   **JavaScript:** Core application logic, timer functionality, theme management, and internationalization (minified with `terser`).
*   **Node.js & npm:** For managing development dependencies and running build scripts.

## 🛠️ Setup and Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Reo365/Pomodoro-Timer.git
    cd Pomodoro-Timer
    ```
2.  **Install NPM packages:**
    ```bash
    npm install
    ```
3.  **Build the project (minify CSS and JS):**
    ```bash
    npm run build
    ```
    This command will generate `style.min.css`, `common.min.js`, and `timer.min.js` from their respective source files.

## 🚀 Usage

Simply open `index.html` in your web browser.

*   **Start/Pause:** Click the central play/pause button to start or pause the timer.
*   **Reset:** Click the reset button to set the timer back to the current mode's default duration.
*   **Switch Modes:** Use the "집중" (Focus) and "휴식" (Break) buttons to change between Pomodoro and Short Break modes.
*   **Theme Switcher:** Use the theme icons in the header to change the application's visual theme (Light, Dark, Dim).
*   **Language Switcher:** Click the globe icon in the header to toggle between Korean and English.

## 🗺️ Sitemap

The sitemap for the website can be found at: `sitemap.xml` (relative path) or `https://pomodoro.64bit.kr/sitemap.xml` (absolute path, if hosted).

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
