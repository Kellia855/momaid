// Pregnancy Tracking System for Momaid App

/**
 * Update user interface with current user data
 */
function updateUserInterface() {
    if (!currentUser) return;

    // Update user avatar and name
    updateUserProfile();
    
    // Calculate and update pregnancy stats
    const pregnancyStats = calculatePregnancyStats();
    updatePregnancyDisplay(pregnancyStats);
    
    // Load tips for current week
    loadWeeklyTips(pregnancyStats.weeks);
}

/**
 * Update user profile display
 */
function updateUserProfile() {
    const userAvatar = document.getElementById('userAvatar');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');

    if (userAvatar) userAvatar.textContent = currentUser.avatar;
    if (profileAvatar) profileAvatar.textContent = currentUser.avatar;
    if (profileName) profileName.textContent = currentUser.name;
}

/**
 * Calculate pregnancy statistics based on due date
 * @returns {Object} Pregnancy statistics
 */
function calculatePregnancyStats() {
    if (!currentUser || !currentUser.dueDate) {
        return { weeks: 0, days: 0, trimester: '1st', daysRemaining: 280, percentage: 0 };
    }

    const dueDate = new Date(currentUser.dueDate);
    const today = new Date();
    
    // Calculate start date (280 days before due date)
    const startDate = new Date(dueDate);
    startDate.setDate(startDate.getDate() - 280);
    
    // Calculate days passed since conception
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const weeks = Math.max(0, Math.floor(daysPassed / 7));
    const days = Math.max(0, daysPassed % 7);
    
    // Calculate days remaining
    const daysRemaining = Math.max(0, Math.floor((dueDate - today) / (1000 * 60 * 60 * 24)));
    
    // Determine trimester
    let trimester;
    if (weeks <= 12) trimester = "1st";
    else if (weeks <= 27) trimester = "2nd";
    else trimester = "3rd";
    
    // Calculate progress percentage
    const percentage = Math.min(100, (weeks / 40) * 100);

    return {
        weeks,
        days,
        trimester,
        daysRemaining,
        percentage,
        dueDate: dueDate.toLocaleDateString(),
        startDate: startDate.toLocaleDateString()
    };
}

/**
 * Update pregnancy display with calculated stats
 * @param {Object} stats - Pregnancy statistics
 */
function updatePregnancyDisplay(stats) {
    // Update week displays
    const weekElements = ['weekNumber', 'profileWeeks', 'dashWeeks'];
    weekElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = stats.weeks;
    });

    // Update trimester display
    const trimesterElements = ['profileTrimester'];
    trimesterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = stats.trimester;
    });

    // Update days remaining
    const daysElements = ['dashDaysLeft'];
    daysElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = stats.daysRemaining;
    });

    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = stats.percentage + '%';
    }

    // Update profile subtitle
    const profileSubtitle = document.getElementById('profileSubtitle');
    if (profileSubtitle) {
        profileSubtitle.textContent = `${stats.weeks} weeks pregnant`;
    }

    // Update dashboard stats
    updateDashboardStats(stats);
}

/**
 * Update dashboard overview statistics
 * @param {Object} stats - Pregnancy statistics
 */
function updateDashboardStats(stats) {
    const dashAppointments = document.getElementById('dashAppointments');
    const dashTips = document.getElementById('dashTips');
    
    if (dashAppointments) {
        const upcomingAppointments = getUpcomingAppointments();
        dashAppointments.textContent = upcomingAppointments.length;
    }
    
    if (dashTips) {
        const availableTips = getAvailableTips(stats.weeks);
        dashTips.textContent = availableTips.length;
    }
}

/**
 * Get upcoming appointments for the user
 * @returns {Array} Array of upcoming appointments
 */
function getUpcomingAppointments() {
    if (!currentUser || !currentUser.appointments) return [];
    
    const today = new Date();
    return currentUser.appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate >= today;
    });
}

/**
 * Show specific section/modal
 * @param {string} section - Section to show ('profile', 'appointments', 'notes')
 */
function showSection(section) {
    switch(section) {
        case 'profile':
            toggleProfileEdit();
            break;
        case 'appointments':
            showAppointmentsModal();
            break;
        case 'notes':
            showNotesModal();
            break;
    }
}

/**
 * Toggle profile edit modal
 */
function toggleProfileEdit() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Pre-fill form with current user data
        if (currentUser) {
            document.getElementById('editName').value = currentUser.name || '';
            document.getElementById('editEmail').value = currentUser.email || '';
            document.getElementById('editDueDate').value = currentUser.dueDate || '';
            document.getElementById('editProvider').value = currentUser.provider || '';
            document.getElementById('editEmergency').value = currentUser.emergency || '';
        }
    }
}

/**
 * Save profile changes
 */
function saveProfile() {
    if (!currentUser) return;

    const updatedData = {
        name: document.getElementById('editName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        dueDate: document.getElementById('editDueDate').value,
        provider: document.getElementById('editProvider').value.trim(),
        emergency: document.getElementById('editEmergency').value.trim()
    };

    // Validate required fields
    if (!updatedData.name || !updatedData.email || !updatedData.dueDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Validate email format
    if (!isValidEmail(updatedData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Update avatar based on new name
    updatedData.avatar = updatedData.name.charAt(0).toUpperCase();

    // Update current user
    updateCurrentUser(updatedData);
    
    closeModal('profileModal');
    updateUserInterface();
    showNotification('Profile updated successfully!', 'success');
}

/**
 * Show appointments modal
 */
function showAppointmentsModal() {
    const modal = document.getElementById('appointmentsModal');
    if (modal) {
        modal.style.display = 'flex';
        updateAppointmentsList();
    }
}

/**
 * Show notes modal
 */
function showNotesModal() {
    const modal = document.getElementById('notesModal');
    if (modal) {
        modal.style.display = 'flex';
        updateNotesList();
    }
}

/**
 * Add new appointment
 */
function addAppointment() {
    const date = prompt('Enter appointment date (YYYY-MM-DD):');
    const time = prompt('Enter appointment time (e.g., 2:00 PM):');
    const description = prompt('Enter appointment description:');
    const provider = prompt('Enter healthcare provider name:') || 'Healthcare Provider';
    
    if (date && time && description) {
        // Validate date format
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            showNotification('Please enter a valid date in YYYY-MM-DD format', 'error');
            return;
        }

        if (!currentUser.appointments) currentUser.appointments = [];
        
        const newAppointment = {
            id: Date.now(),
            date: date,
            time: time,
            description: description,
            provider: provider,
            createdAt: new Date().toISOString()
        };

        currentUser.appointments.push(newAppointment);
        updateCurrentUser(currentUser);
        updateAppointmentsList();
        updateUserInterface();
        showNotification('Appointment added successfully!', 'success');
    }
}

/**
 * Add new note
 */
function addNote() {
    const title = prompt('Enter note title:');
    const content = prompt('Enter note content:');
    
    if (title && content) {
        if (!currentUser.notes) currentUser.notes = [];
        
        const newNote = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            title: title,
            content: content,
            createdAt: new Date().toISOString()
        };

        currentUser.notes.push(newNote);
        updateCurrentUser(currentUser);
        updateNotesList();
        updateUserInterface();
        showNotification('Note added successfully!', 'success');
    }
}

/**
 * Update appointments list in modal
 */
function updateAppointmentsList() {
    const appointmentsList = document.querySelector('.appointments-list');
    if (!appointmentsList || !currentUser || !currentUser.appointments) return;

    if (currentUser.appointments.length === 0) {
        appointmentsList.innerHTML = `
            <div class="appointment-item">
                <div class="appointment-date">No appointments</div>
                <div>You don't have any appointments scheduled.</div>
                <div class="appointment-time">Click "Add New Appointment" to schedule one.</div>
            </div>
        `;
        return;
    }

    // Sort appointments by date
    const sortedAppointments = currentUser.appointments.sort((a, b) => new Date(a.date) - new Date(b.date));

    appointmentsList.innerHTML = sortedAppointments.map(appointment => {
        const appointmentDate = new Date(appointment.date);
        const today = new Date();
        const isPast = appointmentDate < today;
        
        return `
            <div class="appointment-item ${isPast ? 'past-appointment' : ''}">
                <div class="appointment-date">${appointmentDate.toLocaleDateString()}</div>
                <div>${appointment.description}</div>
                <div class="appointment-time">${appointment.time} - ${appointment.provider}</div>
                ${isPast ? '<div class="appointment-status">Past</div>' : '<div class="appointment-status">Upcoming</div>'}
            </div>
        `;
    }).join('');
}

/**
 * Update notes list in modal
 */
function updateNotesList() {
    const notesList = document.querySelector('.notes-list');
    if (!notesList || !currentUser || !currentUser.notes) return;

    if (currentUser.notes.length === 0) {
        notesList.innerHTML = `
            <div class="note-item">
                <div class="note-date">No notes</div>
                <div>You haven't created any notes yet.</div>
                <div class="note-preview">Click "Add New Note" to create your first note.</div>
            </div>
        `;
        return;
    }

    // Sort notes by creation date (newest first)
    const sortedNotes = currentUser.notes.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

    notesList.innerHTML = sortedNotes.map(note => `
        <div class="note-item">
            <div class="note-date">${note.date}</div>
            <div>${note.title}</div>
            <div class="note-preview">${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}</div>
        </div>
    `).join('');
}

/**
 * Get baby development info for current week
 * @param {number} week - Current pregnancy week
 * @returns {Object} Development information
 */
function getBabyDevelopment(week) {
    const developments = {
        4: { size: "Poppy seed", length: "2mm", development: "Heart begins to beat" },
        8: { size: "Raspberry", length: "16mm", development: "All major organs forming" },
        12: { size: "Lime", length: "61mm", development: "Reflexes developing" },
        16: { size: "Avocado", length: "116mm", development: "Can hear sounds" },
        20: { size: "Banana", length: "166mm", development: "Can suck thumb" },
        24: { size: "Corn", length: "300mm", development: "Lungs developing" },
        28: { size: "Eggplant", length: "375mm", development: "Can open eyes" },
        32: { size: "Squash", length: "427mm", development: "Bones hardening" },
        36: { size: "Papaya", length: "472mm", development: "Gaining weight rapidly" },
        40: { size: "Watermelon", length: "508mm", development: "Ready for birth!" }
    };

    // Find closest week
    let closestWeek = 4;
    Object.keys(developments).forEach(w => {
        if (parseInt(w) <= week) closestWeek = parseInt(w);
    });

    return developments[closestWeek] || developments[4];
}

/**
 * Calculate BMI and weight gain recommendations
 * @param {number} prePregnancyWeight - Weight before pregnancy (kg)
 * @param {number} height - Height in cm
 * @param {number} currentWeek - Current pregnancy week
 * @returns {Object} Weight recommendations
 */
function calculateWeightRecommendations(prePregnancyWeight, height, currentWeek) {
    const heightM = height / 100;
    const bmi = prePregnancyWeight / (heightM * heightM);
    
    let recommendedGain;
    if (bmi < 18.5) recommendedGain = { min: 12.5, max: 18 };
    else if (bmi < 25) recommendedGain = { min: 11.5, max: 16 };
    else if (bmi < 30) recommendedGain = { min: 7, max: 11.5 };
    else recommendedGain = { min: 5, max: 9 };
    
    const expectedGainByWeek = (recommendedGain.min + recommendedGain.max) / 2 * (currentWeek / 40);
    
    return {
        bmi: Math.round(bmi * 10) / 10,
        totalRecommended: recommendedGain,
        expectedByNow: Math.round(expectedGainByWeek * 10) / 10
    };
}