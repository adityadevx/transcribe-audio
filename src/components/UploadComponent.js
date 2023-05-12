import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Center,
    Flex,
    Icon,
    Text,
    useColorModeValue,
    useToken,
    Card, CardBody, IconButton
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
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
    const [uploadReRender, setUploadReRender] = useState(false);

    const handleFiles = (e) => {
        // console.log(e.target.files)
        setFiles(e.target.files)
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
            // Handle error and display error message
            console.log(error);
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
        // Empty the files array
        // files.length = 0; 
    };
    const handleDelete = async (id) => {
        // console.log(id)
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/deleteaudio?filename=${id}`)
            const data = await res.json();
            console.log(data);
            if (res.status === 200) {
                setUploadReRender(!uploadReRender);
                return toast({
                    title: "File Deleted",
                    description: "Your file has been deleted successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top-center",
                });
            }

        } catch (error) {

        }
    };

    const handleAudioFilesList = async (e) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/audiolist`);
            const data = await res.data;
            setAudioFiles(data);
            // console.log(data);

        } catch (error) {
            // console.log(error.message)
        }
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
                <Box w={{ base: "100%", md: "70%" }} p="10" my={{ base: "4", md: "0" }}>
                    <Center minH={'-moz-fit-content'}>
                        <Box
                            borderWidth="1px"
                            borderRadius="xl"
                            p="10"
                            boxShadow="xl"
                            bg={useColorModeValue("white", "gray.700")}
                        >
                            <input
                                type="file"
                                style={{ display: "none" }}
                                id="fileInput"
                                accept='audio/*' multiple
                                onChange={(e) => handleFiles(e)}
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
                                        bg: useColorModeValue("purple.100", "gray.800"),
                                        borderColor: color,
                                    }}
                                >
                                    <Icon as={""} fontSize="6xl" color={color} mb="6" />
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
                                        color={useColorModeValue("gray.600", "gray.200")}
                                        mb="2"
                                    >
                                        {"Drag and drop your files here or click to browse"}
                                    </Text>
                                    <Text
                                        fontSize="md"
                                        color={useColorModeValue("gray.500", "gray.300")}
                                        fontWeight={"medium"}
                                    >
                                        {/* Any audio file up to 200MB */}
                                        {files.length === 0 ? "Any audio file up to 200MB" : files.length + " files selected"}
                                    </Text>
                                </Flex>
                            </label>
                        </Box>
                    </Center>
                    <Flex justifyContent="center" alignItems="center" mt={4}>
                        <Button colorScheme="purple" size="lg" mt="8" w="auto" borderRadius={'2xl'}
                            isLoading={uploadBtnLoading}
                            onClick={(e) => handleUpload(e)}>
                            Upload
                        </Button>
                    </Flex>
                </Box>
                <Box
                    w={{ base: "100%", md: "30%" }}
                    bg="white"
                    p="6"
                // boxShadow="lg"
                // borderRadius="lg"
                >
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
                                width: "8px"
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "transparent"
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: "gray.400",
                                borderRadius: "full"
                            }
                        }}
                        maxHeight="400px"
                    >

                        {audioFiles.length === 0 && <Text fontSize="md" fontWeight="semibold" color="gray.800" textAlign="center" mt={4}> No files uploaded yet</Text>}
                        {
                            audioFiles.map((file, index) => {
                                return (
                                    <Card my={4} key={index} variant={'outline'}>
                                        <Flex justifyContent="space-between" alignItems="center">
                                            <CardBody fontSize="md" fontWeight="semibold" color="gray.800">
                                                {file}
                                            </CardBody>
                                            <IconButton
                                                aria-label="Delete"
                                                icon={<DeleteIcon />}
                                                variant="ghost"
                                                colorScheme="gray"
                                                size="md"
                                                onClick={() => handleDelete(file)}
                                            />
                                        </Flex>
                                    </Card>
                                )
                            })
                        }
                    </Box>
                    <Flex justifyContent="center" mt={8}>
                        <Button
                            isDisabled={audioFiles.length === 0}
                            colorScheme="purple"
                            position={'absolute'}
                            bottom={0}
                            size="md"
                            fontWeight="semibold"
                            px={10}
                            py={6}
                            letterSpacing="wide"
                            textTransform="uppercase"
                            borderRadius="full"
                            boxShadow="md"
                            onClick={() => { navigate('/process') }}
                        >
                            Move To Process
                        </Button>
                    </Flex>
                </Box>
            </Flex>

        </>
    )
}

export default UploadComponent