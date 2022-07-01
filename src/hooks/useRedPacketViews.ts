import {useNearServiceStore} from "../stores/global-stores";
import {useCallback, useEffect, useState} from "react";
import {RedPacketView} from "../near/red-packet-contract";

export const useRedPacketViews = (ownerId?: string) => {
  const {nearService} = useNearServiceStore()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isErr, setIsErr] = useState<boolean>(false)
  const [views, setViews] = useState<RedPacketView[]>([])
  const [refreshCount, setRefreshCount] = useState<number>(0)

  const onRefresh = useCallback(() => {
    setIsLoading(true)
    setIsErr(false)
    setViews([])
    setRefreshCount((oldRefreshCount) => {
      return oldRefreshCount + 1
    })
  }, [])

  useEffect(() => {
    if (!nearService) {
      return
    }
    if (!ownerId) {
      return
    }
    nearService.redPacketContract.get_red_packets_by_owner_id({
      owner_id: ownerId
    })
      .then((views) => {
        setViews(views)
        setIsLoading(false)
      })
      .catch((err) => {
        setIsErr(true)
        console.error('fetch red packet views error: ' + err)
      })
  }, [nearService, ownerId, refreshCount])

  return {isLoading, isErr, views, refreshCount, onRefresh}
}