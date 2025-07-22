// MongoDB initialization script for Clínica Médica Cuyún Gaitán
// This script runs when the MongoDB container starts for the first time
// Minimal setup - data seeding is handled by TypeScript scripts

/* eslint-disable */
// Note: 'db' is a global variable provided by MongoDB shell, not Node.js

// Switch to the clinic-dashboard database
db = db.getSiblingDB('clinic-dashboard');

// Create a user for the application
db.createUser({
    user: 'clinic_app',
    pwd: 'clinic_password_123',
    roles: [
        {
            role: 'readWrite',
            db: 'clinic-dashboard'
        }
    ]
});

print('✅ Database user created successfully');
print('📝 Use "npm run seed" in the server directory to populate with sample data');