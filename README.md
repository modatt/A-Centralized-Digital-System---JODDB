# JODDB - Centralized Digital System

> A comprehensive digital platform for technician task management, job order tracking, and event management with advanced user authentication and role-based access control.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Components](#system-components)
- [Getting Started](#getting-started)
- [User Roles & Permissions](#user-roles--permissions)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Usage Guide](#usage-guide)
- [Browser Compatibility](#browser-compatibility)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

JODDB is a centralized digital system designed to streamline technician task management and job order tracking while providing a robust event management platform. The system features role-based access control, real-time analytics, and comprehensive user management capabilities.

### Key Objectives
- **Streamline Operations**: Simplify technician task assignments and job order tracking
- **Event Management**: Organize and manage events with registration and approval workflows
- **User Management**: Maintain secure user authentication with role-based permissions
- **Analytics Dashboard**: Provide real-time insights into system usage and performance
- **Document Management**: Centralize document storage and retrieval

---

## ✨ Features

### Core Features
- 🔐 **Secure Authentication System** - Multi-role login with session management
- 📊 **Real-time Analytics Dashboard** - KPIs and performance metrics
- 👥 **User Management** - Create, edit, and manage user accounts
- 📅 **Event Management** - Create, edit, and track events with registration
- 📝 **Job Order Tracking** - Monitor and manage technician assignments
- 📄 **Document Management** - Centralized document storage and access
- 🔔 **Notification System** - Real-time updates and alerts
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- **Registration Approval System** - Manual or automatic event registration approval
- **Edit History Tracking** - Complete audit trail for posts and events
- **Comment Moderation** - Delete and archive comment system
- **Status Dashboard** - Visual indicators for registration statuses
- **Capacity Management** - Automatic capacity tracking for events
- **Deleted Items Archive** - Admin-accessible archive of deleted content

---

## 🏗️ System Components

### 1. **JODB Web Platform** (`jodb_web/`)
The main planner and task management system featuring:
- Administrative dashboard with real-time analytics
- User management interface
- Document management system
- Job order tracking
- System overview and KPI monitoring

### 2. **Event Management System** (`web/`)
Comprehensive event management platform with:
- Event creation and editing
- Registration and approval workflows
- User authentication and role management
- Comment and moderation system
- Edit history tracking

### 3. **Test Environment** (`test_wevjd/`)
Development and testing environment for feature validation

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- No server-side setup required (client-side application)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/A-Centralized-Digital-System---JODDB.git
   cd A-Centralized-Digital-System---JODDB
   ```

2. **Open the application**
   
   For the Planner System:
   ```bash
   # Open jodb_web/index.html in your browser
   ```
   
   For the Event Management System:
   ```bash
   # Open web/index.html in your browser
   ```

### Demo Credentials

#### Planner System
- Check `jodb_web/js/auth.js` for login credentials

#### Event Management System
- **Admin Access**
  - Username: `admin`
  - Password: `admin123`

- **Normal User Access**
  - Username: `user`
  - Password: `user123`

---

## 👤 User Roles & Permissions

### Administrator
- ✅ Full system access
- ✅ Create, edit, and delete events/posts
- ✅ Manage user accounts
- ✅ Delete any comment
- ✅ View edit history
- ✅ Access deleted items archive
- ✅ View system analytics
- ✅ Manage registrations

### Event Creator/Organizer
- ✅ Create and edit own events
- ✅ Delete comments on own events
- ✅ Manage event registrations (accept/reject)
- ✅ Configure auto-approval settings
- ✅ View event analytics

### Normal User
- ✅ View events and posts
- ✅ Register for events
- ✅ Comment on events/posts
- ✅ Delete own comments
- ✅ Edit own posts
- ✅ Track registration status
- ❌ Cannot delete others' content
- ❌ Cannot access admin features

---

## 🎯 Key Features

### Event Registration System

#### Auto-Approval Mode
- Registrations are instantly confirmed
- Users immediately receive "Registered" status
- Automatic capacity management

#### Manual Approval Mode
- Registrations start with "Pending" status
- Event creators review and approve/reject
- Users receive status updates
- Only accepted registrations count toward capacity

### Registration Status Indicators
- ✓ **Registered** (Green) - Approved and confirmed
- ⏱ **Pending** (Yellow) - Awaiting approval
- ✗ **Rejected** (Red) - Registration declined

### Edit History System
- Track all changes to events and posts
- Before/after comparison for each edit
- Timestamp and user tracking
- Admin-accessible history viewer

### Comment Moderation
- Delete inappropriate comments
- Archive deleted comments (admin access)
- Permission-based deletion (admin, creator, author)
- Complete deletion history

---

## 📁 Project Structure

```
A-Centralized-Digital-System---JODDB/
├── jodb_web/                      # Main planner system
│   ├── dashboard.html             # Admin dashboard
│   ├── index.html                 # Login page
│   ├── test_login.html            # Login testing
│   ├── test_table.html            # Table component testing
│   ├── css/
│   │   └── styles.css             # Main stylesheet
│   └── js/
│       ├── analytics.jsx          # Analytics components
│       ├── auth.js                # Authentication logic
│       ├── dashboard.js           # Dashboard functionality
│       └── sample-data.js         # Sample data for testing
│
├── web/                           # Event management system
│   ├── index.html                 # Main event page
│   ├── script.js                  # Event management logic
│   ├── styles.css                 # Event page styles
│   ├── NEW_FEATURES.md            # Feature documentation
│   ├── README.md                  # Event system docs
│   └── REGISTRATION_DASHBOARD_FEATURES.md
│
├── test_wevjd/                    # Test environment
│   ├── app.js
│   ├── index.html
│   └── styles.css
│
└── README.md                      # This file
```

---

## 🛠️ Technologies Used

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with Flexbox and Grid
- **JavaScript (ES6+)** - Core functionality and interactivity
- **React JSX** - Analytics component rendering

### Features & Libraries
- Local Storage API for data persistence
- Responsive CSS media queries
- Modern ES6+ features (arrow functions, template literals, destructuring)
- Event-driven architecture

### Design Principles
- Mobile-first responsive design
- Accessibility considerations
- Clean and modern UI/UX
- Gradient-based color schemes

---

## 📖 Usage Guide

### For Administrators

1. **Login** with admin credentials
2. **Dashboard**: View system analytics and KPIs
3. **Manage Users**: Create, edit, or remove user accounts
4. **Manage Events**: Create events with custom settings
5. **Review Registrations**: Approve or reject event registrations
6. **View Archives**: Access deleted comments and edit history

### For Event Creators

1. **Create Event**:
   - Fill in event details (title, date, location, capacity)
   - Choose event category
   - Configure auto-approval setting
   - Submit event

2. **Manage Registrations**:
   - View all registration requests
   - Accept or reject applications
   - Monitor capacity and attendance

3. **Edit Events**:
   - Update event information
   - All changes are tracked in edit history
   - Toggle auto-approval setting

### For Users

1. **Browse Events**:
   - View today's events and all upcoming events
   - Filter by category
   - See registration status on event cards

2. **Register for Events**:
   - Click "Register for Event"
   - Fill in registration form
   - Wait for approval (if manual mode) or get instant confirmation

3. **Track Registrations**:
   - Go to "My Registrations"
   - View status of all your registrations
   - Cancel pending registrations if needed

---

## 🌐 Browser Compatibility

This application is compatible with all modern browsers:

- ✅ Google Chrome (v90+)
- ✅ Mozilla Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Microsoft Edge (v90+)

---

## 🙏 Acknowledgments

- Development team for continuous improvement
- All contributors who have helped shape this project
- Users for valuable feedback and suggestions

---

**Made with ❤️ for efficient task and event management**
