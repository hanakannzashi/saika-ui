import {useNearServiceStore} from "../stores/global-stores";
import {useCallback, useEffect, useState} from "react";
import {RedPacketView} from "../near/red-packet-contract";

export const useRedPacketView = (publicKey?: string) => {
  const {nearService} = useNearServiceStore()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isErr, setIsErr] = useState<boolean>(false)
  const [view, setView] = useState<RedPacketView | null>(null)
  const [refreshCount, setReflushCount] = useState<number>(0)

  const onRefresh = useCallback(() => {
    setIsLoading(true)
    setIsErr(false)
    setView(null)
    setReflushCount((oldRefreshCount) => {
      return oldRefreshCount + 1
    })
  }, [])

  useEffect(() => {
    if (!nearService || !publicKey) {
      return
    }
    nearService.redPacketContract.get_red_packet_by_pk({
      public_key: publicKey
    })
      .then((views) => {
        setView(views)
        setIsLoading(false)
      })
      .catch((err) => {
        setIsErr(true)
        console.error('fetch red packet view error: ' + err)
      })
  }, [nearService, publicKey, refreshCount])

  return {isLoading, isErr, view, refreshCount, onRefresh}
}