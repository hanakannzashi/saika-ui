import React from "react";
import {Box, Image} from "@chakra-ui/react";
import saikaLogo from "../assets/saika-logo.png"

export const Logo: React.FC = () => {
  return (
    <Box
      borderRadius={10}
    >
      <Image src={saikaLogo} width={'7rem'} height={'2rem'}/>
    </Box>
  )
}