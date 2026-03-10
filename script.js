document.addEventListener("DOMContentLoaded", () => {

    // --- Cookie Helper Functions ---
    // Sets a cookie with an expiration date (in days)
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Retrieves a cookie value by its name
    function getCookie(name) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for(let i = 0; i < cookieArray.length; i++) {
            let c = cookieArray[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cookieName) === 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return "";
    }


    // light & dark mode toggle logic
    const themeBtn = document.getElementById("theme-toggle");
    
    // fetch theme preference from cookies instead of local storage
    const currentTheme = getCookie("theme");

    // set theme on load based on memory
    if (currentTheme === "light") {
        document.body.classList.add("light-mode");
        if(themeBtn) themeBtn.textContent = "🌙";
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            
            // save preference to cookies (expires in 365 days)
            if (document.body.classList.contains("light-mode")) {
                setCookie("theme", "light", 365);
                themeBtn.textContent = "🌙";
            } else {
                setCookie("theme", "dark", 365);
                themeBtn.textContent = "☀️";
            }
        });
    }

    // personalized nav greeting based on login state
    // fetch username from cookies instead of local storage
    const loggedInUser = getCookie("username");
    const navbar = document.querySelector(".navbar");
    
    if (loggedInUser && navbar) {
        const loginLink = navbar.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = `Welcome, ${loggedInUser}!`;
            loginLink.href = "#"; 
            
            const logoutLink = document.createElement("a");
            logoutLink.href = "#";
            logoutLink.textContent = "(Logout)";
            logoutLink.onclick = () => {
                // To delete a cookie, set its expiration date to the past
                setCookie("username", "", -1);
                window.location.reload(); 
            };
            navbar.insertBefore(logoutLink, document.getElementById("theme-toggle"));
        }
    }

    // typing effect for the main heading
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

    // image slider auto-play
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

    // toggle password visibility 
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

    // password strength checker and match validation
    const passInput = document.getElementById("signup-password");
    const confirmInput = document.getElementById("signup-confirm");
    const strengthBar = document.getElementById("strength-bar");
    const matchText = document.getElementById("match-text");

    if (passInput && strengthBar) {
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

    // form submit actions & shake animation for errors
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            
            // save username to a cookie on login (expires in 7 days)
            if(form.id === "login-form") {
                const user = form.querySelector('input[type="text"]').value;
                setCookie("username", user, 7);
            }

            // stop form submit and shake if passwords don't match
            if (form.id === "signup-form" && passInput.value !== confirmInput.value) {
                e.preventDefault();
                form.classList.add("shake");
                setTimeout(() => form.classList.remove("shake"), 500); 
            }
        });
    });

    // drag-and-drop file upload logic
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

    // validates file size/type and generates a preview thumbnail
    function handleFile(file, previewDiv) {
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) { 
            alert("File size must be less than 2MB.");
            return;
        }
        
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

    // auto-format phone numbers
    const phoneInput = document.getElementById("phone-input");
    if (phoneInput) {
        phoneInput.addEventListener("input", function (e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // star rating system
    const stars = document.querySelectorAll(".star-rating span");
    let currentRating = 0;
    stars.forEach(star => {
        star.addEventListener("click", function() {
            currentRating = this.getAttribute("data-value");
            stars.forEach(s => s.style.color = s.getAttribute("data-value") <= currentRating ? "#FFD700" : "");
        });
    });

    // interactive assessment scoring & timer
    const quizForm = document.getElementById("quiz-form");
    const timerDisplay = document.getElementById("timer");
    
    if (quizForm && timerDisplay) {
        let timeLeft = 10; 
        const timerInterval = setInterval(() => {
            timeLeft--;
            let m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            let s = (timeLeft % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `Time Left: ${m}:${s}`;
            
            // auto submit when time is up
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                quizForm.dispatchEvent(new Event('submit')); 
            }
        }, 1000);

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
            
            if (score === 3) triggerConfetti();
        });
    }

    // confetti generator for perfect scores
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