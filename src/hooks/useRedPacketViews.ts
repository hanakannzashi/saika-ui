import {useNearServiceStore, useWalletSignedInStore} from "../stores/global-stores";
import {useCallback, useEffect, useState} from "react";
import {RedPacketView} from "../near/red-packet-contract";

export const useRedPacketViews = () => {
  const {nearService} = useNearServiceStore()
  const {isSignedIn} = useWalletSignedInStore()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isErr, setIsErr] = useState<boolean>(false)
  const [views, setViews] = useState<RedPacketView[]>([])
  const [reflushCount, setReflushCount] = useState<number>(0)

  const onReflush = useCallback(() => {
    setIsLoading(true)
    setIsErr(false)
    setViews([])
    setReflushCount((oldReflushCount) => {
      return oldReflushCount + 1
    })
  }, [])

  useEffect(() => {
    if (!nearService || !isSignedIn) {
      return
    }
    nearService.redPacketContract.get_red_packets_by_owner_id({
      owner_id: nearService.wallet.getAccountId()
    })
      .then((views) => {
        setViews(views)
        setIsLoading(false)
      })
      .catch((err) => {
        setIsErr(true)
        console.error('fetch red packet views error: ' + err)
      })
  }, [nearService, isSignedIn, reflushCount])

  return {isLoading, isErr, views, reflushCount, onReflush}
}