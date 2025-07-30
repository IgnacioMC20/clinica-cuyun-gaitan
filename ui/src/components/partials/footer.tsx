import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Clinic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Clínica Médica Cuyún Gaitán</h3>
            <p className="text-gray-600 text-sm">
              Sistema de gestión de pacientes para atención médica profesional
            </p>
            <div className="text-sm text-gray-500">
              <p>Versión 1.0</p>
              <p>© {new Date().getFullYear()} Todos los derechos reservados</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tablero" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/paciente/nuevo" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  Nuevo Paciente
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Información</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Sistema médico profesional</p>
              <p>Gestión de pacientes y consultas</p>
              <p>Desarrollado para uso clínico</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            Sistema de gestión médica - Clínica Médica Cuyún Gaitán
          </p>
        </div>
      </div>
    </footer>
  );
}
