import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  ModalLayout,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Typography,
  Select,
  FieldAction,
  Option,
  Searchbar,
  SearchForm,
} from "@strapi/design-system";
import { TextInput as OriginalTextInput } from "@strapi/design-system";
import styled from "styled-components";
import * as ReactIcons from "../../data/all-icons";
import { useIntl } from "react-intl";
import { useFetchClient } from "@strapi/helper-plugin";
import { IconContext } from "react-icons/lib";
import { FixedSizeGrid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

// Force TypeScript to treat AutoSizer as a valid JSX component using a type assertion to 'any'
const AutoSizerComponent = AutoSizer as any;

type IReactIcon = keyof typeof ReactIcons;

const strapiTheme = window.localStorage.STRAPI_THEME;

const inputButtonStyle = {
  border: "1px solid",
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  width: "5rem",
  height: "100%",
  justifyContent: "center",
} as React.CSSProperties;

const searchFormStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "5vh",
} as React.CSSProperties;

const TextInputContainer = styled.div`
  & div[disabled] {
    /* Styles for the child <div> with the disabled attribute */
    /* Add your styles here */
    position: relative;
  }
  & input[type="text"] {
    width: calc(100% - 10rem);
    text-align: center;
  }
`;

// Add this styled component outside the ReactIconsSelector component
const CustomScrollModalBody = styled(FixedSizeGrid)`
  &::-webkit-scrollbar {
    width: 0.65vw;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(165, 165, 186, 1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(123, 121, 255, 1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

const TextInput = ({ ...props }) => {
  return (
    <TextInputContainer>
      <OriginalTextInput {...props} />
    </TextInputContainer>
  );
};

const IconComponent: React.FC<IIconComponent> = ({ icon, size }) => {
  const DynamicIconComponent = ReactIcons[icon as IReactIcon];

  if (undefined === DynamicIconComponent) return <></>;

  return (
    <IconContext.Provider
      value={{ color: strapiTheme === "light" ? "#212134" : "#a5a5ba" }}
    >
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

  const client = useFetchClient();

  const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);
  const [selectedIconLibrary, setSelectedIconLibrary] = useState<string | null>(
    null
  );
  const [selectableIcons, setSelectableIcons] = useState(
    Object.keys(ReactIcons) as IReactIcon[]
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Add a new state for search term
  const [searchTerm, setSearchTerm] = useState("");

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  const changeIcon = (newIcon: string) =>
    onChange({
      target: {
        name,
        type: "string",
        value: newIcon,
      },
    });

  useEffect(() => {
    const getIconLibraries = async () => {
      const response = await client.get("/react-icons/iconlibrary/find");
      setIconLibraries(
        response.data.filter(
          (iconLibrary: IIconLibrary) => iconLibrary.isEnabled
        )
      );
    };

    getIconLibraries();
  }, []);

  useEffect(() => {
    selectedIconLibrary &&
      setSelectableIcons(
        Object.keys(ReactIcons).filter((icon) =>
          icon.toLowerCase().startsWith(selectedIconLibrary)
        ) as IReactIcon[]
      );
  }, [selectedIconLibrary, setSelectableIcons]);

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
        value={value || ""}
        required={required}
        error={error}
        startAction={
          <FieldAction
            onClick={toggleModal}
            style={inputButtonStyle}
            left="0"
            borderRight="5px solid"
          >
            {value ? (
              <IconComponent icon={value} />
            ) : (
              <ReactIcons.TbSearch width="1.25rem" height="1.25rem" />
            )}
          </FieldAction>
        }
        endAction={
          !!value && (
            <FieldAction
              onClick={() => changeIcon("")}
              style={inputButtonStyle}
              right="0"
            >
              <ReactIcons.TbX />
            </FieldAction>
          )
        }
      />

      {isModalVisible && (
        <ModalLayout
          onClose={toggleModal}
          labelledBy="title"
          width="65vw !important"
        >
          <ModalHeader>
            <Typography fontWeight="bold" id="title">
              Select icon
            </Typography>
          </ModalHeader>
          <ModalBody
            minHeight="70vh"
            maxHeight="unset !important"
            overflow="hidden !important"
          >
            <SearchForm style={searchFormStyle}>
              <Searchbar
                id="icon-search"
                name="icon-search"
                onClear={() => setSearchTerm("")}
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                clearLabel="Clearing the plugin search"
                placeholder="Search icons..."
              >
                Search icons...
              </Searchbar>
              <AutoSizerComponent>
                {({ width }: { width: number }) => {
                  // Set the desired minimum column width and row height
                  const minDesiredColumnWidth = 85;
                  const desiredRowHeight = 85;

                  // Calculate the number of columns based on the available width and the desired minimum column width
                  const fractionalWidth = width - 2 * (window.innerWidth / 100);
                  const columnCount = Math.floor(
                    fractionalWidth / minDesiredColumnWidth
                  );

                  // Calculate the actual column width based on the available width and the number of columns
                  const columnWidth = fractionalWidth / columnCount;

                  // Calculate the number of rows based on the total number of icons and column count
                  const rowCount = Math.ceil(
                    selectableIcons.length / columnCount
                  );

                  return (
                    <CustomScrollModalBody
                      columnCount={columnCount}
                      rowCount={rowCount}
                      columnWidth={columnWidth}
                      rowHeight={desiredRowHeight}
                      width={width}
                      height={500}
                    >
                      {({
                        columnIndex,
                        rowIndex,
                        style,
                      }: {
                        columnIndex: number;
                        rowIndex: number;
                        style: React.CSSProperties;
                      }) => {
                        const icon = selectableIcons.filter((icon) =>
                          icon.toLowerCase().includes(searchTerm.toLowerCase())
                        )[rowIndex * columnCount + columnIndex];

                        if (!icon) return null;

                        return (
                          <Box
                            style={style}
                            width="100%"
                            key={icon}
                            variant="secondary"
                            onClick={() => {
                              toggleModal();
                              changeIcon(icon);
                            }}
                          >
                            <IconComponent size={65} icon={icon} />
                          </Box>
                        );
                      }}
                    </CustomScrollModalBody>
                  );
                }}
              </AutoSizerComponent>
            </SearchForm>
          </ModalBody>
          <ModalFooter
            startActions={
              <Select
                id="iconLibrarySelect"
                minWidth={500}
                selectButtonTitle="Select icon library"
                placeholder="Select icon library"
                required={0}
                error={error}
                value={selectedIconLibrary}
                onChange={setSelectedIconLibrary}
              >
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
