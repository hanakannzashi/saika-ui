import React, {useEffect, useMemo, useState} from "react";
import {useNearServiceStore} from "../stores/global-stores";
import {StorageBalance} from "../types/storage-management";
import {
  Stack,
  Stat,
  Flex,
  StatHelpText,
  StatLabel,
  StatNumber,
  CircularProgress,
  CircularProgressLabel, Text, Center, Progress, ProgressLabel, StatGroup, ButtonGroup, Button, Box, Container
} from "@chakra-ui/react";
import {formatAmount, formatYoctoAmount, parseYoctoAmount} from "../utils/amount-utils";
import {DEFAULT_MAX_VIEW_FRAC_DIGITS, maxViewFracDigitsMapping, nearMetaData} from "../config/token-config";
import BN from "bn.js";
import {round} from "../utils/common-utils";
import {BASE_RED_PACKET_CONTRACT_STORAGE_DEPOSIT} from "../config/common-config";

export const StorageUsage: React.FC = () => {
  const {nearService} = useNearServiceStore()
  const [storageBalance, setStorageBalance] = useState<StorageBalance | null>(null)
  const [refreshCount, setRefreshCount] = useState<number>(0)
  const [depositButtonLoading, setDepositButtonLoading] = useState<boolean>(false)
  const [cleanButtonLoading, setCleanButtonLoading] = useState<boolean>(false)

  const total: number | undefined = useMemo(() => {
    if (!storageBalance) {
      return undefined
    }
    return Number(
      formatAmount(
        storageBalance.total,
        nearMetaData.decimals,
        5
      )
    )
  }, [storageBalance])

  const used: number | undefined = useMemo(() => {
    if (!storageBalance) {
      return undefined
    }
    return Number(
      formatYoctoAmount(
        new BN(storageBalance.total).sub(new BN(storageBalance.available)),
        5
      )
    )
  }, [storageBalance])

  const usedPecent: number | undefined = useMemo(() => {
    if (!used || !total) {
      return undefined
    }
    return Number(
      round((100 * used / total).toString(), 2)
    )
  }, [used, total])

  const circularProgressColor: string | undefined = useMemo(() => {
    if (!usedPecent) {
      return undefined
    }
    if (usedPecent < 80) {
      return 'green'
    }
    if (usedPecent >= 80 && usedPecent < 90) {
      return 'orange'
    }
    if (usedPecent >= 90) {
      return 'red'
    }
  }, [usedPecent])

  useEffect(() => {
    if (!nearService) {
      return
    }
    nearService.redPacketContract.storage_balance_of(
      {
        account_id: nearService.wallet.getAccountId()
      }
    )
      .then((storageBalance) => {
        setStorageBalance(storageBalance)
      })
  }, [nearService, refreshCount])

  const handleDepositStorageBalance = async () => {
    setDepositButtonLoading(true)
    nearService!.redPacketContract.storage_deposit(
      {
        args: {},
        amount: BASE_RED_PACKET_CONTRACT_STORAGE_DEPOSIT
      }
    )
  }

  const handleCleanRedPacketHistory = () => {
    setCleanButtonLoading(true)
    nearService!.redPacketContract.clear_history(
      {
        args: {}
      }
    )
      .then(() => {
        setCleanButtonLoading(false)
        setRefreshCount(refreshCount + 1)
      })
  }

  return (
    <Stack spacing={5}>
      <Text fontWeight={'bold'} fontSize={'lg'}>
        Storage Usage
      </Text>
      <Box>
        <StatGroup>
          <Stat>
            <StatLabel>Total</StatLabel>
            <StatNumber>
              {total + ' Ⓝ'}
            </StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Used</StatLabel>
            <StatNumber>
              {used + ' Ⓝ'}
            </StatNumber>
          </Stat>
        </StatGroup>
        <Progress marginTop={1} value={usedPecent} colorScheme={circularProgressColor} size={'lg'} hasStripe={true}/>
      </Box>
      <Center>
        <Text fontSize={'xs'} fontWeight={'bold'} hidden={!usedPecent || usedPecent < 90}>
          ⚠️ Storage is almost full, please deposit balance or clean histoty ⚠️
        </Text>
      </Center>
      <ButtonGroup size={'sm'} gap={2}>
        <Button
          width={220}
          colorScheme={'green'}
          isLoading={depositButtonLoading}
          loadingText={'Connecting Wallet'}
          onClick={handleDepositStorageBalance}>
          Deposit storage balance
        </Button>
        <Button
          width={220}
          colorScheme={'orange'}
          isLoading={cleanButtonLoading}
          loadingText={'Cleaning'}
          onClick={handleCleanRedPacketHistory}>
          Clean Red Packet History
        </Button>
      </ButtonGroup>
    </Stack>
  )
}