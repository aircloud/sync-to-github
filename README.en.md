# sync-to-github

This is a Chrome extension that allows you to synchronize your web page content with a GitHub repository, for example, a conversation with ChatGPT.

![preview](./docs/preview.gif)

## Installation and Usage:

- Download the latest zip package from the [Releases](https://github.com/aircloud/sync-to-github/releases) page on GitHub.
- Extract the zip package to a local directory.
- Open Google Chrome and navigate to [chrome://extensions](chrome://extensions).
- Enable "Developer mode" in the top right corner of the page.
- Click the "Load unpacked extension" button and select the directory where you extracted the zip package.
- Click the "Settings" button in the top right corner of the page to set your AccessToken, repository, and directory information.

First Use:

- **Please refresh the existing page after the first installation.**
- Click the icon to synchronize the web page with your GitHub repository.

Currently supported:

- [ChatGPT](https://chat.openai.com/)
- [ShareGPT](https://sharegpt.com)

## Feedback

This is a new tool that requires your feedback and testing. Please feel free to report any issues you encounter on the Issues page.

When submitting a problem, it is recommended to include information such as console errors, screenshots, or the URL of a conversation shared with ShareGPT.

## Contributing

You can easily add support for a new website.

- Refer to the existing projects in the [converters](apps/chrome-ext/src/converters) directory, create a new folder and implement a new "BaseConverter" inside it.
- Import it into the [content_script](apps/chrome-ext/src/content_script.ts) and create a new instance.
- Add the corresponding regular expression match to the "content_scripts.matches" field in the [manifest.json](apps/chrome-ext/public/manifest.json) file.

## Potential Features

This is a newly launched project, and more features need to be improved, including but not limited to:

- Display colored icons only on verified websites
- Automatic version publishing
- Synchronization with the Chrome Web Store
