document.addEventListener("DOMContentLoaded", () => {

    // --- Cookie Helper Functions ---
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

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
    const currentTheme = getCookie("theme");

    if (currentTheme === "light") {
        document.body.classList.add("light-mode");
        if(themeBtn) themeBtn.textContent = "🌙";
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            if (document.body.classList.contains("light-mode")) {
                setCookie("theme", "light", 365);
                themeBtn.textContent = "🌙";
            } else {
                setCookie("theme", "dark", 365);
                themeBtn.textContent = "☀️";
            }
        });
    }

    // --- Navbar Layout Restructuring (Dynamic Right Controls) ---
    const navbar = document.querySelector(".navbar");
    const loginLink = navbar ? navbar.querySelector('a[href="login.html"]') : null;
    
    if (navbar) {
        const rightControls = document.createElement("div");
        rightControls.className = "nav-right-controls";
        if (themeBtn) rightControls.appendChild(themeBtn);

        const loggedInUser = getCookie("loggedInUser");

        if (loggedInUser && loginLink) {
            loginLink.textContent = "Logout";
            loginLink.href = "#"; 
            loginLink.onclick = (e) => {
                e.preventDefault();
                setCookie("loggedInUser", "", -1); 
                window.location.reload(); 
            };

            rightControls.appendChild(loginLink);

            const welcomeMsg = document.createElement("span");
            welcomeMsg.textContent = `Welcome, ${loggedInUser}!`;
            welcomeMsg.className = "welcome-msg";
            
            rightControls.appendChild(welcomeMsg);
        }
        navbar.appendChild(rightControls);
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

    // --- FORM SUBMIT ACTIONS: LOGIN & SIGNUP SIMULATION ---
    const forms = document.querySelectorAll("form");
    forms.forEach(form => {
        form.addEventListener("submit", (e) => {
            
            // 1. Signup Form Verification & Registration
            if (form.id === "signup-form") {
                const pass = document.getElementById("signup-password");
                const conf = document.getElementById("signup-confirm");
                const usernameInput = form.querySelector('input[type="text"]').value;
                
                // If passwords don't match, stop submission and shake
                if (pass && conf && pass.value !== conf.value) {
                    e.preventDefault();
                    form.classList.add("shake");
                    setTimeout(() => form.classList.remove("shake"), 500); 
                } else {
                    // Valid Registration: Save "account" in cookies
                    e.preventDefault();
                    setCookie("registeredUser", usernameInput, 7);
                    setCookie("registeredPass", pass.value, 7);
                    
                    alert("Account created successfully! Please login.");
                    window.location.href = "login.html";
                }
            }

            // 2. Login Form Verification
            if(form.id === "login-form") {
                e.preventDefault(); 
                const enteredUser = document.getElementById("login-username").value;
                const enteredPass = document.getElementById("login-password").value;
                const errorText = document.getElementById("login-error");
                
                // Retrieve the registered account details from cookies
                const storedUser = getCookie("registeredUser");
                const storedPass = getCookie("registeredPass");

                // Verify credentials
                if (enteredUser === storedUser && enteredPass === storedPass) {
                    // Successful login: Set the active session cookie
                    setCookie("loggedInUser", enteredUser, 7);
                    window.location.href = "index.html"; 
                } else {
                    // Failed login: Show error and shake form
                    errorText.textContent = "Invalid username or password!";
                    form.classList.add("shake");
                    setTimeout(() => form.classList.remove("shake"), 500); 
                }
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

    // auto-format Indian phone numbers (10 digits)
    const phoneInput = document.getElementById("phone-input");
    if (phoneInput) {
        phoneInput.addEventListener("input", function (e) {
            let cleaned = e.target.value.replace(/\D/g, '');
            if (cleaned.length > 10) {
                cleaned = cleaned.substring(0, 10);
            }
            let formatted = cleaned;
            if (cleaned.length > 5) {
                formatted = cleaned.substring(0, 5) + ' ' + cleaned.substring(5);
            }
            e.target.value = formatted;
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