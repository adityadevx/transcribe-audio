import React, { useEffect, useState } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Box, Text, Link, Flex, Spacer, Select, InputGroup, InputRightElement, Input, Stack, Button, Checkbox, ButtonGroup, useToast } from "@chakra-ui/react"
import { DownloadIcon, DeleteIcon } from '@chakra-ui/icons'



const DownloadTable = () => {




    const toast = useToast();
    const [jobs, setJobs] = useState([])
    const [searchVal, setSearchVal] = useState('')
    const [checkdBoxId, setCheckdBoxId] = useState([])
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [disablePrev, setDisablePrev] = useState(false);
    const [disableNext, setDisableNext] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [headerCheckboxState, setHeaderCheckboxState] = useState(false);

    const lastIndexOfLastRecord = currentPage * recordsPerPage;
    const firstIndexOfLastRecord = lastIndexOfLastRecord - recordsPerPage;

    const currentRecords = jobs.slice(firstIndexOfLastRecord, lastIndexOfLastRecord);
    const totalPages = Math.ceil(jobs.length / recordsPerPage);

    const handleHeaderCheckboxChange = (event) => {
        setHeaderCheckboxState(event.target.checked);
        if (event.target.checked) {
            setCheckdBoxId(jobs.map((item) => ({ id: item.id, value: item.id })));
        } else {
            setCheckdBoxId([]);
        }
    };

    const handleSearch = async (e) => {
        // setSearchVal(e.target.value)
        // console.log(searchVal)
        if (searchVal === '') {
            fetchJobs()
        }

        const filteredJobs = jobs.filter(job => {
            return job.data_name.toLowerCase().includes(searchVal.toLowerCase())
        })
        setJobs(filteredJobs)
    };


    async function fetchJobs() {
        const res = await fetch('https://asr.api.speechmatics.com/v2/jobs/', {
            headers: {
                // Authorization: `Bearer 1iazkusYjxyoY0QOd9jTohYaWmzebFmg`
                Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
            }
        })
        const { jobs } = await res.json()
        // console.log(jobs)
        setJobs(jobs)
    }
    const handleEntriesChange = (e) => {
        setRecordsPerPage(e.target.value)
        console.log(recordsPerPage)
        // console.log('rendered')
    }

    const capitalize = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    const languageFullForm = (value) => {
        switch (value) {
            case 'en-US':
                return 'American English'
            case 'en-GB':
                return 'British English'
            case 'en-AU':
                return 'Australian English'
            default:
                return 'Unknown'
        }
    }

    const handleCheckbox = (e) => {
        const { id, checked, value } = e.target;
        // console.log(id, checked, value);
        const obj = { id, value }
        if (checked) {
            setCheckdBoxId([...checkdBoxId, obj])
        }
        else {
            // setCheckdBoxId(checkdBoxId.filter((item) => item !== id))
            setCheckdBoxId(checkdBoxId.filter((item) => item.id !== id));
        }
    }

    const handleDownload = () => {
        // console.log(checkdBoxId)
        if (checkdBoxId.length === 0) {
            return toast({
                title: "No files selected",
                description: "Please select files to download",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: 'top-center'
            });
        }

        else {
            // code to download files
        }
    }

    const handleDelete = async () => {
        // console.log(checkdBoxId)
        // console.log('delete')
        if (checkdBoxId.length > 0) {
            await Promise.all(
                checkdBoxId.map(async (item) => {
                    const res = await fetch(`https://asr.api.speechmatics.com/v2/jobs/${item.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
                        }
                    });
                    const data = await res.json();
                    console.log(data);
                })
            );
            setDeleted(true); // set deleted state to true to re-render the component
            setCheckdBoxId([]);
            return toast({
                title: "Files deleted successfully",
                description: "Files deleted successfully",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: 'top-center'
            });
        }
        else {
            return toast({
                title: "No files selected",
                description: "Please select files to delete",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: 'top-center'
            });
        }

    };

    const textFileNaming = (value) => {
        const splicedText = value.split('.');
        return splicedText[0] + '.txt';
    }


    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)

        }
        else {
            setDisablePrev(true)
            // console.log(disablePrev)
            return toast({
                title: "No Previous pages",
                description: "You are on the first page",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: 'top-center'
            });

        }
        //    console.log('prev')
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
            setDisableNext(false)

        }
        else {
            setDisableNext(true)
            // console.log('i am disabled now')
            return toast({
                title: "No more pages",
                description: "No more pages to show",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: 'top-center'
            });
        }
    };

    useEffect(() => {
        fetchJobs()
    }, [recordsPerPage, deleted])

    return (
        <>
            <Box mx={2}>
                <h1>Files</h1>
                <Text>
                    You have total no of files :{' '}
                    <Link color='tomato'>
                        {jobs.length}
                    </Link>
                </Text>
            </Box>
            <Box m={5} bg={''}>
                <Flex>
                    <Box display='flex' alignItems='center'>
                        <Text display={'inline'} mb='0' >Show</Text>
                        <Select size='sm' onChange={e => handleEntriesChange(e)} >
                            <option value='10'>10</option>
                            <option value='20'>20</option>
                            <option value='30'>30</option>
                            <option value='50'>50</option>
                        </Select>
                        <Text display={'inline'} mb='0'>entries</Text>
                    </Box>
                    <Spacer />
                    <Box p='4' >
                        <InputGroup>
                            <Input placeholder='Search File' onChange={e => { setSearchVal(e.target.value) }} value={searchVal} />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleSearch}>
                                    Search
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                </Flex>
                <TableContainer>
                    <Table size='sm' variant='striped' colorScheme='gray'>
                        <Thead>
                            <Tr fontSize='lg'>

                                <Th fontSize='lg'>FILE</Th>
                                <Th fontSize='lg'>STATUS</Th>
                                <Th fontSize='lg'>CREATED AT</Th>
                                <Th fontSize='lg'>ACCURACY</Th>
                                <Th fontSize='lg'>LANGUAGE</Th>
                                <Th>
                                    <Checkbox size='lg' colorScheme='green'
                                        isChecked={headerCheckboxState}
                                        onChange={handleHeaderCheckboxChange}
                                    ></Checkbox>
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                currentRecords.map((job, index) => {

                                    return (
                                        <Tr key={index}>
                                            <Td>{textFileNaming(job.data_name)}</Td>
                                            <Td>{capitalize(job.status)}</Td>
                                            <Td>{(job.created_at).substr(0, 10)}</Td>
                                            <Td>{capitalize(job.config.transcription_config.operating_point)}</Td>
                                            <Td>{languageFullForm(job.config.transcription_config.output_locale)}</Td>
                                            <Td><Checkbox size='md' colorScheme='green'
                                                value={job.data_name} id={job.id} onChange={e => handleCheckbox(e)} isChecked={headerCheckboxState ? true : checkdBoxId.some(item => item.id === job.id)}
                                            ></Checkbox>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </TableContainer>
                <Flex bg={'gray.100'}>
                    <Box p='2' mt={2}>
                        Showing {firstIndexOfLastRecord + 1} to {lastIndexOfLastRecord} of {jobs.length} entries
                    </Box>
                    <Spacer />
                    <Stack direction='row' spacing={4} align='center'>
                        <Button colorScheme='whatsapp' size={'sm'} onClick={e => handlePrevPage(e)} disabled={disablePrev} >
                            Prev
                        </Button>
                        <Button colorScheme='whatsapp' size={'sm'} onClick={e => { handleNextPage(e) }}
                            disabled={disableNext} >
                            Next
                        </Button>
                    </Stack>
                </Flex>
            </Box>
            <Flex minWidth='max-content' alignItems='center' gap='2' mx={3}>
                <Spacer />
                <ButtonGroup gap='2'>
                    <Button colorScheme='green' leftIcon={<DownloadIcon />}
                        onClick={e => handleDownload()}
                    > Download
                    </Button>
                    <Button colorScheme='red' leftIcon={<DeleteIcon />}
                        onClick={e => handleDelete()}
                    >Delete</Button>
                </ButtonGroup>
            </Flex>
        </>
    )
}

export default DownloadTable;