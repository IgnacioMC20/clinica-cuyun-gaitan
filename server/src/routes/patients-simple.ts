import { Router, Request, Response } from 'express';
import { Patient } from '../models/Patient';

const router = Router();

// GET /api/patients - List patients with search and pagination
router.get('/', async (req: Request, res: Response) => {
    try {
        const {
            query = '',
            gender,
            ageMin,
            ageMax,
            limit = '10',
            offset = '0'
        } = req.query;

        const limitNum = Math.min(parseInt(String(limit)) || 10, 100);
        const offsetNum = parseInt(String(offset)) || 0;

        // Build search filter
        const filter: Record<string, any> = {};

        // Text search
        if (query && String(query).trim()) {
            filter.$text = { $search: String(query).trim() };
        }

        // Gender filter
        if (gender && ['male', 'female', 'child'].includes(String(gender))) {
            filter.gender = gender;
        }

        // Age range filter
        if (ageMin || ageMax) {
            filter.age = {};
            if (ageMin) filter.age.$gte = parseInt(String(ageMin));
            if (ageMax) filter.age.$lte = parseInt(String(ageMax));
        }

        // Execute query with pagination
        const [patients, total] = await Promise.all([
            Patient.find(filter)
                .sort({ createdAt: -1 })
                .limit(limitNum)
                .skip(offsetNum)
                .lean(),
            Patient.countDocuments(filter)
        ]);

        // Transform response
        const response = {
            patients: patients.map((patient: any) => ({
                ...patient,
                id: patient._id.toString(),
                createdAt: patient.createdAt.toISOString(),
                updatedAt: patient.updatedAt.toISOString(),
                visitDate: new Date(patient.visitDate).toISOString()
            })),
            total,
            limit: limitNum,
            offset: offsetNum
        };

        res.json(response);
    } catch (error: any) {
        console.error('Error fetching patients:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch patients'
        });
    }
});

// GET /api/patients/search/phone/:phone - Search patient by phone
router.get('/search/phone/:phone', async (req: Request, res: Response) => {
    try {
        const { phone } = req.params;

        const patient = await Patient.findOne({
            phone: { $regex: phone.replace(/\D/g, ''), $options: 'i' }
        }).lean();

        if (!patient) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Patient not found with this phone number'
            });
        }

        // Transform response
        const response = {
            ...patient,
            id: (patient as any)._id.toString(),
            createdAt: (patient as any).createdAt.toISOString(),
            updatedAt: (patient as any).updatedAt.toISOString(),
            visitDate: new Date((patient as any).visitDate).toISOString()
        };

        res.json(response);
    } catch (error: any) {
        console.error('Error searching by phone:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to search by phone'
        });
    }
});

// GET /api/patients/:id - Get single patient
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findById(id).lean();

        if (!patient) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Patient not found'
            });
        }

        // Transform response
        const response = {
            ...patient,
            id: (patient as any)._id.toString(),
            createdAt: (patient as any).createdAt.toISOString(),
            updatedAt: (patient as any).updatedAt.toISOString(),
            visitDate: new Date((patient as any).visitDate).toISOString()
        };

        res.json(response);
    } catch (error: any) {
        console.error('Error fetching patient:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch patient'
        });
    }
});

// POST /api/patients - Create new patient
router.post('/', async (req: Request, res: Response) => {
    try {
        const patientData = req.body;

        // Create new patient
        const patient = new Patient({
            ...patientData,
            visitDate: new Date(patientData.visitDate),
            notes: patientData.notes?.map((note: any) => ({
                ...note,
                date: new Date()
            })) || []
        });

        await patient.save();

        // Transform response
        const response = {
            ...patient.toObject(),
            id: patient._id.toString(),
            createdAt: patient.createdAt.toISOString(),
            updatedAt: patient.updatedAt.toISOString(),
            visitDate: new Date(patient.visitDate).toISOString()
        };

        res.status(201).json(response);
    } catch (error: any) {
        console.error('Error creating patient:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Invalid patient data',
                details: errors
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to create patient'
        });
    }
});

// PUT /api/patients/:id - Update patient
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove id from update data
        delete updateData.id;

        // Convert visitDate if provided
        if (updateData.visitDate) {
            updateData.visitDate = new Date(updateData.visitDate);
        }

        const patient = await Patient.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if (!patient) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Patient not found'
            });
        }

        // Transform response
        const response = {
            ...patient,
            id: (patient as any)._id.toString(),
            createdAt: (patient as any).createdAt.toISOString(),
            updatedAt: (patient as any).updatedAt.toISOString(),
            visitDate: new Date((patient as any).visitDate).toISOString()
        };

        res.json(response);
    } catch (error: any) {
        console.error('Error updating patient:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Invalid patient data',
                details: errors
            });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to update patient'
        });
    }
});

// DELETE /api/patients/:id - Delete patient
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findByIdAndDelete(id);

        if (!patient) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Patient not found'
            });
        }

        res.json({
            message: 'Patient deleted successfully',
            id: patient._id.toString()
        });
    } catch (error: any) {
        console.error('Error deleting patient:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to delete patient'
        });
    }
});

// POST /api/patients/:id/notes - Add note to patient
router.post('/:id/notes', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Title and content are required'
            });
        }

        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Patient not found'
            });
        }

        // Add new note
        const newNote = {
            title: title.trim(),
            content: content.trim(),
            date: new Date()
        };

        patient.notes.push(newNote);
        await patient.save();

        // Transform response
        const response = {
            ...patient.toObject(),
            id: patient._id.toString(),
            createdAt: patient.createdAt.toISOString(),
            updatedAt: patient.updatedAt.toISOString(),
            visitDate: new Date(patient.visitDate).toISOString()
        };

        res.json(response);
    } catch (error: any) {
        console.error('Error adding note:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to add note'
        });
    }
});


export default router;