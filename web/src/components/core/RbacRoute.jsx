import { Navigate, Outlet } from 'react-router-dom';
import { roles } from '~/config/rbacConfig';
import { usePermission } from '~/hooks/usePermission';

export const RbacRoute = ({ requiredPermission, redirectTo = '/access-denied', children }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const userRole = userInfo?.role;

  const { hasPermission } = usePermission(userRole);

  if (!hasPermission(requiredPermission)) return <Navigate to={redirectTo} replace={true} />;

  // With React Router Dom >= 6.x.x, use <Outlet/>
  return <Outlet />;

  // With React Router Dom < 6.x.x
  // return children;
};
