import React, {useEffect, useState} from "react";
import {
  Avatar,
  ButtonGroup,
  Flex,
  GridItem,
  Image,
  SimpleGrid,
  Text,
  Tooltip,
  Stack,
  Button, Center, Badge, Spacer
} from "@chakra-ui/react";
import {useNearServiceStore, useWalletSignedInStore} from "../stores/global-stores";
import {useRedPacketViews} from "../hooks/useRedPacketViews";
import {useTokenMetadataList} from "../hooks/useTokenMetadataList";
import {
  DEFAULT_TOKEN_ICON,
  getMaxViewFracDigits,
  getTokenIdList
} from "../config/token-config";
import {formatAmount} from "../utils/amount-utils";
import redPacketCover from "../assets/redpacket-cover.svg";
import {tGas} from "../utils/custom-utils";
import {FinalExecutionOutcome} from "near-api-js/lib/providers";
import {getRedPacketContractConfig} from "../config/contract-config";
import {RED_PACKET_PK_PREFIX} from "../config/common-config";
import {LocalStorageUtils} from "../utils/local-storage-utils";
import {toBase64} from "js-base64";
import {AccessKeyInfoView} from "near-api-js/lib/providers/provider";
import copy from "copy-to-clipboard";


const tokenIdList = getTokenIdList()
const redPacketContractConfig = getRedPacketContractConfig()

export const ActiveRedPacketViews: React.FC = () => {
  const {nearService} = useNearServiceStore()
  const {isSignedIn} = useWalletSignedInStore()
  const {views, onReflush} = useRedPacketViews()
  const {tokenMetadataList} = useTokenMetadataList(tokenIdList)
  const [userAccessKeys, setUserAccessKeys] = useState<AccessKeyInfoView[]>([])
  const [refundButtonState, setRefundButtonState] = useState<any>({})
  const [copyButtonState, setCopyButtonState] = useState<any>({})

  useEffect(() => {
    if (!nearService || !isSignedIn) {
      return
    }
    nearService.wallet.account().getAccessKeys()
      .then((accessKeyInfoViews) => {
        setUserAccessKeys(accessKeyInfoViews)
      })
  }, [nearService, isSignedIn])

  const refund = async (publicKey: string): Promise<string> => {
    return nearService!.redPacketContract.refund({
      args: {
        public_key: publicKey
      },
      gas: tGas(50)
    })
  }

  const approve = async (publicKey: string):Promise<FinalExecutionOutcome> => {
    return nearService!.wallet.account().addKey(
      publicKey,
      redPacketContractConfig.contractId,
      ['claim_red_packet']
    )
  }

  const isUserHasTargetKey = (publicKey: string): boolean => {
    return userAccessKeys.find((accessKeyInfoView) => accessKeyInfoView.public_key === publicKey) !== undefined
  }

  const buildClaimLink = (ownerId: string, privateKey: string): string => {
    const params = {
      owner_id: ownerId,
      private_key: privateKey
    }
    const base64Params = toBase64(JSON.stringify(params) ,true)
    const url = new URL(window.location.href);
    return `${url.origin}/claim/${base64Params}`
  }

  return (
    <Stack
      gap={5}
    >
      <Stack
        maxHeight={200}
        overflow={'auto'}
      >
        {
          views.length === 0 ?
            <Center>
              <Text fontWeight={'bold'}>
                Go create a Red Packet!
              </Text>
            </Center>
            :
            views.map((view) => {
              if (view.is_run_out) {
                return null
              }

              const tokenId = view.token_id ?? 'NEAR'
              const isSupportedToken = tokenIdList.find((i) => i === tokenId) !== undefined
              const tokenMetadata = tokenMetadataList.find((t) => t.id === tokenId)

              if (!isSupportedToken) {
                return null
              }
              if (!tokenMetadata) {
                return null
              }

              const privateKey = LocalStorageUtils.getValue<string>(RED_PACKET_PK_PREFIX + view.public_key)

              let approveEnabled = false;
              let copyLinkEnabled = false;
              if (privateKey) {
                if (isUserHasTargetKey(view.public_key)) {
                  copyLinkEnabled = true
                } else {
                  approveEnabled = true
                }
              }

              const onApprove = async () => {
                await approve(view.public_key)
              }

              const onCopyLink = () => {
                setCopyButtonState({
                  ...copyButtonState,
                  [view.public_key]: {
                    text: 'Copied'
                  }
                })
                const claimLink = buildClaimLink(nearService!.wallet.account().accountId, privateKey!)
                copy(claimLink)
                setTimeout(() => {
                  setCopyButtonState({
                    ...copyButtonState,
                    [view.public_key]: {
                      text: 'Copy Link'
                    }
                  })
                }, 2000)
              }

              const onRefund = () => {
                setRefundButtonState({
                  ...refundButtonState,
                  [view.public_key]: {
                    isLoading: true
                  }
                })
                refund(view.public_key)
                  .then((refundedAmount) => {
                    onReflush()
                    LocalStorageUtils.removeValue(RED_PACKET_PK_PREFIX + view.public_key)
                    console.log('refunded token id: ' + tokenId + ', amount: ' + formatAmount(refundedAmount, tokenMetadata.decimals, getMaxViewFracDigits(tokenMetadata.id)))
                  })
                  .catch((err) => {
                    console.error('refund error: ' + err)
                  })
              }

              return (
                <SimpleGrid
                  key={view.public_key}
                  columns={10}
                  alignItems={'center'}
                >
                  <GridItem colSpan={3}>
                    <Flex gap={3} alignItems={'center'}>
                      <Tooltip label={tokenMetadata.symbol} fontSize={'xs'}>
                        <Avatar src={tokenMetadata?.icon ?? DEFAULT_TOKEN_ICON} size={'sm'}/>
                      </Tooltip>
                      <Text fontWeight={'bold'} fontSize={'md'}>
                        {
                          formatAmount(view.current_balance, tokenMetadata.decimals, getMaxViewFracDigits(tokenId))
                        }
                      </Text>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <Flex
                      alignItems={'center'}
                      gap={3}
                    >
                      <Tooltip label={view.split_mod} fontSize={'xs'}>
                        {
                          view.split_mod === 'Average' ?
                            <Flex
                              width={6}
                              height={9}
                              borderTopRadius={2}
                              borderBottomRadius={2}
                              backgroundColor={'#e3514c'}
                              justify={'center'}
                            >
                              <Image src={redPacketCover} width={3.5}/>
                            </Flex>
                            :
                            <Flex
                              width={6}
                              height={9}
                              borderTopRadius={2}
                              borderBottomRadius={2}
                              backgroundColor={'#1cbbb4'}
                              justify={'center'}
                            >
                              <Image src={redPacketCover} width={3.5}/>
                            </Flex>
                        }
                      </Tooltip>
                      <Text fontWeight={'bold'}>
                        {view.current_split}
                      </Text>
                    </Flex>
                  </GridItem>
                  <GridItem colSpan={1}>
                    <Badge colorScheme='green' hidden={!approveEnabled}> new </Badge>
                    <Badge colorScheme='red' hidden={copyLinkEnabled || approveEnabled}> link lost </Badge>
                  </GridItem>
                  <GridItem colSpan={4}>
                    <Flex gap={2}>
                      <Spacer/>
                      <Button
                        loadingText={'Connecting Wallet'}
                        colorScheme='purple'
                        size={'xs'}
                        isDisabled={!approveEnabled}
                        hidden={!approveEnabled}
                        onClick={onApprove}
                      >
                        Approve
                      </Button>
                      <Button
                        width={'6em'}
                        size={'xs'}
                        colorScheme={'teal'}
                        onClick={onCopyLink}
                        isDisabled={!copyLinkEnabled}
                      >
                        {copyButtonState[view.public_key]?.text ?? 'Copy Link'}
                      </Button>
                      <Button
                        isLoading={refundButtonState[view.public_key]?.isLoading ?? false}
                        loadingText={'Refunding'}
                        size={'xs'}
                        colorScheme={'pink'}
                        onClick={onRefund}
                      >
                        Refund
                      </Button>
                    </Flex>
                  </GridItem>
                </SimpleGrid>
              )
            })
        }
      </Stack>
      <Center>
        <Text fontSize={'xs'} fontWeight={'bold'}>
          Active Red Packets
        </Text>
      </Center>
    </Stack>
  )
}