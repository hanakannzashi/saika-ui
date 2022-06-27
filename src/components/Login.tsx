import React, {useEffect} from "react";
import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Box,
  Center,
  Stack,
  VStack,
} from "@chakra-ui/react";
import {useNearServiceStore, useWalletSignedInStore} from "../stores/global-stores";
import {walletConfig} from "../config/wallet-config";
import accountIcon from "../assets/account-icon.svg"
import {Link} from "react-router-dom";


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
      walletConfig.signInOptions
    )
  }

  const signOut = () => {
    nearService!.wallet.signOut()
    setWalletSignedIn(false)
  }

  return (
    <Box>
      {
        !isSignedIn ?
          <Button
            borderRadius={50}
            fontWeight={'bold'}
            fontSize={'sm'}
            color={'gray'}
            backgroundColor={'whiteAlpha.800'}
            onClick={signIn}
          >
            Sign in with NEAR
          </Button> :
          <Menu>
            <MenuButton
              as={Button}
              borderRadius={50}
              backgroundColor={'whiteAlpha.800'}
              leftIcon={
                <Avatar
                  marginLeft={-5}
                  src={accountIcon}
                  size={'md'}
                  padding={'0.5em'}
                  backgroundColor={'whiteAlpha.400'}
                />
              }
            >
              <Text
                fontWeight={'bold'}
                fontSize={'sm'}
                color={'gray'}
                maxWidth={150}
                overflow={'hidden'}
                textOverflow={'ellipsis'}
                whiteSpace={'nowrap'}
              >
                {nearService!.wallet.getAccountId()}
              </Text>
            </MenuButton>
            <MenuList backgroundColor={'whiteAlpha.500'}>
              <Link to={'/account'}>
                <MenuItem
                  fontWeight={'bold'}
                  fontSize={'sm'}
                  color={'gray'}
                  backgroundColor={'whiteAlpha.800'}
                >
                  Account
                </MenuItem>
              </Link>
              <MenuItem
                marginTop={2}
                onClick={signOut}
                fontWeight={'bold'}
                fontSize={'sm'}
                color={'gray'}
                backgroundColor={'whiteAlpha.800'}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
      }
    </Box>
  )
}