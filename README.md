# sync-to-github

这是一个 Chrome 插件，可以将你的网页内容同步到 github 仓库中，例如与 ChatGPT 的对话。

![preview](./docs/preview.gif)

## 安装和使用

在 [releases](https://github.com/aircloud/sync-to-github/releases) 中下载最新的 zip 包，解压缩，通过在 `设置 - 插件` 中，开启开发者模式后，点击 `加载已解压的扩展程序`，加载对应的文件夹完成安装。

初次使用前，请点击右上角“设置”，设置你的 AccessToken、仓库和目录信息。

当前支持列表：

- [ChatGPT](https://chat.openai.com/)
- [ShareGPT](https://sharegpt.com)

## 新增一个网站

- 你可以在 issue 中新增一个 issue，记得添加 `add-a-website` Tag。
- 如果你是开发者，欢迎你 fork 代码，参考下文"贡献内容"，并且通过 `Pull Request` 的方式合并到本项目中。

## 贡献内容

你可以很方便地新增一个网站支持。

1. 在 [converters](apps/chrome-ext/src/converters) 中参考现有项目，新增一个文件夹，用于实现 `BaseConverter`。
2. 在 [content_script](apps/chrome-ext/src/content_script.ts) 中引入它，新增一个实例。
3. 在 [manifest.json](apps/chrome-ext/public/manifest.json) 中的 `content_scripts.matches` 中新增相应的正则匹配。

## 潜在的功能

这是一个刚刚开启的项目，更多的功能仍然需要完善，包括但不限于：

- 只在通过检测的网站中显示彩色图标
- 自动发布版本
- 同步到插件商店
