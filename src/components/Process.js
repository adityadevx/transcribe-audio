import React, { useState, useEffect } from 'react'
import { Flex, Stack, Box, Button, Heading, FormControl, FormLabel, Radio, RadioGroup, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Process = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const [outputLocale, setOutputLocale] = useState("en-US")
    const [diarization, setDiarization] = useState("none")
    const [accuracy, setAccuracy] = useState("enhanced");
    const [transcribeBtnLoading, setTranscribeBtnLoading] = useState(false);
    const [availableFiles, setAvailableFiles] = useState([]);

    const handleAccuracyChange = (value) => { setAccuracy(value) }
    const handleOutputLocaleChange = (value) => { setOutputLocale(value) }
    const handleDiarizationChange = (value) => { setDiarization(value) }

    const handleAvailableFiles = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/audiolist`);
            const data = await res.data;
            setAvailableFiles(data);
            // console.log(data);

        } catch (error) {
            // console.log(error.message);
            return toast({
                title: "Something went wrong",
                description: "Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-center",
            });
        }
    }

    const handleTranscribe = async (e) => {
        e.preventDefault();
        try {
            setTranscribeBtnLoading(true);
            const body = { accuracy, outputLocale, diarization };
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/transcode`, body);
            if (res.status === 200) {
                setTranscribeBtnLoading(false);
                return toast({
                    title: "Transcription Successful",
                    description: "Your transcription is ready to download",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-center",
                });
            }
        } catch (err) {
            console.log(err.message);
            setTranscribeBtnLoading(false);
            return toast({
                title: "Transcription Failed",
                description: "Something went wrong. Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-center",
            });
        }
    }


    useEffect(() => {
        if (document.cookie === '') {
            navigate('/login')
        }
        handleAvailableFiles();
    }, []);


    return (
        <>
            <Flex height="100vh" bg="gray.100" justify="center" align="center" p={8}>
                <Box
                    width="100%"
                    maxW="xl"
                    p={8}
                    bg="white"
                    borderRadius="md"
                    boxShadow="md"
                >
                    <Heading size="md" mb={6} fontWeight="bold" textAlign="center">
                        Choose Your Configurations
                    </Heading>
                    <FormControl mb={8}>
                        <FormLabel fontWeight="semibold" bg="#adaff1" w='-webkit-fit-content' px={3} borderRadius={5}>Accuracy</FormLabel>
                        <RadioGroup defaultValue="enhanced" onChange={handleAccuracyChange}>
                            <Stack spacing={4} pl={5} >
                                <Radio
                                    value="enhanced"
                                    size="md"
                                    colorScheme="purple"
                                    _focus={{ boxShadow: "none" }}
                                >
                                    Enhanced
                                </Radio>
                                <Radio
                                    value="standard"
                                    size="md"
                                    colorScheme="purple"
                                    _focus={{ boxShadow: "none" }}
                                >
                                    Standard
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <FormControl mb={8}>
                        <FormLabel fontWeight="semibold" bg='#e7c3b7' w='-webkit-fit-content' px={3} borderRadius={5}>Output Locale</FormLabel>
                        <RadioGroup defaultValue="en-US" onChange={handleOutputLocaleChange}>
                            <Stack spacing={4} pl={5}>
                                <Radio
                                    value="en-US"
                                    size="md"
                                    colorScheme="purple"
                                    _focus={{ boxShadow: "none" }}
                                >
                                    US English
                                </Radio>
                                <Radio
                                    value="en-GB"
                                    size="md"
                                    colorScheme="purple"
                                    _focus={{ boxShadow: "none" }}
                                >
                                    British English
                                </Radio>
                                <Radio
                                    value="en-AU"
                                    size="md"
                                    colorScheme="purple"
                                    _focus={{ boxShadow: "none" }}
                                >
                                    Australian English
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <FormControl mb={8}>
                        <FormLabel fontWeight="semibold" bg="#f1b4ce" w='-webkit-fit-content' px={3} borderRadius={5}>Diarization</FormLabel>
                        <RadioGroup defaultValue="none" onChange={handleDiarizationChange}>
                            <Stack spacing={4} pl={5} >
                                <Radio
                                    value="none"
                                    size="md"
                                    colorScheme="purple"
                                    _focus={{ boxShadow: "none" }}
                                >
                                    None
                                </Radio>
                                <Radio
                                    value="speaker"
                                    size="md"
                                    colorScheme="purple"
                                    _focus={{ boxShadow: "none" }}
                                >
                                    Speaker
                                </Radio>
                                <Radio
                                    value="channel"
                                    size="md"
                                    colorScheme="purple"
                                    _focus={{ boxShadow: "none" }}
                                >
                                    Channel
                                </Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <Flex justify="center">
                        <Button colorScheme="purple" size="md"
                            isLoading={transcribeBtnLoading}
                            onClick={(e) => { handleTranscribe(e) }}
                            loadingText="Transcribing..."
                            isDisabled={availableFiles.length === 0}
                        >
                            Transcribe Your Files
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default Process