/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
import { useFetchClient } from "@strapi/helper-plugin";
import {
	Button,
	IconButton,
	Checkbox,
	Table,
	Thead,
	Tbody,
	Box,
	Flex,
	Tr,
	Td,
	Th,
	HeaderLayout,
	Layout,
	ContentLayout,
	ActionLayout,
	Typography,
	VisuallyHidden,
} from "@strapi/design-system";
import { Trash } from "@strapi/icons";
import * as ReactIcons from "../../data/all-icons";

const HomePage = () => {
	const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);

	const client = useFetchClient();

	const getIconLibraries = async () => {
		const response = await client.get("/react-icons/iconlibrary/find");
		console.log(response.data);
		setIconLibraries([...response.data]);
	};

	const updateIconLibrary = async (id: string, isEnabled: boolean) => {
		await client.put(`/react-icons/iconlibrary/update/${id}`, {
			data: {
				isEnabled: isEnabled,
			},
		});
		setIconLibraries((current) => {
			return current.map((iconLibrary) =>
				iconLibrary.id === id
					? {
							...iconLibrary,
							isEnabled: isEnabled,
					  }
					: iconLibrary
			);
		});
	};

	const deleteIconLibrary = async (id: string) => {
		await client.del(`/react-icons/iconlibrary/delete/${id}`);
		setIconLibraries((current) =>
			current.filter((iconLibrary) => iconLibrary.id !== id)
		);
	};

	const importDefaultIconLibraries = async () => {
		const defaultData = (await import("../../data/default.json")).default;
		defaultData.forEach(async (entry) => {
			await client.post("/react-icons/iconlibrary/post", {
				data: entry,
			});
		});

		getIconLibraries();
	};

	useEffect(() => {
		getIconLibraries();
	}, []);

	const getIconCount = (abbreviation: string) => {
		return Object.keys(ReactIcons).filter((icon) =>
			icon.toLowerCase().startsWith(abbreviation)
		).length;
	};

	return (
		<Layout
			background="neutral0"
			hasRadius={true}
			shadow="filterShadow"
			padding={8}
			style={{ marginTop: "10px" }}
		>
			<HeaderLayout
				title="strapi-react-icons"
				subtitle="Select the react-icon libraries you want to have enabled."
				as="h2"
				primaryAction={
					<Button
						onClick={importDefaultIconLibraries}
						disabled={iconLibraries.length > 0}
					>
						{iconLibraries.length > 0
							? "Libraries are already imported!"
							: "Import default icon libraries"}
					</Button>
				}
			/>

			<ActionLayout
				startActions={
					<>
						<Button
							onClick={() =>
								iconLibraries
									.filter((iconLibrary) => iconLibrary.isEnabled)
									.forEach((iconLibrary) =>
										updateIconLibrary(iconLibrary.id, false)
									)
							}
							variant="secondary"
							label="Disable all"
						>
							<Flex gap={5}>
								<Trash />
								Disable all
							</Flex>
						</Button>
						<Button
							onClick={() =>
								iconLibraries.forEach((iconLibrary) =>
									deleteIconLibrary(iconLibrary.id)
								)
							}
							variant="danger"
							label="Delete all"
						>
							<Flex gap={5}>
								<Trash />
								Delete all
							</Flex>
						</Button>
					</>
				}
			/>

			<ContentLayout>
				<Table colCount={4}>
					<Thead>
						<Tr>
							<Th>
								<Typography variant="sigma">is enabled</Typography>
							</Th>
							<Th>
								<Typography variant="sigma">abbreviation</Typography>
							</Th>
							<Th>
								<Typography variant="sigma">name</Typography>
							</Th>
							<Th>
								<Typography variant="sigma">icon count</Typography>
							</Th>
							<Th>
								<VisuallyHidden>Actions</VisuallyHidden>
							</Th>
						</Tr>
					</Thead>

					<Tbody>
						{iconLibraries.length > 0 ? (
							iconLibraries.map((iconLibrary) => {
								return (
									<Tr key={iconLibrary.name}>
										<Td>
											<Checkbox
												id={iconLibrary.id}
												value={iconLibrary.isEnabled}
												onClick={() =>
													updateIconLibrary(
														iconLibrary.id,
														!iconLibrary.isEnabled
													)
												}
											/>
										</Td>

										<Td>
											<Typography textColor="neutral800">
												{iconLibrary.abbreviation}
											</Typography>
										</Td>

										<Td>
											<Typography textColor="neutral800">
												{iconLibrary.name}
											</Typography>
										</Td>

										<Td>
											<Typography textColor="neutral800">
												{getIconCount(iconLibrary.abbreviation)}
											</Typography>
										</Td>

										<Td>
											<IconButton
												onClick={() => deleteIconLibrary(iconLibrary.id)}
												label="Delete"
												icon={<Trash />}
											/>
										</Td>
									</Tr>
								);
							})
						) : (
							<Box padding={5}>
								<Typography variant="pi">
									No icon libraries added yet
								</Typography>
							</Box>
						)}
					</Tbody>
				</Table>
			</ContentLayout>
		</Layout>
	);
};

export default HomePage;
