/**
 * convert text result
 */
export type ConvertResult =
  | {
      success: true
      content?: string
    }
  | {
      success: false
      error?: string
    }
