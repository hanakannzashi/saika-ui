import React from "react";
import {Flex, Image} from "@chakra-ui/react";
import saikaLogo from "../assets/saika-logo.png"

export const Logo: React.FC = () => {
  return (
    <Flex
      backgroundColor={'whiteAlpha.800'}
      padding={2}
      color={'#c2cfe4'}
      shadow={'base'}
      borderRadius={10}
      fontWeight={'bold'}
    >
      <Image src={saikaLogo} width={'7em'} height={'1.8em'}/>
    </Flex>
  )
}