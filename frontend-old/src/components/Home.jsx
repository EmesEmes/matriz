import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Escrituras from './pages/Escrituras';
import Actas from './pages/Actas';
import Minutas from './pages/Minutas';
import GestionUsuarios from '../pages/GestionUsuarios';

const Home = () => {
  const { user, logout, hasLexdataAccess, isAdmin } = useAuth();
  
  const [openMenus, setOpenMenus] = useState({
    protocolos: true,
    lexdata: true
  });
  const [selectedMenu, setSelectedMenu] = useState('escrituras');

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">MáTRIZ</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {user?.nombre} ({user?.rol})
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
      <main className="mt-10 flex gap-8">
        <aside className="w-1/6">
          <div className="bg-white border-r border-gray-200 rounded-lg p-4">
            <ul className="space-y-2">
              <li>
                <div 
                  onClick={() => toggleMenu('protocolos')}
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  <span className="font-medium">Protocolos</span>
                  <svg 
                    className={`w-4 h-4 transform transition-transform duration-200 ease-in-out ${
                      openMenus.protocolos ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <ul className={`ml-4 mt-2 space-y-1 transition-all duration-200 ease-in-out ${
                  openMenus.protocolos ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
                }`}>
                  <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                    <button onClick={() => handleMenuClick('escrituras')}>Escrituras Públicas</button>
                  </li>
                  <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                    <button onClick={() => handleMenuClick('actas')}>Actas</button>
                  </li>
                </ul>
              </li>
              
              {/* LexData - Solo visible para admin y lexdata */}
              {hasLexdataAccess && (
                <li>
                  <div 
                    onClick={() => toggleMenu('lexdata')}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    <span className="font-medium">LexData</span>
                    <svg 
                      className={`w-4 h-4 transform transition-transform duration-200 ease-in-out ${
                        openMenus.lexdata ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <ul className={`ml-4 mt-2 space-y-1 transition-all duration-200 ease-in-out ${
                    openMenus.lexdata ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 overflow-hidden'
                  }`}>
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                      <button onClick={() => handleMenuClick('minutas')}>Minutas</button>
                    </li>
                    <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">
                      <button onClick={() => handleMenuClick('peticiones')}>Peticiones</button>
                    </li>
                  </ul>
                </li>
              )}

              {/* Administración - Solo visible para admin */}
              {isAdmin && (
                <li>
                  <div 
                    onClick={() => handleMenuClick('gestion-usuarios')}
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    <span className="font-medium">Gestión de Usuarios</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </aside>
        <section className="w-5/6">
          <div>
            {selectedMenu === 'escrituras' && (
              <div>
                <Escrituras />
              </div>
            )}
            {selectedMenu === 'actas' && (
              <div>
                <Actas />
              </div>
            )}
            {selectedMenu === 'minutas' && (
              <div>
                <Minutas />
              </div>
            )}
            {selectedMenu === 'gestion-usuarios' && (
              <div>
                <GestionUsuarios />
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;