import React from "react";
import {VStack, Image, Button, Text} from "@chakra-ui/react";
import saikaIcon from "../assets/saika-icon.png"
import {Link} from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <VStack minHeight={600} gap={7} marginTop={10}>
      <Text fontSize={'xx-large'} fontWeight={'bold'}>
        Create Red Packet & Share with your friends
      </Text>
      <Link to={'/linkdrop'}>
        <Button color={'#b897ab'} width={180} height={50} borderRadius={20} backgroundColor={'whiteAlpha.700'}>
          Get Started
        </Button>
      </Link>
      <Image src={saikaIcon} boxSize={'md'}/>
    </VStack>
  )
}