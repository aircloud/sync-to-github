import type { ConvertInstructionRequest, ConvertInstructionRespnse } from '../schema'

export const sendMessageToContentScript = (
  message: ConvertInstructionRequest,
): Promise<ConvertInstructionRespnse> => {
  return new Promise((rs) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0]!.id! as number,
          message,
          (res: ConvertInstructionRespnse) => {
            rs(res)
          },
        )
      },
    )
  })
}
