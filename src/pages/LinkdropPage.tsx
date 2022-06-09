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
        paddingTop={10}
        paddingBottom={5}
        paddingInline={5}
        backgroundColor={'whiteAlpha.800'}
        shadow={'base'}
        borderRadius={10}
        minWidth={500}
      >
        <RedPacket/>
      </Box>
      {
        isSignedIn ?
          <Box
            paddingTop={10}
            paddingInline={10}
            paddingBottom={5}
            backgroundColor={'whiteAlpha.800'}
            shadow={'base'}
            borderRadius={10}
            minWidth={500}
          >
            <ActiveRedPacketViews/>
          </Box> :
          null
      }
    </VStack>
  )
}