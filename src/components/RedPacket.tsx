import React, {useEffect, useMemo, useRef, useState} from "react";
import {
  Box, Button, Center, Flex,
  FormControl, FormHelperText,
  FormLabel,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField, Spacer,
  Stack, Text
} from "@chakra-ui/react";
import {Amount, RedPacketType, TokenMetadata, YoctoAmount} from "../types/near-types";
import {RedPacketTypeSelector} from "./RedPacketTypeSelector";
import {TokenSelector} from "./TokenSelector";
import {formatAmount, formatYoctoAmount, ONE_YOCTO, parseAmount, parseYoctoAmount} from "../utils/amount-utils";
import {useTokenMetadataList} from "../hooks/useTokenMetadataList";
import {
  DEFAULT_MAX_VIEW_FRAC_DIGITS,
  maxViewFracDigitsMapping,
  nearMetaData, tokenIdList
} from "../config/token-config";
import {isZeroNumUnstandard, parsePosOrZeroIntNum, parsePosOrZeroNumUnstandard} from "../utils/common-utils";
import {
  MAX_RED_PACKET_NUM,
  RED_PACKET_CONTRACT_REGISTERED_FLAG_PREFIX,
  BASE_RED_PACKET_CONTRACT_STORAGE_DEPOSIT,
  RED_PACKET_PK_PREFIX
} from "../config/common-config";
import {KeyPairEd25519} from "near-api-js/lib/utils";
import {LocalStorageUtils} from "../utils/local-storage-utils";
import {useNearServiceStore, useWalletSignedInStore} from "../stores/global-stores";
import {redPacketContractConfig} from "../config/contract-config";
import {FungibleTokenUtils} from "../utils/fungible-token-utils";
import {tGas} from "../utils/custom-utils";
import {StorageBalance} from "../types/storage-management";
import BN from "bn.js";


export const RedPacket: React.FC = () => {
  const {nearService} = useNearServiceStore()
  const {isSignedIn} = useWalletSignedInStore()

  const {tokenMetadataList} = useTokenMetadataList(tokenIdList)
  const [tokenBalance, setTokenBalance] = useState<string | null>(null)

  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>(nearMetaData)
  const [tokenAmount, setTokenAmount] = useState<string>('')
  const [redPacketType, setRedPacketType] = useState<RedPacketType>('Average')
  const [redPacketNum, setRedPacketNum] = useState<string>('')

  const [isRedPacketContractRegistered, setIsRedPacketContractRegistered] = useState<boolean>(false)
  const [isPutMoneyOrRegisterButtonLoading, setIsPutMoneyOrRegisterButtonLoading] = useState<boolean>(false)

  const tokenSelectorFinalFocusRef = useRef<HTMLInputElement>(null)
  const redPacketTypeSelectorFinalFocusRef = useRef<HTMLInputElement>(null)

  const isPutMoneyButtonDisabled: boolean = useMemo(() => {
    return tokenAmount === '' ||
      isZeroNumUnstandard(tokenAmount) ||
      redPacketNum === '' ||
      redPacketNum === '0'
  }, [redPacketNum, tokenAmount])

  const currentTypeColor: string = useMemo(() => {
    if (redPacketType === 'Average') {
      return '#e3514c'
    } else {
      return '#1cbbb4'
    }
  }, [redPacketType])

  useEffect(() => {
    if (!nearService || !isSignedIn) {
      return
    }
    const key = RED_PACKET_CONTRACT_REGISTERED_FLAG_PREFIX + nearService.wallet.getAccountId()
    const storageBalance = LocalStorageUtils.getValue<StorageBalance>(key)
    if (storageBalance) {
      setIsRedPacketContractRegistered(true)
      return
    }
    nearService.redPacketContract.storage_balance_of(
      {account_id: nearService.wallet.getAccountId()}
    )
      .then((storageBalance) => {
        if (storageBalance) {
          LocalStorageUtils.setValue(key, storageBalance)
          setIsRedPacketContractRegistered(true)
          return
        }
        console.log(`account ${nearService.wallet.getAccountId()} doesn't register red packet contract`)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [nearService ,isSignedIn])

  useEffect(() => {
    if (!nearService || !isSignedIn) {
      return
    }
    if (tokenMetadata.id === 'NEAR') {
      nearService.wallet.account().getAccountBalance()
        .then((accountBalance) => {
          setTokenBalance(accountBalance.available)
        })
      return
    }
    FungibleTokenUtils.ftBalanceOf(
      nearService.wallet.account(),
      tokenMetadata.id,
      {
        account_id: nearService.wallet.getAccountId()
      }
    )
      .then((tokenBalance) => {
        setTokenBalance(tokenBalance)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [nearService, isSignedIn, tokenMetadata.id])

  const createNearRedPacket = async (
    publicKey: string,
    split: number,
    splitMod: string,
    amount: YoctoAmount,
    msg?: string,
    whiteList?: string[],
  ): Promise<void> => {
    return nearService!.redPacketContract.create_near_red_packet({
      args: {
        public_key: publicKey,
        split: split,
        split_mod: splitMod,
        msg: msg,
        white_list: whiteList,
      },
      amount: amount,
      gas: tGas(50)
    })
  }

  const createFungibleTokenRedPacket = async (
    tokenId: string,
    receiver_id: string,
    publicKey: string,
    split: number,
    splitMod: string,
    amount: Amount,
    msg?: string,
    whiteList?: string[]
  ): Promise<string> => {
    return FungibleTokenUtils.ftTransferCall(
      nearService!.wallet.account(),
      tokenId,
      {
        args:{
          receiver_id,
          amount,
          msg: JSON.stringify(
            {
              public_key: publicKey,
              split: split,
              split_mod: splitMod,
              msg: msg,
              white_list: whiteList,
            }
          )
        },
        amount: ONE_YOCTO,
        gas: tGas(50)
      }
    )
  }

  const handleSaveTokenMetadata = (tokenMetadata: TokenMetadata) => {
    setTokenMetadata(tokenMetadata)
  }

  const handleSaveTokenAmount = (tokenAmount: string) => {
    if (!tokenAmount) {
      setTokenAmount(tokenAmount)
      return
    }
    tokenAmount = parsePosOrZeroNumUnstandard(tokenAmount)
    if (!tokenBalance) {
      setTokenAmount(tokenAmount)
      return
    }
    let tokenAmountNum = Number(tokenAmount)
    let tokenBalanceNum = Number(formatAmount(tokenBalance,
        tokenMetadata.decimals,
        maxViewFracDigitsMapping[tokenMetadata.id] ?? DEFAULT_MAX_VIEW_FRAC_DIGITS
    ))
    let limitAmount = tokenMetadata.id === 'NEAR' ? tokenBalanceNum - 1 : tokenBalanceNum
    limitAmount = limitAmount > 0 ? limitAmount : 0
    if (tokenAmountNum > limitAmount) {
      tokenAmount = limitAmount.toString()
    }
    setTokenAmount(tokenAmount)
  }

  const handleSaveRedPacketType = (redPacketType: RedPacketType) => {
    setRedPacketType(redPacketType)
  }

  const handleSaveRedPacketNum = (redPacketNum: string) => {
    if (redPacketNum !== '') {
      redPacketNum = parsePosOrZeroIntNum(redPacketNum)
        if (parseInt(redPacketNum) > MAX_RED_PACKET_NUM) {
          redPacketNum = MAX_RED_PACKET_NUM.toString()
        }
    }
    setRedPacketNum(redPacketNum)
  }

   const handleRegisterRedPacketContract = async () => {
    setIsPutMoneyOrRegisterButtonLoading(true)
    await nearService!.redPacketContract.storage_deposit({
      args: {},
      amount: BASE_RED_PACKET_CONTRACT_STORAGE_DEPOSIT
    })
  }

  const handlePutMoney = async (): Promise<any> => {
    setIsPutMoneyOrRegisterButtonLoading(true)
    const keyPair = KeyPairEd25519.fromRandom()
    const publicKey = keyPair.getPublicKey().toString()
    const privateKey = keyPair.secretKey
    LocalStorageUtils.setValue(RED_PACKET_PK_PREFIX + publicKey, privateKey)

    if(tokenMetadata.id === 'NEAR') {
      await createNearRedPacket(
        publicKey,
        parseInt(redPacketNum),
        redPacketType,
        parseYoctoAmount(tokenAmount),
      )
    } else {
      await createFungibleTokenRedPacket(
        tokenMetadata.id,
        redPacketContractConfig.contractId,
        publicKey,
        parseInt(redPacketNum),
        redPacketType,
        parseAmount(tokenAmount, tokenMetadata.decimals)
      )
    }
  }

  return (
    <Box>
      <Center fontWeight={'bold'} marginBottom={7}>
        🎉 Create Red Packet and share with your friends 🎉
      </Center>
      <Stack spacing={5} marginInline={10}>
        <FormControl isDisabled={!isSignedIn || !isRedPacketContractRegistered}>
          <NumberInput value={redPacketNum} onChange={handleSaveRedPacketNum}>
            <InputGroup>
              <NumberInputField
                placeholder={'Red Packet Number'}
                _placeholderShown={{fontSize: 'sm'}}
                shadow={'base'}
                ref={redPacketTypeSelectorFinalFocusRef}
              />
              <InputRightElement width={'auto'} marginRight={1}>
                <RedPacketTypeSelector
                  redPacketType={redPacketType}
                  onChange={handleSaveRedPacketType}
                  finalFocusRef={redPacketTypeSelectorFinalFocusRef}
                />
              </InputRightElement>
            </InputGroup>
          </NumberInput>
          <Flex>
            <Spacer/>
            <FormHelperText fontSize={'xs'}>
              {"Max: " + MAX_RED_PACKET_NUM}
            </FormHelperText>
          </Flex>
        </FormControl>
        <FormControl isDisabled={!isSignedIn || !isRedPacketContractRegistered}>
          <NumberInput value={tokenAmount} onChange={handleSaveTokenAmount}>
            <InputGroup>
              <NumberInputField
                placeholder={'Total Amount'}
                _placeholderShown={{fontSize: 'sm'}}
                shadow={'base'}
                ref={tokenSelectorFinalFocusRef}
              />
              <InputRightElement width={'auto'} marginRight={1}>
                <TokenSelector
                  tokenMetadataList={tokenMetadataList}
                  tokenMetadata={tokenMetadata}
                  onChange={handleSaveTokenMetadata}
                  finalFocusRef={tokenSelectorFinalFocusRef}
                />
              </InputRightElement>
            </InputGroup>
          </NumberInput>
          <Flex>
            <Spacer/>
            {
              isSignedIn ?
                <FormHelperText fontSize={'xs'}>
                  {'Balance: '}
                  {
                    tokenBalance ?
                      formatAmount(
                        tokenBalance,
                        tokenMetadata.decimals,
                        maxViewFracDigitsMapping[tokenMetadata.id] ?? DEFAULT_MAX_VIEW_FRAC_DIGITS
                      ) :
                      'Not Available'
                  }
                </FormHelperText> :
                <FormHelperText fontSize={'xs'}>
                  Sign in to check balance
                </FormHelperText>
            }
          </Flex>
        </FormControl>
      </Stack>
      <Box marginBlock={5}>
        <Center>
          <Button
            isLoading={isPutMoneyOrRegisterButtonLoading}
            loadingText={'Connecting Wallet'}
            isDisabled={!isSignedIn ? true : isRedPacketContractRegistered ? isPutMoneyButtonDisabled : false}
            borderRadius={10}
            color={'white'}
            fontSize={'sm'}
            backgroundColor={currentTypeColor}
            minWidth={200}
            onClick={isRedPacketContractRegistered ? handlePutMoney : handleRegisterRedPacketContract}
          >
            {
              !isSignedIn ?
                'Please sign in' :
                isRedPacketContractRegistered ?
                  'Put Money' :
                  <Flex alignItems={'center'} gap={1}>
                    {'Register with ' + formatYoctoAmount(BASE_RED_PACKET_CONTRACT_STORAGE_DEPOSIT)}
                    <Text fontSize={'large'}>
                      Ⓝ
                    </Text>
                  </Flex>
            }
          </Button>
        </Center>
        <Box marginTop={2} display={!isSignedIn || isRedPacketContractRegistered ? 'none' : undefined}>
          <Center>
            👆
          </Center>
          <Flex fontSize={'xs'} alignItems={'center'} justify={'center'} gap={1}>
            By first use, you should pay {formatYoctoAmount(BASE_RED_PACKET_CONTRACT_STORAGE_DEPOSIT)}
            <Text fontSize={'large'}>
              Ⓝ
            </Text>
            to cover storage
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}