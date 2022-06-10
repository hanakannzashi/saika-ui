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
import React, {RefObject, useMemo} from "react";
import {customTokenIconMapping, DEFAULT_TOKEN_ICON} from "../config/token-config";
import {FocusableElement} from "@chakra-ui/utils";
import {TokenMetadata} from "../types/near-types";


export interface TokenSelectorProps {
  tokenMetadataList?: TokenMetadata[],
  tokenMetadata?: TokenMetadata,
  onChange?: (tokenMetadata: TokenMetadata) => void
  finalFocusRef?: RefObject<FocusableElement>
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  tokenMetadataList,
  tokenMetadata,
  onChange,
  finalFocusRef
}) => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const tokenIcon: string = useMemo(() => {
    if (tokenMetadata) {
      return customTokenIconMapping[tokenMetadata.id] ?? tokenMetadata.icon ?? DEFAULT_TOKEN_ICON
    } else {
      return DEFAULT_TOKEN_ICON
    }
  }, [tokenMetadata])

  const tokenSymbol: string = useMemo(() => {
    return tokenMetadata?.symbol ?? ''
  }, [tokenMetadata])

  return (
    <Box>
      <Button
        onClick={onOpen}
        backgroundColor={'whiteAlpha.100'}
        size={'sm'}
        leftIcon={<MdArrowDropDown/>}
        rightIcon={
          <Avatar size={'xs'} src={tokenIcon}/>
        }
      >
        {tokenSymbol}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        finalFocusRef={finalFocusRef}
        size={'xs'}
        scrollBehavior={'inside'}
      >
        <ModalOverlay/>
        <ModalContent backgroundColor={'whiteAlpha.900'}>
          <ModalHeader>
            Token
          </ModalHeader>
          <ModalBody>
            <Stack
              spacing={2}
              marginBottom={5}
            >
              {
                tokenMetadataList === undefined || tokenMetadataList.length === 0 ?
                  <Text fontSize={'sm'} fontWeight={'bold'}> Empty Token List </Text> :
                  tokenMetadataList.map((eachTokenMetadata) => {
                    const handleSelectTokenMetadata = () => {
                      onClose()
                      if (onChange) {
                        onChange(eachTokenMetadata)
                      }
                    }
                    return (
                      <Flex
                        key={eachTokenMetadata.id}
                        gap={3}
                        padding={2}
                        borderRadius={10}
                        cursor="pointer"
                        alignItems={'center'}
                        onClick={handleSelectTokenMetadata}
                      >
                        <Avatar src={customTokenIconMapping[eachTokenMetadata.id] ?? eachTokenMetadata.icon ?? DEFAULT_TOKEN_ICON} size={'sm'}/>
                        <Box>
                          <Text fontSize={'sm'} fontWeight={'bold'}>
                            {eachTokenMetadata.symbol}
                          </Text>
                          <Text fontSize={'xs'} color={'gray'}>
                            {eachTokenMetadata.name}
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