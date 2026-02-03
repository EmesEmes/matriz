import { Routes, Route, Navigate } from "react-router";
import { ToastContainer } from "./components/shared";
import { MainLayout, ProtectedRoute } from "./components/layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import GestionUsuariosPage from "./pages/GestionUsuariosPage";
import ComparecientesPage from "./pages/ComparecientesPage";
import { useAuth } from "./context/AuthContext";
import TestInlinePage from "./pages/TestInlinePage";
import GenerarMatrizPage from "./pages/GenerarMatrizPage";
import GenerarMinutaPage from "./pages/GenerarMinutaPage";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout>
                <GestionUsuariosPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/comparecientes"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ComparecientesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-inline"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TestInlinePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route
          path="/matrices/nueva"
          element={
            <ProtectedRoute>
              <MainLayout>
                <GenerarMatrizPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/minutas/nueva"
          element={
            <ProtectedRoute allowedRoles={["admin", "lexdata"]}>
              <MainLayout>
                <GenerarMinutaPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
