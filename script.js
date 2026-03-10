document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. LIGHT / DARK MODE TOGGLE FEATURE
       ========================================================= */
    const themeBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    // Check memory for theme preference on load
    if (currentTheme === "light") {
        document.body.classList.add("light-mode");
        if(themeBtn) themeBtn.textContent = "🌙"; // Show moon icon if in light mode
    }

    // Toggle theme on button click
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            // Save preference to localStorage
            if (document.body.classList.contains("light-mode")) {
                localStorage.setItem("theme", "light");
                themeBtn.textContent = "🌙";
            } else {
                localStorage.setItem("theme", "dark");
                themeBtn.textContent = "☀️";
            }
        });
    }

    /* =========================================================
       2. PERSONALIZED NAV GREETING (LOGIN STATE)
       ========================================================= */
    // Checks if a username is saved in localStorage and updates the navbar
    const loggedInUser = localStorage.getItem("username");
    const navbar = document.querySelector(".navbar");
    if (loggedInUser && navbar) {
        const loginLink = navbar.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = `Welcome, ${loggedInUser}!`;
            loginLink.href = "#"; 
            
            // Create a logout button dynamically
            const logoutLink = document.createElement("a");
            logoutLink.href = "#";
            logoutLink.textContent = "(Logout)";
            logoutLink.onclick = () => {
                localStorage.removeItem("username");
                window.location.reload(); // Refresh page to reset nav
            };
            navbar.insertBefore(logoutLink, document.getElementById("theme-toggle"));
        }
    }

    /* =========================================================
       3. TYPEWRITER EFFECT (HOME PAGE)
       ========================================================= */
    // Simulates typing out the main heading character by character
    const typingElement = document.getElementById("typing-effect");
    if (typingElement) {
        const text = "Games Learning Center";
        let i = 0;
        typingElement.innerHTML = "";
        function typeWriter() {
            if (i < text.length) {
                typingElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100); // 100ms delay between letters
            }
        }
        typeWriter();
    }

    /* =========================================================
       4. IMAGE CAROUSEL / SLIDER (HOME PAGE)
       ========================================================= */
    // Cycles through elements with the class 'carousel-slide' every 3 seconds
    const slides = document.querySelectorAll(".carousel-slide");
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].style.display = "none";
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].style.display = "block";
            slides[currentSlide].style.animation = "fadeInSlideUp 0.8s ease-in-out";
        }, 3000);
    }

    /* =========================================================
       5. PASSWORD TOGGLE EYE ICON
       ========================================================= */
    // Changes input type between 'password' and 'text'
    const togglePasswords = document.querySelectorAll(".toggle-password");
    togglePasswords.forEach(toggle => {
        toggle.addEventListener("click", function () {
            const input = this.previousElementSibling;
            if (input.type === "password") {
                input.type = "text";
                this.textContent = "🙈";
            } else {
                input.type = "password";
                this.textContent = "👁️";
            }
        });
    });

    /* =========================================================
       6. PASSWORD STRENGTH & MATCH VALIDATION (SIGNUP)
       ========================================================= */
    const passInput = document.getElementById("signup-password");
    const confirmInput = document.getElementById("signup-confirm");
    const strengthBar = document.getElementById("strength-bar");
    const matchText = document.getElementById("match-text");

    // Calculate password strength dynamically as user types
    if (passInput && strengthBar) {
        passInput.addEventListener("input", function() {
            let val = this.value;
            let strength = 0;
            if (val.length > 5) strength += 33; // Length check
            if (val.match(/[A-Z]/) && val.match(/[0-9]/)) strength += 33; // Complexity check
            if (val.match(/[^a-zA-Z0-9]/)) strength += 34; // Special character check
            
            strengthBar.style.width = strength + "%";
            if (strength < 34) strengthBar.style.backgroundColor = "red";
            else if (strength < 67) strengthBar.style.backgroundColor = "orange";
            else strengthBar.style.backgroundColor = "green";
        });
    }

    // Instantly verify if "Password" and "Confirm Password" inputs match
    if (confirmInput && passInput) {
        confirmInput.addEventListener("input", function() {
            if (this.value === passInput.value && this.value !== "") {
                matchText.textContent = "✅ Passwords match";
                matchText.style.color = "green";
            } else {
                matchText.textContent = "❌ Passwords do not match";
                matchText.style.color = "red";
            }
        });
    }

    /* =========================================================
       7. FORM SUBMIT ACTIONS & SHAKE ANIMATION
       ========================================================= */
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            // Dummy logic: Save username on login to demonstrate personalized greeting
            if(form.id === "login-form") {
                const user = form.querySelector('input[type="text"]').value;
                localStorage.setItem("username", user);
            }

            // Prevent submission and trigger CSS shake animation if passwords don't match
            if (form.id === "signup-form" && passInput.value !== confirmInput.value) {
                e.preventDefault();
                form.classList.add("shake");
                setTimeout(() => form.classList.remove("shake"), 500); // Remove class to allow re-shake
            }
        });
    });

    /* =========================================================
       8. DRAG-AND-DROP FILE UPLOAD VALIDATOR
       ========================================================= */
    const dropZones = document.querySelectorAll(".drop-zone");
    dropZones.forEach(zone => {
        const input = zone.querySelector("input[type='file']");
        const previewDiv = zone.querySelector(".preview-container");

        // Allow clicking the zone to open file browser
        zone.addEventListener("click", () => input.click());
        
        // Visual effects for dragging over
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.style.borderColor = "#bb86fc";
        });
        zone.addEventListener("dragleave", () => {
            zone.style.borderColor = "#444";
        });

        // Handle file drop
        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.style.borderColor = "#444";
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                handleFile(input.files[0], previewDiv);
            }
        });

        // Handle traditional file input change
        input.addEventListener("change", function() {
            if (this.files.length) handleFile(this.files[0], previewDiv);
        });
    });

    // Validates file size/type and generates a preview thumbnail
    function handleFile(file, previewDiv) {
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB Limit
            alert("File size must be less than 2MB.");
            return;
        }
        // Generate circular image preview
        if(previewDiv) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewDiv.innerHTML = `<img src="${e.target.result}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-top: 10px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            alert(`File "${file.name}" ready for upload!`); 
        }
    }

    /* =========================================================
       9. PHONE NUMBER FORMATTER (FEEDBACK PAGE)
       ========================================================= */
    // Automatically formats input to (123) 456-7890 format
    const phoneInput = document.getElementById("phone-input");
    if (phoneInput) {
        phoneInput.addEventListener("input", function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    /* =========================================================
       10. STAR RATING SYSTEM (FEEDBACK PAGE)
       ========================================================= */
    const stars = document.querySelectorAll(".star-rating span");
    let currentRating = 0;
    stars.forEach(star => {
        star.addEventListener("click", function() {
            currentRating = this.getAttribute("data-value");
            // Highlights all stars up to the clicked value
            stars.forEach(s => s.style.color = s.getAttribute("data-value") <= currentRating ? "#FFD700" : "");
        });
    });

    /* =========================================================
       11. INTERACTIVE ASSESSMENT SCORING & TIMER
       ========================================================= */
    const quizForm = document.getElementById("quiz-form");
    const timerDisplay = document.getElementById("timer");
    
    if (quizForm && timerDisplay) {
        // Countdown Timer Logic
        let timeLeft = 60; // 60 seconds
        const timerInterval = setInterval(() => {
            timeLeft--;
            let m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            let s = (timeLeft % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `Time Left: ${m}:${s}`;
            
            // Auto-submit when timer hits zero
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                quizForm.dispatchEvent(new Event('submit')); 
            }
        }, 1000);

        // Instant Evaluation Logic
        quizForm.addEventListener("submit", function(e) {
            e.preventDefault();
            clearInterval(timerInterval); // Stop timer
            let score = 0;
            
            // Check Answers
            const q1 = document.querySelector('input[name="q1"]:checked');
            const q2 = document.querySelector('input[name="q2"]:checked');
            const q3 = document.querySelector('input[name="q3"]').value.toLowerCase();

            if (q1 && q1.value === "11") score++;
            if (q2 && q2.value === "Football") score++;
            if (q3.includes("forward") || q3.includes("defender") || q3.includes("midfielder") || q3.includes("goalkeeper")) score++;

            // Display Results
            const resultDiv = document.getElementById("quiz-result");
            resultDiv.innerHTML = `<h3 style="color:#bb86fc;">You scored ${score} out of 3!</h3>`;
            
            // Trigger Confetti Celebration for perfect score
            if (score === 3) triggerConfetti();
        });
    }

    /* =========================================================
       12. CONFETTI CELEBRATION GENERATOR
       ========================================================= */
    function triggerConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            // Random horizontal placement and falling speed
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.animationDuration = (Math.random() * 2 + 1) + "s";
            document.body.appendChild(confetti);
            
            // Cleanup elements after animation completes
            setTimeout(() => confetti.remove(), 3000);
        }
    }
});