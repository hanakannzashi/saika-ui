import React, {useEffect, useMemo, useState} from "react";
import {Avatar, Text, Button, VStack, Flex, Center, Image, Box, Tooltip} from "@chakra-ui/react";
import {useNearServiceStore, useWalletSignedInStore} from "../stores/global-stores";
import {TokenMetadata} from "../types/near-types";
import {
  customTokenIconMapping,
  DEFAULT_MAX_VIEW_FRAC_DIGITS,
  DEFAULT_TOKEN_ICON,
  maxViewFracDigitsMapping,
  nearMetaData, tokenIdList
} from "../config/token-config";
import {KeyPairEd25519} from "near-api-js/lib/utils";
import {formatAmount, parseYoctoAmount} from "../utils/amount-utils";
import {NETWORK_ID, TOKEN_REGISTERED_FLAG_PREFIX} from "../config/common-config";
import {Near} from "near-api-js";
import {RedPacketContract} from "../near/red-packet-contract";
import {redPacketContractConfig} from "../config/contract-config";
import {tGas} from "../utils/custom-utils";
import {keyStores} from "near-api-js";
import {nearConfig} from "../config/near-config";
import {FungibleTokenUtils} from "../utils/fungible-token-utils";
import {useRedPacketView} from "../hooks/useRedPacketView";
import {LocalStorageUtils} from "../utils/local-storage-utils";
import {StorageBalance} from "../types/storage-management";
import redPacketCover from "../assets/redpacket-cover.svg";
import BN from "bn.js";


interface ClaimRedPacketProps {
  ownerId?: string,
  privateKey?: string,
  publicKey?: string
}

export const ClaimRedPacket: React.FC<ClaimRedPacketProps> = (
  {
    ownerId,
    privateKey,
    publicKey
  }
) => {
  const {nearService} = useNearServiceStore()
  const {isSignedIn} = useWalletSignedInStore()

  const [isTokenRegistered, setIsTokenRegistered] = useState<boolean>(false)
  const {view, onRefresh} = useRedPacketView(publicKey)
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata | null>(null)

  const [isClaimOrRegisterButtonLoading, setIsClaimOrRegisterButtonLoading] = useState<boolean>(false)

  const isUnSupportedToken = useMemo(() => {
    if (!nearService || !view) {
      return true
    }
    const tokenId = view?.token_id ?? 'NEAR'
    return tokenIdList.find((i) => i === tokenId) === undefined
  }, [nearService, view])

  const claimedAmount: string = useMemo(() => {
    if (!nearService || !isSignedIn || !view) {
      return '0'
    }
    const amount = view.claimers[nearService.wallet.account().accountId]
    if (amount) {
      return amount
    }
    return '0'
  }, [nearService, isSignedIn ,view])

  const isAlreadyClaimed: boolean = useMemo(() => {
    return claimedAmount !== '0'
  }, [claimedAmount])

  const allowAutoClaim = useMemo(() => {
    if (!nearService || !view) {
      return false
    }
    return (
      !isUnSupportedToken &&
      tokenMetadata &&
      isSignedIn &&
      !isAlreadyClaimed &&
      !view.is_run_out &&
      isTokenRegistered
    )
  }, [isAlreadyClaimed, isSignedIn, isTokenRegistered, isUnSupportedToken, nearService, tokenMetadata, view])

  useEffect(() => {
    if (!nearService || !view) {
      return
    }
    if (!view.token_id) {
      setTokenMetadata(nearMetaData)
      return
    }

    FungibleTokenUtils.ftMetadata(
      nearService.wallet.account(),
      view.token_id,
      {}
    )
      .then((fungibleTokenMetadata) => {
        setTokenMetadata({
          ...fungibleTokenMetadata,
          id: view.token_id!
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }, [nearService, view])

  useEffect(() => {
    if (!nearService || !isSignedIn || !view) {
      return
    }
    if (!view.token_id) {
      setIsTokenRegistered(true)
      return
    }
    const key = TOKEN_REGISTERED_FLAG_PREFIX + view.token_id + nearService.wallet.getAccountId()
    const available = LocalStorageUtils.getValue<StorageBalance>(key)?.available
    if (available && new BN(available).gtn(0)) {
      setIsTokenRegistered(true)
      return
    }

    FungibleTokenUtils.storageBalanceOf(
      nearService.wallet.account(),
      view.token_id,
      {
        account_id: nearService.wallet.getAccountId()
      }
    )
      .then((storageBalance) => {
        if (storageBalance) {
          LocalStorageUtils.setValue(key, storageBalance)
          setIsTokenRegistered(true)
          return
        }
        console.log(`account ${nearService.wallet.getAccountId()} doesn't register token ${view.token_id}`)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [nearService, isSignedIn, view])

  useEffect(() => {
    if (!allowAutoClaim) {
      return
    }
    handleClaimRedPacket()
  }, [allowAutoClaim]) // eslint-disable-line react-hooks/exhaustive-deps

  const claimRedPacket = async (ownerId: string, privateKey: string): Promise<string> => {
    const claimer = nearService!.wallet.account()
    const keyPair = KeyPairEd25519.fromString(privateKey)
    const keyStore = new keyStores.InMemoryKeyStore()
    await keyStore.setKey(NETWORK_ID, ownerId, keyPair)
    const near = new Near({...nearConfig, keyStore})
    const owner = await near.account(ownerId)

    return new RedPacketContract(
      owner,
      redPacketContractConfig.contractId,
      redPacketContractConfig.methods
    )
      .claim_red_packet(
        {
          args: {
            claimer_id: claimer.accountId
          },
          gas: tGas(50)
        }
      )
  }

  const handleClaimRedPacket = () => {
    setIsClaimOrRegisterButtonLoading(true)
    claimRedPacket(ownerId!, privateKey!)
      .then((_claimedAmount) => {
        setIsClaimOrRegisterButtonLoading(false)
        onRefresh()
      })
      .catch((err) => {
        setIsClaimOrRegisterButtonLoading(false)
        onRefresh()
        console.error(err)
      })
  }

  const handleRegisterFungibleToken = async () => {
    setIsClaimOrRegisterButtonLoading(true)
    return FungibleTokenUtils.storageDeposit(
      nearService!.wallet.account(),
      view!.token_id!,
      {
        args: {},
        amount: parseYoctoAmount('0.0125')
      }
    )
  }

  return (
    <Box>
      {
        view ?
          isUnSupportedToken ?
            <VStack>
              <Flex gap={2} alignItems={'center'}>
                <Avatar src={DEFAULT_TOKEN_ICON} size={'sm'}/>
                <Text fontSize={'large'} fontWeight={'bold'}> {'Unsupported Token'} </Text>
              </Flex>
              <VStack>
                <Text fontWeight={'bold'}> {view.token} </Text>
                <Text fontWeight={'bold'}> {view.token_id} </Text>
              </VStack>
            </VStack> :
            tokenMetadata ?
              <VStack spacing={6}>
                <Box>
                  <Center>
                    From
                  </Center>
                  <Text fontWeight={'bold'} wordBreak={'break-word'}>
                    {
                      view.owner_id
                    }
                  </Text>
                </Box>
                <Box
                  paddingBottom={2}
                  width={130}
                  borderRadius={5}
                  backgroundColor={view.split_mod === 'Average' ? '#e3514c' : '#1cbbb4'}
                >
                  <Center>
                    <Image src={redPacketCover} width={20}/>
                  </Center>
                  <Flex gap={2} justify={'center'} marginTop={2}>
                    <Tooltip label={tokenMetadata.symbol}>
                      <Avatar src={customTokenIconMapping[tokenMetadata.id] ?? tokenMetadata.icon ?? DEFAULT_TOKEN_ICON} size={'md'}/>
                    </Tooltip>
                  </Flex>
                  <Center marginTop={2} fontWeight={'bold'} color={'#EEC88C'}>
                    Average
                  </Center>
                  <Center fontWeight={'bold'} fontSize={'sm'} color={'#EEC88C'}>
                    Red Packet
                  </Center>
                </Box>
                <Box>
                  {
                    isAlreadyClaimed ?
                      <Flex alignItems={'center'} gap={1}>
                        🎉 &nbsp;
                        <Text>
                          {
                            'CLAIMED: ' +
                            formatAmount(
                              claimedAmount,
                              tokenMetadata.decimals,
                              maxViewFracDigitsMapping[tokenMetadata.id] ?? DEFAULT_MAX_VIEW_FRAC_DIGITS
                            )
                          }
                        </Text>
                        <Avatar
                          src={customTokenIconMapping[tokenMetadata.id] ?? tokenMetadata.icon ?? DEFAULT_TOKEN_ICON}
                          size={'2xs'}
                        />
                        &nbsp; 🎉
                      </Flex> :
                      view.is_run_out ?
                        <VStack>
                          <Text fontWeight={'bold'} fontSize={'lg'}> Empty Red Packet </Text>
                          <Text> Seems a little late 😅 </Text>
                        </VStack> :
                        <Button
                          minWidth={100}
                          fontWeight={'bold'}
                          isLoading={isClaimOrRegisterButtonLoading}
                          disabled={!isSignedIn || isClaimOrRegisterButtonLoading}
                          color={'white'}
                          size={'sm'}
                          backgroundColor={view.split_mod === 'Average' ? '#e3514c' : '#1cbbb4'}
                          loadingText={isTokenRegistered ? 'Claiming' : 'Connecting Wallet'}
                          onClick={isTokenRegistered ? handleClaimRedPacket : handleRegisterFungibleToken}
                        >
                          {
                            isSignedIn ?
                              isTokenRegistered ?
                                'Claim' :
                                'Register token and claim' :
                              'Please sign in'
                          }
                        </Button>
                  }
                </Box>
              </VStack> :
              null :
          null
      }
    </Box>
  )
}
