// Authentication handling
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication - in production, this should be done server-side
        if (username === 'planner' && password === 'planner') {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('role', 'planner');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
        }
    });
});
