import {useNearServiceStore} from "../stores/global-stores";
import React, {useEffect} from "react";
import {initNearService} from "../near/near-service";
import {Outlet} from 'react-router-dom'
import {Box} from "@chakra-ui/react";
import {Header} from "../components/Header";
import {Footer} from "../components/Footer";
import dappImage from "../assets/bg.webp"


export const Root: React.FC = () => {
  const {setNearService} = useNearServiceStore()

  useEffect(() => {
    const nearService = initNearService()
    setNearService(nearService)
  }, [setNearService])


  return (
    <Box backgroundImage={dappImage} minHeight={800}>
      <Header/>
      <Outlet/>
      <Footer/>
    </Box>
  )
}