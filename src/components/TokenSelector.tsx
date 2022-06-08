import {
  useDisclosure,
  Avatar,
  Box,
  Button, Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Stack,
  Flex
} from "@chakra-ui/react";
import {MdArrowDropDown} from "react-icons/all";
import React, {RefObject} from "react";
import {DEFAULT_TOKEN_ICON} from "../config/token-config";
import {FocusableElement} from "@chakra-ui/utils";
import {TokenMetadata} from "../types/near-types";


export interface TokenSelectorProps {
  tokenList: TokenMetadata[],
  selectedToken: TokenMetadata | null,
  onTokenSelect: (token: TokenMetadata) => void
  finalFocusRef?: RefObject<FocusableElement>
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokenList,
  selectedToken,
  onTokenSelect,
  finalFocusRef
}) => {
  const {isOpen, onOpen, onClose} = useDisclosure()

  return (
    <Box>
      <Button
        onClick={onOpen}
        backgroundColor={'white'}
        size={'sm'}
        leftIcon={<MdArrowDropDown/>}
        rightIcon={<Avatar size={'xs'} src={selectedToken?.icon ?? DEFAULT_TOKEN_ICON}/>}
      >
        {selectedToken?.symbol ?? ''}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={finalFocusRef}
        size={'xs'}
        scrollBehavior={'inside'}
      >
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            Token
          </ModalHeader>
          <ModalBody marginBottom={5}>
            <Stack spacing={2}>
              {
                tokenList.length === 0 ?
                  <Text fontSize={'sm'}> Empty Token List </Text>
                  :
                  tokenList.map((eachToken) => {
                    const onClick = () => {
                      onClose()
                      onTokenSelect(eachToken)
                    }
                    return (
                      <Flex
                        key={eachToken.id}
                        gap={3}
                        padding={2}
                        borderRadius={10}
                        cursor="pointer"
                        onClick={onClick}
                        alignItems={'center'}
                      >
                        <Avatar src={eachToken.icon ?? DEFAULT_TOKEN_ICON} size={'sm'}/>
                        <Box>
                          <Text fontSize={'sm'} fontWeight={'bold'}>
                            {eachToken.symbol}
                          </Text>
                          <Text fontSize={'xs'} color={'gray'}>
                            {eachToken.name}
                          </Text>
                        </Box>
                      </Flex>
                    )
                  })
              }
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}