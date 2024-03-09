document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    // Event listener for login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Check if user exists and password matches
        const userData = localStorage.getItem(username);
        if (userData) {
            const parsedData = JSON.parse(userData);
            if (parsedData.password === password) {
                alert('Login successful!');
                // Set the loggedInUser key in local storage to the user's name
                localStorage.setItem('loggedInUser', parsedData.name);
                window.location.href = 'homePage.html';
            } else {
                alert('Incorrect password. Please try again.');
            }
        } else {
            alert('User not found. Please register first.');
        }
    });
});
