import React, {ReactNode} from "react";
import {useNearServiceStore, useWalletSignedInStore} from "../stores/global-stores";
import {Navigate} from "react-router-dom";


interface InterceptorProps {
  redirect: string,
  children: ReactNode
}

export const Interceptor: React.FC<InterceptorProps> = (
  {
    redirect,
    children
  }
) => {
  useWalletSignedInStore()
  const {nearService} = useNearServiceStore()
  return (
    <>
      {
        nearService ?
          nearService.wallet.isSignedIn() ?
            children :
            <Navigate to={redirect} /> :
          null
      }
    </>
  )
}