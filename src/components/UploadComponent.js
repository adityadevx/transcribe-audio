import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Text,
  useColorModeValue,
  useToken,
  Checkbox,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadComponent = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploadBtnLoading, setUploadBtnLoading] = useState(false);
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const [color] = useToken("colors", ["blue.400"]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [uploadReRender, setUploadReRender] = useState(false);

  const fileInputBg = useColorModeValue("purple.100", "gray.800");
  const fileTextColor = useColorModeValue("gray.600", "gray.200");
  const fileSubTextColor = useColorModeValue("gray.500", "gray.300");

  const handleFiles = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleUpload = async (e) => {
    setUploadBtnLoading(true);
    e.preventDefault();
    const formData = new FormData();

    if (files.length === 0) {
      setUploadBtnLoading(false);
      return toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        setFiles([]);
        setUploadBtnLoading(false);
        setUploadReRender(!uploadReRender);
        return toast({
          title: "File Uploaded",
          description: "Your file has been uploaded successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-center",
        });
      }
    } catch (error) {
      setUploadBtnLoading(false);
      return toast({
        title: "Error Uploading File",
        description: "There was an internal error while uploading your file",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedFiles.map(async (file) => {
          const res = await fetch(
            `${process.env.REACT_APP_BASE_URL}/api/deleteaudio?filename=${file}`
          );
          const data = await res.json();
          if (res.status === 200) {
            return data;
          } else {
            throw new Error("Failed to delete");
          }
        })
      );

      setUploadReRender(!uploadReRender);
      setSelectedFiles([]);
      setSelectAll(false);
      return toast({
        title: "Files Deleted",
        description: "Selected files have been deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    } catch (error) {
      console.log(error.message);
      return toast({
        title: "Error Deleting Files",
        description: "There was an internal error while deleting files",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }
  };

  const handleAudioFilesList = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/audiolist`
      );
      const data = await res.data;
      setAudioFiles(data);
    } catch (error) {
      // Handle error
    }
  };

  const handleCheckboxChange = (fileName) => {
    setSelectedFiles((prev) =>
      prev.includes(fileName)
        ? prev.filter((file) => file !== fileName)
        : [...prev, fileName]
    );
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(audioFiles);
    }
    setSelectAll(!selectAll);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDragLeave = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  useEffect(() => {
    if (document.cookie === "") {
      navigate("/login");
    }
    handleAudioFilesList();
  }, [uploadReRender]);

  return (
    <>
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="center"
        alignItems="stretch"
        spacing={10}
        height={"auto"}
        mt={5}
      >
        <Box
          textAlign={"center"}
          bg="white"
          p={{ base: 4, md: 10 }}
          rounded="xl"
          boxShadow="lg"
          flex={1}
          minH="500px"
          display="flex"
          flexDirection="column"
        >
          <Card
            height={"100%"}
            display="flex"
            flexDirection="column"
            shadow={"none"}
          >
            <CardHeader>
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                Upload Audio Files
              </Text>
              <Text fontSize="md" color="gray.500" mt={2}>
                Upload your audio files here. You can upload multiple files at
                once.
              </Text>
            </CardHeader>
            <CardBody
              flex={1}
              height={"full"}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                style={{ display: "none" }}
                id="fileInput"
                accept="audio/*"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
              />
              <label htmlFor="fileInput">
                <Flex
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  borderWidth="2px"
                  borderStyle="dashed"
                  borderColor={borderColor}
                  borderRadius="xl"
                  py="10"
                  px="12"
                  height={"full"}
                  cursor="pointer"
                  _hover={{
                    bg: fileInputBg,
                    borderColor: color,
                  }}
                  transition="all 0.3s ease"
                  flex={1}
                >
                  <Text
                    fontWeight="semibold"
                    fontSize="lg"
                    textAlign="center"
                    color={fileTextColor}
                    mb={2}
                  >
                    Drag and drop your files here <br /> or click to browse
                  </Text>
                  <Text
                    fontSize="sm"
                    color={fileSubTextColor}
                    fontWeight="medium"
                  >
                    {files.length === 0
                      ? "Any audio file up to 500MB"
                      : `${files.length} file(s) selected`}
                  </Text>
                </Flex>
              </label>
            </CardBody>
            <CardFooter p={{ sm: "1" }}>
              <Flex justifyContent="center" alignItems="center" w="full">
                <Button
                  colorScheme="purple"
                  size={{ base: "md", md: "lg" }}
                  mt={4}
                  w="auto"
                  borderRadius="full"
                  isDisabled={files.length === 0}
                  isLoading={uploadBtnLoading}
                  onClick={handleUpload}
                  _hover={{ bg: "purple.500" }}
                  transition="all 0.3s ease"
                >
                  Upload Files
                </Button>
              </Flex>
            </CardFooter>
          </Card>
        </Box>

        <Box
          textAlign={"center"}
          bg="white"
          p={{ base: 4, md: 10 }}
          rounded="xl"
          boxShadow="lg"
          flex={1}
          minH="500px"
          display="flex"
          flexDirection="column"
          ml={{ md: 4 }}
          mt={{ base: 4, md: 0 }}
        >
          <Card
            height="100%"
            display="flex"
            flexDirection="column"
            shadow={"none"}
          >
            <CardHeader>
              <Text fontSize="3xl" fontWeight="bold" color="red.600">
                Manage Audio Files
              </Text>
              <Text fontSize="md" color="gray.500" mt={2}>
                Manage your uploaded audio files. You can delete selected files.
              </Text>
            </CardHeader>
            <CardBody flex={1} padding={{ base: 0 }}>
              {audioFiles.length === 0 ? (
                <Center height={"full"}>
                  <Text fontSize="xl" color="gray.500" fontWeight={"semibold"}>
                    No audio files available.
                  </Text>
                </Center>
              ) : (
                <TableContainer
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    scrollbarColor: "#6B46C1",
                    scrollbarWidth: "thin",
                  }}
                  className="my-scrollable-element"
                >
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>
                          <Checkbox
                            isChecked={selectAll}
                            onChange={handleSelectAllChange}
                          ></Checkbox>
                        </Th>
                        <Th fontSize={"md"}>File Name</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {audioFiles.map((file, index) => (
                        <Tr key={index}>
                          <Td>
                            <Checkbox
                              isChecked={selectedFiles.includes(file)}
                              onChange={() => handleCheckboxChange(file)}
                            />
                          </Td>
                          <Td fontSize={{ base: "sm", md: "md" }}>{file}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </CardBody>

            <CardFooter p={{ sm: 1 }}>
              <Flex
                justifyContent={
                  audioFiles.length === 0 ? "center" : "space-between"
                }
                alignItems="center"
                w="full"
              >
                {audioFiles.length > 0 && (
                  <Button
                    colorScheme="red"
                    size={{ base: "md", md: "lg" }}
                    mt={4}
                    borderRadius="full"
                    onClick={handleDelete}
                    isDisabled={selectedFiles.length === 0}
                    _hover={{ bg: "red.500" }}
                    transition="all 0.3s ease"
                  >
                    Delete Selected
                  </Button>
                )}
                <Button
                  colorScheme="purple"
                  size={{ base: "md", md: "lg" }}
                  mt={4}
                  borderRadius="full"
                  isDisabled={audioFiles.length === 0}
                  _hover={{ bg: "purple" }}
                  transition="all 0.3s ease"
                  onClick={() => {
                    navigate("/process");
                  }}
                >
                  Move to Process
                </Button>
              </Flex>
            </CardFooter>
          </Card>
        </Box>
      </Flex>
    </>
  );
};

export default UploadComponent;
