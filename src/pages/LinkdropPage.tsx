import {Box, Button, Flex, VStack} from "@chakra-ui/react";
import {RedPacket} from "../components/RedPacket";
import React from "react";
import {ActiveRedPacketViews} from "../components/ActiveRedPacketViews";
import {useWalletSignedInStore} from "../stores/global-stores";


export const LinkdropPage: React.FC = () => {
  const {isSignedIn} = useWalletSignedInStore()
  return (
    <VStack spacing={10} marginTop={20} paddingBottom={20}>
      <Box color={'pink.300'} fontWeight={'bold'}>
        🎉 Create Red Packet and share with your friends 🎉
      </Box>
      <Box
        paddingTop={10}
        paddingBottom={5}
        paddingInline={5}
        backgroundColor={'whiteAlpha.800'}
        shadow={'base'}
        borderRadius={10}
        minWidth={500}
        maxWidth={500}
      >
        <RedPacket/>
      </Box>
      <Box
        display={!isSignedIn ? 'none': undefined}
        paddingTop={10}
        paddingInline={10}
        paddingBottom={5}
        backgroundColor={'whiteAlpha.800'}
        shadow={'base'}
        borderRadius={10}
        minWidth={500}
        maxWidth={700}
      >
        <ActiveRedPacketViews/>
      </Box>
    </VStack>
  )
}