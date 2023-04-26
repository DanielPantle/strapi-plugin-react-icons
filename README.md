# Strapi plugin react-icons
A plugin for strapi to select react icons.

![grafik](https://user-images.githubusercontent.com/34894514/234541590-5146511b-82ad-471f-aaf9-8475c91fc894.png)
![grafik](https://user-images.githubusercontent.com/34894514/234541920-c5b65ba0-51cd-4da5-9a9f-00937309a869.png)
![grafik](https://user-images.githubusercontent.com/34894514/234541742-0b257d6c-d38e-43ca-af83-bd6af1dcff9e.png)

## Installation

To install this plugin, you need to add an NPM dependency to your Strapi application:

```sh
# Using Yarn
yarn add @strapi/plugin-color-picker

# Or using NPM
npm install @strapi/plugin-color-picker
```

Then, you'll need to build your admin panel:

```sh
# Using Yarn
yarn build

# Or using NPM
npm run build
```

## Usage
### Usage in strapi
 - Select your prefered icon libraries on the settings page.
 - Add react-icon as custom field to your content type.
 - Press the search icon to select a icon from any of the selected icon libraries.

### Usage in React / Next.js
Create the following IconComponent to dynamically show the icon:
```
import * as ReactIcons from "react-icons/all";

interface IIconComponent {
  icon: string;
  size?: number;
}
type IReactIcon = keyof typeof ReactIcons;

const IconComponent: React.FC<IIconComponent> = ({ icon, size }) => {
  const DynamicIconComponent = ReactIcons[icon as IReactIcon];

  if (undefined === DynamicIconComponent) return <></>;

  return <DynamicIconComponent size={size} />;
};
```

## Planned features
 - [x] custom field for react-icons
 - [x] selection modal for the custom field
 - [x] settings page for enabling / disabling icon libraries
 - [ ] default selection for icon library
 - [ ] search in the selection modal
 
## Contributing and developing
Feel free to post any PR or issues :)
