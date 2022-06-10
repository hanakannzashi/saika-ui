import React, {useEffect, useMemo, useState} from "react";
import {
  Avatar,
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
  customTokenIconMapping,
  DEFAULT_MAX_VIEW_FRAC_DIGITS,
  DEFAULT_TOKEN_ICON,
  maxViewFracDigitsMapping,
  tokenIdList
} from "../config/token-config";
import {formatAmount} from "../utils/amount-utils";
import redPacketCover from "../assets/redpacket-cover.png";
import {tGas} from "../utils/custom-utils";
import {redPacketContractConfig} from "../config/contract-config";
import {RED_PACKET_PK_PREFIX} from "../config/common-config";
import {LocalStorageUtils} from "../utils/local-storage-utils";
import {toBase64} from "js-base64";
import {AccessKeyInfoView} from "near-api-js/lib/providers/provider";
import copy from "copy-to-clipboard";
import BN from "bn.js";


export const ActiveRedPacketViews: React.FC = () => {
  const {nearService} = useNearServiceStore()
  const {isSignedIn} = useWalletSignedInStore()
  const {tokenMetadataList} = useTokenMetadataList(tokenIdList)
  const [userAccessKeys, setUserAccessKeys] = useState<AccessKeyInfoView[]>([])
  const [refundButtonsState, setRefundButtonsState] = useState<Record<string, any>>({})
  const [copyButtonsState, setCopyButtonsState] = useState<Record<string, any>>({})

  const ownerId = useMemo(() => {
    if (!nearService || !isSignedIn) {
      return undefined
    }
    return nearService.wallet.getAccountId()
  }, [nearService, isSignedIn])

  const {views, onRefresh} = useRedPacketViews(ownerId)

  const filterViews = useMemo(() => {
    const filterViews = []
    for (let i = 0;i < views.length;i++) {
      const view = views[i]
      const tokenId = view.token_id ?? 'NEAR'
      const isUnsupportedToken = tokenIdList.find((i) => i === tokenId) === undefined
      if (view.is_run_out || isUnsupportedToken) {
        continue
      }
      const tokenMetadata = tokenMetadataList.find((t) => t.id === tokenId)
      if (!tokenMetadata) {
        continue
      }
      const filterView = {
        tokenId,
        tokenMetadata,
        view
      }
      filterViews.push(filterView)
    }
    return filterViews.sort((a, b) => {
        const a_create_timestamp = new BN(a.view.create_timestamp)
        const b_create_timestamp = new BN(b.view.create_timestamp)
        if (a_create_timestamp < b_create_timestamp) {
          return 1
        }
        if (a_create_timestamp > b_create_timestamp) {
          return -1
        }
        return 0
      })
  }, [views, tokenMetadataList])

  useEffect(() => {
    if (!nearService || !isSignedIn) {
      return
    }
    nearService.wallet.account().getAccessKeys()
      .then((accessKeyInfoViews) => {
        setUserAccessKeys(accessKeyInfoViews)
      })
  }, [nearService, isSignedIn])

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
    <Stack spacing={5}>
      <Stack
        maxHeight={200}
        overflow={'auto'}
      >
        {
          filterViews.length === 0 ?
            <Center>
              <Text fontWeight={'bold'} fontSize={'x-large'}>
                Go create a Red Packet!
              </Text>
            </Center>
            :
            filterViews.map(({tokenId, view, tokenMetadata}) => {
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

              const handleApprove = async () => {
                await nearService!.wallet.account().addKey(
                  view.public_key,
                  redPacketContractConfig.contractId,
                  ['claim_red_packet']
                )
              }

              const handleCopyLink = () => {
                setCopyButtonsState({
                  ...copyButtonsState,
                  [view.public_key]: {
                    text: 'Copied'
                  }
                })

                copy(buildClaimLink(
                  nearService!.wallet.getAccountId(),
                  privateKey!
                ))

                setTimeout(() => {
                  setCopyButtonsState({
                    ...copyButtonsState,
                    [view.public_key]: {
                      text: 'Copy Link'
                    }
                  })
                }, 2000)
              }

              const onRefund = () => {
                setRefundButtonsState({
                  ...refundButtonsState,
                  [view.public_key]: {
                    isLoading: true
                  }
                })

                nearService!.redPacketContract.refund({
                  args: {
                    public_key: view.public_key
                  },
                  gas: tGas(50)
                })
                  .then((_refundedAmount) => {
                    LocalStorageUtils.removeValue(RED_PACKET_PK_PREFIX + view.public_key)
                    onRefresh()
                  })
                  .catch((err) => {
                    console.error(err)
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
                        <Avatar src={customTokenIconMapping[tokenId] ?? tokenMetadata.icon ?? DEFAULT_TOKEN_ICON} size={'sm'}/>
                      </Tooltip>
                      <Text fontWeight={'bold'} fontSize={'md'}>
                        {
                          formatAmount(
                            view.current_balance,
                            tokenMetadata.decimals,
                            maxViewFracDigitsMapping[tokenId] ?? DEFAULT_MAX_VIEW_FRAC_DIGITS
                          )
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
                        <Flex
                          width={6}
                          height={9}
                          borderTopRadius={2}
                          borderBottomRadius={2}
                          backgroundColor={view.split_mod === 'Average' ? '#e3514c' : '#1cbbb4'}
                          justify={'center'}
                        >
                          <Image src={redPacketCover} width={3.5} marginBlock={1}/>
                        </Flex>
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
                        onClick={handleApprove}
                      >
                        Approve
                      </Button>
                      <Button
                        width={'6em'}
                        size={'xs'}
                        colorScheme={'teal'}
                        onClick={handleCopyLink}
                        isDisabled={!copyLinkEnabled}
                      >
                        {copyButtonsState[view.public_key]?.text ?? 'Copy Link'}
                      </Button>
                      <Button
                        isLoading={refundButtonsState[view.public_key]?.isLoading ?? false}
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
        <Text fontSize={'sm'} fontWeight={'bold'}>
          Active Red Packets
        </Text>
      </Center>
    </Stack>
  )
}