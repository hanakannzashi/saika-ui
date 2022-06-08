import React, {useEffect, useMemo, useState} from "react";
import {Avatar, Text, Button, VStack, Flex, useToast, Center, Image, Box, Tooltip} from "@chakra-ui/react";
import {useNearServiceStore, useWalletSignedInStore} from "../stores/global-stores";
import {TokenMetadata} from "../types/near-types";
import {DEFAULT_TOKEN_ICON, getMaxViewFracDigits, nearMetaData} from "../config/token-config";
import {KeyPairEd25519} from "near-api-js/lib/utils";
import {formatAmount, parseYoctoAmount} from "../utils/amount-utils";
import {NETWORK_ID, TOKEN_REGISTERED_FLAG_PREFIX} from "../config/common-config";
import {Near} from "near-api-js";
import {RedPacketContract} from "../near/red-packet-contract";
import {getRedPacketContractConfig} from "../config/contract-config";
import {tGas} from "../utils/custom-utils";
import {keyStores} from "near-api-js";
import {getNearConfig} from "../config/near-config";
import {FungibleTokenUtils} from "../utils/fungible-token-utils";
import {useRedPacketViews} from "../hooks/useRedPacketViews";
import {useRedPacketView} from "../hooks/useRedPacketView";
import {LocalStorageUtils} from "../utils/local-storage-utils";
import {StorageBalance} from "../types/storage-management";
import redPacketCover from "../assets/redpacket-cover.svg";


const nearConfig = getNearConfig()
const {contractId ,methods} = getRedPacketContractConfig()

interface ClaimProps {
  tokenIdList: string[],
  ownerId: string,
  privateKey: string,
  publicKey: string
}

export const Claim: React.FC<ClaimProps> = (
  {
    tokenIdList,
    ownerId,
    privateKey,
    publicKey
  }
) => {
  const {isSignedIn} = useWalletSignedInStore()
  const {nearService} = useNearServiceStore()

  const [isRegisterTokenButtonLoading, setIsRegisterTokenButtonLoading] = useState<boolean>(false)
  const [isClaimButtonLoading, setIsClaimButtonLoading] = useState<boolean>(false)
  const [isTokenRegistered, setIsTokenRegistered] = useState<boolean>(false)
  const {view, onReflush} = useRedPacketView(publicKey)

  const [token, setToken] = useState<TokenMetadata | null>(null)

  const claimedAmount: string = useMemo(() => {
    if (!nearService || !isSignedIn || !view) {
      return '0'
    }
    const amount = view.claimers[nearService.wallet.account().accountId]
    if (amount) {
      return amount
    } else {
      return '0'
    }
  }, [nearService, isSignedIn ,view])

  const isAlreadyClaimed: boolean = useMemo(() => {
    return claimedAmount !== '0'
  }, [claimedAmount])

  const allowAutoClaim = useMemo(() => {
    if (!view) {
      return false
    }
    return nearService &&
      token &&
      isSignedIn &&
      !isAlreadyClaimed &&
      !view.is_run_out &&
      isTokenRegistered
  }, [nearService, isSignedIn, isTokenRegistered, token, isAlreadyClaimed, view])

  useEffect(() => {
    if (!nearService || !view) {
      return
    }
    if (!view.token_id) {
      setToken(nearMetaData)
      return
    }
    const isSupportedToken = tokenIdList.find((i) => i === view.token_id) !==undefined
    if (!isSupportedToken) {
      return
    }

    FungibleTokenUtils.ftMetadata(
      nearService.wallet.account(),
      view.token_id,
      {}
    )
      .then((fungibleTokenMetadata) => {
        const token: TokenMetadata = {
          ...fungibleTokenMetadata,
          id: view.token_id!
        }
        setToken(token)
      })
      .catch((err) => {
        console.error('fetch fungible token error, token id: ' + view.token_id + ', error: ' + err)
      })
  }, [nearService, view])

  useEffect(() => {
    if (!nearService || !isSignedIn || !view) {
      return
    }
    if (view.token_id === null) {
      setIsTokenRegistered(true)
      return
    }
    const key = TOKEN_REGISTERED_FLAG_PREFIX + view.token_id + nearService.wallet.getAccountId()
    const localFlag = LocalStorageUtils.getValue<StorageBalance>(key) !== null
    if (localFlag) {
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
        } else {
          console.log('account ' + nearService.wallet.getAccountId() + ' doesn\'t register token: ' + view.token_id)
        }
      })
      .catch((err) => {
        console.error('fetch storage balance error: ' + err)
      })
  }, [nearService, isSignedIn, view])

  useEffect(() => {
    if (!allowAutoClaim) {
      return
    }
    onClaimRedPacket()
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
      contractId,
      methods
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

  const onClaimRedPacket = () => {
    setIsClaimButtonLoading(true)
    claimRedPacket(ownerId, privateKey)
      .then((claimedAmount) => {
        console.log('claim token id: ' + (view?.token_id ?? 'NEAR') + ', amount: ' + formatAmount(claimedAmount, token!.decimals, getMaxViewFracDigits(token!.id)))
        setIsClaimButtonLoading(false)
        onReflush()
      })
      .catch((err) => {
        setIsClaimButtonLoading(false)
        onReflush()
        console.error('claim error: ' + err)
      })
  }

  const onRegisterFungibleToken = async () => {
    setIsRegisterTokenButtonLoading(true)
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
    token ?
      <VStack gap={2} paddingBottom={5}>
        {
          view?.split_mod === 'Average' ?
            <Box
              paddingBottom={2}
              width={130}
              borderTopRadius={5}
              borderBottomRadius={5}
              backgroundColor={'#e3514c'}
            >
              <Center>
                <Image src={redPacketCover} width={20}/>
              </Center>
              <Flex gap={2} justify={'center'} marginTop={2}>
                <Tooltip label={token.symbol}>
                  <Avatar src={token.icon ?? DEFAULT_TOKEN_ICON} size={'md'}/>
                </Tooltip>
              </Flex>
              <Center marginTop={2} fontWeight={'bold'} color={'#EEC88C'}>
                Average
              </Center>
              <Center fontWeight={'bold'} fontSize={'sm'} color={'#EEC88C'}>
                Red Packet
              </Center>
            </Box>
            :
            <Box
              paddingBottom={2}
              width={130}
              borderTopRadius={5}
              borderBottomRadius={5}
              backgroundColor={'#1cbbb4'}
            >
              <Center>
                <Image src={redPacketCover} width={20}/>
              </Center>
              <Flex gap={2} justify={'center'} marginTop={2}>
                <Tooltip label={token.symbol}>
                  <Avatar src={token.icon ?? DEFAULT_TOKEN_ICON} size={'md'}/>
                </Tooltip>
              </Flex>
              <Center marginTop={2} fontWeight={'bold'} color={'#EEC88C'}>
                Rondom
              </Center>
              <Center fontWeight={'bold'} fontSize={'sm'} color={'#EEC88C'}>
                Red Packet
              </Center>
            </Box>
        }
        {
          isSignedIn ?
            isAlreadyClaimed ?
              <Flex alignItems={'center'} gap={1}>
                <Text fontWeight={'bold'} fontSize={'lg'}>
                  Claimed: {
                    formatAmount(
                      claimedAmount,
                      token.decimals,
                      getMaxViewFracDigits(token.id)
                    )
                  }
                </Text>
                <Avatar src={token.icon} size={'2xs'}/>
              </Flex>
              :
              view?.is_run_out ?
                <VStack>
                  <Text fontWeight={'bold'} fontSize={'lg'}> Empty Red Packet </Text>
                  <Text> Seems a little late 😅 </Text>
                </VStack>
                :
                isTokenRegistered ?
                  <Button
                    fontWeight={'bold'}
                    isLoading={isClaimButtonLoading}
                    loadingText={'Claiming'}
                    onClick={onClaimRedPacket}
                    backgroundColor={view?.split_mod === 'Average' ? '#e3514c' : '#1cbbb4'}
                    color={'white'}
                    fontSize={'sm'}
                    borderRadius={20}
                    size={'sm'}
                  >
                    Claim
                  </Button>
                  :
                  <VStack>
                    <Button
                      fontWeight={'bold'}
                      isLoading={isRegisterTokenButtonLoading}
                      loadingText={'Connecting Wallet'}
                      onClick={onRegisterFungibleToken}
                      backgroundColor={view?.split_mod === 'Average' ? '#e3514c' : '#1cbbb4'}
                      color={'white'}
                      fontSize={'xs'}
                      borderRadius={20}
                    >
                      Register and Claim
                    </Button>
                    <Text fontSize={'xs'}> You didn't register {token.symbol}. </Text>
                  </VStack>
            :
            <Text fontWeight={'bold'} fontSize={'xs'}> Sign in and claim Red Packet! </Text>
        }
      </VStack>
      :
      <VStack>
        <Flex gap={2} alignItems={'center'}>
          <Avatar src={DEFAULT_TOKEN_ICON} size={'sm'}/>
          <Text fontSize={'large'} fontWeight={'bold'}> {'Unsupported Token'} </Text>
        </Flex>
        <VStack paddingBottom={10}>
          <Text fontWeight={'bold'}> {view?.token} </Text>
          <Text fontWeight={'bold'}> {view?.token_id} </Text>
        </VStack>
      </VStack>
  )
}