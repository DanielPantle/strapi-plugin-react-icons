import { useRBAC } from '@strapi/helper-plugin';

const perms = { read: [{ action: 'plugin::react-icons.read', subject: null }] };

interface IUserPermissions {
  loading: boolean;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPublish: boolean;
}

function usePermissions() {
  const { allowedActions, isLoading: loading } = useRBAC(perms);
  return { ...allowedActions, loading } as IUserPermissions;
}

export default usePermissions;
