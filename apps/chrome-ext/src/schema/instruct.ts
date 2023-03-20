import type { ConvertResult } from './convert'

export type ConvertInstructions = 'GET_TITLE' | 'CONVERT'

export interface ConvertInstructionRequest {
  command: ConvertInstructions
}

export interface ConvertInstructionRespnse {
  result: ConvertResult
}
