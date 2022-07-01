import React from "react";
import {Flex, Image} from "@chakra-ui/react";
import nearLogo from "../assets/near-logo.svg"

export const Footer: React.FC = () => {
  return (
    <Flex justify={'center'} alignItems={"center"} gap={2} fontSize={'lg'} fontWeight={'bold'} paddingBottom={10}>
      Powered by
      <Image src={nearLogo} width={'5em'}/>
    </Flex>
  )
}