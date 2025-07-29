import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSignup } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SignupForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'admin' | 'doctor' | 'nurse' | 'assistant'>('doctor');
    const navigate = useNavigate();
    const signup = useSignup();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            return;
        }

        if (password !== confirmPassword) {
            // You might want to show an error toast here
            return;
        }

        try {
            await signup.mutateAsync({ email, password, role });
            navigate('/tablero', { replace: true });
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    const isFormValid = email && password && confirmPassword && password === confirmPassword;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
                    <CardDescription className="text-center">
                        Crea una nueva cuenta para acceder al sistema de la clínica
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="doctor@clinica.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={signup.isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={signup.isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={signup.isPending}
                            />
                            {password && confirmPassword && password !== confirmPassword && (
                                <p className="text-sm text-red-600">Las contraseñas no coinciden</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select value={'doctor'} onValueChange={(value: any) => setRole('doctor')} disabled={signup.isPending}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona tu rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* <SelectItem value="assistant">Asistente</SelectItem> */}
                                    {/* <SelectItem value="nurse">Enfermero/a</SelectItem> */}
                                    <SelectItem value="doctor">Doctor/a</SelectItem>
                                    {/* <SelectItem value="admin">Administrador</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={signup.isPending || !isFormValid}
                        >
                            {signup.isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/iniciar-sesion" className="text-blue-600 hover:underline">
                            Iniciar sesión
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}