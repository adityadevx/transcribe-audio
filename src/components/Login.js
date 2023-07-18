import { Flex, Stack, Box, Button, useColorModeValue, Heading, FormControl, FormLabel, Input, InputRightElement, InputGroup } from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import ReCAPTCHA from "react-google-recaptcha";
import logo from './nav-logo.png'



export default function Loign() {
    const navigate = useNavigate();
    const toast = useToast();
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show);
    const captchaRef = useRef(null);


    const [inputFields, setInputFields] = useState({ email: '', password: '' });

    const handleInputChange = (e) => {
        setInputFields({ ...inputFields, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const captchaValue = captchaRef.current.getValue();


        if (inputFields.email === '' || inputFields.password === '' || captchaValue === '') {
            captchaRef.current.reset();
            return toast({
                title: "Invalid Credentials",
                description: "Please check your credentials or captcha",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-center'
            })
        }
        if (!handleCaptcha(captchaValue)) {
            captchaRef.current.reset();
            return toast({
                title: "Invalid Captcha",
                description: "Please try again",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: 'top-center'
            })
        }
        captchaRef.current.reset();
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputFields),
            });
            const data = await res.json();
            if (res.status === 200) {
                document.cookie = `token=${data.token}`;
                navigate('/upload');
            }
            else {
                setInputFields({ email: '', password: '' });
                return toast({
                    title: "Invalid Credentials",
                    description: "Please check your email and password",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: 'top-center'
                })
            }

        } catch (error) {
            console.log(error.message)
            setInputFields({ email: '', password: '' });
            return toast({
                title: "Server Error",
                description: "Please try again later",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'top-center'
            })
        }
    };

    useEffect(() => {
        if (document.cookie.includes('token')) {
            navigate('/upload');
        }
    }, []);

    const handleCaptcha = async (value) => {
        console.log("Captcha value:", value);
        const token = captchaRef.current.getValue();

        try {
            const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REACT_APP_RECAPTCHA_SECRET_KEY}&response=${token}`, { method: 'POST' })

            const data = await res.json();
            console.log(data);
            return data.success;
        } catch (error) {
            captchaRef.current.reset();
            return false;
        }
    };


    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={10}  maxW={'lg'} py={12} >
                <Stack align={'center'} justify={'center'}>
                    <img src={logo} alt="logo"  width={'auto'}/>
                </Stack>
            </Stack>
            <Stack spacing={8}  maxW={'lg'} py={12} px={6}>
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
                                placeholder="Enter email"
                                required
                            />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    pr='4.5rem'
                                    onChange={handleInputChange}
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                    name='password'
                                    value={inputFields.password}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>

                        </FormControl>
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                            ref={captchaRef}
                            // style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}
                            style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
                        />
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