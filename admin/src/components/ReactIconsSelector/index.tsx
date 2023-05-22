import React, { useState, useEffect } from "react";
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
	Option,
} from "@strapi/design-system";
import { TextInput as OriginalTextInput } from "@strapi/design-system";
import styled from "styled-components";
import * as ReactIcons from "react-icons/all";
import { Cross } from "@strapi/icons";
import { SearchIcon } from "@strapi/icons";
import { useIntl, MessageDescriptor } from "react-intl";
import { request } from "@strapi/helper-plugin";
import { IconContext } from "react-icons/lib";
import { FixedSizeGrid as Grid } from "react-window";

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

const inputButtonStyle = {
	background: "#0021a4",
	position: "absolute",
	bottom: 0,
	width: "5rem",
	height: "100%",
	justifyContent: "center",
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

	const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);
	const [selectedIconLibrary, setSelectedIconLibrary] = useState<string | null>(
		null
	);
	const [selectableIcons, setSelectableIcons] = useState([] as IReactIcon[]);
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
			setIconLibraries(
				(
					await request("/strapi-react-icons/iconlibrary/find", {
						method: "GET",
					})
				).filter((iconLibrary: IIconLibrary) => iconLibrary.isEnabled)
			);
		};

		getIconLibraries();
	}, []);

	useEffect(() => {
		setSelectableIcons(
			Object.keys(ReactIcons).filter((icon) =>
				icon.toLowerCase()
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
					<FieldAction onClick={toggleModal} style={inputButtonStyle} left="0">
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
						overflow="hidden"
					>
						<TextInput
							id="icon-search"
							name="icon-search"
							label={intlLabel && formatMessage(intlLabel)}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search icons..."
							margin={"15px"}
						/>
						<Grid
							columnCount={11} // Change to fit your needs
							rowCount={Math.ceil(selectableIcons.length / 11)} // Change 10 to your column count
							columnWidth={100} // Change to fit your needs
							rowHeight={60} // Change to fit your needs
							width={1150} // Change to fit your needs
							height={500} // Change to fit your needs
						>
							{({ columnIndex, rowIndex, style }) => {
								const icon = selectableIcons.filter((icon) =>
									icon.toLowerCase().includes(searchTerm.toLowerCase())
								)[rowIndex * 11 + columnIndex]; // Change 10 to your column count

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
										<IconComponent size={50} icon={icon} />
									</Box>
								);
							}}
						</Grid>
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
