import {
    Box, Flex, IconButton, Button, Stack, Link,
    useColorModeValue,
    useDisclosure, HStack
} from '@chakra-ui/react';
import NavLogo from './nav-logo.png'

import { useNavigate } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Cookies from 'js-cookie';


export default function Navbar() {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();


    const handleLogOutBtn = (e) => {
        e.preventDefault();
        Cookies.remove("token");
        navigate("/login")
    }

    const Links = ['Upload', 'Download'];

    const NavLink = ({ children, href }) => (
        <Link
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
            href={href}>
            {children}
        </Link>
    );

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <IconButton
                        size={'md'}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={'Open Menu'}
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={'center'}>
                        <Box fontSize={'xl'} fontWeight={600}>
                            <img src={NavLogo} alt='logo' width='60px' height='60px'  />
                        </Box>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'none', md: 'flex' }}>
                            {Links.map(link => (
                                <NavLink key={link} href={`/${link.toLowerCase()}`}>
                                    {link}
                                </NavLink>
                            ))}
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        {/* <Menu>
                            <MenuButton
                                as={Button}
                                rounded={'full'}
                                variant={'link'}
                                cursor={'pointer'}
                                minW={0}>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={(e) => { handleLogOutBtn(e) }}>Logout</MenuItem>
                                <MenuItem onClick={(e) => { navigate('/changepassword') }}>Change Password</MenuItem>

                            </MenuList>
                        </Menu> */}

                        <Button colorScheme='green' size='sm' mx={1} onClick={() => { navigate('/key') }} >
                            API KEY
                        </Button>
                        <Button colorScheme='green' size='sm' mx={1} onClick={(e) => { navigate('/changepassword') }}>
                            Change Pass
                        </Button>
                        <Button colorScheme='red' size='sm' onClick={(e) => { handleLogOutBtn(e) }}>
                            Logout
                        </Button>
                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as={'nav'} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link} href={`/${link.toLowerCase()}`}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box >

        </>
    );
}