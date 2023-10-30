import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';
import getTrad from './utils/getTrad';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.customFields.register({
      name: 'icon',
      pluginId,
      icon: PluginIcon,
      type: 'string',
      intlLabel: {
        id: getTrad('react-icons.label'),
        defaultMessage: 'react-icon',
      },
      intlDescription: {
        id: getTrad('react-icons.description'),
        defaultMessage: 'Select a react-icon',
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "react-icons-input-component" */ './components/ReactIconsSelector'
          ),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTrad('react-icons.options.advanced.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad('react-icons.options.advanced.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
            ],
          },
        ],
      },
    });
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => await import(/* webpackChunkName: "[request]" */ './pages/HomePage'),
      permissions: [
        {
          action: 'plugin::react-icons.read',
          subject: null,
        },
      ],
    });
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
