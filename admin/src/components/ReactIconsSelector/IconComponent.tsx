import React from 'react';
import { IconContext } from 'react-icons/lib';
import * as ReactIcons from '../../all';
import { IReactIcon } from '.';

interface IIconComponent {
  icon: string;
  size?: number;
}

const strapiTheme = window.localStorage.STRAPI_THEME;

export const IconComponent: React.FC<IIconComponent> = ({ icon, size }) => {
  const DynamicIconComponent = ReactIcons[icon as IReactIcon];

  if (undefined === DynamicIconComponent) return <></>;

  return (
    <IconContext.Provider value={{ color: strapiTheme === 'light' ? '#212134' : '#a5a5ba' }}>
      <DynamicIconComponent size={size} />
    </IconContext.Provider>
  );
};
