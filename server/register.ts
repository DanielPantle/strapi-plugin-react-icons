import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'icon',
    plugin: 'react-icons',
    type: 'string'
  })
};
