document.addEventListener("DOMContentLoaded", () => {

    // --- 27. Personalized Greeting ---
    const loggedInUser = localStorage.getItem("username");
    const navbar = document.querySelector(".navbar");
    if (loggedInUser) {
        const loginLink = navbar.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = `Welcome, ${loggedInUser}!`;
            loginLink.href = "#"; // Disable login link
            // Add a logout button
            const logoutLink = document.createElement("a");
            logoutLink.href = "#";
            logoutLink.textContent = "(Logout)";
            logoutLink.onclick = () => {
                localStorage.removeItem("username");
                window.location.reload();
            };
            navbar.appendChild(logoutLink);
        }
    }

    // --- 4. Typing Effect (index.html) ---
    const typingElement = document.getElementById("typing-effect");
    if (typingElement) {
        const text = "Games Learning Center";
        let i = 0;
        typingElement.innerHTML = "";
        function typeWriter() {
            if (i < text.length) {
                typingElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        typeWriter();
    }

    // --- 3. Image Carousel/Slider (index.html) ---
    const slides = document.querySelectorAll(".carousel-slide");
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].style.display = "none";
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].style.display = "block";
            slides[currentSlide].style.animation = "fadeIn 1s ease-in-out";
        }, 3000);
    }

    // --- 11. Show/Hide Password Toggle ---
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

    // --- 8 & 9. Password Strength & Match (signup.html) ---
    const passInput = document.getElementById("signup-password");
    const confirmInput = document.getElementById("signup-confirm");
    const strengthBar = document.getElementById("strength-bar");
    const matchText = document.getElementById("match-text");

    if (passInput) {
        passInput.addEventListener("input", function() {
            let val = this.value;
            let strength = 0;
            if (val.length > 5) strength += 33;
            if (val.match(/[A-Z]/) && val.match(/[0-9]/)) strength += 33;
            if (val.match(/[^a-zA-Z0-9]/)) strength += 34;
            
            strengthBar.style.width = strength + "%";
            if (strength < 34) strengthBar.style.backgroundColor = "red";
            else if (strength < 67) strengthBar.style.backgroundColor = "orange";
            else strengthBar.style.backgroundColor = "green";
        });
    }

    if (confirmInput) {
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

    // --- 10. Form Shake on Error (login/signup) ---
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            // Dummy logic for login storage
            if(form.id === "login-form") {
                const user = form.querySelector('input[type="text"]').value;
                localStorage.setItem("username", user);
            }

            // Trigger shake if passwords don't match on signup
            if (form.id === "signup-form" && passInput.value !== confirmInput.value) {
                e.preventDefault();
                form.classList.add("shake");
                setTimeout(() => form.classList.remove("shake"), 500);
            }
        });
    });

    // --- 14, 15, 16, 17, 18. Drag & Drop File Upload Validation ---
    const dropZones = document.querySelectorAll(".drop-zone");
    dropZones.forEach(zone => {
        const input = zone.querySelector("input[type='file']");
        const previewDiv = zone.querySelector(".preview-container");

        zone.addEventListener("click", () => input.click());
        
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
            zone.style.borderColor = "#bb86fc";
        });
        
        zone.addEventListener("dragleave", () => {
            zone.style.borderColor = "#444";
        });

        zone.addEventListener("drop", (e) => {
            e.preventDefault();
            zone.style.borderColor = "#444";
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                handleFile(input.files[0], previewDiv);
            }
        });

        input.addEventListener("change", function() {
            if (this.files.length) handleFile(this.files[0], previewDiv);
        });
    });

    function handleFile(file, previewDiv) {
        // 18. File Size/Type Validation
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB
            alert("File size must be less than 2MB.");
            return;
        }
        // 15. Image Preview
        if(previewDiv) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewDiv.innerHTML = `<img src="${e.target.result}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-top: 10px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            alert(`File "${file.name}" ready for upload!`); // For feedback form attachment
        }
    }

    // --- 13. Auto-formatting Phone Numbers (feedback.html) ---
    const phoneInput = document.getElementById("phone-input");
    if (phoneInput) {
        phoneInput.addEventListener("input", function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // --- 28. Star Rating System (feedback.html) ---
    const stars = document.querySelectorAll(".star-rating span");
    let currentRating = 0;
    stars.forEach(star => {
        star.addEventListener("click", function() {
            currentRating = this.getAttribute("data-value");
            stars.forEach(s => s.style.color = s.getAttribute("data-value") <= currentRating ? "#FFD700" : "#444");
        });
    });

    // --- 20, 21, 22. Interactive Assessment ---
    const quizForm = document.getElementById("quiz-form");
    const timerDisplay = document.getElementById("timer");
    
    if (quizForm && timerDisplay) {
        // 22. Countdown Timer
        let timeLeft = 60; // 60 seconds
        const timerInterval = setInterval(() => {
            timeLeft--;
            let m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            let s = (timeLeft % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `Time Left: ${m}:${s}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                quizForm.dispatchEvent(new Event('submit')); // Auto submit
            }
        }, 1000);

        // 20. Instant Scoring
        quizForm.addEventListener("submit", function(e) {
            e.preventDefault();
            clearInterval(timerInterval);
            let score = 0;
            const q1 = document.querySelector('input[name="q1"]:checked');
            const q2 = document.querySelector('input[name="q2"]:checked');
            const q3 = document.querySelector('input[name="q3"]').value.toLowerCase();

            if (q1 && q1.value === "11") score++;
            if (q2 && q2.value === "Football") score++;
            if (q3.includes("forward") || q3.includes("defender") || q3.includes("midfielder") || q3.includes("goalkeeper")) score++;

            const resultDiv = document.getElementById("quiz-result");
            resultDiv.innerHTML = `<h3 style="color:#bb86fc;">You scored ${score} out of 3!</h3>`;
            
            // 21. Confetti logic
            if (score === 3) triggerConfetti();
        });
    }

    function triggerConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.animationDuration = (Math.random() * 2 + 1) + "s";
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }
});