document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    // Event listener for registration form submission
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Check if user already exists
        if (localStorage.getItem(username)) {
            alert('Username already exists. Please choose another one.');
            return;
        }

        // Store user data in local storage
        const userData = {
            name: name,
            password: password
        };
        localStorage.setItem(username, JSON.stringify(userData));
        localStorage.setItem('name', name); // Store name separately

        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
});
