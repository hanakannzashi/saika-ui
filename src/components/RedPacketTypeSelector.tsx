import React, {RefObject, useMemo} from "react";
import {FocusableElement} from "@chakra-ui/utils";
import {
  useDisclosure,
  Text,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Image,
  Flex,
  Center, VStack
} from "@chakra-ui/react";
import {MdArrowDropDown} from "react-icons/all";
import {RedPacketType} from "../types/near-types";
import redPacketCover from "../assets/redpacket-cover.svg"


interface RedPacketTypeSelectorProps {
  redPacketType?: RedPacketType,
  onChange?: (redPacketType: RedPacketType) => void
  finalFocusRef?: RefObject<FocusableElement>
}

export const RedPacketTypeSelector: React.FC<RedPacketTypeSelectorProps> = ({
  redPacketType,
  onChange,
  finalFocusRef
}) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const currentTypeColor: string = useMemo(() => {
    if (redPacketType === 'Average') {
      return '#e3514c'
    } else {
      return '#1cbbb4'
    }
  }, [redPacketType])

  const handleSelectAverage = () => {
    onClose()
    if (onChange) {
      onChange('Average')
    }
  }

  const handleSelectRandom = () => {
    onClose()
    if (onChange) {
       onChange('Random')
    }
  }

  return (
    <Box>
      <Button
        color={'white'}
        size={'sm'}
        leftIcon={<MdArrowDropDown/>}
        rightIcon={<Image src={redPacketCover} width={3}/>}
        backgroundColor={currentTypeColor}
        onClick={onOpen}
      >
        <Text> {redPacketType} </Text>
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={finalFocusRef}
        scrollBehavior={'inside'}
      >
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            Type
          </ModalHeader>
          <ModalBody>
            <Flex gap={10} paddingTop={5} paddingBottom={10} justify={'center'}>
              <Box
                paddingBottom={3}
                width={130}
                borderRadius={5}
                cursor="pointer"
                backgroundColor={'#e3514c'}
                onClick={handleSelectAverage}
              >
                <Center>
                  <Image src={redPacketCover} width={20}/>
                </Center>
                <VStack spacing={0}>
                  <Text fontWeight={'bold'} color={'#EEC88C'}>
                    Average
                  </Text>
                  <Text fontWeight={'bold'} fontSize={'sm'} color={'#EEC88C'}>
                    Red Packet
                  </Text>
                </VStack>
              </Box>
              <Box
                paddingBottom={3}
                width={130}
                borderRadius={5}
                cursor="pointer"
                backgroundColor={'#1cbbb4'}
                onClick={handleSelectRandom}
              >
                <Center>
                  <Image src={redPacketCover} width={20}/>
                </Center>
                <VStack spacing={0}>
                  <Text fontWeight={'bold'} color={'#EEC88C'}>
                    Average
                  </Text>
                  <Text fontWeight={'bold'} fontSize={'sm'} color={'#EEC88C'}>
                    Red Packet
                  </Text>
                </VStack>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}