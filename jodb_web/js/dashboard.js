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
                } else if (sectionId === 'users-section') {
                    loadUsers();
                } else if (sectionId === 'documents-section') {
                    loadDocuments();
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
    });

    cancelUserBtn.addEventListener('click', function() {
        userFormContainer.style.display = 'none';
        userForm.reset();
    });

    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('user-username').value;
        const password = document.getElementById('user-password').value;
        const email = document.getElementById('user-email').value;
        const role = document.getElementById('user-role').value;

        const users = JSON.parse(localStorage.getItem('users'));
        
        const newUser = {
            id: Date.now(),
            username: username,
            password: password,
            email: email,
            role: role,
            createdDate: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        userFormContainer.style.display = 'none';
        userForm.reset();
        loadUsers();
        loadOverview();
        
        alert('User created successfully!');
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
        // Reset operations to one input
        operationsContainer.innerHTML = `
            <div class="operation-item">
                <input type="text" class="operation-input" placeholder="Operation description">
                <button type="button" class="btn btn-small btn-danger remove-operation">Remove</button>
            </div>
        `;
        attachOperationListeners();
    });

    cancelDocumentBtn.addEventListener('click', function() {
        documentFormContainer.style.display = 'none';
        documentForm.reset();
    });

    addOperationBtn.addEventListener('click', function() {
        const operationItem = document.createElement('div');
        operationItem.className = 'operation-item';
        operationItem.innerHTML = `
            <input type="text" class="operation-input" placeholder="Operation description">
            <button type="button" class="btn btn-small btn-danger remove-operation">Remove</button>
        `;
        operationsContainer.appendChild(operationItem);
        attachOperationListeners();
    });

    function attachOperationListeners() {
        const removeButtons = document.querySelectorAll('.remove-operation');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (operationsContainer.children.length > 1) {
                    this.parentElement.remove();
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
        
        // Collect operations
        const operationInputs = document.querySelectorAll('.operation-input');
        const operations = [];
        operationInputs.forEach(input => {
            if (input.value.trim()) {
                operations.push(input.value.trim());
            }
        });

        const documents = JSON.parse(localStorage.getItem('documents'));
        
        const newDocument = {
            id: Date.now(),
            serial: serial,
            title: title,
            description: description,
            operations: operations,
            createdDate: new Date().toISOString()
        };

        documents.push(newDocument);
        localStorage.setItem('documents', JSON.stringify(documents));

        documentFormContainer.style.display = 'none';
        documentForm.reset();
        loadDocuments();
        loadOverview();
        
        alert('Document created successfully!');
    });

    // Load functions
    function loadOverview() {
        const users = JSON.parse(localStorage.getItem('users'));
        const documents = JSON.parse(localStorage.getItem('documents'));
        
        const technicians = users.filter(u => u.role === 'technician').length;
        const supervisors = users.filter(u => u.role === 'supervisor').length;
        
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-technicians').textContent = technicians;
        document.getElementById('total-supervisors').textContent = supervisors;
        document.getElementById('total-documents').textContent = documents.length;
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
            
            row.innerHTML = `
                <td><strong>${doc.serial}</strong></td>
                <td>${doc.title}</td>
                <td>${doc.operations.length}</td>
                <td>${date}</td>
                <td>
                    <button class="action-btn view" onclick="viewDocument(${doc.id})">View</button>
                    <button class="action-btn delete" onclick="deleteDocument(${doc.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Make functions global for onclick handlers
    window.deleteUser = function(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            let users = JSON.parse(localStorage.getItem('users'));
            users = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
            loadOverview();
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
            
            const operationsList = doc.operations.map(op => `<li>${op}</li>`).join('');
            
            modalBody.innerHTML = `
                <div class="detail-item">
                    <strong>Serial Number:</strong>
                    <p>${doc.serial}</p>
                </div>
                <div class="detail-item">
                    <strong>Title:</strong>
                    <p>${doc.title}</p>
                </div>
                <div class="detail-item">
                    <strong>Description:</strong>
                    <p>${doc.description || 'No description provided'}</p>
                </div>
                <div class="detail-item">
                    <strong>Created Date:</strong>
                    <p>${new Date(doc.createdDate).toLocaleString()}</p>
                </div>
                <div class="detail-item">
                    <strong>Operations:</strong>
                    <ul class="operations-list">
                        ${operationsList}
                    </ul>
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
});
