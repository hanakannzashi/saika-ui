import {useEffect, useState} from "react";
import {TokenMetadata} from "../types/near-types";
import {FungibleTokenUtils} from "../utils/fungible-token-utils";
import {useNearServiceStore} from "../stores/global-stores";
import {nearMetaData} from "../config/token-config";


export const useTokenMetadataList = (tokenIdList: string[]) => {
  const {nearService} = useNearServiceStore()
  const [tokenMetadataList, setTokenMetadataList] = useState<TokenMetadata[]>([])

  useEffect(() => {
    if (!nearService) {
      return
    }
    tokenIdList.forEach((tokenId) => {
      const isTokenExist = tokenMetadataList.find((t) => t.id === tokenId) !== undefined
      if (isTokenExist) {
        return
      }
      if (tokenId === 'NEAR') {
        setTokenMetadataList((oldTokenMetadataList) => {
          return [...oldTokenMetadataList, nearMetaData]
        })
        return
      }
      FungibleTokenUtils.ftMetadata(
        nearService.wallet.account(),
        tokenId,
        {}
      )
        .then((fungibleTokenMetadata) => {
          const tokenMetadata: TokenMetadata = {
            ...fungibleTokenMetadata,
            id: tokenId
          }
          setTokenMetadataList((oldTokenMetadataList) => {
            return [...oldTokenMetadataList, tokenMetadata]
          })
        })
        .catch((err) => {
          console.warn('fetch token metadata error, token id: ' + tokenId + ', error: ' + err)
        })
    })
  }, [nearService]) // eslint-disable-line react-hooks/exhaustive-deps

  return {tokenMetadataList}
}