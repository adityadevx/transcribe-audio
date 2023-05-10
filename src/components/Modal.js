import React from 'react'
import {
    Button, Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, FormControl
    , ModalFooter, Input, FormLabel, ModalCloseButton, useDisclosure, FormHelperText
} from '@chakra-ui/react'

const ModalComponent = ({ modal }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <>
            <>
                {modal &&
                    <Modal
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader textAlign={'center'} >Change Your Api Key</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>New Api Key</FormLabel>
                                    <Input placeholder='API KEY' />
                                    <FormHelperText fontWeight={300}>
                                        Entering wrong API KEY will result in failure of all the requests
                                    </FormHelperText>
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme='blue' mr={3}>
                                    Change
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                }
            </>
        </>
    )
}

export default ModalComponent