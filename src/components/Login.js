import { Flex, Stack, Box, Button, useColorModeValue, Heading, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultIdPass = {
    email: 'admin',
    password: 'admin'
}

export default function Loign() {
    const navigate = useNavigate();
    const [inputFields, setInputFields] = useState({ email: '', password: '' });

    const handleInputChange = (e) => {
        setInputFields({ ...inputFields, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(inputFields)
        if (inputFields.email === defaultIdPass.email && inputFields.password === defaultIdPass.password) {
            navigate('/upload');
            // console.log('login success')
        }
    };

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Sign In to your account</Heading>
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email"
                                value={inputFields.email}
                                onChange={handleInputChange}
                                name="email"
                                required
                            />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>

                            <Input type="password"
                                value={inputFields.password}
                                onChange={handleInputChange}
                                name="password"
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
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}