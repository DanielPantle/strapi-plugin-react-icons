import { Strapi } from "@strapi/strapi";

export default async ({ strapi }: { strapi: Strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access react-icons menu',
      uid: 'read',
      pluginName: 'react-icons',
    }
  ];

  await (strapi as any).admin?.services.permission.actionProvider.registerMany(actions);
};
