import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PatientNote {
    id: string;
    title: string;
    content: string;
    date: string;
}

interface PatientData {
    id?: string;
    firstName: string;
    lastName: string;
    address: string;
    age: number;
    gender: 'male' | 'female' | 'child';
    maritalStatus: string;
    occupation: string;
    phone: string;
    vaccination: string[];
    visitDate: string;
    notes: PatientNote[];
}

interface PatientDetailProps {
    patient?: PatientData;
    onSave?: (patient: PatientData) => void;
    onCancel?: () => void;
    className?: string;
    mode?: 'view' | 'edit' | 'create';
}

export function PatientDetail({
    patient,
    onSave,
    onCancel,
    className,
    mode = 'view'
}: PatientDetailProps) {
    const [formData, setFormData] = useState<PatientData>(patient || {
        firstName: '',
        lastName: '',
        address: '',
        age: 0,
        gender: 'male',
        maritalStatus: '',
        occupation: '',
        phone: '',
        vaccination: [],
        visitDate: new Date().toISOString().split('T')[0],
        notes: []
    });

    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [isEditing, setIsEditing] = useState(mode === 'create' || mode === 'edit');

    const handleInputChange = (field: keyof PatientData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddNote = () => {
        if (newNote.title.trim() && newNote.content.trim()) {
            const note: PatientNote = {
                id: Date.now().toString(),
                title: newNote.title,
                content: newNote.content,
                date: new Date().toISOString()
            };
            setFormData(prev => ({
                ...prev,
                notes: [...prev.notes, note]
            }));
            setNewNote({ title: '', content: '' });
        }
    };

    const handleRemoveNote = (noteId: string) => {
        setFormData(prev => ({
            ...prev,
            notes: prev.notes.filter(note => note.id !== noteId)
        }));
    };

    const handleSave = () => {
        onSave?.(formData);
        setIsEditing(false);
    };

    const getGenderLabel = (gender: string) => {
        switch (gender) {
            case 'male': return 'Masculino';
            case 'female': return 'Femenino';
            case 'child': return 'Niño/a';
            default: return gender;
        }
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Patient Information Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Información del Paciente</CardTitle>
                    {mode === 'view' && (
                        <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                            className="text-accentBlue border-accentBlue hover:bg-accentBlue hover:text-white"
                        >
                            Editar
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="firstName">Nombre</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <Label htmlFor="age">Edad</Label>
                            <Input
                                id="age"
                                type="number"
                                value={formData.age}
                                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <Label htmlFor="gender">Género</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) => handleInputChange('gender', value)}
                                disabled={!isEditing}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Masculino</SelectItem>
                                    <SelectItem value="female">Femenino</SelectItem>
                                    <SelectItem value="child">Niño/a</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <Label htmlFor="maritalStatus">Estado Civil</Label>
                            <Input
                                id="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <Label htmlFor="occupation">Ocupación</Label>
                            <Input
                                id="occupation"
                                value={formData.occupation}
                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <Label htmlFor="visitDate">Fecha de Visita</Label>
                            <Input
                                id="visitDate"
                                type="date"
                                value={formData.visitDate}
                                onChange={(e) => handleInputChange('visitDate', e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="address">Dirección</Label>
                        <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!isEditing}
                            rows={2}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Notes Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Notas Médicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Existing Notes */}
                    {formData.notes.length > 0 && (
                        <div className="space-y-3">
                            {formData.notes.map((note) => (
                                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">{note.title}</h4>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-500">
                                                {new Date(note.date).toLocaleDateString('es-ES')}
                                            </span>
                                            {isEditing && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveNote(note.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Eliminar
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add New Note */}
                    {isEditing && (
                        <div className="space-y-3 p-3 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900">Agregar Nueva Nota</h4>
                            <div>
                                <Label htmlFor="noteTitle">Título</Label>
                                <Input
                                    id="noteTitle"
                                    value={newNote.title}
                                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Título de la nota"
                                />
                            </div>
                            <div>
                                <Label htmlFor="noteContent">Contenido</Label>
                                <Textarea
                                    id="noteContent"
                                    value={newNote.content}
                                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="Contenido de la nota médica"
                                    rows={3}
                                />
                            </div>
                            <Button
                                onClick={handleAddNote}
                                className="bg-accentBlue hover:bg-blue-600"
                                disabled={!newNote.title.trim() || !newNote.content.trim()}
                            >
                                Agregar Nota
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Buttons */}
            {isEditing && (
                <div className="flex justify-end space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsEditing(false);
                            onCancel?.();
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-accentBlue hover:bg-blue-600"
                    >
                        Guardar
                    </Button>
                </div>
            )}
        </div>
    );
}