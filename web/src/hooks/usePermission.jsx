import { rolePermissions } from '~/config/rbacConfig';

export const usePermission = (userRole) => {
  const hasPermission = (requirePermission) => {
    const allowedPermissions = rolePermissions[userRole] || [];

    return allowedPermissions.includes(requirePermission);
  };

  return {
    hasPermission,
  };
};
