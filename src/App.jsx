import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { HouseProvider } from './context/HouseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ColorTracker from './components/ColorTracker';
import RoomManager from './components/RoomManager';
import BankImport from './components/BankImport';
import LoginPage from './components/LoginPage';

function PrivateRoute() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <HouseProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="colors" element={<ColorTracker />} />
                <Route path="house" element={<RoomManager />} />
                <Route path="import" element={<BankImport />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </HouseProvider>
    </AuthProvider>
  );
}

export default App;