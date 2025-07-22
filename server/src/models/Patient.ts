import { Schema, model, Document, Model } from 'mongoose';
import { IPatient, PatientNote, PATIENT_VALIDATION } from '../../../shared/types';

// Extend the shared interface with Mongoose Document
export interface IPatientDocument extends Omit<IPatient, 'id'>, Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    fullName: string;
    addNote(title: string, content: string): Promise<IPatientDocument>;
    getRecentNotes(limit?: number): PatientNote[];
}

// Static methods interface
export interface IPatientModel extends Model<IPatientDocument> {
    findByPhone(phone: string): Promise<IPatientDocument | null>;
    findByName(firstName: string, lastName: string): Promise<IPatientDocument[]>;
    getStats(): Promise<{
        total: number;
        male: number;
        female: number;
        children: number;
        averageAge: number;
        recentVisits: number;
    }>;
}

// Note schema for embedded documents
const noteSchema = new Schema<PatientNote>({
    title: {
        type: String,
        required: [true, 'Note title is required'],
        trim: true,
        maxlength: [100, 'Note title cannot exceed 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Note content is required'],
        trim: true,
        maxlength: [1000, 'Note content cannot exceed 1000 characters']
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    _id: true, // Generate _id for each note
    timestamps: false // Don't add timestamps to subdocuments
});

// Main Patient schema
const patientSchema = new Schema<IPatientDocument>({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [PATIENT_VALIDATION.firstName.minLength, `First name must be at least ${PATIENT_VALIDATION.firstName.minLength} characters`],
        maxlength: [PATIENT_VALIDATION.firstName.maxLength, `First name cannot exceed ${PATIENT_VALIDATION.firstName.maxLength} characters`],
        match: [PATIENT_VALIDATION.firstName.pattern, 'First name contains invalid characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [PATIENT_VALIDATION.lastName.minLength, `Last name must be at least ${PATIENT_VALIDATION.lastName.minLength} characters`],
        maxlength: [PATIENT_VALIDATION.lastName.maxLength, `Last name cannot exceed ${PATIENT_VALIDATION.lastName.maxLength} characters`],
        match: [PATIENT_VALIDATION.lastName.pattern, 'Last name contains invalid characters']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [PATIENT_VALIDATION.address.minLength, `Address must be at least ${PATIENT_VALIDATION.address.minLength} characters`],
        maxlength: [PATIENT_VALIDATION.address.maxLength, `Address cannot exceed ${PATIENT_VALIDATION.address.maxLength} characters`]
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [PATIENT_VALIDATION.age.min, `Age must be at least ${PATIENT_VALIDATION.age.min}`],
        max: [PATIENT_VALIDATION.age.max, `Age cannot exceed ${PATIENT_VALIDATION.age.max}`],
        validate: {
            validator: Number.isInteger,
            message: 'Age must be a whole number'
        }
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['male', 'female', 'child'],
            message: 'Gender must be one of: male, female, child'
        }
    },
    maritalStatus: {
        type: String,
        required: [true, 'Marital status is required'],
        trim: true,
        maxlength: [50, 'Marital status cannot exceed 50 characters']
    },
    occupation: {
        type: String,
        required: [true, 'Occupation is required'],
        trim: true,
        maxlength: [100, 'Occupation cannot exceed 100 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        minlength: [PATIENT_VALIDATION.phone.minLength, `Phone must be at least ${PATIENT_VALIDATION.phone.minLength} characters`],
        maxlength: [PATIENT_VALIDATION.phone.maxLength, `Phone cannot exceed ${PATIENT_VALIDATION.phone.maxLength} characters`],
        match: [PATIENT_VALIDATION.phone.pattern, 'Phone number format is invalid']
    },
    vaccination: {
        type: [String],
        default: [],
        validate: {
            validator: function (vaccinations: string[]) {
                return vaccinations.every(v => typeof v === 'string' && v.trim().length > 0);
            },
            message: 'All vaccinations must be non-empty strings'
        }
    },
    visitDate: {
        type: Date,
        required: [true, 'Visit date is required'],
        index: true
    },
    notes: {
        type: [noteSchema],
        default: [],
        validate: {
            validator: function (notes: PatientNote[]) {
                return notes.length <= 50; // Limit number of notes
            },
            message: 'Cannot have more than 50 notes per patient'
        }
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    collection: 'patients',
    toJSON: {
        transform: function (doc, ret: any) {
            // Transform _id to id for API responses
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        transform: function (doc, ret: any) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Indexes for better query performance
patientSchema.index({ firstName: 1, lastName: 1 }); // Compound index for name searches
patientSchema.index({ phone: 1 }, { unique: true }); // Unique index for phone
patientSchema.index({ visitDate: -1 }); // Descending index for recent visits
patientSchema.index({ gender: 1 }); // Index for gender filtering
patientSchema.index({ age: 1 }); // Index for age filtering
patientSchema.index({ createdAt: -1 }); // Index for recent patients

// Text index for search functionality
patientSchema.index({
    firstName: 'text',
    lastName: 'text',
    phone: 'text',
    address: 'text'
}, {
    weights: {
        firstName: 10,
        lastName: 10,
        phone: 5,
        address: 1
    },
    name: 'patient_text_index'
});

// Virtual for full name
patientSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Instance methods
patientSchema.methods.addNote = function (title: string, content: string) {
    this.notes.push({
        title: title.trim(),
        content: content.trim(),
        date: new Date()
    });
    return this.save();
};

patientSchema.methods.getRecentNotes = function (limit: number = 5) {
    return this.notes
        .sort((a: PatientNote, b: PatientNote) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
};

// Static methods
patientSchema.statics.findByPhone = function (phone: string) {
    return this.findOne({ phone: phone.trim() });
};

patientSchema.statics.findByName = function (firstName: string, lastName: string) {
    return this.find({
        firstName: new RegExp(firstName.trim(), 'i'),
        lastName: new RegExp(lastName.trim(), 'i')
    });
};

patientSchema.statics.getStats = async function () {
    const stats = await this.aggregate([
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

    const recentVisits = await this.countDocuments({
        visitDate: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    return {
        total: stats[0]?.total || 0,
        male: stats[0]?.male || 0,
        female: stats[0]?.female || 0,
        children: stats[0]?.children || 0,
        averageAge: Math.round(stats[0]?.averageAge || 0),
        recentVisits
    };
};

// Pre-save middleware
patientSchema.pre('save', function (next) {
    // Ensure phone number is properly formatted
    if (this.phone) {
        this.phone = this.phone.replace(/\s+/g, ' ').trim();
    }

    // Ensure names are properly capitalized
    if (this.firstName) {
        this.firstName = this.firstName.trim().replace(/\b\w/g, l => l.toUpperCase());
    }
    if (this.lastName) {
        this.lastName = this.lastName.trim().replace(/\b\w/g, l => l.toUpperCase());
    }

    next();
});

// Export the model
export const Patient = model<IPatientDocument, IPatientModel>('Patient', patientSchema);
export default Patient;