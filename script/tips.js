// Pregnancy Tips System for Momaid App

// Comprehensive pregnancy tips database organized by week
const pregnancyTips = {
    1: [
        { category: "Health", tip: "Start taking prenatal vitamins with folic acid to prevent birth defects." },
        { category: "Lifestyle", tip: "Avoid alcohol, smoking, and limit caffeine intake to less than 200mg daily." },
        { category: "Nutrition", tip: "Focus on a balanced diet rich in fruits, vegetables, and whole grains." },
        { category: "Planning", tip: "Track your menstrual cycle to confirm pregnancy." }
    ],
    4: [
        { category: "Symptoms", tip: "Morning sickness may begin. Try eating small, frequent meals throughout the day." },
        { category: "Health", tip: "Schedule your first prenatal appointment with your healthcare provider." },
        { category: "Self-care", tip: "Get plenty of rest - your body is working hard to grow your baby." },
        { category: "Nutrition", tip: "Include protein-rich foods like eggs, lean meats, and legumes in your diet." }
    ],
    8: [
        { category: "Development", tip: "Your baby's heart is beating and major organs are forming rapidly." },
        { category: "Nutrition", tip: "Increase protein intake to support rapid cell growth and development." },
        { category: "Health", tip: "Stay hydrated and consider ginger tea for morning sickness relief." },
        { category: "Exercise", tip: "Begin gentle exercises like walking or prenatal yoga if approved by your doctor." }
    ],
    12: [
        { category: "Milestone", tip: "End of first trimester! Risk of miscarriage decreases significantly." },
        { category: "Health", tip: "You may start feeling more energetic as morning sickness typically subsides." },
        { category: "Planning", tip: "Consider when to announce your pregnancy to family and friends." },
        { category: "Screening", tip: "Discuss genetic screening options with your healthcare provider." }
    ],
    16: [
        { category: "Development", tip: "You might start feeling baby's first movements (quickening) soon." },
        { category: "Health", tip: "Consider getting a flu shot - it's safe and recommended during pregnancy." },
        { category: "Nutrition", tip: "Increase calcium intake for baby's developing bones and teeth." },
        { category: "Comfort", tip: "You may need to start wearing maternity clothes as your belly grows." }
    ],
    20: [
        { category: "Milestone", tip: "Halfway point! Anatomy scan can reveal baby's gender and development." },
        { category: "Exercise", tip: "Continue moderate exercise like walking, swimming, or prenatal yoga." },
        { category: "Comfort", tip: "Invest in comfortable, supportive maternity bras and clothing." },
        { category: "Planning", tip: "Start researching childbirth classes and pediatricians." }
    ],
    24: [
        { category: "Development", tip: "Baby's hearing is developing - talk, read, and sing to your baby!" },
        { category: "Health", tip: "Glucose screening test may be scheduled to check for gestational diabetes." },
        { category: "Planning", tip: "Start thinking about baby names and begin nursery planning." },
        { category: "Nutrition", tip: "Focus on iron-rich foods to prevent anemia - spinach, lean meats, beans." }
    ],
    28: [
        { category: "Milestone", tip: "Third trimester begins! Baby's survival rate increases significantly if born now." },
        { category: "Health", tip: "You may start feeling more tired again - this is completely normal." },
        { category: "Preparation", tip: "Consider taking childbirth and newborn care classes." },
        { category: "Monitoring", tip: "Start paying attention to baby's movement patterns daily." }
    ],
    32: [
        { category: "Development", tip: "Baby's movements may feel stronger but less frequent due to less space." },
        { category: "Health", tip: "Monitor for signs of preeclampsia: swelling, headaches, vision changes." },
        { category: "Planning", tip: "Start preparing your hospital bag and birth plan." },
        { category: "Comfort", tip: "Sleep on your side with pillows for support - avoid sleeping on your back." }
    ],
    36: [
        { category: "Preparation", tip: "Baby is considered full-term at 37 weeks - you're almost there!" },
        { category: "Health", tip: "Group B strep test may be performed between 35-37 weeks." },
        { category: "Planning", tip: "Finalize your birth plan and discuss with your healthcare provider." },
        { category: "Comfort", tip: "Practice relaxation and breathing techniques for labor." }
    ],
    40: [
        { category: "Milestone", tip: "Your due date! Remember, only 5% of babies are born on their actual due date." },
        { category: "Signs", tip: "Watch for signs of labor: regular contractions, water breaking, bloody show." },
        { category: "Preparation", tip: "Stay calm and rest when possible - labor could start any time!" },
        { category: "Health", tip: "Keep your healthcare provider's contact information handy at all times." }
    ]
};

// Additional tips by category
const categoryTips = {
    nutrition: [
        "Eat folate-rich foods like leafy greens, citrus fruits, and fortified cereals",
        "Include omega-3 fatty acids from fish, walnuts, and flaxseeds for brain development",
        "Stay hydrated with 8-10 glasses of water daily",
        "Limit processed foods and focus on whole, nutrient-dense options",
        "Eat small, frequent meals to manage nausea and maintain energy levels"
    ],
    exercise: [
        "Aim for 30 minutes of moderate exercise most days of the week",
        "Try prenatal yoga to improve flexibility and reduce stress",
        "Swimming is excellent low-impact exercise during pregnancy",
        "Walking is safe throughout pregnancy and helps with circulation",
        "Avoid contact sports and activities with fall risk"
    ],
    wellness: [
        "Practice stress-reduction techniques like meditation or deep breathing",
        "Get 7-9 hours of sleep per night when possible",
        "Take time for self-care and activities you enjoy",
        "Stay connected with supportive friends and family",
        "Consider prenatal massage for relaxation and comfort"
    ],
    safety: [
        "Avoid raw or undercooked meats, eggs, and seafood",
        "Limit exposure to cleaning chemicals and paint fumes",
        "Wear seatbelts properly with the lap belt under your belly",
        "Avoid hot tubs, saunas, and activities that raise core body temperature",
        "Stay up to date with recommended vaccines during pregnancy"
    ]
};

/**
 * Load and display weekly tips based on pregnancy week
 * @param {number} week - Current pregnancy week
 */
function loadWeeklyTips(week) {
    const tipsContainer = document.getElementById('tipsContainer');
    if (!tipsContainer) return;

    const tips = getAvailableTips(week);
    
    if (tips.length === 0) {
        tipsContainer.innerHTML = `
            <div class="loading">
                <div>No tips available for this week. Please check back later!</div>
            </div>
        `;
        return;
    }

    tipsContainer.innerHTML = tips.map(tip => `
        <div class="tip-item" data-category="${tip.category.toLowerCase()}">
            <div class="tip-category">${tip.category}</div>
            <div class="tip-content">${tip.tip}</div>
            <div class="tip-actions">
                <button class="tip-action-btn" onclick="markTipAsRead(this)" title="Mark as read">✓</button>
                <button class="tip-action-btn" onclick="saveTipToNotes('${tip.tip.replace(/'/g, "\\'")}', '${tip.category}')" title="Save to notes">📝</button>
            </div>
        </div>
    `).join('');
}

/**
 * Get available tips for a specific week
 * @param {number} week - Pregnancy week
 * @returns {Array} Array of tips for the week
 */
function getAvailableTips(week) {
    // Find the closest week with tips
    let closestWeek = 1;
    const availableWeeks = Object.keys(pregnancyTips).map(Number).sort((a, b) => a - b);
    
    for (let availableWeek of availableWeeks) {
        if (availableWeek <= week) {
            closestWeek = availableWeek;
        }
    }
    
    return pregnancyTips[closestWeek] || pregnancyTips[1];
}

/**
 * Get tips by category
 * @param {string} category - Category of tips ('nutrition', 'exercise', 'wellness', 'safety')
 * @returns {Array} Array of tips for the category
 */
function getTipsByCategory(category) {
    return categoryTips[category] || [];
}

/**
 * Search tips by keyword
 * @param {string} keyword - Search keyword
 * @returns {Array} Array of matching tips
 */
function searchTips(keyword) {
    const allTips = [];
    
    // Search in weekly tips
    Object.values(pregnancyTips).forEach(weekTips => {
        weekTips.forEach(tip => {
            if (tip.tip.toLowerCase().includes(keyword.toLowerCase()) || 
                tip.category.toLowerCase().includes(keyword.toLowerCase())) {
                allTips.push(tip);
            }
        });
    });
    
    // Search in category tips
    Object.keys(categoryTips).forEach(category => {
        categoryTips[category].forEach(tip => {
            if (tip.toLowerCase().includes(keyword.toLowerCase())) {
                allTips.push({
                    category: category.charAt(0).toUpperCase() + category.slice(1),
                    tip: tip
                });
            }
        });
    });
    
    // Remove duplicates
    return allTips.filter((tip, index, self) => 
        index === self.findIndex(t => t.tip === tip.tip)
    );
}

/**
 * Mark tip as read
 * @param {HTMLElement} button - The button element clicked
 */
function markTipAsRead(button) {
    const tipItem = button.closest('.tip-item');
    if (tipItem) {
        tipItem.classList.add('tip-read');
        button.style.opacity = '0.5';
        button.disabled = true;
        
        // Save read status if user is logged in
        if (currentUser) {
            if (!currentUser.readTips) currentUser.readTips = [];
            const tipContent = tipItem.querySelector('.tip-content').textContent;
            if (!currentUser.readTips.includes(tipContent)) {
                currentUser.readTips.push(tipContent);
                updateCurrentUser(currentUser);
            }
        }
    }
}

/**
 * Save tip to user's notes
 * @param {string} tipContent - Content of the tip
 * @param {string} category - Category of the tip
 */
function saveTipToNotes(tipContent, category) {
    if (!currentUser) {
        showNotification('Please log in to save tips to notes', 'error');
        return;
    }
    
    if (!currentUser.notes) currentUser.notes = [];
    
    const newNote = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        title: `Tip: ${category}`,
        content: tipContent,
        createdAt: new Date().toISOString(),
        source: 'tip'
    };
    
    currentUser.notes.push(newNote);
    updateCurrentUser(currentUser);
    showNotification('Tip saved to your notes!', 'success');
}

/**
 * Filter tips by category
 * @param {string} category - Category to filter by
 */
function filterTipsByCategory(category) {
    const tipItems = document.querySelectorAll('.tip-item');
    
    tipItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category.toLowerCase()) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Get personalized tips based on user's week and preferences
 * @param {number} week - Current pregnancy week
 * @param {Array} preferences - User's preference categories
 * @returns {Array} Personalized tips
 */
function getPersonalizedTips(week, preferences = []) {
    const weekTips = getAvailableTips(week);
    
    if (preferences.length === 0) {
        return weekTips;
    }
    
    // Filter tips based on user preferences
    const filteredTips = weekTips.filter(tip => 
        preferences.includes(tip.category.toLowerCase())
    );
    
    // If filtered tips are too few, add some general tips
    if (filteredTips.length < 3) {
        const additionalTips = weekTips.filter(tip => 
            !preferences.includes(tip.category.toLowerCase())
        ).slice(0, 3 - filteredTips.length);
        
        return [...filteredTips, ...additionalTips];
    }
    
    return filteredTips;
}

/**
 * Get tip of the day
 * @returns {Object} Random tip for the day
 */
function getTipOfTheDay() {
    const allTips = [];
    Object.values(pregnancyTips).forEach(weekTips => {
        allTips.push(...weekTips);
    });
    
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const tipIndex = dayOfYear % allTips.length;
    
    return allTips[tipIndex];
}

/**
 * Check if user has read a tip
 * @param {string} tipContent - Content of the tip to check
 * @returns {boolean} True if tip has been read
 */
function isTipRead(tipContent) {
    if (!currentUser || !currentUser.readTips) return false;
    return currentUser.readTips.includes(tipContent);
}

/**
 * Get statistics about user's tip engagement
 * @returns {Object} Tip engagement statistics
 */
function getTipStats() {
    if (!currentUser) return { read: 0, saved: 0, total: 0 };
    
    const readTips = currentUser.readTips ? currentUser.readTips.length : 0;
    const savedTips = currentUser.notes ? 
        currentUser.notes.filter(note => note.source === 'tip').length : 0;
    
    const allTipsCount = Object.values(pregnancyTips).reduce((total, tips) => total + tips.length, 0);
    
    return {
        read: readTips,
        saved: savedTips,
        total: allTipsCount,
        readPercentage: Math.round((readTips / allTipsCount) * 100)
    };
}