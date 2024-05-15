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

<details>
  <summary>Show code</summary>
  
  ```
  'use client';
  
  import { DOMAttributes } from 'react';
  
  export type IReactIcon = string;
  
  import loadable from '@loadable/component';
  import { IconType } from 'react-icons';
  
  const iconComponents = {
    Ai: () => import('react-icons/ai'),
    Bs: () => import('react-icons/bs'),
    Bi: () => import('react-icons/bi'),
    Ci: () => import('react-icons/ci'),
    Di: () => import('react-icons/di'),
    Fi: () => import('react-icons/fi'),
    Fc: () => import('react-icons/fc'),
    Fa: () => import('react-icons/fa6'),
    Gi: () => import('react-icons/gi'),
    Go: () => import('react-icons/go'),
    Gr: () => import('react-icons/gr'),
    Hi: () => import('react-icons/hi2'),
    Im: () => import('react-icons/im'),
    Lia: () => import('react-icons/lia'),
    Io: () => import('react-icons/io5'),
    Lu: () => import('react-icons/lu'),
    Md: () => import('react-icons/md'),
    Pi: () => import('react-icons/pi'),
    Rx: () => import('react-icons/rx'),
    Ri: () => import('react-icons/ri'),
    Si: () => import('react-icons/si'),
    Sl: () => import('react-icons/sl'),
    Tb: () => import('react-icons/tb'),
    Tfi: () => import('react-icons/tfi'),
    Ti: () => import('react-icons/ti'),
    Vsc: () => import('react-icons/vsc'),
    Wi: () => import('react-icons/wi'),
    Cg: () => import('react-icons/cg'),
  } as unknown as { [x: string]: () => Promise<{ [key: string]: IconType }> };
  
  export interface IDynamicReactIcon extends DOMAttributes<SVGElement> {
    name: IReactIcon;
  }
  
  const DynamicReactIcon: React.FC<IDynamicReactIcon> = ({
    name,
    ...rest
  }: IDynamicReactIcon) => {
    const lib = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(' ')[0];
    const iconComponent = iconComponents[lib];
  
    if (!iconComponent) return <></>;
  
    const DynamicIcon = loadable(iconComponent, {
      resolveComponent: (el) => el[name],
    }) as IconType;
  
    return <DynamicIcon {...rest} />;
  };
  
  export default DynamicReactIcon;
  ```
</details>

## Planned features

- [x] custom field for react-icons
- [x] selection modal for the custom field
- [x] settings page for enabling / disabling icon libraries
- [ ] default selection for icon library
- [x] search in the selection modal

## Contributing and developing

Feel free to post any PR or issues :)
