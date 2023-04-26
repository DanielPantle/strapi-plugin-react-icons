/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
import { request } from "@strapi/helper-plugin";
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
import * as ReactIcons from "react-icons/all";

const HomePage = () => {
  const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);

  const getIconLibraries = async () => {
    setIconLibraries([
      ...(await request("/react-icons/iconlibrary/find", {
        method: "GET",
      })),
    ]);
  };

  const updateIconLibrary = async (id: string, isEnabled: boolean) => {
    await request(`/react-icons/iconlibrary/update/${id}`, {
      method: "PUT",
      body: { data: { isEnabled: isEnabled } },
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
    await request(`/react-icons/iconlibrary/delete/${id}`, {
      method: "DELETE",
    });
    setIconLibraries((current) =>
      current.filter((iconLibrary) => iconLibrary.id !== id)
    );
  };

  const importDefaultIconLibraries = async () => {
    (await import("../../data/default.json")).default.forEach(async (entry) => {
      await request("/react-icons/iconlibrary/post", {
        method: "POST",
        body: { data: entry },
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
        title="react-icons"
        subtitle="Select the react-icon libraries you want to have enabled."
        as="h2"
        primaryAction={
          <Button onClick={importDefaultIconLibraries}>
            Import default icon libraries
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
