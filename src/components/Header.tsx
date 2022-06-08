import React from "react";
import {Flex, Spacer} from "@chakra-ui/react";
import {Login} from "./Login";
import {Logo} from "./Logo";

export const Header: React.FC = () => {
  return (
    <Flex padding={10}>
      <Logo/>
      <Spacer/>
      <Login/>
    </Flex>
  )
}