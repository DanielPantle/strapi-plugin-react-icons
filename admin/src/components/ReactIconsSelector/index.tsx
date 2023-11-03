import React, { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  Badge,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Select,
  FieldAction,
  Option,
  TextInput,
  SearchForm,
  Searchbar,
  Box,
} from '@strapi/design-system';
import * as ReactIcons from 'react-icons/all';
import { useIntl, MessageDescriptor } from 'react-intl';
import { useFetchClient } from '@strapi/helper-plugin';
import getTrad from '../../utils/getTrad';
import { IconLibraryComponent } from './IconLibraryComponent';
import { IconComponent } from './IconComponent';
import { Accordion, AccordionToggle, AccordionContent, AccordionGroup } from '@strapi/design-system';

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

export type IReactIcon = keyof typeof ReactIcons;

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
  const {get} = useFetchClient()

  const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);
  const [selectedIconLibrary, setSelectedIconLibrary] = useState<string | null>(null);
  const allReactIcons = Object.keys(ReactIcons) as IReactIcon[];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  const changeIcon = (newIcon: string) =>
    onChange({
      target: {
        name,
        type: 'string',
        value: newIcon,
      },
    });

  const onSelectIcon = (newIcon: string) => {
    toggleModal();
    changeIcon(newIcon);
  };

  useEffect(() => {
    const getIconLibraries = async () => {
      setIconLibraries(
        (
          (await get('/react-icons/iconlibrary/find')).data
        ).filter((iconLibrary: IIconLibrary) => iconLibrary.isEnabled)
      );
    };

    getIconLibraries();
  }, []);

  const [expandedIDs, setExpandedID] = useState<string[]>(['acc-0']);
  const handleToggle = (id: string) => () => {
    expandedIDs?.includes(id) ?
      setExpandedID(expandedIDs.filter((i) => i !== id)) :
      setExpandedID([...expandedIDs, id]);
  };

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
            <Box>
              <SearchForm>
                <Searchbar
                  onClear={() => setSearchTerm('')}
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder={formatMessage({
                    id: getTrad('react-icons.iconSelector.search'),
                  })}
                >
                  {formatMessage({
                    id: getTrad('react-icons.iconSelector.search'),
                  })}
                </Searchbar>
              </SearchForm>

                {iconLibraries.length > 0 ? (
                  <Box padding={4} marginTop={2} background="neutral0">
                    <AccordionGroup>
                    {
                      iconLibraries
                        .filter(
                          (iconLibrary) =>
                            !selectedIconLibrary || iconLibrary.abbreviation === selectedIconLibrary
                        )
                        .map((iconLibrary, index) => (
                          allReactIcons.filter(
                            (icon) =>
                              icon.toLowerCase().startsWith(iconLibrary.abbreviation) &&
                              icon.toLowerCase().includes(searchTerm.toLowerCase())
                          ).length > 0 &&
                          <Accordion expanded={expandedIDs.includes('acc-'+index)} onToggle={handleToggle('acc-'+index)} id={"acc-"+index} size="S">
                            <AccordionToggle
                              togglePosition="left"
                              title={<Typography>{`${iconLibrary.name} (${iconLibrary.abbreviation})`}</Typography>}
                              action={<Badge>{allReactIcons.filter(
                                (icon) =>
                                  icon.toLowerCase().startsWith(iconLibrary.abbreviation) &&
                                  icon.toLowerCase().includes(searchTerm.toLowerCase())
                              ).length}</Badge>}
                            >
                            </AccordionToggle>
                            <AccordionContent>
                              <Box paddingLeft={3} paddingTop={3} paddingBottom={3}>
                                <Flex direction="row" wrap="wrap" display="flex" alignItems="center" gap={1}>
                                  <IconLibraryComponent
                                    icons={allReactIcons.filter(
                                      (icon) =>
                                        icon.toLowerCase().startsWith(iconLibrary.abbreviation) &&
                                        icon.toLowerCase().includes(searchTerm.toLowerCase())
                                    )}
                                    onSelectIcon={onSelectIcon}
                                  />
                                </Flex>
                              </Box>
                            </AccordionContent>
                          </Accordion>
                        ))
                    }
                  </AccordionGroup>
                  </Box>
                ) : (
                  <Typography variant="pi">
                    {formatMessage({
                      id: getTrad('react-icons.iconSelector.noIconLibrariesAvailable'),
                    })}
                  </Typography>
                )}
              </Box>
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
