import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { FlaggedCall } from "../generated/schema"
import { FlaggedCall as FlaggedCallEvent } from "../generated/SpamProtector/SpamProtector"
import { handleFlaggedCall } from "../src/spam-protector"
import { createFlaggedCallEvent } from "./spam-protector-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let callTime = BigInt.fromI32(234)
    let obfuscatedNumber = "Example string value"
    let submittedBy = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let label = "Example string value"
    let callType = 123
    let verified = "boolean Not implemented"
    let newFlaggedCallEvent = createFlaggedCallEvent(
      callTime,
      obfuscatedNumber,
      submittedBy,
      label,
      callType,
      verified
    )
    handleFlaggedCall(newFlaggedCallEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("FlaggedCall created and stored", () => {
    assert.entityCount("FlaggedCall", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "FlaggedCall",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "callTime",
      "234"
    )
    assert.fieldEquals(
      "FlaggedCall",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "obfuscatedNumber",
      "Example string value"
    )
    assert.fieldEquals(
      "FlaggedCall",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "submittedBy",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "FlaggedCall",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "label",
      "Example string value"
    )
    assert.fieldEquals(
      "FlaggedCall",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "callType",
      "123"
    )
    assert.fieldEquals(
      "FlaggedCall",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "verified",
      "boolean Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
