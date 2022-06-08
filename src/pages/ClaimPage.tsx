import {Claim} from "../components/Claim";
import React, {useMemo} from "react";
import {useNearServiceStore} from "../stores/global-stores";
import {useParams} from "react-router-dom";
import {fromBase64} from "js-base64";
import {KeyPair} from "near-api-js";
import {getTokenIdList} from "../config/token-config";
import {Box ,VStack} from "@chakra-ui/react";


const tokenIdList = getTokenIdList()

export interface ClaimParams {
  ownerId: string,
  privateKey: string,
  publicKey: string
}

export const ClaimPage: React.FC = () => {
  const {base64Params} = useParams<string>()

  const claimParams: ClaimParams | null = useMemo(() => {
    if (!base64Params) {
      return null
    }
    try {
      const {owner_id, private_key} = JSON.parse(fromBase64(base64Params))
      return {
        ownerId: owner_id,
        privateKey: private_key,
        publicKey: KeyPair.fromString(private_key).getPublicKey().toString()
      }
    } catch (err) {
      console.log(err)
      return null
    }
  }, [base64Params])

  return (
    <VStack gap={4}>
      <Box
        minWidth={250}
        borderRadius={20}
        paddingTop={10}
        marginTop={20}
        backgroundColor={'whiteAlpha.800'}
        shadow={'base'}
      >
        <Claim
          tokenIdList={tokenIdList}
          ownerId={claimParams!.ownerId}
          privateKey={claimParams!.privateKey}
          publicKey={claimParams!.publicKey}
        />
      </Box>
    </VStack>
  )
}