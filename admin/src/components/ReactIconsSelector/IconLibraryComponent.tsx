import React from 'react';
import { Box } from '@strapi/design-system';
import { IconComponent } from './IconComponent';

export interface IIconLibraryComponent {
  icons: string[];
  onSelectIcon: (newIcon: string) => void;
}

export const IconLibraryComponent: React.FC<IIconLibraryComponent> = ({ icons, onSelectIcon }) => {
  return (
    <>
      {icons.map((icon) => (
        <Box
          key={icon}
          variant="secondary"
          onClick={() => {
            onSelectIcon(icon);
          }}
          title={icon}
        >
            <IconComponent size={30} icon={icon} />
        </Box>
      ))}
    </>
  );
};
