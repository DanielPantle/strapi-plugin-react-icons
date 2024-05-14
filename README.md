# Strapi plugin react-icons

A plugin for strapi to select react icons.

![grafik](https://user-images.githubusercontent.com/34894514/234541590-5146511b-82ad-471f-aaf9-8475c91fc894.png)
![react-icons](https://github.com/DanielPantle/strapi-plugin-react-icons/assets/34894514/895596d2-b0b8-4dc9-8129-bd5449dfee72)
![grafik](https://user-images.githubusercontent.com/34894514/234541742-0b257d6c-d38e-43ca-af83-bd6af1dcff9e.png)

## Installation

To install this plugin, you need to add an NPM dependency to your Strapi application:

```sh
# Using Yarn
yarn add strapi-plugin-react-icons

# Or using NPM
npm install strapi-plugin-react-icons
```

Then, you'll need to build your admin panel:

```sh
# Using Yarn
yarn build

# Or using NPM
npm run build
```

### Strapi plugins config file
Add `"react-icons": true,` in you strapi plugins file.

If you do not have this file, create a file:
```
# in TypeScript: "/config/plugins.ts"
export default ({ env }) => ({ "react-icons": true, });

# in JavaScript: "/config/plugins.js"
module.exports = ({ env }) => ({ "react-icons": true, });
```

## Usage

### Usage in strapi

- Select your prefered icon libraries on the settings page.
- Add react-icon as custom field to your content type.
- Press the search icon to select an icon from any of the selected icon libraries.

### Usage in React / Next.js

Create the following IconComponent to dynamically show the icon:

```
import loadable from '@loadable/component';
import { IconType } from 'react-icons';

interface IIconComponent {
  icon: string;
  size?: number;
}
export type IReactIcon = string;

export const IconComponent: React.FC<IIconComponent> = ({ icon, size }) => {
  const lib = icon.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ')[0].toLowerCase();
  const DynamicIconComponent = loadable(() => import(`react-icons/${lib}/index.js`), { resolveComponent: (el) => el[icon] }) as IconType;

  return <DynamicIconComponent size={size} />;
};
```

## Planned features

- [x] custom field for react-icons
- [x] selection modal for the custom field
- [x] settings page for enabling / disabling icon libraries
- [ ] default selection for icon library
- [x] search in the selection modal

## Contributing and developing

Feel free to post any PR or issues :)
