import { Router, Request, Response } from 'express';
import { Patient } from '../models/Patient';

const router = Router();

// GET /api/stats - Get patient statistics
router.get('/', async (req: Request, res: Response) => {
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

        res.json(response);
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Failed to fetch statistics'
        });
    }
});

export default router;