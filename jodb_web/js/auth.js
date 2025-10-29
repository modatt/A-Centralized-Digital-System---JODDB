// Authentication handling
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in - redirect based on role
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const role = localStorage.getItem('role');
        if (role === 'technician') {
            window.location.href = 'technician.html';
        } else if (role === 'supervisor') {
            window.location.href = 'supervisor.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        return;
    }

    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Try to authenticate against stored users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        let matched = users.find(u => u.username === username && u.password === password);

        // Demo fallback credentials if no users or not matched
        if (!matched) {
            const fallback = [
                { username: 'planner', password: 'planner', role: 'planner' },
                { username: 'john_tech', password: 'password123', role: 'technician' },
                { username: 'mike_tech', password: 'password123', role: 'technician' },
                { username: 'sarah_supervisor', password: 'password123', role: 'supervisor' },
            ];
            const fb = fallback.find(u => u.username === username && u.password === password);
            if (fb) {
                matched = fb;
            }
        }

        if (matched) {
            const role = matched.role || 'planner';
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', matched.username);
            localStorage.setItem('role', role);

            if (role === 'technician') {
                window.location.href = 'technician.html';
            } else if (role === 'supervisor') {
                window.location.href = 'supervisor.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
        }
    });
});
