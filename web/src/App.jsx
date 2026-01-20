// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from '~/pages/Login';
import Dashboard from '~/pages/Dashboard';
import { NotFound } from '~/pages/NotFound';
import { AccessDenied } from '~/pages/AccessDenied';
import { RbacRoute } from '~/components/core/RbacRoute';
import { permissions } from '~/config/rbacConfig';

const ProtectedRoutes = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return !userInfo ? <Navigate to="/login" replace={true} /> : <Outlet />;
};

const UnAuthorizedRoutes = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
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
        {/* With React Router Dom < v6.x.x, use Children*/}
        {/* <Route
          path="/dashboard"
          element={
            <RbacRoute requiredPermission={permissions.VIEW_DASHBOARD}>
              <Dashboard />
            </RbacRoute>
          }
        /> */}

        {/* With REact Router DOM >= v6.x.x, use <Outlet/> */}
        <Route element={<RbacRoute requiredPermission={permissions.VIEW_DASHBOARD} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermission={permissions.VIEW_SUPPORT} />}>
          <Route path="/support" element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermission={permissions.VIEW_MESSAGES} />}>
          <Route path="/messages" element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermission={permissions.VIEW_REVENUE} />}>
          <Route path="/revenue" element={<Dashboard />} />
        </Route>

        <Route element={<RbacRoute requiredPermission={permissions.VIEW_ADMIN_TOOLS} />}>
          <Route path="/admin-tools" element={<Dashboard />} />
        </Route>
      </Route>

      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
