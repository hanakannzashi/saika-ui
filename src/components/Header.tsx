import React from "react";
import {Flex, Spacer} from "@chakra-ui/react";
import {Login} from "./Login";
import {Logo} from "./Logo";
import {Link} from "react-router-dom";


export const Header: React.FC = () => {
  return (
    <Flex padding={5} alignItems={'center'}>
      <Link to={'/linkdrop'}>
        <Logo/>
      </Link>
      <Spacer/>
      <Login/>
    </Flex>
  )
}