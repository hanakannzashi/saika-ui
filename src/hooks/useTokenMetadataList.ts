import {useEffect, useState} from "react";
import {TokenMetadata} from "../types/near-types";
import {FungibleTokenUtils} from "../utils/fungible-token-utils";
import {useNearServiceStore} from "../stores/global-stores";
import {nearMetaData} from "../config/token-config";
import {FungibleTokenMetadata} from "../near/fungible-token-contract";


export const useTokenMetadataList = (tokenIdList: string[]) => {
  const {nearService} = useNearServiceStore()
  const [tokenMetadataList, setTokenMetadataList] = useState<TokenMetadata[]>([])

  useEffect(() => {
    if (!nearService) {
      return
    }
    const promises = tokenIdList.map((tokenId) => {
      if (tokenId === 'NEAR') {
        return new Promise<TokenMetadata>((resolve) => {
          resolve(nearMetaData)
        })
      }
      return FungibleTokenUtils.ftMetadata(
        nearService.wallet.account(),
        tokenId,
        {}
      )
    })
    Promise.all<TokenMetadata | FungibleTokenMetadata>(promises)
      .then((results) => {
        const tokenMetadataList: TokenMetadata[] = results.map((result, index) => {
          return {
            ...result,
            id: tokenIdList[index]
          }
        })
        setTokenMetadataList(tokenMetadataList)
      })
  }, [nearService, tokenIdList])

  return {tokenMetadataList}
}