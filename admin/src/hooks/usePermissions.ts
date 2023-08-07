import { useRBAC } from '@strapi/helper-plugin';

const perms = { read: [{ action: 'plugin::react-icons.read', subject: null }] };

function usePermissions() {
  const { allowedActions, isLoading: loading } = useRBAC(perms);
  return { ...allowedActions, loading };
}

export default usePermissions;
