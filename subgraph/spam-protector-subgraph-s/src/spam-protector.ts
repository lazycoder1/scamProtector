import {
  FlaggedCall as FlaggedCallEvent,
  Proof as ProofEvent
} from "../generated/SpamProtector/SpamProtector"
import { FlaggedCall, Proof } from "../generated/schema"

export function handleFlaggedCall(event: FlaggedCallEvent): void {
  let entity = new FlaggedCall(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.callTime = event.params.callTime
  entity.obfuscatedNumber = event.params.obfuscatedNumber
  entity.submittedBy = event.params.submittedBy
  entity.label = event.params.label
  entity.callType = event.params.callType
  entity.verified = event.params.verified

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProof(event: ProofEvent): void {
  let entity = new Proof(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.root = event.params.root
  entity.nullifierHash = event.params.nullifierHash
  entity.proof = event.params.proof

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
