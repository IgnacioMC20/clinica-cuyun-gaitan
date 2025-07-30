import React, { useState } from 'react';
import { Card, Typography, Button, Input } from '../atoms';
import { NoteItem } from '../molecules';
import { useAddPatientNote, useDeletePatientNote } from '../../hooks/usePatients';
import type { PatientResponse, PatientNote } from '../../../../shared/types/patient';
import { Plus, FileText } from 'lucide-react';

interface NotesListProps {
    patient: PatientResponse;
    notes?: PatientNote[];
    onNoteAdded?: (note: PatientNote) => void;
    onNoteUpdated?: (noteId: string, note: PatientNote) => void;
    onNoteDeleted?: (noteId: string) => void;
    readOnly?: boolean;
}

export const NotesList: React.FC<NotesListProps> = ({
    patient,
    notes = [],
    onNoteAdded,
    onNoteUpdated,
    onNoteDeleted,
    readOnly = false
}) => {
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

    const addNoteMutation = useAddPatientNote();
    const deleteNoteMutation = useDeletePatientNote();

    const handleAddNote = async () => {
        if (!newNoteTitle.trim() || !newNoteContent.trim()) {
            return;
        }

        try {
            const result = await addNoteMutation.mutateAsync({
                id: patient.id,
                note: {
                    title: newNoteTitle.trim(),
                    content: newNoteContent.trim()
                }
            });

            // Reset form
            setNewNoteTitle('');
            setNewNoteContent('');
            setIsAddingNote(false);

            // Notify parent component - result is PatientResponse, we need to extract the new note
            if (result.notes && result.notes.length > 0) {
                const newNote = result.notes[result.notes.length - 1];
                onNoteAdded?.(newNote);
            }
        } catch (error) {
            console.error('Error adding note:', error);
        }
    };

    const handleCancelAdd = () => {
        setNewNoteTitle('');
        setNewNoteContent('');
        setIsAddingNote(false);
    };

    const handleEditNote = (noteId: string, updatedNote: PatientNote) => {
        onNoteUpdated?.(noteId, updatedNote);
    };

    const handleDeleteNote = (noteId: string) => {
        console.log(`Deleting note: ${noteId}`);
        setNoteToDelete(noteId);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteNote = async () => {
        console.log(`noteToDelete ${noteToDelete}`)
        if (!noteToDelete) return;

        try {
            await deleteNoteMutation.mutateAsync({
                patientId: patient.id,
                noteId: noteToDelete
            });

            // Notify parent component
            onNoteDeleted?.(noteToDelete);
            setShowDeleteConfirm(false);
            setNoteToDelete(null);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const cancelDeleteNote = () => {
        setShowDeleteConfirm(false);
        setNoteToDelete(null);
    };

    const sortedNotes = [...notes].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return (
        <Card className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-primary" />
                    <div>
                        <Typography variant="h3">
                            Notas Médicas
                        </Typography>
                        <Typography variant="bodySmall" className="text-muted-foreground">
                            {patient.firstName} {patient.lastName}
                        </Typography>
                    </div>
                </div>

                {!readOnly && !isAddingNote && (
                    <Button
                        onClick={() => setIsAddingNote(true)}
                        size="sm"
                        className="flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Agregar Nota</span>
                    </Button>
                )}
            </div>

            {/* Add Note Form */}
            {isAddingNote && !readOnly && (
                <Card className="p-4 mb-6 border-dashed border-2 border-primary/20">
                    <Typography variant="h4" className="mb-4">
                        Nueva Nota Médica
                    </Typography>

                    <div className="space-y-4">
                        <div>
                            <Typography variant="label" className="mb-2 block">
                                Título de la nota
                            </Typography>
                            <Input
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                placeholder="Ej: Consulta de seguimiento, Diagnóstico inicial..."
                                className="w-full"
                            />
                        </div>

                        <div>
                            <Typography variant="label" className="mb-2 block">
                                Contenido
                            </Typography>
                            <textarea
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                placeholder="Escriba aquí los detalles de la consulta, síntomas, diagnóstico, tratamiento, etc."
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                                rows={5}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={handleCancelAdd}
                                disabled={addNoteMutation.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleAddNote}
                                loading={addNoteMutation.isPending}
                                disabled={!newNoteTitle.trim() || !newNoteContent.trim() || addNoteMutation.isPending}
                            >
                                Guardar Nota
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Notes List */}
            <div className="space-y-4">
                {sortedNotes.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <Typography variant="h4" className="text-muted-foreground mb-2">
                            No hay notas médicas
                        </Typography>
                        <Typography variant="body" className="text-muted-foreground mb-6">
                            {readOnly
                                ? 'Este paciente no tiene notas médicas registradas.'
                                : 'Comienza agregando la primera nota médica para este paciente.'
                            }
                        </Typography>
                        {!readOnly && !isAddingNote && (
                            <Button onClick={() => setIsAddingNote(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Primera Nota
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <Typography variant="bodySmall" className="text-muted-foreground">
                                {sortedNotes.length} nota{sortedNotes.length !== 1 ? 's' : ''} médica{sortedNotes.length !== 1 ? 's' : ''}
                            </Typography>
                        </div>

                        {sortedNotes.map((note, index) => (
                            <NoteItem
                                key={note.id || index}
                                note={note}
                                onEdit={!readOnly ? () => handleEditNote(note.id || '', note) : undefined}
                                onDelete={!readOnly ? () => handleDeleteNote(note.id || '') : undefined}
                                showActions={!readOnly}
                            />
                        ))}
                    </>
                )}
            </div>

            {/* Notes Summary */}
            {sortedNotes.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <Typography variant="h4" className="text-primary">
                                {sortedNotes.length}
                            </Typography>
                            <Typography variant="bodySmall" className="text-muted-foreground">
                                Total de notas
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="h4" className="text-primary">
                                {sortedNotes.filter(note => {
                                    const noteDate = new Date(note.date);
                                    const thirtyDaysAgo = new Date();
                                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                    return noteDate >= thirtyDaysAgo;
                                }).length}
                            </Typography>
                            <Typography variant="bodySmall" className="text-muted-foreground">
                                Últimos 30 días
                            </Typography>
                        </div>
                        <div>
                            <Typography variant="h4" className="text-primary">
                                {sortedNotes.length > 0
                                    ? new Date(sortedNotes[0].date).toLocaleDateString('es-GT', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })
                                    : '-'
                                }
                            </Typography>
                            <Typography variant="bodySmall" className="text-muted-foreground">
                                Última nota
                            </Typography>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="p-6 max-w-md mx-4">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-6 h-6 text-red-600" />
                            </div>
                            <Typography variant="h3" className="mb-2">
                                Eliminar Nota Médica
                            </Typography>
                            <Typography variant="body" className="text-gray-600 mb-6">
                                ¿Está seguro que desea eliminar esta nota médica?
                                Esta acción no se puede deshacer.
                            </Typography>
                            <div className="flex space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={cancelDeleteNote}
                                    className="flex-1"
                                    disabled={deleteNoteMutation.isPending}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmDeleteNote}
                                    className="flex-1"
                                    loading={deleteNoteMutation.isPending}
                                    disabled={deleteNoteMutation.isPending}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </Card>
    );
};
