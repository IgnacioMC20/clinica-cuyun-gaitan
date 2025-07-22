import { FastifyPluginAsync } from 'fastify';
import { Patient } from './models/Patient';

const routes: FastifyPluginAsync = async (app) => {
    // GET /api/stats - Get patient statistics
    app.get('/stats', async (request, reply) => {
        try {
            // Get basic stats using aggregation
            const stats = await Patient.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        male: { $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] } },
                        female: { $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] } },
                        children: { $sum: { $cond: [{ $eq: ['$gender', 'child'] }, 1, 0] } },
                        averageAge: { $avg: '$age' }
                    }
                }
            ]);

            const recentVisits = await Patient.countDocuments({
                visitDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            });

            const response = {
                total: stats[0]?.total || 0,
                male: stats[0]?.male || 0,
                female: stats[0]?.female || 0,
                children: stats[0]?.children || 0,
                averageAge: Math.round(stats[0]?.averageAge || 0),
                recentVisits
            };

            return reply.send(response);
        } catch (error) {
            request.log.error('Error fetching stats:', error);
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: 'Failed to fetch statistics'
            });
        }
    });

    // GET /api/patients - List patients with search and pagination
    app.get('/patients', async (request, reply) => {
        try {
            const query = request.query as {
                query?: string;
                gender?: string;
                ageMin?: string;
                ageMax?: string;
                limit?: string;
                offset?: string;
            };

            const {
                query: searchQuery = '',
                gender,
                ageMin,
                ageMax,
                limit = '10',
                offset = '0'
            } = query;

            const limitNum = Math.min(parseInt(String(limit)) || 10, 100);
            const offsetNum = parseInt(String(offset)) || 0;

            // Build search filter
            const filter: Record<string, any> = {};

            // Text search
            if (searchQuery && String(searchQuery).trim()) {
                filter.$text = { $search: String(searchQuery).trim() };
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

            return reply.send(response);
        } catch (error) {
            request.log.error('Error fetching patients:', error);
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: 'Failed to fetch patients'
            });
        }
    });

    // GET /api/patients/search/phone/:phone - Search patient by phone
    app.get('/patients/search/phone/:phone', async (request, reply) => {
        try {
            const { phone } = request.params as { phone: string };

            const patient = await Patient.findOne({
                phone: { $regex: phone.replace(/\D/g, ''), $options: 'i' }
            }).lean();

            if (!patient) {
                return reply.status(404).send({
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

            return reply.send(response);
        } catch (error) {
            request.log.error('Error searching by phone:', error);
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: 'Failed to search by phone'
            });
        }
    });

    // GET /api/patients/:id - Get single patient
    app.get('/patients/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };

            const patient = await Patient.findById(id).lean();

            if (!patient) {
                return reply.status(404).send({
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

            return reply.send(response);
        } catch (error) {
            request.log.error('Error fetching patient:', error);
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: 'Failed to fetch patient'
            });
        }
    });

    // POST /api/patients - Create new patient
    app.post('/patients', async (request, reply) => {
        try {
            const patientData = request.body as any;

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

            return reply.status(201).send(response);
        } catch (error: any) {
            request.log.error('Error creating patient:', error);

            // Handle validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((err: any) => ({
                    field: err.path,
                    message: err.message
                }));
                return reply.status(400).send({
                    error: 'Validation Error',
                    message: 'Invalid patient data',
                    details: errors
                });
            }

            return reply.status(500).send({
                error: 'Internal Server Error',
                message: 'Failed to create patient'
            });
        }
    });

    // PUT /api/patients/:id - Update patient
    app.put('/patients/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const updateData = request.body as any;

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
                return reply.status(404).send({
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

            return reply.send(response);
        } catch (error: any) {
            request.log.error('Error updating patient:', error);

            // Handle validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map((err: any) => ({
                    field: err.path,
                    message: err.message
                }));
                return reply.status(400).send({
                    error: 'Validation Error',
                    message: 'Invalid patient data',
                    details: errors
                });
            }

            return reply.status(500).send({
                error: 'Internal Server Error',
                message: 'Failed to update patient'
            });
        }
    });

    // DELETE /api/patients/:id - Delete patient
    app.delete('/patients/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };

            const patient = await Patient.findByIdAndDelete(id);

            if (!patient) {
                return reply.status(404).send({
                    error: 'Not Found',
                    message: 'Patient not found'
                });
            }

            return reply.send({
                message: 'Patient deleted successfully',
                id: patient._id.toString()
            });
        } catch (error) {
            request.log.error('Error deleting patient:', error);
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: 'Failed to delete patient'
            });
        }
    });

    // POST /api/patients/:id/notes - Add note to patient
    app.post('/patients/:id/notes', async (request, reply) => {
        try {
            const { id } = request.params as { id: string };
            const { title, content } = request.body as { title: string; content: string };

            if (!title || !content) {
                return reply.status(400).send({
                    error: 'Validation Error',
                    message: 'Title and content are required'
                });
            }

            const patient = await Patient.findById(id);

            if (!patient) {
                return reply.status(404).send({
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

            return reply.send(response);
        } catch (error) {
            request.log.error('Error adding note:', error);
            return reply.status(500).send({
                error: 'Internal Server Error',
                message: 'Failed to add note'
            });
        }
    });
};

export default routes;