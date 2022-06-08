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
import {getMaxViewFracDigits, getTokenIdList, nearMetaData} from "../config/token-config";
import {isZeroNumUnstandard, parsePosOrZeroIntNum, parsePosOrZeroNumUnstandard} from "../utils/common-utils";
import {
  MAX_RED_PACKET_NUM,
  RED_PACKET_CONTRACT_REGISTERED_FLAG_PREFIX,
  RED_PACKET_CONTRACT_STORAGE_DEPOSIT,
  RED_PACKET_PK_PREFIX
} from "../config/common-config";
import {KeyPairEd25519} from "near-api-js/lib/utils";
import {LocalStorageUtils} from "../utils/local-storage-utils";
import {useNearServiceStore, useWalletSignedInStore} from "../stores/global-stores";
import {getRedPacketContractConfig} from "../config/contract-config";
import {FungibleTokenUtils} from "../utils/fungible-token-utils";
import {tGas} from "../utils/custom-utils";
import {StorageBalance} from "../types/storage-management";


const tokenIdList = getTokenIdList()
const redPacketContractConfig = getRedPacketContractConfig()


export const RedPacket: React.FC = () => {
  const {nearService} = useNearServiceStore()
  const {isSignedIn} = useWalletSignedInStore()

  const {tokenMetadataList} = useTokenMetadataList(tokenIdList)

  const [tokenBalance, setTokenBalance] = useState<string | null>(null)
  const [token, setToken] = useState<TokenMetadata>(nearMetaData)
  const [tokenAmount, setTokenAmount] = useState<string>('0')
  const [redPacketType, setRedPacketType] = useState<RedPacketType>('Average')
  const [redPacketNum, setRedPacketNum] = useState<string>('0')

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
    const localFlag = LocalStorageUtils.getValue<StorageBalance>(key) !== null
    if (localFlag) {
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
        } else {
          console.log('account ' + nearService.wallet.getAccountId() + ' doesn\'t register red packet contract')
        }
      })
      .catch((err) => {
        console.error('fetch storage balance error: ' + err)
      })
  }, [nearService ,isSignedIn])

  useEffect(() => {
    if (!nearService || !isSignedIn) {
      return
    }
    if (token.id === 'NEAR') {
      nearService.wallet.account().getAccountBalance()
        .then((accountBalance) => {
          setTokenBalance(accountBalance.available)
        })
      return
    }
    FungibleTokenUtils.ftBalanceOf(
      nearService.wallet.account(),
      token.id,
      {
        account_id: nearService.wallet.getAccountId()
      }
    )
      .then((tokenBalance) => {
        setTokenBalance(tokenBalance)
      })
      .catch((err) => {
        console.error('get token balance error, token id: ' + token.id + ', error: ' + err)
      })
  }, [nearService, isSignedIn, token.id])

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

  const onTokenSelect = (token: TokenMetadata) => {
    setToken(token)
  }

  const onTokenAmountChange = (tokenAmount: string) => {
    if (tokenAmount !== '') {
      tokenAmount = parsePosOrZeroNumUnstandard(tokenAmount)
      if (tokenBalance) {
        let amount = Number(tokenAmount)
        let balacne = Number(formatAmount(tokenBalance, token.decimals, getMaxViewFracDigits(token.id)))
        let limitAmount;
        if (token.id === 'NEAR') {
          limitAmount = balacne - 1
        } else {
          limitAmount = balacne
        }
        limitAmount = limitAmount > 0 ? limitAmount : 0
        if (amount > limitAmount) {
          tokenAmount = limitAmount.toString()
        }
      }
    }
    setTokenAmount(tokenAmount)
  }

  const onRedPacketTypeSelect = (redPacketType: RedPacketType) => {
    setRedPacketType(redPacketType)
  }

  const onRedPacketNumChange = (redPacketNum: string) => {
    if (redPacketNum !== '') {
      redPacketNum = parsePosOrZeroIntNum(redPacketNum)
        if (parseInt(redPacketNum) > MAX_RED_PACKET_NUM) {
          redPacketNum = MAX_RED_PACKET_NUM.toString()
        }
    }
    setRedPacketNum(redPacketNum)
  }

   const onRegisterRedPacketContract = async () => {
    setIsPutMoneyOrRegisterButtonLoading(true)
    await nearService!.redPacketContract.storage_deposit({
      args: {},
      amount: RED_PACKET_CONTRACT_STORAGE_DEPOSIT
    })
  }

  const onPutMoney = async (): Promise<any> => {
    setIsPutMoneyOrRegisterButtonLoading(true)

    const keyPair = KeyPairEd25519.fromRandom()
    const publicKey = keyPair.getPublicKey().toString()
    const privateKey = keyPair.secretKey

    LocalStorageUtils.setValue(RED_PACKET_PK_PREFIX + publicKey, privateKey)

    if(token.id === 'NEAR') {
      await createNearRedPacket(
        publicKey,
        parseInt(redPacketNum),
        redPacketType,
        parseYoctoAmount(tokenAmount),
      )
    } else {
      await createFungibleTokenRedPacket(
        token.id,
        redPacketContractConfig.contractId,
        publicKey,
        parseInt(redPacketNum),
        redPacketType,
        parseAmount(tokenAmount, token.decimals)
      )
    }
  }

  return (
    <Box>
      <Stack spacing={0} marginInline={10}>
        <FormControl isDisabled={!isSignedIn || !isRedPacketContractRegistered}>
          <FormLabel fontSize={'sm'}>
            Number
          </FormLabel>
          <NumberInput value={redPacketNum} onChange={onRedPacketNumChange}>
            <InputGroup>
              <NumberInputField
                shadow={'base'}
                ref={redPacketTypeSelectorFinalFocusRef}
              />
              <InputRightElement width={'auto'} marginRight={1}>
                <RedPacketTypeSelector
                  redPacketType={redPacketType}
                  onRedPacketTypeSelect={onRedPacketTypeSelect}
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
          <FormLabel fontSize={'sm'}>
            Total Amount
          </FormLabel>
          <NumberInput value={tokenAmount} onChange={onTokenAmountChange}>
            <InputGroup>
              <NumberInputField
                shadow={'base'}
                ref={tokenSelectorFinalFocusRef}
              />
              <InputRightElement width={'auto'} marginRight={1}>
                <TokenSelector
                  tokenList={tokenMetadataList}
                  selectedToken={token}
                  onTokenSelect={onTokenSelect}
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
                  Balance: &nbsp;
                  {
                    tokenBalance ?
                      formatAmount(
                        tokenBalance,
                        token.decimals,
                        getMaxViewFracDigits(token.id)
                      ) : 'Not Available'
                  }
                </FormHelperText>
                :
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
            onClick={isRedPacketContractRegistered ? onPutMoney : onRegisterRedPacketContract}
          >
            {
              !isSignedIn ?
                'Please Sign in' :
                isRedPacketContractRegistered ?
                  'Put Money' :
                  <Flex alignItems={'center'} gap={1}>
                    {'Register with ' + formatYoctoAmount(RED_PACKET_CONTRACT_STORAGE_DEPOSIT)}
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
            By first use, you should pay {formatYoctoAmount(RED_PACKET_CONTRACT_STORAGE_DEPOSIT)}
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