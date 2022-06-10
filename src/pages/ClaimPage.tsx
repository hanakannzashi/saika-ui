import {ClaimRedPacket} from "../components/Claim";
import React, {useMemo} from "react";
import {useParams} from "react-router-dom";
import {fromBase64} from "js-base64";
import {KeyPair} from "near-api-js";
import {Flex, Text, VStack} from "@chakra-ui/react";


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
    <VStack minHeight={600} justify={'center'}>
      <Flex
        borderRadius={20}
        padding={10}
        minWidth={300}
        maxWidth={300}
        backgroundColor={'whiteAlpha.700'}
        shadow={'base'}
        justify={'center'}
      >
        {
          claimParams ?
            <ClaimRedPacket
              ownerId={claimParams.ownerId}
              privateKey={claimParams.privateKey}
              publicKey={claimParams.publicKey}
            /> :
            <Text fontWeight={'bold'} fontSize={'lg'}>
              ⚠️ Invalid Red Packet Link
            </Text>
        }
      </Flex>
    </VStack>
  )
}