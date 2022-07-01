import {Box, VStack} from "@chakra-ui/react";
import {RedPacket} from "../components/RedPacket";
import React from "react";
import {ActiveRedPacketViews} from "../components/ActiveRedPacketViews";
import {useWalletSignedInStore} from "../stores/global-stores";


export const LinkdropPage: React.FC = () => {
  const {isSignedIn} = useWalletSignedInStore()

  return (
    <VStack spacing={10} minHeight={600} justify={'center'}>
      <Box
        padding={5}
        backgroundColor={'whiteAlpha.800'}
        shadow={'base'}
        borderRadius={10}
        minWidth={350}
      >
        <RedPacket/>
      </Box>
      {
        isSignedIn ?
          <Box
            padding={5}
            backgroundColor={'whiteAlpha.800'}
            shadow={'base'}
            borderRadius={10}
            minWidth={350}
          >
            <ActiveRedPacketViews/>
          </Box> :
          null
      }
    </VStack>
  )
}