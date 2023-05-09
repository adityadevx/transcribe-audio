import React, { useState } from 'react'
import { Button } from '@chakra-ui/button'
import { Box, Flex, Heading, Stack } from '@chakra-ui/layout'
import { Input } from '@chakra-ui/input'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { useToast } from '@chakra-ui/toast'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'


const ChangePassword = () => {
    const toast = useToast()
    const navigate = useNavigate()
    const [formDetails, setFormDetails] = useState({ password: '', confirmPassword: '' })

    const handleInputChange = (e) => {
        setFormDetails({ ...formDetails, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formDetails.password !== formDetails.confirmPassword) {
            return toast({
                title: "Passwords do not match",
                description: "Please check your password",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: 'top-center'
            })
        }
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/resetpass`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newPassword: formDetails.password })
        })
        const data = await response.json()
        if (response.status === 200) {
            toast({
                title: "Password Changed Successfully",
                description: "Please login again",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: 'top-center'
            })
        }
        else {
            toast({
                title: "Password Change Failed",
                description: "Please try again",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: 'top-center'
            })
        }
    }


    return (
        <>

            <Flex
                minH={'100vh'}
                align={'center'}
                justify={'center'}
                bg={useColorModeValue('gray.50', 'gray.800')}>
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                    <Stack align={'center'}>
                        <Heading fontSize={'4xl'}>Change Your Password</Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('white', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="email">
                                <FormLabel>Enter your New Password</FormLabel>
                                <Input type="password"
                                    value={formDetails.password}
                                    onChange={(e) => { handleInputChange(e) }}
                                    name="password"
                                    required
                                />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Re Enter Your New Password</FormLabel>

                                <Input type="password"
                                    value={formDetails.confirmPassword}
                                    onChange={(e) => { handleInputChange(e) }}
                                    name="confirmPassword"
                                    required
                                />
                            </FormControl>
                            <Stack spacing={10}>
                                <Button
                                    type='submit'
                                    onClick={e => handleSubmit(e)}
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Change Password
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
        </>
    )
}

export default ChangePassword