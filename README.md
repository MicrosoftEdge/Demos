# Microsoft Edge Demos

This repository contains demo webpages, apps, and sample code to demonstrate various features of Microsoft Edge.

<!-- sorted per toc order -->

| Feature area | Overview of samples |
|---|---|
| DevTools | [Sample code for DevTools](https://learn.microsoft.com/microsoft-edge/devtools/sample-code/sample-code) |
| Microsoft Edge extensions | [Samples for Microsoft Edge extensions](https://learn.microsoft.com/microsoft-edge/extensions/samples) |
| Progressive Web Apps (PWAs) | [Progressive Web App samples](https://learn.microsoft.com/microsoft-edge/progressive-web-apps/samples/) |
| WebView2 | [WebView2 sample apps](https://learn.microsoft.com/microsoft-edge/webview2/samples/) |
| Web platform | [Cross-browser API samples](https://learn.microsoft.com/microsoft-edge/web-platform/samples) |

See also:
[Clone the "MicrosoftEdge / Demos" repo to your drive](https://learn.microsoft.com/microsoft-edge/devtools/sample-code/sample-code#clone-the-edge-demos-repo-to-your-drive) in _Sample code for DevTools_.


<!-- ====================================================================== -->
## Adding a new demo

To add a new demo:

1. Make a copy of the `/template/` directory at the root of this repository and give it a name, such as `/my-demo/`.

1. Edit `README.md` in the new directory to clearly explain what your new demo is about.

1. In `README.md` in the new directory, modify the `github.io` link to point to the live demo; that is, change `/my-demo/` to the name of your directory.

   This repository is set up to be deployed live using GitHub Pages (GitHub.io), so a rendered `index.html` file in the `/my-demo/` directory (for example) will end up being accessible on the web at `https://microsoftedge.github.io/demos/my-demo/`.

   The GitHub.io-hosted demo page will be available about an hour after your PR is merged.  You can monitor the job at [Actions](https://github.com/MicrosoftEdge/Demos/actions).

1. Edit the code in the new directory.  Examples of files in a demo directory:
   * `index.html`
   * `style.css`
   * `foo.js`
   * `README.md`
   * `manifest.json`

1. Create a pull request (PR) in this repo.

   The Edge team will review, approve, and merge your PR.

1. The demo creator or the Edge team: Create a PR in the [MicrosoftDocs / edge-developer](https://github.com/MicrosoftDocs/edge-developer) repo to add information about the new demo, in one of the articles that are linked to from this Readme.


<!-- ====================================================================== -->
## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide a CLA and decorate the PR appropriately (e.g., status check, comment).  Simply follow the instructions provided by the bot.  You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).  For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.


<!-- ====================================================================== -->
## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).  Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.  Any use of third-party trademarks or logos are subject to those third-party's policies.
