document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.querySelector('.timer-display');
    const minutesRoller = timerDisplay.querySelector('.time-roller:nth-child(1)');
    const secondsRoller = timerDisplay.querySelector('.time-roller:nth-child(3)');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const startButton = document.getElementById('start-btn');
    const resetButton = document.getElementById('reset-btn');
    const totalFocusDisplay = document.getElementById('total-focus-display');
    const background = document.querySelector('.background');

    let totalSeconds = 25 * 60; // Default Pomodoro
    let intervalId = null;
    let isPaused = true;
    let currentMode = 'pomodoro'; // 'pomodoro' or 'shortBreak'
    let totalFocusedMinutes = parseInt(localStorage.getItem('totalFocusedMinutes')) || 0;

    const pomodoroDuration = 25 * 60;
    const shortBreakDuration = 5 * 60;

    // --- Utility Functions ---
    function updateDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        updateRoller(minutesRoller, minutes);
        updateRoller(secondsRoller, seconds);
    }

    function updateRoller(rollerElement, value) {
        const currentDigits = Array.from(rollerElement.children).map(span => parseInt(span.textContent));
        const newDigits = String(value).padStart(2, '0').split('').map(Number);

        newDigits.forEach((newDigit, index) => {
            const currentSpan = rollerElement.children[index];
            if (!currentSpan || parseInt(currentSpan.textContent) !== newDigit) {
                const oldSpan = currentSpan ? currentSpan : document.createElement('span');
                if (!currentSpan) {
                    oldSpan.classList.add('digit');
                    rollerElement.appendChild(oldSpan);
                }

                const newSpan = document.createElement('span');
                newSpan.classList.add('digit');
                newSpan.textContent = newDigit;

                // Position new digit below
                newSpan.style.transform = 'translateY(100%)';
                newSpan.style.opacity = '0';
                rollerElement.appendChild(newSpan);

                // Animate old digit up and new digit in
                setTimeout(() => {
                    if (oldSpan) {
                        oldSpan.style.transform = 'translateY(-100%)';
                        oldSpan.style.opacity = '0';
                    }
                    newSpan.style.transform = 'translateY(0)';
                    newSpan.style.opacity = '1';
                }, 10); // Small delay for rendering

                // Clean up old digit after animation
                setTimeout(() => {
                    if (oldSpan && rollerElement.contains(oldSpan) && oldSpan !== newSpan) {
                        rollerElement.removeChild(oldSpan);
                    }
                }, 600); // Should match CSS transition duration
            }
        });
        // Remove extra digits if the new value has fewer digits (e.g., 100 -> 99)
        while (rollerElement.children.length > newDigits.length) {
            const childToRemove = rollerElement.children[rollerElement.children.length - 1];
            childToRemove.style.transform = 'translateY(-100%)';
            childToRemove.style.opacity = '0';
            setTimeout(() => {
                if (rollerElement.contains(childToRemove)) {
                    rollerElement.removeChild(childToRemove);
                }
            }, 600);
        }
    }


    function startTimer() {
        isPaused = false;
        startButton.classList.add('paused');
        startButton.innerHTML = ''; // Clear existing content
        startButton.title = '일시정지';

        intervalId = setInterval(() => {
            totalSeconds--;
            updateDisplay();
            updateBackgroundGradient(totalSeconds);

            if (totalSeconds < 0) {
                clearInterval(intervalId);
                isPaused = true;
                startButton.classList.remove('paused');
                startButton.title = '시작';
                alert('시간이 종료되었습니다!');
                // Auto-switch mode or play sound
            }
        }, 1000);
    }

    function pauseTimer() {
        isPaused = true;
        clearInterval(intervalId);
        startButton.classList.remove('paused');
        startButton.title = '시작';
    }

    function resetTimer() {
        pauseTimer();
        if (currentMode === 'pomodoro') {
            totalSeconds = pomodoroDuration;
        } else if (currentMode === 'shortBreak') {
            totalSeconds = shortBreakDuration;
        }
        updateDisplay();
        // Reset background gradient to initial mode color
        updateBackgroundGradient(totalSeconds, true);
    }

    function switchMode(mode) {
        if (currentMode === 'pomodoro' && mode === 'shortBreak' && !isPaused) {
            // When switching from pomodoro to short break,
            // we should account for the completed focus time
            const focusedSeconds = pomodoroDuration - totalSeconds;
            totalFocusedMinutes += Math.floor(focusedSeconds / 60);
            localStorage.setItem('totalFocusedMinutes', totalFocusedMinutes);
            updateTotalFocusDisplay();
        }

        currentMode = mode;
        modeButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.mode-btn[data-mode="${mode}"]`).classList.add('active');
        resetTimer();
    }

    function updateTotalFocusDisplay() {
        totalFocusDisplay.textContent = `${totalFocusedMinutes}분`;
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', () => {
        if (isPaused) {
            startTimer();
        } else {
            pauseTimer();
        }
    });

    resetButton.addEventListener('click', resetTimer);

    modeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            switchMode(mode);
        });
    });

    // --- Background Interaction and Dynamic Gradient ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateBackground() {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        const bgX = (targetX / window.innerWidth - 0.5) * 50; // -25 to 25
        const bgY = (targetY / window.innerHeight - 0.5) * 50; // -25 to 25

        background.style.backgroundPosition = `${50 + bgX}% ${50 + bgY}%`;
        requestAnimationFrame(animateBackground);
    }

    const colorPalette = {
        pomodoro: [
            ['#ffafbd', '#ffc3a0'], // Start
            ['#a1c4fd', '#c2e59c']  // End
        ],
        shortBreak: [
            ['#d4fc79', '#96e6a1'], // Start
            ['#a18cd1', '#fbc2eb']  // End
        ]
    };

    function interpolateColor(color1, color2, factor) {
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16);
            const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16);
            const c = Math.round(c1 + factor * (c2 - c1));
            result[i] = (c < 16 ? '0' : '') + c.toString(16);
        }
        return `#${result.join('')}`;
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return [r, g, b];
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function lerpColor(a, b, amount) { 
        const ar = a >> 16,
              ag = (a & 0x00ff00) >> 8,
              ab = (a & 0x0000ff);
    
        const br = b >> 16,
              bg = (b & 0x00ff00) >> 8,
              bb = (b & 0x0000ff);
    
        const rr = ar + amount * (br - ar);
        const rg = ag + amount * (bg - ag);
        const rb = ab + amount * (bb - ab);
    
        return ((rr << 16) + (rg << 8) + (rb | 0));
    }

    function updateBackgroundGradient(secondsLeft, reset = false) {
        let duration = currentMode === 'pomodoro' ? pomodoroDuration : shortBreakDuration;
        if (reset) {
            duration = currentMode === 'pomodoro' ? pomodoroDuration : shortBreakDuration;
            secondsLeft = duration; // Set to full duration to get initial color
        }
        
        const progress = 1 - (secondsLeft / duration); // 0 at start, 1 at end

        const [startColor1, startColor2] = colorPalette[currentMode][0].map(hexToRgb);
        const [endColor1, endColor2] = colorPalette[currentMode][1].map(hexToRgb);

        const currentC1_R = Math.round(startColor1[0] + progress * (endColor1[0] - startColor1[0]));
        const currentC1_G = Math.round(startColor1[1] + progress * (endColor1[1] - startColor1[1]));
        const currentC1_B = Math.round(startColor1[2] + progress * (endColor1[2] - startColor1[2]));

        const currentC2_R = Math.round(startColor2[0] + progress * (endColor2[0] - startColor2[0]));
        const currentC2_G = Math.round(startColor2[1] + progress * (endColor2[1] - startColor2[1]));
        const currentC2_B = Math.round(startColor2[2] + progress * (endColor2[2] - startColor2[2]));

        document.documentElement.style.setProperty('--bg-color-1', rgbToHex(currentC1_R, currentC1_G, currentC1_B));
        document.documentElement.style.setProperty('--bg-color-2', rgbToHex(currentC2_R, currentC2_G, currentC2_B));
    }


    // --- Initialization ---
    function init() {
        updateDisplay();
        updateTotalFocusDisplay();
        animateBackground(); // Start mouse parallax effect
        updateBackgroundGradient(totalSeconds, true); // Initialize background color
    }

    init();
});