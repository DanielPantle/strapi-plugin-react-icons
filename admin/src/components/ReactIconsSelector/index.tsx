import React, { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  Box,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Select,
  FieldAction,
  Badge,
  Option,
  TextInput,
} from '@strapi/design-system';
import * as ReactIcons from 'react-icons/all';
import { useIntl, MessageDescriptor } from 'react-intl';
import { request } from '@strapi/helper-plugin';
import { IconContext } from 'react-icons/lib';
import getTrad from '../../utils/getTrad';

interface IReactIconsSelector {
  description: null | MessageDescriptor;
  intlLabel: null | MessageDescriptor;
  placeholder: null | MessageDescriptor;
  name: string;
  error: string;
  required: boolean;
  onChange: any;
  value: string;
}

interface IIconComponent {
  icon: string;
  size?: number;
}

type IReactIcon = keyof typeof ReactIcons;

const strapiTheme = window.localStorage.STRAPI_THEME;

const IconComponent: React.FC<IIconComponent> = ({ icon, size }) => {
  const DynamicIconComponent = ReactIcons[icon as IReactIcon];

  if (undefined === DynamicIconComponent) return <></>;

  return (
    <IconContext.Provider value={{ color: strapiTheme === 'light' ? '#212134' : '#a5a5ba' }}>
      <DynamicIconComponent size={size} />
    </IconContext.Provider>
  );
};

const ReactIconsSelector: React.FC<IReactIconsSelector> = ({
  description,
  error,
  intlLabel,
  placeholder,
  name,
  required,
  onChange,
  value,
}) => {
  const { formatMessage } = useIntl();

  const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);
  const [selectedIconLibrary, setSelectedIconLibrary] = useState<string | null>(null);
  const allReactIcons = Object.keys(ReactIcons) as IReactIcon[];
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  const changeIcon = (newIcon: string) =>
    onChange({
      target: {
        name,
        type: 'string',
        value: newIcon,
      },
    });

  useEffect(() => {
    const getIconLibraries = async () => {
      setIconLibraries(
        (
          await request('/react-icons/iconlibrary/find', {
            method: 'GET',
          })
        ).filter((iconLibrary: IIconLibrary) => iconLibrary.isEnabled)
      );
    };

    getIconLibraries();
  }, []);

  return (
    <>
      <TextInput
        type="text"
        label={intlLabel && formatMessage(intlLabel)}
        placeholder={placeholder && formatMessage(placeholder)}
        hint={description && formatMessage(description)}
        disabled={true}
        onChange={onChange}
        id={name}
        name={name}
        value={value || ''}
        required={required}
        error={error}
        startAction={
          <FieldAction onClick={toggleModal}>
            {value ? <IconComponent icon={value} /> : <ReactIcons.TbSearch />}
          </FieldAction>
        }
        endAction={
          !!value && (
            <FieldAction onClick={() => changeIcon('')}>
              <ReactIcons.TbX />
            </FieldAction>
          )
        }
      />

      {isModalVisible && (
        <ModalLayout onClose={toggleModal} labelledBy="title">
          <ModalHeader>
            <Typography fontWeight="bold" id="title">
              Select icon
            </Typography>
          </ModalHeader>
          <ModalBody>
            <Flex direction="column" gap={5}>
              {iconLibraries.length > 0 ? (
                iconLibraries
                  .filter(
                    (iconLibrary) =>
                      !selectedIconLibrary || iconLibrary.abbreviation === selectedIconLibrary
                  )
                  .map((iconLibrary) => (
                    <>
                      <Badge>
                        <Typography>{`${iconLibrary.name} (${iconLibrary.abbreviation})`}</Typography>
                      </Badge>

                      <Flex direction="row" wrap="wrap" gap={2}>
                        {allReactIcons.filter((icon) =>
                          icon.toLowerCase().startsWith(iconLibrary.abbreviation)
                        ).length > 0 ? (
                          allReactIcons
                            .filter((icon) =>
                              icon.toLowerCase().startsWith(iconLibrary.abbreviation)
                            )
                            .map((icon) => (
                              <Box
                                key={icon}
                                variant="secondary"
                                onClick={() => {
                                  toggleModal();
                                  changeIcon(icon);
                                }}
                              >
                                <IconComponent size={30} icon={icon} />
                              </Box>
                            ))
                        ) : (
                          <Typography variant="pi">
                            {formatMessage({
                              id: getTrad('react-icons.iconSelector.noIconsAvailable'),
                            })}
                          </Typography>
                        )}
                      </Flex>
                    </>
                  ))
              ) : (
                <Typography variant="pi">
                  {formatMessage({
                    id: getTrad('react-icons.iconSelector.noIconLibrariesAvailable'),
                  })}
                </Typography>
              )}
            </Flex>
          </ModalBody>
          <ModalFooter
            startActions={
              <Select
                minWidth={500}
                required={0}
                error={error}
                value={selectedIconLibrary}
                onChange={setSelectedIconLibrary}
              >
                <Option value="">
                  {formatMessage({ id: getTrad('react-icons.iconSelector.allIconLibraries') })}
                </Option>

                {iconLibraries.map((iconLibrary) => (
                  <Option key={iconLibrary.id} value={iconLibrary.abbreviation}>
                    {iconLibrary.name}
                  </Option>
                ))}
              </Select>
            }
            endActions={
              <Button variant="tertiary" onClick={toggleModal}>
                Close
              </Button>
            }
          />
        </ModalLayout>
      )}
    </>
  );
};

export default ReactIconsSelector;
