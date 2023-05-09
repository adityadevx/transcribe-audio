import React, { useEffect, useState } from 'react'
import { Flex, Stack, Box, Button, useColorModeValue, Heading, FormControl, FormLabel, Input, Radio, RadioGroup } from '@chakra-ui/react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const Upload = () => {
    const toast = useToast()
    const navigate = useNavigate()

    const [files, setFiles] = useState([])
    const [processBtnLoading, setProcessBtnLoading] = useState(false)
    const [outputLocale, setOutputLocale] = useState("en-US")
    const [diarization, setDiarization] = useState("none")
    const [accuracy, setAccuracy] = useState("enhanced");
    const [uploadBtnLoading, setUploadBtnLoading] = useState(false);
    const [processDisabled, setProcessDisabled] = useState(true);


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
            setProcessDisabled(true);
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
                setProcessDisabled(false);
                setUploadBtnLoading(false);
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


    const handleDownload = async (e) => {
        setProcessBtnLoading(true)
        e.preventDefault();
        const body = { outputLocale, diarization, accuracy };

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/transcode`, body);
            if (res.status === 200) {
                setFiles([]);
                setProcessBtnLoading(false)
                return toast({
                    title: "File Processed",
                    description: "Your file has been processed successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: 'top-center'
                })
            }
        } catch (error) {
            setProcessBtnLoading(false);
            return toast({
                title: "Error Occurred",
                description: "There was an internal error while processing your file",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-center'
            })
        }
    };

    const handleOutputLocaleChange = (value) => {
        setOutputLocale(value)
        // console.log(value)
    };

    const handleDiarizationChange = (value) => {
        setDiarization(value);
        // console.log(value)
    };
    const handleAccuracyChange = (value) => {
        setAccuracy(value);
        // console.log(value)
    };



    useEffect(() => {
        if (document.cookie === '') {
            navigate('/login')
        }
    }, []);





    return (
        <>
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                direction={'column'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Upload your file</Heading>
                    </Stack>
                    <Box>
                        <Box
                            w={'full'}
                            bg={'lightblue'}
                        >
                            <FormControl px={50} py={55} >
                                <FormLabel textAlign={'center'}>No files Selected</FormLabel>
                                <Input type="file" border={'none'} accept='audio/*' multiple onChange={e => handleFiles(e)} />
                            </FormControl>
                            <Stack spacing={6} >
                                <Button
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}
                                    isLoading={uploadBtnLoading}
                                    onClick={(e) => handleUpload(e)}
                                >
                                    Upload
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Stack>

                <Stack mt={4}>
                    <label >Accuracy</label>
                    <RadioGroup defaultValue='enhanced' onChange={handleAccuracyChange} >
                        <Stack spacing={4} direction='row'>
                            <Radio value='enhanced'>
                                Enhanced
                            </Radio>
                            <Radio value='standard'>Standard</Radio>
                        </Stack>
                    </RadioGroup>
                </Stack>

                <Stack mt={4}>
                    <label >Output Locale</label>
                    <RadioGroup defaultValue='en-US' onChange={handleOutputLocaleChange} >
                        <Stack spacing={4} direction='row'>
                            <Radio value='en-US'>
                                US English
                            </Radio>
                            <Radio value='en-GB'>British English</Radio>
                            <Radio value='en-AU'>Australian English</Radio>
                        </Stack>
                    </RadioGroup>
                </Stack>

                <Stack mt={4} >
                    <label>Diarization</label>
                    <RadioGroup defaultValue='none' onChange={handleDiarizationChange}>
                        <Stack spacing={10} direction='row'>
                            <Radio value='none'>
                                None
                            </Radio>
                            <Radio value='speaker'>Speaker</Radio>
                            <Radio value='channel'>Channel</Radio>
                        </Stack>
                    </RadioGroup>
                </Stack>

                <Stack direction='row' spacing={4} align='center' mt={6} marginTop={10}>
                    <Button colorScheme='teal' variant='solid'
                        isLoading={processBtnLoading} loadingText='Please wait...'
                        onClick={(e) => handleDownload(e)}
                        isDisabled={processDisabled}
                    >
                        Process
                    </Button>
                </Stack>
            </Flex>
        </>
    )
}

export default Upload