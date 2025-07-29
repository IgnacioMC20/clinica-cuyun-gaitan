import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User } from 'lucide-react';

export function UserMenu() {
    const user = useCurrentUser();
    const logout = useLogout();

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout.mutate();
    };

    const getInitials = (email: string) => {
        return email.substring(0, 2).toUpperCase();
    };

    const getRoleLabel = (role: string) => {
        const roleLabels: { [key: string]: string } = {
            admin: 'Administrador',
            doctor: 'Doctor/a',
            nurse: 'Enfermero/a',
            assistant: 'Asistente'
        };
        return roleLabels[role] || role;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {getRoleLabel(user.role)}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={logout.isPending}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{logout.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}