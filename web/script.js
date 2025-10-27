// Categories for events and posts
const categories = [
    'IT', 'AI', 'Accounting', 'Marketing', 'Finance', 
    'Healthcare', 'Education', 'Engineering', 'Sales', 
    'Human Resources', 'Design', 'Legal', 'Other'
];

// User preferences
let userPreferences = {};

// Profile change requests (for company users)
let profileChangeRequests = [];

// Messages database
let messages = [];
let nextMessageId = 1;

// Event comments
let eventComments = [];
let nextCommentId = 1;

// Deleted comments (for admin review)
let deletedComments = [];

// Edit history for posts and events
let editHistory = [];
let nextEditHistoryId = 1;

// Event registrations with approval status
let eventRegistrations = [];
let nextRegistrationId = 1;

// Users database
let users = {
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        email: 'admin@system.com',
        blocked: false,
        approved: true,
        interests: ['IT', 'AI', 'Management'],
        joinedDate: new Date('2025-01-01').toISOString()
    },
    organizer1: {
        username: 'organizer1',
        password: 'org123',
        role: 'organizer',
        name: 'Event Organizer',
        email: 'organizer@events.com',
        blocked: false,
        approved: true,
        interests: ['IT', 'AI'],
        joinedDate: new Date('2025-01-15').toISOString()
    },
    company1: {
        username: 'company1',
        password: 'company123',
        role: 'company',
        name: 'Tech Corp',
        email: 'contact@techcorp.com',
        blocked: false,
        approved: true,
        interests: ['IT', 'Engineering'],
        joinedDate: new Date('2025-02-15').toISOString(),
        website: 'https://techcorp.example.com',
        description: 'Leading technology company specializing in software development and IT solutions.',
        links: [
            { title: 'LinkedIn', url: 'https://linkedin.com/company/techcorp' },
            { title: 'GitHub', url: 'https://github.com/techcorp' }
        ]
    },
    company2: {
        username: 'company2',
        password: 'company123',
        role: 'company',
        name: 'Innovation Labs',
        email: 'info@innovationlabs.com',
        blocked: false,
        approved: true,
        interests: ['AI', 'Design'],
        joinedDate: new Date('2025-03-10').toISOString(),
        website: 'https://innovationlabs.example.com',
        description: 'Innovative AI research and development company focused on machine learning solutions.',
        links: [
            { title: 'Website', url: 'https://innovationlabs.com' },
            { title: 'Twitter', url: 'https://twitter.com/innovationlabs' }
        ]
    },
    user: {
        username: 'user',
        password: 'user123',
        role: 'user',
        name: 'Normal User',
        email: 'user@example.com',
        blocked: false,
        approved: true,
        interests: ['IT', 'Marketing'],
        joinedDate: new Date('2025-02-01').toISOString()
    },
    user2: {
        username: 'user2',
        password: 'user123',
        role: 'user',
        name: 'John Doe',
        email: 'john@example.com',
        blocked: false,
        approved: true,
        interests: ['Finance', 'Accounting'],
        joinedDate: new Date('2025-03-01').toISOString()
    },
    user3: {
        username: 'user3',
        password: 'user123',
        role: 'user',
        name: 'Jane Smith',
        email: 'jane@example.com',
        blocked: false,
        approved: true,
        interests: ['AI', 'Healthcare'],
        joinedDate: new Date('2025-04-01').toISOString()
    }
};

// Posts data (submitted by users, needs admin approval)
let posts = [
    {
        id: 1,
        title: 'Welcome to our Event System',
        content: 'This is a sample post that has been approved. We are excited to have you here! Feel free to explore all the events and create your own posts.',
        author: 'user',
        authorName: 'Normal User',
        category: 'IT',
        date: new Date().toISOString(),
        status: 'approved',
        likes: 5,
        likedBy: ['user2', 'user3'],
        comments: [
            { username: 'user2', name: 'John Doe', text: 'Great post!', date: new Date().toISOString() }
        ]
    }
];

let nextPostId = 2;

// Sample events data
let events = [
    {
        id: 1,
        title: 'JavaScript Workshop',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        location: 'Room 101',
        description: 'Learn modern JavaScript techniques and best practices.',
        category: 'IT',
        status: 'approved',
        createdBy: 'admin',
        creatorName: 'Admin User',
        maxAttendees: 30,
        subscribers: [],
        visibleFields: ['name', 'email', 'phone'],
            views: 45,
        likes: 8,
        comments: [],
        autoApprove: true
    },
    {
        id: 2,
        title: 'Team Assessment Meeting',
        date: new Date().toISOString().split('T')[0],
        time: '14:00',
        location: 'Conference Room A',
        description: 'Quarterly assessment review with team leads.',
        category: 'Accounting',
        status: 'approved',
        createdBy: 'admin',
        creatorName: 'Admin User',
        maxAttendees: 20,
        subscribers: [],
        visibleFields: ['name', 'email'],
        views: 30,
        likes: 5,
        comments: [],
        autoApprove: false
    },
    {
        id: 3,
        title: 'AI and Machine Learning Summit',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '09:00',
        location: 'Main Auditorium',
        description: 'Explore the future of AI and machine learning in business.',
        category: 'AI',
        status: 'approved',
        createdBy: 'company1',
        creatorName: 'Tech Corp',
        maxAttendees: 100,
        subscribers: [],
        visibleFields: ['name', 'email', 'phone', 'company'],
        views: 120,
        likes: 25,
        comments: [],
        autoApprove: true
    },
    {
        id: 4,
        title: 'Marketing Strategy Workshop',
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        time: '15:00',
        location: 'Room 205',
        description: 'Learn modern marketing strategies and digital campaigns.',
        category: 'Marketing',
        status: 'approved',
        createdBy: 'organizer1',
        creatorName: 'Event Organizer',
        maxAttendees: 15,
        subscribers: [],
        visibleFields: ['name'],
        views: 60,
        likes: 12,
        comments: [],
        autoApprove: false
    },
    {
        id: 5,
        title: 'Financial Planning Seminar',
        date: new Date().toISOString().split('T')[0],
        time: '16:30',
        location: 'Room 303',
        description: 'Corporate financial planning and budgeting strategies.',
        category: 'Finance',
        status: 'approved',
        createdBy: 'admin',
        creatorName: 'Admin User',
        maxAttendees: 25,
        subscribers: [],
        visibleFields: ['name', 'email'],
        views: 40,
        likes: 7,
        comments: [],
        autoApprove: true
    }
];

let nextEventId = 6;

let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('addEventForm').addEventListener('submit', handleAddEvent);
    document.getElementById('addPostForm').addEventListener('submit', handleAddPost);
    document.getElementById('subscriptionForm').addEventListener('submit', handleSubscription);
    updateCurrentDate();
    populateLocationFilter();
    
    // Show main content by default (public access)
    displayEvents();
    displayPosts();
    updateUIForGuest();
});

function updateCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
}

function populateLocationFilter() {
    const locationFilter = document.getElementById('locationFilter');
    
    // Get unique locations from approved events
    const locations = [...new Set(events
        .filter(e => e.status === 'approved' && e.location)
        .map(e => e.location)
    )].sort();
    
    // Clear existing options except "All Locations"
    locationFilter.innerHTML = '<option value="">All Locations</option>';
    
    // Add location options
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users[username];
    
    if (user && user.password === password) {
        if (user.blocked) {
            alert('Your account has been blocked. Please contact the administrator.');
            return;
        }
        if (user.role === 'company' && !user.approved) {
            alert('Your company account is pending admin approval. Please wait for approval before logging in.');
            return;
        }
        currentUser = user;
        closeAuthSection();
        updateUIForLoggedInUser();
        alert(`Welcome back, ${currentUser.name}!`);
    } else {
        alert('Invalid username or password!');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('regFullName').value;
    const username = document.getElementById('regUsername').value.toLowerCase();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const accountType = document.getElementById('regAccountType').value;
    
    // Get selected interests
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]:checked');
    const interests = Array.from(interestCheckboxes).map(cb => cb.value);
    
    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (interests.length < 2) {
        alert('Please select at least 2 interests!');
        return;
    }
    
    if (users[username]) {
        alert('Username already exists! Please choose another one.');
        return;
    }
    
    // Check if email already exists
    const emailExists = Object.values(users).some(user => user.email === email);
    if (emailExists) {
        alert('Email already registered!');
        return;
    }
    
    // Create new user
    const isCompany = accountType === 'company';
    users[username] = {
        username: username,
        password: password,
        role: accountType,
        name: fullName,
        email: email,
        blocked: false,
        approved: !isCompany, // Regular users and organizers are auto-approved, companies need approval
        interests: interests,
        joinedDate: new Date().toISOString()
    };
    
    if (isCompany) {
        alert('Company account registered successfully! Your account is pending admin approval. You will be notified once approved.');
        updatePendingCompaniesCount();
    } else {
        alert('Registration successful! You can now login.');
    }
    
    document.getElementById('registerForm').reset();
    showLoginCard();
}

function showAuthSection() {
    document.getElementById('authSection').style.display = 'flex';
    showLoginCard();
}

function closeAuthSection() {
    document.getElementById('authSection').style.display = 'none';
}

function showLoginCard() {
    document.getElementById('loginCard').style.display = 'block';
    document.getElementById('registerCard').style.display = 'none';
}

function showRegisterCard() {
    document.getElementById('loginCard').style.display = 'none';
    document.getElementById('registerCard').style.display = 'block';
}

function updateUIForGuest() {
    document.getElementById('guestInfo').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('adminControls').style.display = 'none';
    document.getElementById('organizerControls').style.display = 'none';
    document.getElementById('companyControls').style.display = 'none';
    document.getElementById('userControls').style.display = 'none';
    document.getElementById('guestControls').style.display = 'block';
    
    // Display content for guests (read-only)
    displayEvents();
    displayPosts();
}

function updateUIForLoggedInUser() {
    document.getElementById('guestInfo').style.display = 'none';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('guestControls').style.display = 'none';
    document.getElementById('userName').textContent = `👤 ${currentUser.name}`;
    
    if (currentUser.role === 'admin') {
        document.getElementById('adminControls').style.display = 'block';
        updatePendingCounts();
    } else if (currentUser.role === 'organizer') {
        document.getElementById('organizerControls').style.display = 'block';
        updatePendingCount(); // Show pending posts for organizer
    } else if (currentUser.role === 'company') {
        document.getElementById('companyControls').style.display = 'block';
    } else {
        document.getElementById('userControls').style.display = 'block';
    }
    
    displayEvents();
    displayPosts();
}

function logout() {
    currentUser = null;
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('adminControls').style.display = 'none';
    document.getElementById('organizerControls').style.display = 'none';
    document.getElementById('userControls').style.display = 'none';
    document.getElementById('companyControls').style.display = 'none';
    document.getElementById('loginForm').reset();
    updateUIForGuest();
    alert('You have been logged out successfully!');
}

function displayEvents() {
    const today = new Date().toISOString().split('T')[0];
    
    // Filter events based on status - show only approved events or all if admin
    const visibleEvents = currentUser && currentUser.role === 'admin' 
        ? events 
        : events.filter(event => event.status === 'approved');
    
    // Today's events
    const todayEvents = visibleEvents.filter(event => event.date === today);
    const todayEventsList = document.getElementById('eventsList');
    
    if (todayEvents.length === 0) {
        todayEventsList.innerHTML = '<div class="no-events">No events scheduled for today</div>';
    } else {
        todayEventsList.innerHTML = todayEvents.map(event => createEventCard(event)).join('');
    }
    
    // All upcoming events
    const upcomingEvents = visibleEvents.filter(event => event.date >= today).sort((a, b) => {
        if (a.date === b.date) {
            return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
    });
    
    const allEventsList = document.getElementById('allEventsList');
    
    if (upcomingEvents.length === 0) {
        allEventsList.innerHTML = '<div class="no-events">No upcoming events</div>';
    } else {
        allEventsList.innerHTML = upcomingEvents.map(event => createEventCard(event)).join('');
    }
}

function createEventCard(event) {
    const deleteButton = currentUser && currentUser.role === 'admin' 
        ? `<button class="delete-btn" onclick="deleteEvent(${event.id}); event.stopPropagation();">×</button>` 
        : '';
    
    const readOnlyBadge = !currentUser ? '<span class="read-only-badge">👁️ View Only</span>' : '';
    
    const pendingBadge = event.status === 'pending' 
        ? '<span class="pending-badge-event">⏳ Pending Approval</span>' 
        : '';
    
    const creatorBadge = event.createdBy && currentUser && currentUser.role === 'admin'
        ? `<span class="creator-badge">📝 by ${event.creatorName}</span>`
        : '';
    
    // Check if creator is a company to make name clickable
    const creatorUser = users[event.createdBy];
    const creatorDisplay = creatorUser && creatorUser.role === 'company' && event.status === 'approved'
        ? `<span class="company-link" onclick="showCompanyProfile('${event.createdBy}'); event.stopPropagation();">🏢 ${event.creatorName}</span>`
        : '';
    
    const eventDate = new Date(event.date + 'T00:00:00');
    const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Get user's registration status
    const userRegistration = currentUser ? eventRegistrations.find(r => 
        r.eventId === event.id && r.username === currentUser.username
    ) : null;
    
    // Calculate available spots (only count accepted registrations)
    const acceptedCount = eventRegistrations.filter(r => 
        r.eventId === event.id && r.status === 'accepted'
    ).length;
    const spotsLeft = event.maxAttendees - acceptedCount;
    const isFull = spotsLeft <= 0;
    
    // Check if user can see capacity (creator or admin)
    const isCreator = currentUser && event.createdBy === currentUser.username;
    const isAdmin = currentUser && currentUser.role === 'admin';
    const canSeeCapacity = isCreator || isAdmin || !event.hideCapacity;
    
    // Registration status badge for user
    let registrationBadge = '';
    if (userRegistration && event.status === 'approved') {
        if (userRegistration.status === 'accepted') {
            registrationBadge = '<span class="subscribed-badge">✓ Registered</span>';
        } else if (userRegistration.status === 'pending') {
            registrationBadge = '<span class="status-badge status-pending">⏱ Pending</span>';
        } else if (userRegistration.status === 'rejected') {
            registrationBadge = '<span class="status-badge status-rejected">✗ Rejected</span>';
        }
    }
    
    const subscriptionInfo = event.status === 'approved' ? `
        <div class="subscription-info">
            ${canSeeCapacity ? 
                `<span class="spots-left ${isFull ? 'full' : ''}">${isFull ? '🔴 Full' : `🟢 ${spotsLeft} spots left`}</span>` 
                : 
                `<span class="spots-left">${isFull ? '🔴 Full' : '🟢 Available'}</span>`
            }
            ${registrationBadge}
        </div>
    ` : '';
    
    return `
        <div class="event-card ${!currentUser ? 'read-only-card' : ''} ${event.status === 'pending' ? 'pending-event-card' : ''}" onclick="showEventDetails(${event.id})">
            ${deleteButton}
            ${readOnlyBadge}
            ${pendingBadge}
            ${creatorBadge}
            ${creatorDisplay}
            <span class="event-category">${event.category}</span>
            <h3>${event.title}</h3>
            <div class="event-time">
                <span>🕒</span>
                <span>${formattedDate} at ${event.time}</span>
            </div>
            <div class="event-location">
                <span>📍</span>
                <span>${event.location}</span>
            </div>
            ${subscriptionInfo}
            ${event.status === 'approved' && event.comments ? `<div class="event-comments-count">💬 ${event.comments.length} comments</div>` : ''}
        </div>
    `;
}

function showEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const eventDate = new Date(event.date + 'T00:00:00');
    const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const isCreator = currentUser && event.createdBy === currentUser.username;
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    // Get user's registration status
    const userRegistration = getMyRegistrationStatus(event.id);
    
    // Count accepted registrations for capacity
    const acceptedCount = eventRegistrations.filter(r => 
        r.eventId === event.id && r.status === 'accepted'
    ).length;
    const spotsLeft = event.maxAttendees - acceptedCount;
    const isFull = spotsLeft <= 0;
    
    // Check if user can see capacity
    const canSeeCapacity = isCreator || isAdmin || !event.hideCapacity;
    
    let actionButton = '';
    if (currentUser && event.status === 'approved') {
        if (userRegistration) {
            let statusIcon = userRegistration === 'accepted' ? '✓' :
                            userRegistration === 'rejected' ? '✗' : '⏱';
            let statusClass = userRegistration === 'accepted' ? 'status-accepted' :
                             userRegistration === 'rejected' ? 'status-rejected' : 'status-pending';
            
            actionButton = `
                <div style="text-align: center;">
                    <span class="status-badge ${statusClass}">${statusIcon} ${userRegistration.toUpperCase()}</span>
                    ${userRegistration === 'pending' ? 
                        `<br><button class="btn-danger" style="margin-top: 10px;" onclick="unsubscribeFromEvent(${event.id}); event.stopPropagation();">Cancel Registration</button>` 
                        : ''
                    }
                </div>
            `;
        } else if (!isFull) {
            actionButton = `<button class="btn-success" onclick="showSubscriptionModal(${event.id}); event.stopPropagation();">Register for Event</button>`;
        } else {
            actionButton = `<button class="btn-disabled" disabled>Event Full</button>`;
        }
    } else if (!currentUser) {
        actionButton = `<p class="login-prompt">Please <a href="#" onclick="showAuthSection(); return false;">login</a> to register for this event</p>`;
    }
    
    // Edit and manage section for creator/admin
    let managementSection = '';
    if (isCreator || isAdmin) {
        const pendingCount = eventRegistrations.filter(r => 
            r.eventId === event.id && r.status === 'pending'
        ).length;
        
        managementSection = `
            <div class="event-management-section">
                ${isCreator ? `<button class="btn-secondary" onclick="showEditEventModal(${event.id}); event.stopPropagation();">✏️ Edit Event</button>` : ''}
                ${isAdmin ? `<button class="btn-secondary" onclick="showEditHistory('event', ${event.id}); event.stopPropagation();">📜 View Edit History</button>` : ''}
                <button class="btn-info" onclick="showRegistrationsModal(${event.id}); event.stopPropagation();">
                    📋 Manage Registrations ${pendingCount > 0 ? `<span class="badge">${pendingCount}</span>` : ''}
                </button>
            </div>
        `;
    }
    
    // Capacity display based on privacy settings
    let capacityDisplay = '';
    if (canSeeCapacity) {
        capacityDisplay = `${acceptedCount}/${event.maxAttendees} registered
            ${isFull ? ' <span class="full-badge">FULL</span>' : ` (${spotsLeft} spots available)`}`;
    } else {
        capacityDisplay = event.hideCapacity ? '🔒 Private' : `${acceptedCount}/${event.maxAttendees}`;
    }
    
    // Check if event is by a company
    const creatorUser = users[event.createdBy];
    const isCompanyEvent = creatorUser && creatorUser.role === 'company';
    const companySection = isCompanyEvent ? `
        <div class="event-detail-item">
            <strong>Organized by:</strong> 
            <span class="company-link" onclick="showCompanyProfile('${event.createdBy}'); event.stopPropagation();">
                🏢 ${event.creatorName}
            </span>
            ${currentUser && currentUser.username !== event.createdBy ? 
                `<button class="btn-message" onclick="startConversationWith('${event.createdBy}'); event.stopPropagation();">📨 Message</button>` 
                : ''
            }
        </div>
    ` : '';
    
    // Comments section
    const commentsSection = event.status === 'approved' ? `
        <div class="event-comments-section">
            <button class="btn-secondary" onclick="showEventComments(${event.id}); event.stopPropagation();">
                💬 View Comments (${event.comments ? event.comments.length : 0})
            </button>
        </div>
    ` : '';
    
    const detailsHTML = `
        <div class="event-detail">
            <h2>${event.title}</h2>
            ${managementSection}
            <div class="event-detail-item">
                <strong>Category:</strong> ${event.category}
            </div>
            ${companySection}
            <div class="event-detail-item">
                <strong>Date:</strong> ${formattedDate}
            </div>
            <div class="event-detail-item">
                <strong>Time:</strong> ${event.time}
            </div>
            <div class="event-detail-item">
                <strong>Location:</strong> ${event.location}
            </div>
            <div class="event-detail-item">
                <strong>Capacity:</strong> ${capacityDisplay}
            </div>
            <div class="event-detail-item">
                <strong>Registration:</strong> ${event.autoApprove ? '✓ Auto-approved (instant confirmation)' : '⏱ Requires approval from organizer'}
            </div>
            <div class="event-detail-item">
                <strong>Description:</strong><br>${event.description}
            </div>
            ${commentsSection}
            <div class="event-actions">
                ${actionButton}
            </div>
        </div>
    `;
    
    document.getElementById('eventDetails').innerHTML = detailsHTML;
    document.getElementById('eventModal').style.display = 'block';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
}

function showAddEventModal() {
    if (!currentUser) {
        alert('Please login or register to create events!');
        showAuthSection();
        return;
    }
    document.getElementById('addEventModal').style.display = 'block';
}

function closeAddEventModal() {
    document.getElementById('addEventModal').style.display = 'none';
    document.getElementById('addEventForm').reset();
}

function handleAddEvent(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login to create events!');
        return;
    }
    
    // Determine event status based on user role
    let eventStatus = 'pending'; // Default for regular users
    if (currentUser.role === 'admin' || currentUser.role === 'company' || currentUser.role === 'organizer') {
        eventStatus = 'approved'; // Admin, organizer, and company users can create events directly
    }
    
    // Get visible fields selections
    const visibleFields = [];
    if (document.getElementById('visibleName').checked) visibleFields.push('name');
    if (document.getElementById('visibleEmail').checked) visibleFields.push('email');
    if (document.getElementById('visiblePhone').checked) visibleFields.push('phone');
    if (document.getElementById('visibleCompany').checked) visibleFields.push('company');
    
    // Get privacy settings
    const hideCapacity = document.getElementById('hideCapacity').checked;
    
    // Get auto-approval setting
    const autoApprove = document.getElementById('autoApprove').checked;
    
    const newEvent = {
        id: nextEventId++,
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        category: document.getElementById('eventCategory').value,
        maxAttendees: parseInt(document.getElementById('eventMaxAttendees').value) || 50,
        status: eventStatus,
        createdBy: currentUser.username,
        creatorName: currentUser.name,
        subscribers: [],
        visibleFields: visibleFields.length > 0 ? visibleFields : ['name', 'email'],
        hideCapacity: hideCapacity, // Privacy setting
        autoApprove: autoApprove, // Auto-approval setting
        views: 0,
        likes: 0,
        comments: []
    };
    
    events.push(newEvent);
    displayEvents();
    populateLocationFilter(); // Update location filter
    closeAddEventModal();
    
    if (eventStatus === 'approved') {
        alert('Event created successfully!');
    } else {
        alert('Event submitted successfully! Waiting for admin approval.');
        updatePendingEventsCount();
    }
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(e => e.id !== eventId);
        displayEvents();
        populateLocationFilter(); // Update location filter
    }
}

// Event Subscription Functions
function showSubscriptionModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    document.getElementById('subscriptionEventId').value = eventId;
    document.getElementById('subscriptionEventTitle').textContent = event.title;
    
    // Show/hide fields based on event's visible fields
    const visibleFields = event.visibleFields || ['name', 'email'];
    
    document.getElementById('subNameGroup').style.display = visibleFields.includes('name') ? 'block' : 'none';
    document.getElementById('subEmailGroup').style.display = visibleFields.includes('email') ? 'block' : 'none';
    document.getElementById('subPhoneGroup').style.display = visibleFields.includes('phone') ? 'block' : 'none';
    document.getElementById('subCompanyGroup').style.display = visibleFields.includes('company') ? 'block' : 'none';
    
    // Pre-fill with user data
    if (currentUser) {
        document.getElementById('subName').value = currentUser.name || '';
        document.getElementById('subEmail').value = currentUser.email || '';
    }
    
    document.getElementById('subscriptionModal').style.display = 'block';
}

function closeSubscriptionModal() {
    document.getElementById('subscriptionModal').style.display = 'none';
    document.getElementById('subscriptionForm').reset();
}

function handleSubscription(e) {
    e.preventDefault();
    
    const eventId = parseInt(document.getElementById('subscriptionEventId').value);
    const event = events.find(e => e.id === eventId);
    
    if (!event) {
        alert('Event not found!');
        return;
    }
    
    const spotsLeft = event.maxAttendees - (event.subscribers ? event.subscribers.length : 0);
    if (spotsLeft <= 0) {
        alert('Sorry, this event is full!');
        closeSubscriptionModal();
        return;
    }
    
    // Create registration with status based on autoApprove setting
    const initialStatus = event.autoApprove ? 'accepted' : 'pending';
    
    const registration = {
        id: nextRegistrationId++,
        eventId: eventId,
        username: currentUser.username,
        name: document.getElementById('subName').value,
        email: document.getElementById('subEmail').value,
        phone: document.getElementById('subPhone').value,
        company: document.getElementById('subCompany').value,
        status: initialStatus, // pending, accepted, rejected
        registeredAt: new Date().toISOString(),
        respondedAt: event.autoApprove ? new Date().toISOString() : null,
        respondedBy: event.autoApprove ? 'Auto-Approved' : null
    };
    
    eventRegistrations.push(registration);
    
    closeSubscriptionModal();
    closeEventModal();
    displayEvents();
    
    if (event.autoApprove) {
        alert(`Registration confirmed for "${event.title}"! You have been automatically approved.`);
    } else {
        alert(`Registration submitted for "${event.title}"! Waiting for approval from event creator.`);
    }
}

function unsubscribeFromEvent(eventId) {
    if (!confirm('Are you sure you want to cancel your registration?')) {
        return;
    }
    
    // Remove registration
    const registrationIndex = eventRegistrations.findIndex(r => 
        r.eventId === eventId && r.username === currentUser.username
    );
    
    if (registrationIndex > -1) {
        eventRegistrations.splice(registrationIndex, 1);
    }
    
    closeEventModal();
    displayEvents();
    alert('Your registration has been cancelled.');
}

function showSubscribersModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const isCreator = currentUser && event.createdBy === currentUser.username;
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    if (!isCreator && !isAdmin) {
        alert('You do not have permission to view attendees.');
        return;
    }
    
    const visibleFields = event.visibleFields || ['name', 'email'];
    
    let subscribersHTML = '';
    if (event.subscribers && event.subscribers.length > 0) {
        subscribersHTML = event.subscribers.map((sub, index) => {
            let details = `<div class="subscriber-item">
                <h4>Attendee ${index + 1}</h4>`;
            
            if (visibleFields.includes('name')) {
                details += `<p><strong>Name:</strong> ${sub.name}</p>`;
            }
            if (visibleFields.includes('email')) {
                details += `<p><strong>Email:</strong> ${sub.email}</p>`;
            }
            if (visibleFields.includes('phone') && sub.phone) {
                details += `<p><strong>Phone:</strong> ${sub.phone}</p>`;
            }
            if (visibleFields.includes('company') && sub.company) {
                details += `<p><strong>Company:</strong> ${sub.company}</p>`;
            }
            
            const regDate = new Date(sub.registeredAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            details += `<p class="reg-date">📅 Registered: ${regDate}</p>`;
            
            // Admin can see full data
            if (isAdmin) {
                details += `<p class="admin-info">👤 User: @${sub.username}</p>`;
            }
            
            details += `</div>`;
            return details;
        }).join('');
    } else {
        subscribersHTML = '<div class="no-events">No attendees yet</div>';
    }
    
    document.getElementById('subscribersEventTitle').textContent = event.title;
    document.getElementById('subscribersCount').textContent = 
        `${event.subscribers ? event.subscribers.length : 0}/${event.maxAttendees} registered`;
    document.getElementById('subscribersList').innerHTML = subscribersHTML;
    document.getElementById('subscribersModal').style.display = 'block';
}

function closeSubscribersModal() {
    document.getElementById('subscribersModal').style.display = 'none';
}

// Settings Modal Functions
function showSettingsModal() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const user = users[currentUser];
    
    // Load profile data
    document.getElementById('settingsUsername').value = currentUser;
    document.getElementById('settingsName').value = user.name || '';
    document.getElementById('settingsEmail').value = user.email || '';
    document.getElementById('settingsPhone').value = user.phone || '';
    document.getElementById('settingsCompany').value = user.company || '';
    
    // Load interests
    const interestsContainer = document.getElementById('settingsInterests');
    interestsContainer.innerHTML = categories.map(category => `
        <label class="checkbox-label">
            <input type="checkbox" name="settingsInterests" value="${category}" 
                ${user.interests && user.interests.includes(category) ? 'checked' : ''}>
            ${category}
        </label>
    `).join('');
    
    // Load profile photo
    if (user.profilePhoto) {
        document.getElementById('profilePhotoPreview').src = user.profilePhoto;
    } else {
        document.getElementById('profilePhotoPreview').src = '';
    }
    
    // Show warning for company users
    if (user.role === 'company') {
        document.getElementById('companyRequestWarning').style.display = 'block';
        document.getElementById('saveProfileBtn').textContent = 'Submit for Approval';
    } else {
        document.getElementById('companyRequestWarning').style.display = 'none';
        document.getElementById('saveProfileBtn').textContent = 'Save Changes';
    }
    
    // Load account info
    document.getElementById('accountUsername').textContent = currentUser;
    document.getElementById('accountRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    document.getElementById('accountStatus').textContent = user.approved ? '✅ Approved' : '⏳ Pending Approval';
    
    // Load preferences
    const prefs = userPreferences[currentUser] || {
        emailNotifications: true,
        eventReminders: true,
        marketingEmails: false,
        theme: 'light',
        language: 'en'
    };
    
    document.getElementById('emailNotifications').checked = prefs.emailNotifications;
    document.getElementById('eventReminders').checked = prefs.eventReminders;
    document.getElementById('marketingEmails').checked = prefs.marketingEmails;
    document.getElementById('themeSelect').value = prefs.theme;
    document.getElementById('languageSelect').value = prefs.language;
    
    // Show modal and default tab
    switchSettingsTab('profile');
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function switchSettingsTab(tab) {
    // Hide all sections
    document.getElementById('profileSettings').style.display = 'none';
    document.getElementById('accountSettings').style.display = 'none';
    document.getElementById('preferencesSettings').style.display = 'none';
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.settings-tab');
    tabs.forEach(t => t.classList.remove('active'));
    
    // Show selected section and activate tab
    if (tab === 'profile') {
        document.getElementById('profileSettings').style.display = 'block';
        tabs[0].classList.add('active');
    } else if (tab === 'account') {
        document.getElementById('accountSettings').style.display = 'block';
        tabs[1].classList.add('active');
    } else if (tab === 'preferences') {
        document.getElementById('preferencesSettings').style.display = 'block';
        tabs[2].classList.add('active');
    }
}

function updateProfile(e) {
    e.preventDefault();
    
    const user = users[currentUser];
    
    // Get selected interests
    const interestCheckboxes = document.querySelectorAll('input[name="settingsInterests"]:checked');
    const interests = Array.from(interestCheckboxes).map(cb => cb.value);
    
    if (interests.length < 2) {
        alert('Please select at least 2 interests!');
        return;
    }
    
    const newData = {
        name: document.getElementById('settingsName').value,
        email: document.getElementById('settingsEmail').value,
        phone: document.getElementById('settingsPhone').value,
        company: document.getElementById('settingsCompany').value,
        interests: interests,
        profilePhoto: user.profilePhoto || ''
    };
    
    // If company user, create approval request
    if (user.role === 'company') {
        const request = {
            id: Date.now(),
            username: currentUser,
            currentData: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                company: user.company,
                interests: user.interests,
                profilePhoto: user.profilePhoto || ''
            },
            newData: newData,
            requestedAt: new Date().toISOString(),
            status: 'pending'
        };
        
        profileChangeRequests.push(request);
        updatePendingCounts();
        alert('✅ Profile change request submitted! Waiting for admin approval.');
        closeSettingsModal();
    } else {
        // Direct update for admin, organizers, and regular users
        user.name = newData.name;
        user.email = newData.email;
        user.phone = newData.phone;
        user.company = newData.company;
        user.interests = newData.interests;
        
        alert('✅ Profile updated successfully!');
        document.getElementById('userName').textContent = `👤 ${user.name}`;
        
        // Update user display in events/posts
        displayEvents();
        displayPosts();
    }
}

function changePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const user = users[currentUser];
    
    if (user.password !== currentPassword) {
        alert('Current password is incorrect');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    user.password = newPassword;
    alert('Password changed successfully!');
    
    // Clear form
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

function savePreferences(e) {
    e.preventDefault();
    
    userPreferences[currentUser] = {
        emailNotifications: document.getElementById('emailNotifications').checked,
        eventReminders: document.getElementById('eventReminders').checked,
        marketingEmails: document.getElementById('marketingEmails').checked,
        theme: document.getElementById('themeSelect').value,
        language: document.getElementById('languageSelect').value
    };
    
    // Apply theme
    applyTheme(userPreferences[currentUser].theme);
    
    alert('Preferences saved successfully!');
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (theme === 'light') {
        document.body.classList.remove('dark-theme');
    } else if (theme === 'auto') {
        // Auto detect system preference
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

// Profile Photo Functions
function handleProfilePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        document.getElementById('profilePhotoPreview').src = photoData;
        
        // Store temporarily (will be saved on form submit)
        users[currentUser].profilePhoto = photoData;
    };
    reader.readAsDataURL(file);
}

function removeProfilePhoto() {
    if (confirm('Are you sure you want to remove your profile photo?')) {
        document.getElementById('profilePhotoPreview').src = '';
        users[currentUser].profilePhoto = '';
        alert('Profile photo removed');
    }
}

// Profile Change Requests Management
function showProfileChangeRequestsModal() {
    if (!currentUser || users[currentUser].role !== 'admin') {
        alert('Access denied');
        return;
    }
    
    const pendingRequests = profileChangeRequests.filter(r => r.status === 'pending');
    
    let html = '';
    if (pendingRequests.length === 0) {
        html = '<p class="no-items">No pending profile change requests</p>';
    } else {
        pendingRequests.forEach(request => {
            const user = users[request.username];
            html += `
                <div class="request-card">
                    <div class="request-header">
                        <h3>👤 ${user.name} (@${request.username})</h3>
                        <span class="role-badge">${user.role}</span>
                    </div>
                    
                    <div class="request-changes">
                        <div class="change-section">
                            <h4>Current Information:</h4>
                            ${request.currentData.profilePhoto ? `
                                <div class="photo-preview-small">
                                    <img src="${request.currentData.profilePhoto}" alt="Current Photo">
                                </div>
                            ` : ''}
                            <p><strong>Name:</strong> ${request.currentData.name || 'N/A'}</p>
                            <p><strong>Email:</strong> ${request.currentData.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> ${request.currentData.phone || 'N/A'}</p>
                            <p><strong>Company:</strong> ${request.currentData.company || 'N/A'}</p>
                        </div>
                        
                        <div class="change-arrow">→</div>
                        
                        <div class="change-section">
                            <h4>Requested Changes:</h4>
                            ${request.newData.profilePhoto ? `
                                <div class="photo-preview-small">
                                    <img src="${request.newData.profilePhoto}" alt="New Photo">
                                </div>
                            ` : ''}
                            <p><strong>Name:</strong> ${request.newData.name}</p>
                            <p><strong>Email:</strong> ${request.newData.email}</p>
                            <p><strong>Phone:</strong> ${request.newData.phone}</p>
                            <p><strong>Company:</strong> ${request.newData.company}</p>
                        </div>
                    </div>
                    
                    <div class="request-info">
                        <p>📅 Requested: ${new Date(request.requestedAt).toLocaleString()}</p>
                    </div>
                    
                    <div class="request-actions">
                        <button onclick="approveProfileChange(${request.id})" class="btn-approve">✅ Approve</button>
                        <button onclick="rejectProfileChange(${request.id})" class="btn-reject">❌ Reject</button>
                    </div>
                </div>
            `;
        });
    }
    
    document.getElementById('profileChangeRequestsList').innerHTML = html;
    document.getElementById('profileChangeRequestsModal').style.display = 'block';
}

function closeProfileChangeRequestsModal() {
    document.getElementById('profileChangeRequestsModal').style.display = 'none';
}

function approveProfileChange(requestId) {
    const request = profileChangeRequests.find(r => r.id === requestId);
    if (!request) return;
    
    const user = users[request.username];
    
    // Apply changes
    user.name = request.newData.name;
    user.email = request.newData.email;
    user.phone = request.newData.phone;
    user.company = request.newData.company;
    user.profilePhoto = request.newData.profilePhoto;
    
    // Update request status
    request.status = 'approved';
    request.approvedAt = new Date().toISOString();
    request.approvedBy = currentUser;
    
    alert(`✅ Profile change request approved for ${user.name}`);
    showProfileChangeRequestsModal();
    updatePendingCounts();
    displayEvents();
    displayPosts();
}

function rejectProfileChange(requestId) {
    const request = profileChangeRequests.find(r => r.id === requestId);
    if (!request) return;
    
    const reason = prompt('Enter rejection reason (optional):');
    
    request.status = 'rejected';
    request.rejectedAt = new Date().toISOString();
    request.rejectedBy = currentUser;
    request.rejectionReason = reason;
    
    alert(`❌ Profile change request rejected`);
    showProfileChangeRequestsModal();
    updatePendingCounts();
}

// Close modals when clicking outside
window.onclick = function(event) {
    const eventModal = document.getElementById('eventModal');
    const addEventModal = document.getElementById('addEventModal');
    const addPostModal = document.getElementById('addPostModal');
    const postModal = document.getElementById('postModal');
    const userManagementModal = document.getElementById('userManagementModal');
    const postManagementModal = document.getElementById('postManagementModal');
    const eventManagementModal = document.getElementById('eventManagementModal');
    const subscriptionModal = document.getElementById('subscriptionModal');
    const subscribersModal = document.getElementById('subscribersModal');
    const settingsModal = document.getElementById('settingsModal');
    const profileChangeRequestsModal = document.getElementById('profileChangeRequestsModal');
    const companyProfileModal = document.getElementById('companyProfileModal');
    const eventCommentsModal = document.getElementById('eventCommentsModal');
    const messagingModal = document.getElementById('messagingModal');
    const newConversationModal = document.getElementById('newConversationModal');
    const deletedCommentsModal = document.getElementById('deletedCommentsModal');
    const editEventModal = document.getElementById('editEventModal');
    const editPostModal = document.getElementById('editPostModal');
    const editHistoryModal = document.getElementById('editHistoryModal');
    const registrationsModal = document.getElementById('registrationsModal');
    const myRegistrationsModal = document.getElementById('myRegistrationsModal');
    const authSection = document.getElementById('authSection');
    
    if (event.target === eventModal) {
        closeEventModal();
    }
    if (event.target === addEventModal) {
        closeAddEventModal();
    }
    if (event.target === addPostModal) {
        closeAddPostModal();
    }
    if (event.target === postModal) {
        closePostModal();
    }
    if (event.target === userManagementModal) {
        closeUserManagementModal();
    }
    if (event.target === postManagementModal) {
        closePostManagementModal();
    }
    if (event.target === eventManagementModal) {
        closeEventManagementModal();
    }
    if (event.target === subscriptionModal) {
        closeSubscriptionModal();
    }
    if (event.target === subscribersModal) {
        closeSubscribersModal();
    }
    if (event.target === settingsModal) {
        closeSettingsModal();
    }
    if (event.target === profileChangeRequestsModal) {
        closeProfileChangeRequestsModal();
    }
    if (event.target === companyProfileModal) {
        closeCompanyProfileModal();
    }
    if (event.target === eventCommentsModal) {
        closeEventCommentsModal();
    }
    if (event.target === messagingModal) {
        closeMessagingModal();
    }
    if (event.target === newConversationModal) {
        closeNewConversationModal();
    }
    if (event.target === deletedCommentsModal) {
        closeDeletedCommentsModal();
    }
    if (event.target === editEventModal) {
        closeEditEventModal();
    }
    if (event.target === editPostModal) {
        closeEditPostModal();
    }
    if (event.target === editHistoryModal) {
        closeEditHistoryModal();
    }
    if (event.target === registrationsModal) {
        closeRegistrationsModal();
    }
    if (event.target === myRegistrationsModal) {
        closeMyRegistrationsModal();
    }
    if (event.target === authSection) {
        authSection.style.display = 'none';
    }
}

// Posts Management Functions
function displayPosts() {
    const postsContainer = document.getElementById('postsList');
    const approvedPosts = posts.filter(post => post.status === 'approved')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (approvedPosts.length === 0) {
        postsContainer.innerHTML = '<div class="no-events">No posts yet</div>';
    } else {
        postsContainer.innerHTML = approvedPosts.map(post => createPostCard(post)).join('');
    }
}

function createPostCard(post) {
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const authorInfo = users[post.author];
    const authorAvatar = post.authorName.charAt(0).toUpperCase();
    
    const readOnlyBadge = !currentUser ? '<span class="read-only-badge">👁️ View Only</span>' : '';
    
    return `
        <div class="post-card ${!currentUser ? 'read-only-card' : ''}" onclick="showPostDetails(${post.id})">
            ${readOnlyBadge}
            <div class="post-header-card">
                <div class="author-info">
                    <div class="author-avatar">${authorAvatar}</div>
                    <div class="author-details">
                        <h4>${post.authorName}</h4>
                        <span class="post-username">@${post.author}</span>
                    </div>
                </div>
                <div class="post-date">
                    <span>📅 ${formattedDate}</span>
                </div>
            </div>
            <h3>${post.title}</h3>
            <p class="post-preview">${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
            <div class="post-footer">
                <span>👁️ View Details</span>
                ${post.likes ? `<span>❤️ ${post.likes} likes</span>` : ''}
            </div>
        </div>
    `;
}

function showPostDetails(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const authorInfo = users[post.author];
    const authorAvatar = post.authorName.charAt(0).toUpperCase();
    
    const isAuthor = currentUser && post.author === currentUser.username;
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    // Edit and manage section for author/admin
    let managementSection = '';
    if (isAuthor || isAdmin) {
        managementSection = `
            <div class="post-management-section" style="margin-bottom: 15px;">
                ${isAuthor ? `<button class="btn-secondary" onclick="showEditPostModal(${post.id}); event.stopPropagation();">✏️ Edit Post</button>` : ''}
                ${isAdmin ? `<button class="btn-secondary" onclick="showEditHistory('post', ${post.id}); event.stopPropagation();">📜 View Edit History</button>` : ''}
            </div>
        `;
    }
    
    const detailsHTML = `
        <div class="post-detail">
            <div class="post-detail-header">
                <div class="author-info-large">
                    <div class="author-avatar-large">${authorAvatar}</div>
                    <div class="author-details-large">
                        <h3>${post.authorName}</h3>
                        <span class="post-username">@${post.author}</span>
                        <span class="post-date-detail">📅 ${formattedDate}</span>
                    </div>
                </div>
            </div>
            ${managementSection}
            <h2 class="post-title-detail">${post.title}</h2>
            <div class="post-content-detail">${post.content}</div>
            <div class="post-stats">
                <span>❤️ ${post.likes || 0} likes</span>
                <span>💬 ${post.comments ? post.comments.length : 0} comments</span>
            </div>
        </div>
    `;
    
    document.getElementById('postDetails').innerHTML = detailsHTML;
    document.getElementById('postModal').style.display = 'block';
}

function closePostModal() {
    document.getElementById('postModal').style.display = 'none';
}

function showAddPostModal() {
    if (!currentUser) {
        alert('Please login or register to create posts!');
        showAuthSection();
        return;
    }
    document.getElementById('addPostModal').style.display = 'block';
}

function closeAddPostModal() {
    document.getElementById('addPostModal').style.display = 'none';
    document.getElementById('addPostForm').reset();
}

function handleAddPost(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login to create posts!');
        return;
    }
    
    const newPost = {
        id: nextPostId++,
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        category: document.getElementById('postCategory').value,
        author: currentUser.username,
        authorName: currentUser.name,
        date: new Date().toISOString(),
        status: 'pending',
        likes: 0,
        likedBy: [],
        comments: []
    };
    
    posts.push(newPost);
    closeAddPostModal();
    updatePendingCount();
    alert('Post submitted successfully! Waiting for approval.');
}

// User Management Functions
function showUserManagementModal() {
    displayUsersList();
    updatePendingCompaniesCount();
    document.getElementById('userManagementModal').style.display = 'block';
}

function closeUserManagementModal() {
    document.getElementById('userManagementModal').style.display = 'none';
}

function displayUsersList() {
    const usersListContainer = document.getElementById('usersList');
    const usersList = Object.values(users);
    
    usersListContainer.innerHTML = usersList.map(user => {
        const joinedDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
        
        const blockButton = user.role !== 'admin' 
            ? `<button class="btn-${user.blocked ? 'success' : 'danger'}" onclick="toggleBlockUser('${user.username}')">
                ${user.blocked ? 'Unblock' : 'Block'}
            </button>`
            : '<span class="admin-badge">Admin</span>';
        
        const approveButton = user.role === 'company' && !user.approved
            ? `<button class="btn-success" onclick="approveCompanyUser('${user.username}')">✓ Approve</button>`
            : '';
        
        let statusBadge = '';
        if (user.blocked) {
            statusBadge = '<span class="status-badge blocked">Blocked</span>';
        } else if (user.role === 'company' && !user.approved) {
            statusBadge = '<span class="status-badge pending">Pending Approval</span>';
        } else {
            statusBadge = '<span class="status-badge active">Active</span>';
        }
        
        const roleDisplay = user.role === 'company' ? '🏢 Company' : user.role;
        
        return `
            <div class="user-item ${user.role === 'company' && !user.approved ? 'pending-user' : ''}">
                <div class="user-info-detail">
                    <h4>${user.name}</h4>
                    <p>@${user.username} - ${roleDisplay}</p>
                    <p class="user-meta">📧 ${user.email} | 📅 Joined ${joinedDate}</p>
                </div>
                <div class="user-actions">
                    ${statusBadge}
                    ${approveButton}
                    ${blockButton}
                </div>
            </div>
        `;
    }).join('');
}

function toggleBlockUser(username) {
    if (confirm(`Are you sure you want to ${users[username].blocked ? 'unblock' : 'block'} ${users[username].name}?`)) {
        users[username].blocked = !users[username].blocked;
        displayUsersList();
        alert(`User ${users[username].blocked ? 'blocked' : 'unblocked'} successfully!`);
    }
}

function approveCompanyUser(username) {
    if (confirm(`Are you sure you want to approve ${users[username].name} as a company account?`)) {
        users[username].approved = true;
        displayUsersList();
        updatePendingCompaniesCount();
        alert(`Company account approved! ${users[username].name} can now login with full company privileges.`);
    }
}

function updatePendingCompaniesCount() {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    const pendingCompaniesCount = Object.values(users).filter(u => u.role === 'company' && !u.approved).length;
    const badge = document.getElementById('pendingCompaniesCountBadge');
    if (badge) {
        if (pendingCompaniesCount > 0) {
            badge.textContent = pendingCompaniesCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

function updatePendingProfileChangesCount() {
    if (!currentUser || users[currentUser].role !== 'admin') return;
    
    const pendingProfileChangesCount = profileChangeRequests.filter(r => r.status === 'pending').length;
    const badge = document.getElementById('pendingProfileChangesCountBadge');
    if (badge) {
        if (pendingProfileChangesCount > 0) {
            badge.textContent = pendingProfileChangesCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

function updatePendingCounts() {
    updatePendingCount();
    updatePendingEventsCount();
    updatePendingCompaniesCount();
    updatePendingProfileChangesCount();
}

// Post Management Functions (Admin & Organizer)
function showPostManagementModal() {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'organizer')) {
        alert('Access denied');
        return;
    }
    displayPendingPosts();
    document.getElementById('postManagementModal').style.display = 'block';
}

function closePostManagementModal() {
    document.getElementById('postManagementModal').style.display = 'none';
}

function displayPendingPosts() {
    const pendingPostsContainer = document.getElementById('pendingPostsList');
    const pendingPosts = posts.filter(post => post.status === 'pending')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (pendingPosts.length === 0) {
        pendingPostsContainer.innerHTML = '<div class="no-events">No pending posts</div>';
    } else {
        pendingPostsContainer.innerHTML = pendingPosts.map(post => {
            const postDate = new Date(post.date);
            const formattedDate = postDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="pending-post-item">
                    <div class="post-header">
                        <h4>${post.title}</h4>
                        <span class="pending-badge">Pending</span>
                    </div>
                    <div class="post-meta">
                        <span>👤 ${post.authorName} (@${post.author})</span>
                        <span>📅 ${formattedDate}</span>
                    </div>
                    <p class="post-content-preview">${post.content}</p>
                    <div class="post-actions">
                        <button class="btn-success" onclick="approvePost(${post.id})">✓ Approve</button>
                        <button class="btn-danger" onclick="rejectPost(${post.id})">✗ Reject</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function approvePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.status = 'approved';
        displayPendingPosts();
        displayPosts();
        updatePendingCount();
        alert('Post approved successfully!');
    }
}

function rejectPost(postId) {
    if (confirm('Are you sure you want to reject this post?')) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.status = 'rejected';
            displayPendingPosts();
            updatePendingCount();
            alert('Post rejected!');
        }
    }
}

function updatePendingCount() {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'organizer')) return;
    
    const pendingCount = posts.filter(p => p.status === 'pending').length;
    const badge = document.getElementById('pendingCountBadge');
    const organizerBadge = document.getElementById('organizerPendingCountBadge');
    
    if (badge) {
        if (pendingCount > 0) {
            badge.textContent = pendingCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
    
    if (organizerBadge) {
        if (pendingCount > 0) {
            organizerBadge.textContent = pendingCount;
            organizerBadge.style.display = 'inline-block';
        } else {
            organizerBadge.style.display = 'none';
        }
    }
}

function updatePendingEventsCount() {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    const pendingEventsCount = events.filter(e => e.status === 'pending').length;
    const badge = document.getElementById('pendingEventsCountBadge');
    if (badge) {
        if (pendingEventsCount > 0) {
            badge.textContent = pendingEventsCount;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    }
}

// Event Management Functions (Admin)
function showEventManagementModal() {
    displayPendingEvents();
    document.getElementById('eventManagementModal').style.display = 'block';
}

function closeEventManagementModal() {
    document.getElementById('eventManagementModal').style.display = 'none';
}

function displayPendingEvents() {
    const pendingEventsContainer = document.getElementById('pendingEventsList');
    const pendingEvents = events.filter(event => event.status === 'pending')
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (pendingEvents.length === 0) {
        pendingEventsContainer.innerHTML = '<div class="no-events">No pending events</div>';
    } else {
        pendingEventsContainer.innerHTML = pendingEvents.map(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            const formattedDate = eventDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric'
            });
            
            return `
                <div class="pending-post-item">
                    <div class="post-header">
                        <h4>${event.title}</h4>
                        <span class="pending-badge">Pending</span>
                    </div>
                    <div class="post-meta">
                        <span>👤 Created by ${event.creatorName} (@${event.createdBy})</span>
                        <span>📅 ${formattedDate} at ${event.time}</span>
                    </div>
                    <div class="event-pending-details">
                        <p><strong>📍 Location:</strong> ${event.location}</p>
                        <p><strong>📂 Category:</strong> ${event.category}</p>
                        <p><strong>📝 Description:</strong> ${event.description}</p>
                    </div>
                    <div class="post-actions">
                        <button class="btn-success" onclick="approveEvent(${event.id})">✓ Approve</button>
                        <button class="btn-danger" onclick="rejectEvent(${event.id})">✗ Reject</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function approveEvent(eventId) {
    const event = events.find(e => e.id === eventId);
    if (event) {
        event.status = 'approved';
        displayPendingEvents();
        displayEvents();
        populateLocationFilter(); // Update location filter
        updatePendingEventsCount();
        alert('Event approved successfully!');
    }
}

function rejectEvent(eventId) {
    if (confirm('Are you sure you want to reject this event?')) {
        events = events.filter(e => e.id !== eventId);
        displayPendingEvents();
        displayEvents();
        populateLocationFilter(); // Update location filter
        updatePendingEventsCount();
        alert('Event rejected and removed!');
    }
}

// Event Comments Functions
function showEventComments(eventId) {
    if (!currentUser) {
        alert('Please login to view and add comments');
        return;
    }
    
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    document.getElementById('eventCommentsTitle').textContent = `Comments: ${event.title}`;
    document.getElementById('commentEventId').value = eventId;
    
    displayEventComments(eventId);
    document.getElementById('eventCommentsModal').style.display = 'block';
}

function displayEventComments(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const commentsList = document.getElementById('eventCommentsList');
    const comments = event.comments || [];
    
    const isAdmin = currentUser && currentUser.role === 'admin';
    const isEventCreator = currentUser && event.createdBy === currentUser.username;
    
    if (comments.length === 0) {
        commentsList.innerHTML = '<div class="no-comments"><p>No comments yet. Be the first to comment!</p></div>';
        return;
    }
    
    commentsList.innerHTML = comments.map(comment => {
        const commentDate = new Date(comment.date).toLocaleString();
        const authorAvatar = comment.authorName.charAt(0).toUpperCase();
        const isCommentAuthor = currentUser && comment.username === currentUser.username;
        
        // Show delete button if user is admin, event creator, or comment author
        const canDelete = isAdmin || isEventCreator || isCommentAuthor;
        
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="author-avatar-small">${authorAvatar}</div>
                        <div>
                            <strong>${comment.authorName}</strong>
                            <span class="comment-username">@${comment.username}</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="comment-date">${commentDate}</span>
                        ${canDelete ? `<button class="btn-delete-comment" onclick="deleteComment(${comment.id}, ${eventId}); event.stopPropagation();">Delete</button>` : ''}
                    </div>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
    }).join('');
}

function closeEventCommentsModal() {
    document.getElementById('eventCommentsModal').style.display = 'none';
    document.getElementById('commentText').value = '';
}

function handleAddEventComment(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Please login to comment');
        return;
    }
    
    const eventId = parseInt(document.getElementById('commentEventId').value);
    const text = document.getElementById('commentText').value.trim();
    
    if (!text) return;
    
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    if (!event.comments) {
        event.comments = [];
    }
    
    const comment = {
        id: nextCommentId++,
        eventId: eventId,
        username: currentUser.username,
        authorName: currentUser.name,
        text: text,
        date: new Date().toISOString()
    };
    
    event.comments.push(comment);
    
    document.getElementById('commentText').value = '';
    displayEventComments(eventId);
    displayEvents(); // Refresh event cards to update comment count
    
    alert('Comment added successfully!');
}

// Comment Management Functions
function deleteComment(commentId, eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event || !event.comments) return;
    
    const commentIndex = event.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;
    
    const comment = event.comments[commentIndex];
    
    // Check permissions
    const isAdmin = currentUser && currentUser.role === 'admin';
    const isEventCreator = currentUser && event.createdBy === currentUser.username;
    const isCommentAuthor = currentUser && comment.username === currentUser.username;
    
    if (!isAdmin && !isEventCreator && !isCommentAuthor) {
        alert('You do not have permission to delete this comment.');
        return;
    }
    
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }
    
    // Move to deleted comments
    const deletedComment = {
        ...comment,
        deletedBy: currentUser.username,
        deletedAt: new Date().toISOString(),
        deletedByRole: currentUser.role
    };
    
    deletedComments.push(deletedComment);
    
    // Remove from event
    event.comments.splice(commentIndex, 1);
    
    displayEventComments(eventId);
    displayEvents();
    alert('Comment deleted successfully.');
}

function showDeletedComments() {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Only admins can view deleted comments.');
        return;
    }
    
    const modalContent = document.getElementById('deletedCommentsContent');
    
    if (deletedComments.length === 0) {
        modalContent.innerHTML = '<div class="no-comments"><p>No deleted comments</p></div>';
    } else {
        modalContent.innerHTML = deletedComments.map(comment => {
            const event = events.find(e => e.id === comment.eventId);
            const eventTitle = event ? event.title : 'Unknown Event';
            const deletedDate = new Date(comment.deletedAt).toLocaleString();
            
            return `
                <div class="deleted-comment-item">
                    <div class="deleted-comment-header">
                        <strong>Event:</strong> ${eventTitle}<br>
                        <strong>Author:</strong> ${comment.authorName} (@${comment.username})<br>
                        <strong>Posted:</strong> ${new Date(comment.date).toLocaleString()}<br>
                        <strong>Deleted by:</strong> ${comment.deletedBy} (${comment.deletedByRole})<br>
                        <strong>Deleted at:</strong> ${deletedDate}
                    </div>
                    <div class="deleted-comment-text">${comment.text}</div>
                </div>
            `;
        }).join('');
    }
    
    document.getElementById('deletedCommentsModal').style.display = 'block';
}

function closeDeletedCommentsModal() {
    document.getElementById('deletedCommentsModal').style.display = 'none';
}

// Edit History Functions
function showEditEventModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const isCreator = currentUser && event.createdBy === currentUser.username;
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    if (!isCreator && !isAdmin) {
        alert('Only the event creator can edit this event.');
        return;
    }
    
    // Populate category dropdown
    const categorySelect = document.getElementById('editEventCategory');
    categorySelect.innerHTML = categories.map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join('');
    
    // Populate form with current values
    document.getElementById('editEventId').value = event.id;
    document.getElementById('editEventTitle').value = event.title;
    document.getElementById('editEventDate').value = event.date;
    document.getElementById('editEventTime').value = event.time;
    document.getElementById('editEventLocation').value = event.location;
    document.getElementById('editEventDescription').value = event.description;
    document.getElementById('editEventCategory').value = event.category;
    document.getElementById('editEventMaxAttendees').value = event.maxAttendees;
    document.getElementById('editAutoApprove').checked = event.autoApprove || false;
    
    document.getElementById('editEventModal').style.display = 'block';
}

function closeEditEventModal() {
    document.getElementById('editEventModal').style.display = 'none';
    document.getElementById('editEventForm').reset();
}

function handleEditEvent(e) {
    e.preventDefault();
    
    const eventId = parseInt(document.getElementById('editEventId').value);
    const event = events.find(ev => ev.id === eventId);
    
    if (!event) return;
    
    // Save old values to history
    const oldValues = {
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        description: event.description,
        category: event.category,
        maxAttendees: event.maxAttendees,
        autoApprove: event.autoApprove
    };
    
    // Update event
    const newValues = {
        title: document.getElementById('editEventTitle').value,
        date: document.getElementById('editEventDate').value,
        time: document.getElementById('editEventTime').value,
        location: document.getElementById('editEventLocation').value,
        description: document.getElementById('editEventDescription').value,
        category: document.getElementById('editEventCategory').value,
        maxAttendees: parseInt(document.getElementById('editEventMaxAttendees').value),
        autoApprove: document.getElementById('editAutoApprove').checked
    };
    
    // Record edit history
    const historyEntry = {
        id: nextEditHistoryId++,
        type: 'event',
        itemId: eventId,
        editedBy: currentUser.username,
        editedByName: currentUser.name,
        editedAt: new Date().toISOString(),
        oldValues: oldValues,
        newValues: newValues
    };
    
    editHistory.push(historyEntry);
    
    // Apply changes
    Object.assign(event, newValues);
    
    closeEditEventModal();
    closeEventModal();
    displayEvents();
    alert('Event updated successfully!');
}

function showEditPostModal(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const isAuthor = currentUser && post.author === currentUser.username;
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    if (!isAuthor && !isAdmin) {
        alert('Only the post author can edit this post.');
        return;
    }
    
    // Populate category dropdown
    const categorySelect = document.getElementById('editPostCategory');
    categorySelect.innerHTML = categories.map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join('');
    
    // Populate form
    document.getElementById('editPostId').value = post.id;
    document.getElementById('editPostTitle').value = post.title;
    document.getElementById('editPostContent').value = post.content;
    document.getElementById('editPostCategory').value = post.category;
    
    document.getElementById('editPostModal').style.display = 'block';
}

function closeEditPostModal() {
    document.getElementById('editPostModal').style.display = 'none';
    document.getElementById('editPostForm').reset();
}

function handleEditPost(e) {
    e.preventDefault();
    
    const postId = parseInt(document.getElementById('editPostId').value);
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    // Save old values
    const oldValues = {
        title: post.title,
        content: post.content,
        category: post.category
    };
    
    // Get new values
    const newValues = {
        title: document.getElementById('editPostTitle').value,
        content: document.getElementById('editPostContent').value,
        category: document.getElementById('editPostCategory').value
    };
    
    // Record edit history
    const historyEntry = {
        id: nextEditHistoryId++,
        type: 'post',
        itemId: postId,
        editedBy: currentUser.username,
        editedByName: currentUser.name,
        editedAt: new Date().toISOString(),
        oldValues: oldValues,
        newValues: newValues
    };
    
    editHistory.push(historyEntry);
    
    // Apply changes
    Object.assign(post, newValues);
    
    closeEditPostModal();
    closePostModal();
    displayPosts();
    alert('Post updated successfully!');
}

function showEditHistory(type, itemId) {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Only admins can view edit history.');
        return;
    }
    
    const history = editHistory.filter(h => h.type === type && h.itemId === itemId);
    const modalContent = document.getElementById('editHistoryContent');
    
    if (history.length === 0) {
        modalContent.innerHTML = '<div class="no-history"><p>No edit history for this item</p></div>';
    } else {
        modalContent.innerHTML = history.map((entry, index) => {
            const editDate = new Date(entry.editedAt).toLocaleString();
            const changes = [];
            
            for (const key in entry.newValues) {
                if (entry.oldValues[key] !== entry.newValues[key]) {
                    changes.push({

                        field: key,
                        old: entry.oldValues[key],
                        new: entry.newValues[key]
                    });
                }
            }
            
            return `
                <div class="edit-history-item">
                    <div class="edit-history-header">
                        <strong>Edit #${history.length - index}</strong><br>
                        <strong>Edited by:</strong> ${entry.editedByName} (@${entry.editedBy})<br>
                        <strong>Date:</strong> ${editDate}
                    </div>
                    <div class="edit-changes">
                        ${changes.map(change => `
                            <div class="edit-change">
                                <strong>${change.field}:</strong>
                                <div class="change-comparison">
                                    <div class="old-value">
                                        <span class="change-label">Before:</span>
                                        <div class="change-text">${change.old}</div>
                                    </div>
                                    <div class="change-arrow">→</div>
                                    <div class="new-value">
                                        <span class="change-label">After:</span>
                                        <div class="change-text">${change.new}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    document.getElementById('editHistoryModal').style.display = 'block';
}

function closeEditHistoryModal() {
    document.getElementById('editHistoryModal').style.display = 'none';
}

// Registration Management Functions
function showRegistrationsModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const isCreator = currentUser && event.createdBy === currentUser.username;
    const isAdmin = currentUser && currentUser.role === 'admin';
    
    if (!isCreator && !isAdmin) {
        alert('Only the event creator or admin can manage registrations.');
        return;
    }
    
    const registrations = eventRegistrations.filter(r => r.eventId === eventId);
    const modalContent = document.getElementById('registrationsContent');
    
    if (registrations.length === 0) {
        modalContent.innerHTML = '<div class="no-registrations"><p>No registrations yet</p></div>';
    } else {
        modalContent.innerHTML = registrations.map(reg => {
            const regDate = new Date(reg.registeredAt).toLocaleString();
            const statusClass = reg.status === 'accepted' ? 'status-accepted' : 
                                reg.status === 'rejected' ? 'status-rejected' : 'status-pending';
            
            let respondedInfo = '';
            if (reg.respondedAt) {
                respondedInfo = `
                    <div class="responded-info">
                        <strong>Responded by:</strong> ${reg.respondedBy}<br>
                        <strong>Responded at:</strong> ${new Date(reg.respondedAt).toLocaleString()}
                    </div>
                `;
            }
            
            return `
                <div class="registration-item">
                    <div class="registration-header">
                        <div>
                            <strong>${reg.name}</strong> (@${reg.username})<br>
                            <span class="status-badge ${statusClass}">${reg.status.toUpperCase()}</span>
                        </div>
                        <div class="registration-date">Registered: ${regDate}</div>
                    </div>
                    <div class="registration-details">
                        <p><strong>Email:</strong> ${reg.email}</p>
                        ${reg.phone ? `<p><strong>Phone:</strong> ${reg.phone}</p>` : ''}
                        ${reg.company ? `<p><strong>Company:</strong> ${reg.company}</p>` : ''}
                        ${respondedInfo}
                    </div>
                    ${reg.status === 'pending' ? `
                        <div class="registration-actions">
                            <button onclick="handleRegistrationResponse(${reg.id}, 'accepted')" class="btn-success">✓ Accept</button>
                            <button onclick="handleRegistrationResponse(${reg.id}, 'rejected')" class="btn-danger">✗ Reject</button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
    
    document.getElementById('registrationsModal').style.display = 'block';
}

function closeRegistrationsModal() {
    document.getElementById('registrationsModal').style.display = 'none';
}

function handleRegistrationResponse(registrationId, status) {
    const registration = eventRegistrations.find(r => r.id === registrationId);
    if (!registration) return;
    
    const event = events.find(e => e.id === registration.eventId);
    if (!event) return;
    
    if (status === 'accepted') {
        // Check capacity
        const acceptedCount = eventRegistrations.filter(r => 
            r.eventId === event.id && r.status === 'accepted'
        ).length;
        
        if (acceptedCount >= event.maxAttendees) {
            alert('Event is at full capacity!');
            return;
        }
    }
    
    registration.status = status;
    registration.respondedAt = new Date().toISOString();
    registration.respondedBy = currentUser.username;
    
    // Refresh the registrations modal
    showRegistrationsModal(registration.eventId);
    alert(`Registration ${status}!`);
}

function getMyRegistrationStatus(eventId) {
    if (!currentUser) return null;
    
    const registration = eventRegistrations.find(r => 
        r.eventId === eventId && r.username === currentUser.username
    );
    
    return registration ? registration.status : null;
}

function showMyRegistrations() {
    if (!currentUser) {
        alert('Please login first');
        return;
    }
    
    const myRegs = eventRegistrations.filter(r => r.username === currentUser.username);
    const modalContent = document.getElementById('myRegistrationsContent');
    
    if (myRegs.length === 0) {
        modalContent.innerHTML = '<div class="no-registrations"><p>You have no event registrations</p></div>';
    } else {
        modalContent.innerHTML = myRegs.map(reg => {
            const event = events.find(e => e.id === reg.eventId);
            if (!event) return '';
            
            const regDate = new Date(reg.registeredAt).toLocaleString();
            const statusClass = reg.status === 'accepted' ? 'status-accepted' : 
                                reg.status === 'rejected' ? 'status-rejected' : 'status-pending';
            
            let statusIcon = reg.status === 'accepted' ? '✓' :
                            reg.status === 'rejected' ? '✗' : '⏱';
            
            return `
                <div class="my-registration-item">
                    <div class="my-registration-header">
                        <h4>${event.title}</h4>
                        <span class="status-badge ${statusClass}">${statusIcon} ${reg.status.toUpperCase()}</span>
                    </div>
                    <div class="my-registration-details">
                        <p><strong>Date:</strong> ${event.date} at ${event.time}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <p><strong>Registered:</strong> ${regDate}</p>
                        ${reg.respondedAt ? `<p><strong>Response received:</strong> ${new Date(reg.respondedAt).toLocaleString()}</p>` : ''}
                    </div>
                    ${reg.status === 'pending' ? `
                        <button onclick="cancelRegistration(${reg.id})" class="btn-danger">Cancel Registration</button>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
    
    document.getElementById('myRegistrationsModal').style.display = 'block';
}

function closeMyRegistrationsModal() {
    document.getElementById('myRegistrationsModal').style.display = 'none';
}

function cancelRegistration(registrationId) {
    if (!confirm('Are you sure you want to cancel this registration?')) {
        return;
    }
    
    const index = eventRegistrations.findIndex(r => r.id === registrationId);
    if (index > -1) {
        eventRegistrations.splice(index, 1);
        showMyRegistrations(); // Refresh the modal
        alert('Registration cancelled.');
    }
}

