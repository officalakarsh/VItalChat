document.addEventListener('DOMContentLoaded', () => {
    // Basic regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            let isValid = true;
            
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const emailErr = document.getElementById('emailError');
            const passErr = document.getElementById('passwordError');

            // Reset errors
            emailErr.style.display = 'none';
            passErr.style.display = 'none';
            
            if (!emailRegex.test(email.value)) {
                emailErr.style.display = 'block';
                isValid = false;
            }

            if (password.value.trim().length === 0) {
                passErr.style.display = 'block';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // Register Form Validation
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            let isValid = true;

            const name = document.getElementById('full_name');
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const confirm = document.getElementById('confirm_password');
            
            const nameErr = document.getElementById('nameError');
            const emailErr = document.getElementById('emailError');
            const passErr = document.getElementById('passwordError');
            const confErr = document.getElementById('confirmError');

            // Reset errors
            nameErr.style.display = 'none';
            emailErr.style.display = 'none';
            passErr.style.display = 'none';
            confErr.style.display = 'none';

            if (name.value.trim().length < 2) {
                nameErr.style.display = 'block';
                isValid = false;
            }

            if (!emailRegex.test(email.value)) {
                emailErr.style.display = 'block';
                isValid = false;
            }

            if (password.value.length < 8) {
                passErr.style.display = 'block';
                isValid = false;
            }

            if (password.value !== confirm.value) {
                confErr.style.display = 'block';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }
});
