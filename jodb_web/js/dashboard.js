// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // Initialize data structures
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('documents')) {
        localStorage.setItem('documents', JSON.stringify([]));
    }

    // Display current user
    const username = localStorage.getItem('username');
    document.getElementById('current-user').textContent = username;

    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('logout')) {
                e.preventDefault();
                
                // Remove active class from all links and sections
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Show corresponding section
                const sectionId = this.getAttribute('data-section') + '-section';
                const section = document.getElementById(sectionId);
                if (section) {
                    section.classList.add('active');
                    document.getElementById('section-title').textContent = this.textContent;
                }
                
                // Load section data
                if (sectionId === 'overview-section') {
                    loadOverview();
                    startDashboardAutoRefresh();
                } else {
                    stopDashboardAutoRefresh();
                    if (sectionId === 'users-section') {
                        loadUsers();
                    } else if (sectionId === 'documents-section') {
                        loadDocuments();
                    }
                }
            }
        });
    });

    // Logout handling
    document.querySelector('.logout').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        window.location.href = 'index.html';
    });

    // User Management
    const addUserBtn = document.getElementById('add-user-btn');
    const userFormContainer = document.getElementById('user-form-container');
    const cancelUserBtn = document.getElementById('cancel-user-btn');
    const userForm = document.getElementById('userForm');

    addUserBtn.addEventListener('click', function() {
        userFormContainer.style.display = 'block';
        userForm.reset();
        // Reset form for creating new user
        const submitBtn = userForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Create User';
        delete submitBtn.dataset.editing;
    });

    cancelUserBtn.addEventListener('click', function() {
        userFormContainer.style.display = 'none';
        userForm.reset();
        // Reset form state
        const submitBtn = userForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Create User';
        delete submitBtn.dataset.editing;
    });

    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('user-username').value;
        const password = document.getElementById('user-password').value;
        const email = document.getElementById('user-email').value;
        const role = document.getElementById('user-role').value;

        const users = JSON.parse(localStorage.getItem('users'));
        const submitBtn = this.querySelector('button[type="submit"]');
        const editingId = submitBtn.dataset.editing;

        if (editingId) {
            // Update existing user
            const userIndex = users.findIndex(u => u.id === parseInt(editingId));
            if (userIndex !== -1) {
                users[userIndex] = {
                    ...users[userIndex],
                    username: username,
                    password: password,
                    email: email,
                    role: role
                };
                alert('User updated successfully!');
            }
        } else {
            // Create new user
            const newUser = {
                id: Date.now(),
                username: username,
                password: password,
                email: email,
                role: role,
                createdDate: new Date().toISOString()
            };
            users.push(newUser);
            alert('User created successfully!');
        }

        localStorage.setItem('users', JSON.stringify(users));

        userFormContainer.style.display = 'none';
        userForm.reset();
        submitBtn.textContent = 'Create User';
        delete submitBtn.dataset.editing;
        loadUsers();
        loadOverview();
    });

    // Document Management
    const addDocumentBtn = document.getElementById('add-document-btn');
    const documentFormContainer = document.getElementById('document-form-container');
    const cancelDocumentBtn = document.getElementById('cancel-document-btn');
    const documentForm = document.getElementById('documentForm');
    const addOperationBtn = document.getElementById('add-operation-btn');
    const operationsContainer = document.getElementById('operations-container');

    addDocumentBtn.addEventListener('click', function() {
        documentFormContainer.style.display = 'block';
        documentForm.reset();
        // Reset form for creating new document
        const submitBtn = documentForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Create Document';
        delete submitBtn.dataset.editing;
        // Reset operations to one input
        operationsContainer.innerHTML = `
            <div class="operation-item">
                <div class="operation-row">
                    <input type="text" class="operation-input" placeholder="Operation description" required>
                    <button type="button" class="btn btn-small btn-danger remove-operation">Remove</button>
                </div>
                <div class="operation-details">
                    <div class="form-row">
                        <div class="form-col">
                            <label>Minimum Output</label>
                            <input type="number" class="min-output" placeholder="Min output" min="0" step="0.01">
                        </div>
                        <div class="form-col">
                            <label>Minimum Time (hours)</label>
                            <input type="number" class="min-time" placeholder="Min time" min="0" step="0.1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Actual Output</label>
                            <input type="number" class="actual-output" placeholder="Actual output" min="0" step="0.01">
                        </div>
                        <div class="form-col">
                            <label>Actual Time (hours)</label>
                            <input type="number" class="actual-time" placeholder="Actual time" min="0" step="0.1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Operation Status</label>
                            <select class="operation-status">
                                <option value="">Select Status</option>
                                <option value="true">Completed</option>
                                <option value="false">Not Completed</option>
                            </select>
                        </div>
                        <div class="form-col">
                            <label>number of operation</label>
                            <input type="number" class="operation-priority" placeholder="operation (1-150)" min="1" max="150" step="1">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-col">
                            <label>Notes</label>
                            <textarea class="operation-notes" placeholder="Additional notes or comments" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;
        attachOperationListeners();
    });

    cancelDocumentBtn.addEventListener('click', function() {
        documentFormContainer.style.display = 'none';
        documentForm.reset();
        // Reset form state
        const submitBtn = documentForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Create Document';
        delete submitBtn.dataset.editing;
    });

    addOperationBtn.addEventListener('click', function() {
        const operationItem = document.createElement('div');
        operationItem.className = 'operation-item';
        operationItem.innerHTML = `
            <div class="operation-row">
                <input type="text" class="operation-input" placeholder="Operation description" required>
                <button type="button" class="btn btn-small btn-danger remove-operation">Remove</button>
            </div>
            <div class="operation-details">
                <div class="form-row">
                    <div class="form-col">
                        <label>Minimum Output</label>
                        <input type="number" class="min-output" placeholder="Min output" min="0" step="0.01">
                    </div>
                    <div class="form-col">
                        <label>Minimum Time (hours)</label>
                        <input type="number" class="min-time" placeholder="Min time" min="0" step="0.1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Actual Output</label>
                        <input type="number" class="actual-output" placeholder="Actual output" min="0" step="0.01">
                    </div>
                    <div class="form-col">
                        <label>Actual Time (hours)</label>
                        <input type="number" class="actual-time" placeholder="Actual time" min="0" step="0.1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Operation Status</label>
                        <select class="operation-status">
                            <option value="">Select Status</option>
                            <option value="true">Completed</option>
                            <option value="false">Not Completed</option>
                        </select>
                    </div>
                    <div class="form-col">
                        <label>number of operation</label>
                        <input type="number" class="operation-priority" placeholder="operation (1-150)" min="1" max="150" step="1">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-col">
                        <label>Notes</label>
                        <textarea class="operation-notes" placeholder="Additional notes or comments" rows="3"></textarea>
                    </div>
                </div>
            </div>
        `;
        operationsContainer.appendChild(operationItem);
        attachOperationListeners();
    });

    function attachOperationListeners() {
        const removeButtons = document.querySelectorAll('.remove-operation');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (operationsContainer.children.length > 1) {
                    this.closest('.operation-item').remove();
                } else {
                    alert('At least one operation is required');
                }
            });
        });
    }

    attachOperationListeners();

    documentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const serial = document.getElementById('doc-serial').value;
        const title = document.getElementById('doc-title').value;
        const description = document.getElementById('doc-description').value;
        
        // Collect operations with all details
        const operationItems = document.querySelectorAll('.operation-item');
        const operations = [];
        
        operationItems.forEach(item => {
            const description = item.querySelector('.operation-input').value.trim();
            if (description) {
                const minOutput = parseFloat(item.querySelector('.min-output').value) || 0;
                const minTime = parseFloat(item.querySelector('.min-time').value) || 0;
                const actualOutput = parseFloat(item.querySelector('.actual-output').value) || 0;
                const actualTime = parseFloat(item.querySelector('.actual-time').value) || 0;
                const status = item.querySelector('.operation-status').value;
                const priority = parseInt(item.querySelector('.operation-priority').value) || null;
                const notes = item.querySelector('.operation-notes').value.trim();
                
                operations.push({
                    description: description,
                    minOutput: minOutput,
                    minTime: minTime,
                    actualOutput: actualOutput,
                    actualTime: actualTime,
                    status: status === 'true' ? true : status === 'false' ? false : null,
                    priority: priority,
                    notes: notes
                });
            }
        });

        const documents = JSON.parse(localStorage.getItem('documents'));
        const submitBtn = this.querySelector('button[type="submit"]');
        const editingId = submitBtn.dataset.editing;

        if (editingId) {
            // Update existing document
            const docIndex = documents.findIndex(d => d.id === parseInt(editingId));
            if (docIndex !== -1) {
                documents[docIndex] = {
                    ...documents[docIndex],
                    serial: serial,
                    title: title,
                    description: description,
                    operations: operations
                };
                alert('Document updated successfully!');
            }
        } else {
            // Create new document
            const newDocument = {
                id: Date.now(),
                serial: serial,
                title: title,
                description: description,
                operations: operations,
                createdDate: new Date().toISOString()
            };
            documents.push(newDocument);
            alert('Document created successfully!');
        }

        localStorage.setItem('documents', JSON.stringify(documents));

        documentFormContainer.style.display = 'none';
        documentForm.reset();
        submitBtn.textContent = 'Create Document';
        delete submitBtn.dataset.editing;
        loadDocuments();
        loadOverview();
    });

    // Dashboard Analytics Functions
    let dashboardInterval;
    
    function updateDashboardTime() {
        const now = new Date();
        document.getElementById('last-update-time').textContent = now.toLocaleTimeString();
    }

    function calculateAnalytics() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const documents = JSON.parse(localStorage.getItem('documents') || '[]');
        
        // Basic counts
        const technicians = users.filter(u => u.role === 'technician').length;
        const supervisors = users.filter(u => u.role === 'supervisor').length;
        
        // Operations analytics
        let totalOperations = 0;
        let completedOperations = 0;
        let totalActualTime = 0;
        let totalPlannedTime = 0;
        let totalEfficiency = 0;
        let efficiencyCount = 0;
        
        documents.forEach(doc => {
            if (doc.operations && Array.isArray(doc.operations)) {
                doc.operations.forEach(op => {
                    if (typeof op === 'object') {
                        totalOperations++;
                        
                        if (op.status === true) {
                            completedOperations++;
                        }
                        
                        if (op.actualTime) totalActualTime += parseFloat(op.actualTime);
                        if (op.minTime) totalPlannedTime += parseFloat(op.minTime);
                        
                        // Calculate efficiency
                        if (op.actualTime && op.minTime && op.actualOutput && op.minOutput) {
                            const timeEff = (parseFloat(op.minTime) / parseFloat(op.actualTime)) * 100;
                            const outputEff = (parseFloat(op.actualOutput) / parseFloat(op.minOutput)) * 100;
                            totalEfficiency += (timeEff + outputEff) / 2;
                            efficiencyCount++;
                        }
                    }
                });
            }
        });
        
        const successRate = totalOperations > 0 ? (completedOperations / totalOperations) * 100 : 0;
        const avgEfficiency = efficiencyCount > 0 ? totalEfficiency / efficiencyCount : 0;
        const timeUtilization = totalPlannedTime > 0 ? (totalActualTime / totalPlannedTime) * 100 : 0;
        const avgCompletionTime = completedOperations > 0 ? totalActualTime / completedOperations : 0;
        const pendingOperations = totalOperations - completedOperations;
        const overdueCount = Math.floor(pendingOperations * 0.3); // Mock overdue calculation
        
        return {
            users: users.length,
            technicians,
            supervisors,
            documents: documents.length,
            totalOperations,
            completedOperations,
            pendingOperations,
            successRate,
            avgEfficiency,
            timeUtilization,
            avgCompletionTime,
            overdueCount,
            activeProjects: documents.filter(doc => doc.operations.some(op => op.status === false)).length
        };
    }

    function generateSystemAlerts(analytics) {
        const alerts = [];
        
        if (analytics.successRate < 70) {
            alerts.push({
                type: 'warning',
                icon: '⚠️',
                text: `Operation success rate is below target (${analytics.successRate.toFixed(1)}%)`,
                time: 'Just now'
            });
        }
        
        if (analytics.avgEfficiency < 75) {
            alerts.push({
                type: 'warning',
                icon: '🐌',
                text: `Average efficiency needs improvement (${analytics.avgEfficiency.toFixed(1)}%)`,
                time: '2 min ago'
            });
        }
        
        if (analytics.overdueCount > 0) {
            alerts.push({
                type: 'warning',
                icon: '⏰',
                text: `${analytics.overdueCount} operations are overdue`,
                time: '5 min ago'
            });
        }
        
        if (analytics.successRate >= 90) {
            alerts.push({
                type: 'success',
                icon: '🎉',
                text: 'Excellent performance! Success rate above 90%',
                time: '10 min ago'
            });
        }
        
        if (alerts.length === 0) {
            alerts.push({
                type: 'info',
                icon: '✅',
                text: 'All systems operating normally',
                time: 'Just now'
            });
        }
        
        return alerts;
    }

    function updateActivityFeed(analytics) {
        const activities = [
            { time: new Date().toLocaleTimeString(), text: 'Dashboard refreshed' },
            { time: '--:--', text: `${analytics.completedOperations} operations completed today` },
            { time: '--:--', text: `${analytics.activeProjects} projects currently active` },
            { time: '--:--', text: `System efficiency: ${analytics.avgEfficiency.toFixed(1)}%` }
        ];
        
        const feedContainer = document.getElementById('activity-feed');
        feedContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-time">${activity.time}</div>
                <div class="activity-text">${activity.text}</div>
            </div>
        `).join('');
    }

    // Load functions
    function loadOverview() {
        const analytics = calculateAnalytics();
        
        // Update KPI cards
        document.getElementById('total-users').textContent = analytics.users;
        document.getElementById('total-technicians').textContent = analytics.technicians;
        document.getElementById('total-supervisors').textContent = analytics.supervisors;
        document.getElementById('total-documents').textContent = analytics.documents;
        
        // Update trends (mock data)
        document.getElementById('users-trend').textContent = '+2.5%';
        document.getElementById('tech-trend').textContent = '+1.2%';
        document.getElementById('super-trend').textContent = '0%';
        document.getElementById('docs-trend').textContent = '+5.1%';
        
        // Update operations analytics
        document.getElementById('completed-ops').textContent = analytics.completedOperations;
        document.getElementById('pending-ops').textContent = analytics.pendingOperations;
        document.getElementById('success-rate').textContent = analytics.successRate.toFixed(1) + '%';
        
        // Update progress bar
        const progressBar = document.getElementById('operations-progress');
        if (progressBar) {
            progressBar.style.width = analytics.successRate + '%';
        }
        
        // Update performance metrics
        document.getElementById('avg-efficiency').textContent = analytics.avgEfficiency.toFixed(1) + '%';
        document.getElementById('time-utilization').textContent = Math.min(analytics.timeUtilization, 100).toFixed(1) + '%';
        document.getElementById('resource-usage').textContent = (Math.random() * 30 + 60).toFixed(1) + '%';
        
        // Update performance gauge
        const gauge = document.getElementById('performance-gauge');
        if (gauge) {
            gauge.style.width = analytics.avgEfficiency + '%';
        }
        
        // Update quick stats
        document.getElementById('total-operations').textContent = analytics.totalOperations;
        document.getElementById('avg-completion-time').textContent = analytics.avgCompletionTime.toFixed(1) + 'h';
        document.getElementById('overdue-count').textContent = analytics.overdueCount;
        document.getElementById('active-projects').textContent = analytics.activeProjects;
        
        // Update system status
        updateSystemStatus(analytics);
        
        // Update activity feed
        updateActivityFeed(analytics);
        
        // Update alerts
        updateAlerts(analytics);
        
        // Update timestamp
        updateDashboardTime();
    }

    function updateSystemStatus(analytics) {
        // Database status
        document.getElementById('database-status').textContent = '🟢';
        
        // Operations status
        const opsStatus = analytics.successRate >= 80 ? '🟢' : analytics.successRate >= 60 ? '🟡' : '🔴';
        document.getElementById('operations-status').textContent = opsStatus;
        document.getElementById('operations-value').textContent = analytics.successRate >= 80 ? 'Optimal' : 'Degraded';
        
        // Workflow status
        const workflowStatus = analytics.pendingOperations < 5 ? '🟢' : analytics.pendingOperations < 10 ? '🟡' : '🔴';
        document.getElementById('workflow-status').textContent = workflowStatus;
        document.getElementById('workflow-value').textContent = analytics.pendingOperations < 5 ? 'Smooth' : 'Busy';
        
        // Performance status
        const perfStatus = analytics.avgEfficiency >= 85 ? '🟢' : analytics.avgEfficiency >= 70 ? '🟡' : '🔴';
        document.getElementById('performance-status').textContent = perfStatus;
        document.getElementById('performance-value').textContent = analytics.avgEfficiency >= 85 ? 'Excellent' : analytics.avgEfficiency >= 70 ? 'Good' : 'Poor';
    }

    function updateAlerts(analytics) {
        const alerts = generateSystemAlerts(analytics);
        const alertsContainer = document.getElementById('alerts-container');
        
        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert-item alert-${alert.type}">
                <div class="alert-icon">${alert.icon}</div>
                <div class="alert-text">${alert.text}</div>
                <div class="alert-time">${alert.time}</div>
            </div>
        `).join('');
    }

    // Refresh dashboard functionality
    document.getElementById('refresh-dashboard')?.addEventListener('click', function() {
        loadOverview();
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 500);
    });

    // Auto-refresh dashboard every 30 seconds
    function startDashboardAutoRefresh() {
        dashboardInterval = setInterval(() => {
            if (document.getElementById('overview-section').classList.contains('active')) {
                loadOverview();
            }
        }, 30000);
    }

    // Stop auto-refresh when leaving dashboard
    function stopDashboardAutoRefresh() {
        if (dashboardInterval) {
            clearInterval(dashboardInterval);
        }
    }

    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('users'));
        const tbody = document.getElementById('users-tbody');
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No users found. Create your first user!</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            const date = new Date(user.createdDate).toLocaleDateString();
            const roleClass = user.role === 'technician' ? 'badge-technician' : 'badge-supervisor';
            
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="badge ${roleClass}">${user.role}</span></td>
                <td>${date}</td>
                <td>
                    <button class="action-btn edit" onclick="editUser(${user.id})">Edit</button>
                    <button class="action-btn delete" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    function loadDocuments() {
        const documents = JSON.parse(localStorage.getItem('documents'));
        const tbody = document.getElementById('documents-tbody');
        
        if (documents.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No documents found. Create your first document!</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        documents.forEach(doc => {
            const row = document.createElement('tr');
            const date = new Date(doc.createdDate).toLocaleDateString();
            
            // Count completed operations
            const completedOps = doc.operations.filter(op => op.status === true).length;
            const totalOps = doc.operations.length;
            
            row.innerHTML = `
                <td><strong>${doc.serial}</strong></td>
                <td>${doc.title}</td>
                <td>
                    <span class="operations-count">${totalOps} total</span>
                    <br>
                    <span class="completed-count">${completedOps} completed</span>
                </td>
                <td>${date}</td>
                <td>
                    <button class="action-btn view" onclick="viewDocument(${doc.id})">View</button>
                    <button class="action-btn edit" onclick="editDocument(${doc.id})">Edit</button>
                    <button class="action-btn delete" onclick="deleteDocument(${doc.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Make functions global for onclick handlers
    window.editUser = function(userId) {
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.id === userId);
        
        if (user) {
            // Populate form with existing data
            document.getElementById('user-username').value = user.username;
            document.getElementById('user-password').value = user.password;
            document.getElementById('user-email').value = user.email;
            document.getElementById('user-role').value = user.role;
            
            // Show form and change button text
            userFormContainer.style.display = 'block';
            const submitBtn = userForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update User';
            submitBtn.dataset.editing = userId;
        }
    };

    window.deleteUser = function(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            let users = JSON.parse(localStorage.getItem('users'));
            users = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
            loadOverview();
        }
    };

    window.editDocument = function(docId) {
        const documents = JSON.parse(localStorage.getItem('documents'));
        const doc = documents.find(d => d.id === docId);
        
        if (doc) {
            // Populate form with existing data
            document.getElementById('doc-serial').value = doc.serial;
            document.getElementById('doc-title').value = doc.title;
            document.getElementById('doc-description').value = doc.description || '';
            
            // Populate operations
            operationsContainer.innerHTML = '';
            doc.operations.forEach(op => {
                const operationItem = document.createElement('div');
                operationItem.className = 'operation-item';
                
                // Handle both old string format and new object format
                const description = typeof op === 'string' ? op : op.description;
                const minOutput = typeof op === 'object' ? op.minOutput || '' : '';
                const minTime = typeof op === 'object' ? op.minTime || '' : '';
                const actualOutput = typeof op === 'object' ? op.actualOutput || '' : '';
                const actualTime = typeof op === 'object' ? op.actualTime || '' : '';
                const status = typeof op === 'object' ? op.status : '';
                const priority = typeof op === 'object' ? op.priority || '' : '';
                const notes = typeof op === 'object' ? op.notes || '' : '';
                
                operationItem.innerHTML = `
                    <div class="operation-row">
                        <input type="text" class="operation-input" placeholder="Operation description" required value="${description}">
                        <button type="button" class="btn btn-small btn-danger remove-operation">Remove</button>
                    </div>
                    <div class="operation-details">
                        <div class="form-row">
                            <div class="form-col">
                                <label>Minimum Output</label>
                                <input type="number" class="min-output" placeholder="Min output" min="0" step="0.01" value="${minOutput}">
                            </div>
                            <div class="form-col">
                                <label>Minimum Time (hours)</label>
                                <input type="number" class="min-time" placeholder="Min time" min="0" step="0.1" value="${minTime}">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-col">
                                <label>Actual Output</label>
                                <input type="number" class="actual-output" placeholder="Actual output" min="0" step="0.01" value="${actualOutput}">
                            </div>
                            <div class="form-col">
                                <label>Actual Time (hours)</label>
                                <input type="number" class="actual-time" placeholder="Actual time" min="0" step="0.1" value="${actualTime}">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-col">
                                <label>Operation Status</label>
                                <select class="operation-status">
                                    <option value="">Select Status</option>
                                    <option value="true" ${status === true ? 'selected' : ''}>Completed</option>
                                    <option value="false" ${status === false ? 'selected' : ''}>Not Completed</option>
                                </select>
                            </div>
                            <div class="form-col">
                                <label>number of operation</label>
                                <input type="number" class="operation-priority" placeholder="operation (1-150)" min="1" max="150" step="1" value="${priority}">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-col">
                                <label>Notes</label>
                                <textarea class="operation-notes" placeholder="Additional notes or comments" rows="3">${notes}</textarea>
                            </div>
                        </div>
                    </div>
                `;
                operationsContainer.appendChild(operationItem);
            });
            
            attachOperationListeners();
            
            // Show form and change button text
            documentFormContainer.style.display = 'block';
            const submitBtn = documentForm.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Document';
            submitBtn.dataset.editing = docId;
        }
    };

    window.deleteDocument = function(docId) {
        if (confirm('Are you sure you want to delete this document?')) {
            let documents = JSON.parse(localStorage.getItem('documents'));
            documents = documents.filter(d => d.id !== docId);
            localStorage.setItem('documents', JSON.stringify(documents));
            loadDocuments();
            loadOverview();
        }
    };

    window.viewDocument = function(docId) {
        const documents = JSON.parse(localStorage.getItem('documents'));
        const doc = documents.find(d => d.id === docId);
        
        if (doc) {
            const modal = document.getElementById('document-modal');
            const modalBody = document.getElementById('modal-body');
            
            // Calculate time-related metrics
            let totalMinTime = 0;
            let totalActualTime = 0;
            let completedOperationsTime = 0;
            let completedOperationsCount = 0;
            let validOperations = 0;
            
            doc.operations.forEach(op => {
                if (typeof op === 'object') {
                    // Count all operations with time data
                    if (op.minTime) {
                        totalMinTime += parseFloat(op.minTime) || 0;
                        validOperations++;
                    }
                    if (op.actualTime) {
                        totalActualTime += parseFloat(op.actualTime) || 0;
                    }
                    
                    // Count completed operations
                    if (op.status === true) {
                        completedOperationsCount++;
                        if (op.actualTime) {
                            completedOperationsTime += parseFloat(op.actualTime) || 0;
                        }
                    }
                }
            });
            
            // Calculate metrics with better logic
            const availableTime = totalMinTime; // Total planned time for all operations
            const actualOperatingTime = completedOperationsTime; // Time spent on completed operations
            const netTime = totalActualTime; // Total actual time spent on all operations
            const utilization = availableTime > 0 ? ((actualOperatingTime / availableTime) * 100) : 0;
            const idleTime = Math.max(0, netTime - actualOperatingTime);
            
            // Additional calculated metrics
            const completionRate = doc.operations.length > 0 ? ((completedOperationsCount / doc.operations.length) * 100) : 0;
            const averageTimePerOperation = completedOperationsCount > 0 ? (actualOperatingTime / completedOperationsCount) : 0;
            
            const operationsTable = doc.operations.map((op, index) => {
                if (typeof op === 'string') {
                    // Legacy format support
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${op}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    `;
                } else {
                    // New format with detailed information
                    const statusText = op.status === true ? 'Completed' : op.status === false ? 'Not Completed' : 'Not Set';
                    const statusClass = op.status === true ? 'status-completed' : op.status === false ? 'status-incomplete' : 'status-unset';
                    
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${op.description}</strong></td>
                            <td>${op.minOutput || '-'}</td>
                            <td>${op.minTime || '-'}</td>
                            <td>${op.actualOutput || '-'}</td>
                            <td>${op.actualTime || '-'}</td>
                            <td><span class="${statusClass}">${statusText}</span></td>
                            <td>${op.priority || '-'}</td>
                            <td class="notes-cell">${op.notes || '-'}</td>
                        </tr>
                    `;
                }
            }).join('');
            
            modalBody.innerHTML = `
                <div class="document-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Serial Number:</strong>
                            <span>${doc.serial}</span>
                        </div>
                        <div class="info-item">
                            <strong>Title:</strong>
                            <span>${doc.title}</span>
                        </div>
                        <div class="info-item">
                            <strong>Description:</strong>
                            <span>${doc.description || 'No description provided'}</span>
                        </div>
                        <div class="info-item">
                            <strong>Created Date:</strong>
                            <span>${new Date(doc.createdDate).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div class="time-metrics">
                    <h3>📊 Time Analysis & Performance Metrics</h3>
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-label">Available Time</div>
                            <div class="metric-value">${availableTime.toFixed(1)} hrs</div>
                            <div class="metric-description">Total planned time for all operations</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Net Time</div>
                            <div class="metric-value">${netTime.toFixed(1)} hrs</div>
                            <div class="metric-description">Total actual time spent on operations</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Actual Operating Time</div>
                            <div class="metric-value">${actualOperatingTime.toFixed(1)} hrs</div>
                            <div class="metric-description">Time spent on completed operations only</div>
                        </div>
                        <div class="metric-card ${utilization >= 80 ? 'metric-good' : utilization >= 60 ? 'metric-warning' : 'metric-poor'}">
                            <div class="metric-label">Utilization Rate</div>
                            <div class="metric-value">${utilization.toFixed(1)}%</div>
                            <div class="metric-description">Efficiency: Operating time vs Available time</div>
                        </div>
                        <div class="metric-card ${idleTime < 1 ? 'metric-good' : idleTime < 3 ? 'metric-warning' : 'metric-poor'}">
                            <div class="metric-label">Idle Time</div>
                            <div class="metric-value">${idleTime.toFixed(1)} hrs</div>
                            <div class="metric-description">Non-productive time (Net - Operating)</div>
                        </div>
                        <div class="metric-card ${completionRate >= 80 ? 'metric-good' : completionRate >= 50 ? 'metric-warning' : 'metric-poor'}">
                            <div class="metric-label">Completion Rate</div>
                            <div class="metric-value">${completionRate.toFixed(1)}%</div>
                            <div class="metric-description">${completedOperationsCount}/${doc.operations.length} operations completed</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-label">Avg Time/Operation</div>
                            <div class="metric-value">${averageTimePerOperation.toFixed(1)} hrs</div>
                            <div class="metric-description">Average time per completed operation</div>
                        </div>
                        <div class="metric-card ${(netTime > 0 && availableTime > 0) ? (netTime <= availableTime ? 'metric-good' : 'metric-warning') : ''}">
                            <div class="metric-label">Schedule Variance</div>
                            <div class="metric-value">${availableTime > 0 ? ((netTime - availableTime) / availableTime * 100).toFixed(1) : 0}%</div>
                            <div class="metric-description">${netTime > availableTime ? 'Over' : 'Under'} planned time</div>
                        </div>
                    </div>
                </div>
                <div class="operations-section">
                    <h3>Operations Details</h3>
                    <div class="table-wrapper">
                        <table class="operations-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Description</th>
                                    <th>Min Output</th>
                                    <th>Min Time (hrs)</th>
                                    <th>Actual Output</th>
                                    <th>Actual Time (hrs)</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${operationsTable}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        }
    };

    // Modal close handling
    const modal = document.getElementById('document-modal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initial load
    loadOverview();
    startDashboardAutoRefresh();
});
