import React, {useEffect} from "react";
import {Avatar, Box, Button, Flex, Menu, MenuButton, MenuList, MenuItem, Text, Image, Spacer} from "@chakra-ui/react";
import {useNearServiceStore, useWalletSignedInStore} from "../stores/global-stores";
import {getWalletConfig} from "../config/wallet-config";
import accountIcon from "../assets/account-icon.svg"


const {signInOptions} = getWalletConfig()

export const Login: React.FC = () => {
  const {nearService} = useNearServiceStore()
  const {isSignedIn, setWalletSignedIn} = useWalletSignedInStore()

  useEffect(() => {
    if (!nearService) {
      return
    }
    setWalletSignedIn(nearService.wallet.isSignedIn())
  }, [nearService]) // eslint-disable-line react-hooks/exhaustive-deps

  const signIn = async () => {
    await nearService!.wallet.requestSignIn(
      signInOptions
    )
  }

  const signOut = () => {
    nearService!.wallet.signOut()
    setWalletSignedIn(false)
  }

  return (
    !isSignedIn ?
      <Button
        borderRadius={20}
        fontWeight={'bold'}
        fontSize={'sm'}
        color={'#c2cfe4'}
        backgroundColor={'whiteAlpha.800'}
        onClick={signIn}
      >
        Sign in with NEAR
      </Button>
      :
      <Menu>
        <MenuButton
          as={Button}
          borderRadius={20}
          backgroundColor={'whiteAlpha.800'}
          _hover={{backgroundColor: ''}}
          _active={{backgroundColor: ''}}
          leftIcon={<Avatar marginLeft={-5} src={accountIcon} size={'md'} padding={'0.5em'} backgroundColor={'whiteAlpha.500'}/>}
        >
          <Text
            fontWeight={'bold'}
            fontSize={'sm'}
            color={'gray.400'}
            maxWidth={150}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
            whiteSpace={'nowrap'}
          >
            {nearService!.wallet.getAccountId()}
          </Text>

        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={signOut}
            fontWeight={'bold'}
            fontSize={'sm'}
            color={'gray.600'}
          >
            Sign out
          </MenuItem>
          {/*<MenuItem*/}
          {/*  fontWeight={'bold'}*/}
          {/*  fontSize={'sm'}*/}
          {/*  color={'gray.600'}*/}
          {/*>*/}
          {/*  <Link to={'/account'}>*/}
          {/*    Account*/}
          {/*  </Link>*/}
          {/*</MenuItem>*/}
        </MenuList>
      </Menu>
  )
}