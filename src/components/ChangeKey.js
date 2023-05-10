import React, { useEffect, useState } from 'react'
import { Flex, Stack, Box, Button, useColorModeValue, Heading, FormControl, FormLabel, Input, InputGroup, Text } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ChangeKey = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [newKey, setNewKey] = useState({ newApiKey: "", confirmNewApiKey: "" })

    const handleInputsChange = (e) => {
        setNewKey({ ...newKey, [e.target.name]: e.target.value })
    }

    const handleKeySubmit = async (e) => {
        e.preventDefault()
        if (newKey.newApiKey !== newKey.confirmNewApiKey) {
            return toast({
                title: "API KEY MISMATCH",
                description: "Please enter same API KEY in both the fields",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-center"
            })
        }
        console.log('newKey', newKey)
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/keyreset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newApiKey: newKey.newApiKey })
            })
            // const data = await res.json()
            if (res.status === 200) {
                return toast({
                    title: "API KEY CHANGED",
                    description: "API KEY changed successfully",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                    position: "top-center"
                })
            }

        } catch (error) {
            // console.log(error.message)
            return toast({
                title: "API KEY CHANGE FAILED",
                description: "API KEY change failed",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-center"
            })
        }

    }
    useEffect(() => {
        if (document.cookie === "") {
            navigate('/login')
        }
    }, [])


    return (
        <>
            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Change Your API KEY</Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel>Enter Api Key</FormLabel>
                                <Input type="text"
                                    value={newKey.newApiKey}
                                    onChange={(e) => { handleInputsChange(e) }}
                                    name="newApiKey"
                                    placeholder="Enter new API KEY"
                                    required
                                />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Re-Enter Api Key</FormLabel>
                                <InputGroup size='md'>
                                    <Input
                                        pr='4.5rem'
                                        type='text'
                                        onChange={(e) => { handleInputsChange(e) }}
                                        placeholder='Re-Enter new API KEY'
                                        name='confirmNewApiKey'
                                        value={newKey.confirmNewApiKey}
                                    />
                                </InputGroup>

                            </FormControl>
                            <Stack spacing={10}>
                                <Button
                                    type='submit'
                                    onClick={e => handleKeySubmit(e)}
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Change Key
                                </Button>
                                <Text color={'red'} fontWeight={200}>
                                    Note :
                                    Entering wrong API KEY will result in failure of all the requests
                                </Text>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}

export default ChangeKey