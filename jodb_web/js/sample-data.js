// Sample data for testing time metrics
document.addEventListener('DOMContentLoaded', function() {
    // Check if we need to create sample data for testing
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');

    // Create sample documents with realistic time data if none exist
    if (documents.length === 0) {
        const sampleDocuments = [
            {
                id: 1,
                serial: 'DOC-001',
                title: 'Production Line Assembly',
                description: 'Complete assembly line setup and optimization project',
                createdDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
                supervisor: 'sarah_supervisor',
                assignedUsers: [1, 3], // john_tech and mike_tech
                operations: [
                    {
                        description: 'Initial setup and calibration',
                        minOutput: 100,
                        minTime: 4.0,
                        actualOutput: 105,
                        actualTime: 3.5,
                        status: true,
                        priority: 1,
                        notes: 'Completed ahead of schedule with better output'
                    },
                    {
                        description: 'Quality testing and validation',
                        minOutput: 50,
                        minTime: 2.0,
                        actualOutput: 48,
                        actualTime: 2.5,
                        status: true,
                        priority: 2,
                        notes: 'Minor adjustments needed, took extra time'
                    },
                    {
                        description: 'Performance optimization',
                        minOutput: 75,
                        minTime: 3.0,
                        actualOutput: 0,
                        actualTime: 0,
                        status: false,
                        priority: 3,
                        notes: 'Pending - waiting for equipment parts'
                    },
                    {
                        description: 'Final testing and documentation',
                        minOutput: 25,
                        minTime: 1.5,
                        actualOutput: 0,
                        actualTime: 0,
                        status: false,
                        priority: 4,
                        notes: 'Not started yet'
                    }
                ]
            },
            {
                id: 2,
                serial: 'DOC-002',
                title: 'Quality Control Implementation',
                description: 'Implement comprehensive quality control system',
                createdDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                supervisor: 'sarah_supervisor',
                assignedUsers: [1], // john_tech (only technicians)
                operations: [
                    {
                        description: 'Develop QC protocols and procedures',
                        minOutput: 10,
                        minTime: 6.0,
                        actualOutput: 12,
                        actualTime: 5.5,
                        status: true,
                        priority: 1,
                        notes: 'Protocols exceed requirements and completed efficiently'
                    },
                    {
                        description: 'Train staff on new QC procedures',
                        minOutput: 20,
                        minTime: 8.0,
                        actualOutput: 22,
                        actualTime: 9.0,
                        status: true,
                        priority: 2,
                        notes: 'Training completed, extra time for hands-on practice'
                    },
                    {
                        description: 'Install monitoring equipment',
                        minOutput: 5,
                        minTime: 4.0,
                        actualOutput: 3,
                        actualTime: 6.0,
                        status: false,
                        priority: 3,
                        notes: 'Installation in progress, facing technical difficulties'
                    },
                    {
                        description: 'System integration and testing',
                        minOutput: 8,
                        minTime: 3.0,
                        actualOutput: 0,
                        actualTime: 0,
                        status: false,
                        priority: 4,
                        notes: 'Waiting for equipment installation completion'
                    }
                ]
            },
            {
                id: 3,
                serial: 'DOC-003',
                title: 'Maintenance Schedule Optimization',
                description: 'Optimize equipment maintenance schedules for maximum efficiency',
                createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                supervisor: 'sarah_supervisor',
                assignedUsers: [1, 3], // john_tech and mike_tech (only technicians)
                operations: [
                    {
                        description: 'Analyze current maintenance data',
                        minOutput: 30,
                        minTime: 10.0,
                        actualOutput: 35,
                        actualTime: 8.0,
                        status: true,
                        priority: 1,
                        notes: 'Analysis completed efficiently with excellent results'
                    },
                    {
                        description: 'Develop optimized maintenance schedule',
                        minOutput: 15,
                        minTime: 6.0,
                        actualOutput: 18,
                        actualTime: 7.5,
                        status: true,
                        priority: 2,
                        notes: 'Schedule developed with additional contingency plans'
                    },
                    {
                        description: 'Implementation and staff training',
                        minOutput: 25,
                        minTime: 8.0,
                        actualOutput: 0,
                        actualTime: 0,
                        status: false,
                        priority: 3,
                        notes: 'Scheduled for next week'
                    }
                ]
            },
            {
                id: 4,
                serial: 'DOC-004',
                title: 'Energy Efficiency Project',
                description: 'Comprehensive energy reduction initiative - target 20% reduction',
                createdDate: new Date().toISOString(),
                supervisor: 'sarah_supervisor',
                assignedUsers: [1, 3], // All technicians assigned
                operations: [
                    {
                        description: 'Energy audit and baseline assessment',
                        minOutput: 25,
                        minTime: 12.0,
                        actualOutput: 28,
                        actualTime: 14.0,
                        status: true,
                        priority: 1,
                        notes: 'Comprehensive audit completed, identified multiple optimization areas'
                    },
                    {
                        description: 'LED lighting system upgrade',
                        minOutput: 100,
                        minTime: 16.0,
                        actualOutput: 95,
                        actualTime: 18.0,
                        status: true,
                        priority: 2,
                        notes: 'Installation complete, minor issues with some fixtures'
                    },
                    {
                        description: 'HVAC system optimization',
                        minOutput: 50,
                        minTime: 20.0,
                        actualOutput: 30,
                        actualTime: 25.0,
                        status: false,
                        priority: 3,
                        notes: 'In progress - more complex than anticipated'
                    },
                    {
                        description: 'Smart energy monitoring installation',
                        minOutput: 10,
                        minTime: 8.0,
                        actualOutput: 0,
                        actualTime: 0,
                        status: false,
                        priority: 4,
                        notes: 'Equipment ordered, installation pending'
                    },
                    {
                        description: 'Staff training on energy conservation',
                        minOutput: 40,
                        minTime: 6.0,
                        actualOutput: 0,
                        actualTime: 0,
                        status: false,
                        priority: 5,
                        notes: 'Training materials being developed'
                    }
                ]
            }
        ];
        localStorage.setItem('documents', JSON.stringify(sampleDocuments));
    }
    // Ensure existing sample documents have a supervisor for demo
    else {
        let updated = false;
        documents.forEach(d => {
            if (!d.supervisor) { d.supervisor = 'sarah_supervisor'; updated = true; }
        });
        if (updated) localStorage.setItem('documents', JSON.stringify(documents));
    }

    // Create sample users if none exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
        const sampleUsers = [
            {
                id: 1,
                username: 'john_tech',
                password: 'password123',
                email: 'john.doe@company.com',
                role: 'technician',
                createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 2,
                username: 'sarah_supervisor',
                password: 'password123',
                email: 'sarah.manager@company.com',
                role: 'supervisor',
                createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 3,
                username: 'mike_tech',
                password: 'password123',
                email: 'mike.tech@company.com',
                role: 'technician',
                createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
});
