import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const login = useLogin();

    const from = location.state?.from?.pathname || '/tablero';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        try {
            await login.mutateAsync({ email, password });
            navigate(from, { replace: true });
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tus credenciales para acceder al sistema de la clínica
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
                                disabled={login.isPending}
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
                                disabled={login.isPending}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={login.isPending || !email || !password}
                        >
                            {login.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/registro" className="text-blue-600 hover:underline">
                            Registrarse
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}