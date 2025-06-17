import { BigInt } from '@graphprotocol/graph-ts'
import {
  Stake as StakeEvent,
  Unstake as UnstakeEvent,
  ClaimReward as ClaimEvent
} from '../types/USDTStaking/USDTStaking'
import { StakeTransaction, UnstakeTransaction, ClaimTransaction } from '../types/schema'

export function handleStake(ev: StakeEvent): void {
  let tx = new StakeTransaction(ev.transaction.hash.toHex())
  tx.user = ev.params.user
  tx.amount = ev.params.amount
  tx.timestamp = ev.block.timestamp
  tx.save()
}
export function handleUnstake(ev: UnstakeEvent): void {
  let tx = new UnstakeTransaction(ev.transaction.hash.toHex())
  tx.user = ev.params.user
  tx.amount = ev.params.amount
  tx.timestamp = ev.block.timestamp
  tx.save()
}
export function handleClaim(ev: ClaimEvent): void {
  let tx = new ClaimTransaction(ev.transaction.hash.toHex())
  tx.user = ev.params.user
  tx.reward = ev.params.reward
  tx.timestamp = ev.block.timestamp
  tx.save()
}
