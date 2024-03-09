document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    // Event listener for login button click
    loginBtn.addEventListener('click', function() {
        window.location.href = 'src/html/login.html';
    });

    // Event listener for register button click
    registerBtn.addEventListener('click', function() {
        window.location.href = 'src/html/register.html';
    });
});
