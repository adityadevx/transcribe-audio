import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Text,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

const UploadComponent = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploadBtnLoading, setUploadBtnLoading] = useState(false);
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const [color] = useToken("colors", ["blue.400"]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadReRender, setUploadReRender] = useState(false);

  const fileInputBg = useColorModeValue("purple.100", "gray.800");
  const fileTextColor = useColorModeValue("gray.600", "gray.200");
  const fileSubTextColor = useColorModeValue("gray.500", "gray.300");
  const boxBgColor = useColorModeValue("white", "gray.700");

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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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
      <Flex flexWrap="wrap" justifyContent="center" mt={2}>
        <Box w={{ base: "100%", md: "50%" }} p={6} my={{ base: "4", md: "0" }}>
          <Center minH={"-moz-fit-content"}>
            <Box
              borderWidth="1px"
              borderRadius="xl"
              p="10"
              boxShadow="xl"
              bg={boxBgColor}
              onDragOver={handleDragOver}
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
                  borderWidth="3px"
                  borderStyle="dashed"
                  borderColor={borderColor}
                  borderRadius="xl"
                  py="12"
                  px="16"
                  cursor="pointer"
                  _hover={{
                    bg: fileInputBg,
                    borderColor: color,
                  }}
                >
                  <Text
                    fontWeight="semibold"
                    fontSize={{
                      base: "sm",
                      md: "md",
                      lg: "lg",
                      xl: "xl",
                      "2xl": "2xl",
                    }}
                    textAlign="center"
                    color={fileTextColor}
                    mb="2"
                  >
                    Drag and drop your files here <br /> or click to browse
                  </Text>
                  <Text
                    fontSize="md"
                    color={fileSubTextColor}
                    fontWeight={"medium"}
                  >
                    {files.length === 0
                      ? "Any audio file up to 500MB"
                      : files.length + " files selected"}
                  </Text>
                </Flex>
              </label>
            </Box>
          </Center>
          <Flex justifyContent="center" alignItems="center" mt={4}>
            <Button
              colorScheme="purple"
              size="lg"
              mt="8"
              w="auto"
              borderRadius={"2xl"}
              isLoading={uploadBtnLoading}
              onClick={handleUpload}
            >
              Upload
            </Button>
          </Flex>
        </Box>
        <Box w={{ base: "100%", md: "50%" }} p={6}>
          <Flex justifyContent="center" alignItems="center" mb={4}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Uploaded Files
            </Text>
          </Flex>
          <Box
            scrollBehavior={"smooth"}
            overflowY="scroll"
            css={{
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "gray.400",
                borderRadius: "full",
              },
            }}
            maxHeight="400px"
          >
            {audioFiles.length === 0 ? (
              <Flex height={"150px"} justify={"center"} alignItems={"center"}>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="gray.800"
                  textAlign="center"
                >
                  No Files Uploaded
                </Text>
              </Flex>
            ) : (
              <>
                <TableContainer p={2} bg={"gray.50"} rounded={"lg"}>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th fontSize={"lg"}>File Name</Th>
                        <Th>
                          <Checkbox
                            isChecked={
                              audioFiles.length > 0 &&
                              selectedFiles.length === audioFiles.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFiles(audioFiles);
                              } else {
                                setSelectedFiles([]);
                              }
                            }}
                            colorScheme="green"
                          ></Checkbox>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {audioFiles.map((file, index) => (
                        <Tr key={index}>
                          <Td fontSize={"md"} fontWeight={"medium"}>
                            {file}
                          </Td>
                          <Td>
                            <Checkbox
                              colorScheme={"green"}
                              isChecked={selectedFiles.includes(file)}
                              onChange={() => handleCheckboxChange(file)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Flex width={"full"} justify={"end"}>
                  <Button
                    colorScheme="red"
                    size="md"
                    justifyContent={"end"}
                    mt={4}
                    onClick={handleDelete}
                    isDisabled={selectedFiles.length === 0}
                  >
                    <DeleteIcon mr={2} />
                    Delete
                  </Button>
                </Flex>
              </>
            )}
            <Flex justifyContent="center" mt={8}>
              <Button
                isDisabled={audioFiles.length === 0}
                colorScheme="purple"
                position={"absolute"}
                bottom={0}
                size="md"
                fontWeight="semibold"
                px={10}
                py={6}
                letterSpacing="wide"
                textTransform="uppercase"
                borderRadius="full"
                boxShadow="md"
                onClick={() => {
                  navigate("/process");
                }}
              >
                Move To Process
              </Button>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default UploadComponent;
