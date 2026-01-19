// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '~/pages/Login';
import Dashboard from '~/pages/Dashboard';
import { NotFound } from '~/pages/NotFound';
import { AccessDenied } from '~/pages/AccessDenied';

const ProtectedRoutes = () => {
  const userInfo = localStorage.getItem('userInfo');
  return !userInfo ? <Navigate to="/login" replace={true} /> : <Outlet />;
};

const UnAuthorizedRoutes = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? <Navigate to="/dashboard" replace={true} /> : <Outlet />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace={true} />} />

      <Route element={<UnAuthorizedRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/support" element={<Dashboard />} />
        <Route path="/messages" element={<Dashboard />} />
        <Route path="/revenue" element={<Dashboard />} />
        <Route path="/admin-tools" element={<Dashboard />} />
      </Route>

      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
