// @ts-expect-error ignore type
import TurndownService from 'turndown/lib/turndown.es.js'
import { BaseConverter } from '../base'

const turndownService = new TurndownService({
  preformattedCode: true,
  codeBlockStyle: 'fenced',
})

export class ChatGPTConverter extends BaseConverter {
  override get isActive() {
    return /chat.openai.com/.test(window.location.href)
  }

  override get currentFileName() {
    const titlesContainer = document.getElementsByClassName(
      'flex-col flex-1 overflow-y-auto border-b border-white/20',
    )[0]

    try {
      const activeNode = [...(titlesContainer?.childNodes?.[0]?.childNodes || [])].find((node) => {
        return (node as HTMLDivElement).className.includes('bg-gray-800')
      })

      if (activeNode) {
        return `${(activeNode.childNodes[1] as HTMLElement).innerText || ''}.md`
      }
    } catch (e) {
      // do nothing
    }

    return ''
  }

  convert(): string {
    const threadContainer = document.getElementsByClassName(
      'flex flex-col items-center text-sm dark:bg-gray-800',
    )[0]

    let res = ''
    for (const childNode of threadContainer!.childNodes) {
      // ignore unexpected:
      if (!childNode.childNodes.length) continue
      if (childNode.childNodes?.[0]?.childNodes.length !== 2) continue

      // hack: chatgpt icon is an svg
      const isQ = /<img.*?>/.test((childNode.childNodes[0].childNodes[0] as HTMLElement).innerHTML)
      const textNode = childNode.childNodes[0]?.childNodes[1]?.childNodes[0] as HTMLDivElement

      res += isQ ? `Q: ` : 'A: '

      // Make sure code follows pre so that turndown can handle multiple lines of code
      const formattedHTML = textNode.innerHTML.replace(
        /<pre([\s\S]*?)<code([\s\S]*?)<\/code>([\s\S]*?)<\/pre>/g,
        '<pre><code$2</code></pre>',
      )

      const markdown = turndownService.turndown(formattedHTML)
      res += markdown
      res += `\n\n---\n\n`
    }

    return res
  }
}
