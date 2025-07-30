import mongoose from 'mongoose';
import { User } from '../models/authModels';
import argon2 from 'argon2';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinica-medica';

// Sample users
const sampleUsers = [
    {
        email: 'admin@clinica.com',
        password: 'admin123',
        role: 'admin' as const
    },
    {
        email: 'doctor@clinica.com',
        password: 'doctor123',
        role: 'doctor' as const
    },
    {
        email: 'nurse@clinica.com',
        password: 'nurse123',
        role: 'nurse' as const
    }
];

async function seedUsers(): Promise<void> {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB!');

        // Clear existing users
        console.log('🧹 Clearing existing user data...');
        await User.deleteMany({});

        // Insert sample users
        console.log('👥 Creating sample users...');

        for (const userData of sampleUsers) {
            const hashedPassword = await argon2.hash(userData.password);
            const userId = randomUUID();

            await User.create({
                _id: userId,
                email: userData.email,
                hashed_password: hashedPassword,
                role: userData.role
            });

            console.log(`✅ Created user: ${userData.email} (${userData.role})`);
        }

        console.log('🎉 User seeding completed successfully!');
        console.log('\n📋 Test Credentials:');
        sampleUsers.forEach(user => {
            console.log(`   ${user.role}: ${user.email} / ${user.password}`);
        });

    } catch (error) {
        console.error('❌ User seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
    seedUsers().catch(console.error);
}

export { seedUsers };