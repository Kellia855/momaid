// Authentication System for Momaid App

// User data storage (in real app, this would be in a database)
let currentUser = null;
let users = JSON.parse(localStorage.getItem('momaidUsers') || '[]');

/**
 * Check if user is already logged in
 */
function checkLoginStatus() {
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (savedUser) {
        currentUser = savedUser;
        showMainApp();
    } else {
        showWelcomeScreen();
    }
}

/**
 * Show welcome screen for non-authenticated users
 */
function showWelcomeScreen() {
    document.getElementById('welcomeScreen').style.display = 'block';
    document.getElementById('mainApp').classList.add('hidden');
}

/**
 * Show main app for authenticated users
 */
async function showMainApp() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('mainApp').classList.remove('hidden');
    
    // Load dashboard content
    await loadDashboard();
}

/**
 * Show authentication modal
 * @param {string} mode - 'login' or 'register'
 */
function showAuthModal(mode) {
    document.getElementById('authModal').style.display = 'flex';
    switchAuthMode(mode);
}

/**
 * Switch between login and register forms
 * @param {string} mode - 'login' or 'register'
 */
function switchAuthMode(mode, email = '') {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    const newPasswordForm = document.getElementById('newPasswordForm');
    const authTitle = document.getElementById('authTitle');

    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    resetForm.classList.add('hidden');
    newPasswordForm.classList.add('hidden');

    if (mode === 'login') {
        loginForm.classList.remove('hidden');
        authTitle.textContent = 'Login';
    } else if (mode === 'register') {
        registerForm.classList.remove('hidden');
        authTitle.textContent = 'Sign Up';
    } else if (mode === 'reset') {
        resetForm.classList.remove('hidden');
        authTitle.textContent = 'Reset Password';
    } else if (mode === 'newPassword') {
        newPasswordForm.classList.remove('hidden');
        document.getElementById('newPasswordEmail').value = email;
        authTitle.textContent = 'Set New Password';
    }
}

/**
 * Handle user login
 */
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Find user in stored users
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('authModal');
        showMainApp();
        showNotification('Welcome back!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
        return;
    }

    // Clear form
    clearAuthForms();
}

/**
 * Handle user registration
 */
function register() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const dueDate = document.getElementById('registerDueDate').value;

    if (!name || !email || !password || !dueDate) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Validate due date (should be in the future)
    const dueDateObj = new Date(dueDate);
    const today = new Date();
    if (dueDateObj <= today) {
        showNotification('Due date should be in the future', 'error');
        return;
    }

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('User with this email already exists', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        dueDate: dueDate,
        provider: '',
        emergency: '',
        avatar: name.charAt(0).toUpperCase(),
        appointments: [],
        notes: [],
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    currentUser = newUser;
    
    // Save to localStorage
    localStorage.setItem('momaidUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeModal('authModal');
    showMainApp();
    showNotification('Account created successfully! Welcome to Momaid!', 'success');

    // Clear form
    clearAuthForms();
}

/**
 * Handle user logout
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showWelcomeScreen();
        showNotification('Logged out successfully', 'success');
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Handle password reset request - Step 1: Verify Email
 */
function resetPassword() {
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        showNotification('No account found with this email address', 'error');
        return;
    }

    // If email is valid and user exists, show the new password form
    switchAuthMode('newPassword', email);
    showNotification('Please set your new password', 'info');
}

/**
 * Handle password reset request - Step 2: Set New Password
 */
function setNewPassword() {
    const email = document.getElementById('newPasswordEmail').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!newPassword || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const user = users.find(u => u.email === email);
    if (!user) {
        showNotification('User not found', 'error');
        return;
    }

    // Update user's password
    user.password = newPassword;
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('momaidUsers', JSON.stringify(users));
    }

    showNotification('Password has been reset successfully!', 'success');
    setTimeout(() => {
        switchAuthMode('login');
    }, 2000);
}

/**
 * Clear authentication forms
 */
function clearAuthForms() {
    // Clear login form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    // Clear register form
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerDueDate').value = '';
}

/**
 * Show notification to user
 * @param {string} message - Notification message
 * @param {string} type - 'success', 'error', or 'info'
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Close modal by ID
 * @param {string} modalId - ID of modal to close
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Get current user data
 * @returns {Object|null} Current user object or null
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Update current user data
 * @param {Object} userData - Updated user data
 */
function updateCurrentUser(userData) {
    if (currentUser) {
        Object.assign(currentUser, userData);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update in users array
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem('momaidUsers', JSON.stringify(users));
        }
    }
}