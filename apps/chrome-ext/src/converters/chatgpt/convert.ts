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
    const titlesContainer = document.querySelector(
      'div > nav  a.hover\\:bg-gray-800 div.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative',
    )

    try {
      return (titlesContainer as HTMLDivElement)?.innerText
        ? `${(titlesContainer as HTMLDivElement)?.innerText}.md`
        : ''
    } catch (e) {
      // do nothing
    }

    return ''
  }

  convert(): string {
    const threadContainer = document.getElementsByClassName(
      'flex flex-col text-sm dark:bg-gray-800',
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
