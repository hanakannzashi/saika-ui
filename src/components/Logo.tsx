import React from "react";
import {Box} from "@chakra-ui/react";

export const Logo: React.FC = () => {
  return (
    <Box
      paddingInline={3}
      paddingBlock={2}
      backgroundColor={'whiteAlpha.800'}
      color={'#c2cfe4'}
      shadow={'base'}
      borderRadius={10}
      fontWeight={'bold'}
    >
      🧧 Saika Red Packet
    </Box>
  )
}