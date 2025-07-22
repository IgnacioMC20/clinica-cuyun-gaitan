import mongoose from 'mongoose';
import { Patient } from '../models/Patient';
import { IPatient } from '../../../shared/types';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env.development' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/clinic-dashboard?authSource=admin';

// Sample patient data with proper typing
const samplePatients: Omit<IPatient, 'id'>[] = [
    {
        firstName: 'María',
        lastName: 'González',
        address: 'Calle Principal 123, Ciudad de Guatemala',
        age: 35,
        gender: 'female',
        maritalStatus: 'Casada',
        occupation: 'Maestra',
        phone: '555-0123',
        vaccination: ['COVID-19', 'Influenza'],
        visitDate: new Date('2024-01-15'),
        notes: [
            {
                title: 'Consulta General',
                content: 'Paciente presenta síntomas de gripe común. Se recomienda reposo y medicación.',
                date: new Date('2024-01-15T10:00:00Z')
            }
        ]
    },
    {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        address: 'Avenida Reforma 456, Guatemala',
        age: 42,
        gender: 'male',
        maritalStatus: 'Soltero',
        occupation: 'Ingeniero',
        phone: '555-0456',
        vaccination: ['COVID-19'],
        visitDate: new Date('2024-01-14'),
        notes: [
            {
                title: 'Chequeo Anual',
                content: 'Examen físico completo. Resultados normales.',
                date: new Date('2024-01-14T14:30:00Z')
            }
        ]
    },
    {
        firstName: 'Ana',
        lastName: 'Martínez',
        address: 'Zona 10, Guatemala',
        age: 8,
        gender: 'child',
        maritalStatus: 'N/A',
        occupation: 'Estudiante',
        phone: '555-0789',
        vaccination: ['COVID-19', 'MMR', 'DPT'],
        visitDate: new Date('2024-01-13'),
        notes: [
            {
                title: 'Consulta Pediátrica',
                content: 'Control de crecimiento y desarrollo. Todo normal para su edad.',
                date: new Date('2024-01-13T09:00:00Z')
            }
        ]
    }
];

async function seedDatabase(): Promise<void> {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB!');

        // Clear existing data
        console.log('🧹 Clearing existing patient data...');
        await Patient.deleteMany({});

        // Insert sample data
        console.log('📝 Inserting sample patients...');
        const insertedPatients = await Patient.insertMany(samplePatients);

        console.log(`✅ Successfully inserted ${insertedPatients.length} patients`);

        // Create indexes (Mongoose will handle this automatically, but we can ensure they exist)
        console.log('📊 Ensuring indexes exist...');
        await Patient.createIndexes();
        console.log('✅ Indexes created successfully');

        // Display statistics
        const stats = await Patient.getStats();
        console.log('📈 Database statistics:', stats);

        console.log('🎉 Database seeding completed successfully!');

    } catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
    seedDatabase().catch(console.error);
}

export { seedDatabase, samplePatients };