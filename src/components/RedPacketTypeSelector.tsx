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
  VStack,
  Image,
  Flex, Center
} from "@chakra-ui/react";
import {MdArrowDropDown} from "react-icons/all";
import {RedPacketType} from "../types/near-types";
import redPacketCover from "../assets/redpacket-cover.svg"
import redPacketIcon from "../assets/red-packet-icon.png"


interface RedPacketTypeSelectorProps {
  redPacketType: RedPacketType,
  onRedPacketTypeSelect: (redPacketType: RedPacketType) => void
  finalFocusRef?: RefObject<FocusableElement>
}

export const RedPacketTypeSelector: React.FC<RedPacketTypeSelectorProps> = ({
  redPacketType,
  onRedPacketTypeSelect,
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

  const onClickAverage = () => {
    onClose()
    onRedPacketTypeSelect('Average')
  }

  const onClickRandom = () => {
    onClose()
    onRedPacketTypeSelect('Random')
  }

  return (
    <Box>
      <Button
        gap={1}
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
            <Flex gap={'3em'} paddingInline={3} paddingTop={5} paddingBottom={10} justify={'center'}>
              <Box
                paddingBottom={2}
                width={130}
                borderTopRadius={5}
                borderBottomRadius={5}
                cursor="pointer"
                backgroundColor={'#e3514c'}
                onClick={onClickAverage}
              >
                <Center>
                  <Image src={redPacketCover} width={20}/>
                </Center>
                <Center marginTop={2} fontWeight={'bold'} color={'#EEC88C'}>
                  Average
                </Center>
                <Center fontWeight={'bold'} fontSize={'sm'} color={'#EEC88C'}>
                  Red Packet
                </Center>
              </Box>
              <Box
                paddingBottom={2}
                width={130}
                borderTopRadius={5}
                borderBottomRadius={5}
                cursor="pointer"
                backgroundColor={'#1cbbb4'}
                onClick={onClickRandom}
              >
                <Center>
                  <Image src={redPacketCover} width={20}/>
                </Center>
                <Center marginTop={2} fontWeight={'bold'} color={'#EEC88C'}>
                  Rondom
                </Center>
                <Center fontWeight={'bold'} fontSize={'sm'} color={'#EEC88C'}>
                  Red Packet
                </Center>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}