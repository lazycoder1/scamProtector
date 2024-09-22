import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { FlaggedCall, Proof } from "../generated/SpamProtector/SpamProtector"

export function createFlaggedCallEvent(
  callTime: BigInt,
  obfuscatedNumber: string,
  submittedBy: Address,
  label: string,
  callType: i32,
  verified: boolean
): FlaggedCall {
  let flaggedCallEvent = changetype<FlaggedCall>(newMockEvent())

  flaggedCallEvent.parameters = new Array()

  flaggedCallEvent.parameters.push(
    new ethereum.EventParam(
      "callTime",
      ethereum.Value.fromUnsignedBigInt(callTime)
    )
  )
  flaggedCallEvent.parameters.push(
    new ethereum.EventParam(
      "obfuscatedNumber",
      ethereum.Value.fromString(obfuscatedNumber)
    )
  )
  flaggedCallEvent.parameters.push(
    new ethereum.EventParam(
      "submittedBy",
      ethereum.Value.fromAddress(submittedBy)
    )
  )
  flaggedCallEvent.parameters.push(
    new ethereum.EventParam("label", ethereum.Value.fromString(label))
  )
  flaggedCallEvent.parameters.push(
    new ethereum.EventParam(
      "callType",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(callType))
    )
  )
  flaggedCallEvent.parameters.push(
    new ethereum.EventParam("verified", ethereum.Value.fromBoolean(verified))
  )

  return flaggedCallEvent
}

export function createProofEvent(
  root: BigInt,
  nullifierHash: BigInt,
  proof: Array<BigInt>
): Proof {
  let proofEvent = changetype<Proof>(newMockEvent())

  proofEvent.parameters = new Array()

  proofEvent.parameters.push(
    new ethereum.EventParam("root", ethereum.Value.fromUnsignedBigInt(root))
  )
  proofEvent.parameters.push(
    new ethereum.EventParam(
      "nullifierHash",
      ethereum.Value.fromUnsignedBigInt(nullifierHash)
    )
  )
  proofEvent.parameters.push(
    new ethereum.EventParam(
      "proof",
      ethereum.Value.fromUnsignedBigIntArray(proof)
    )
  )

  return proofEvent
}
