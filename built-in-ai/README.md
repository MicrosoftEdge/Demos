# Built-in AI playgrounds
<!-- # Built-in AI playground -->
<!--
tab-title: Prompt API playground
top-of-page title: Built-in AI Playground
-->

➡️ **[Open the playgrounds](https://microsoftedge.github.io/Demos/built-in-ai/)** ⬅️

The files in this directory are playgrounds and samples for the built-in AI APIs in Microsoft Edge.

To learn more, see:
* [Prompt a built-in language model with the Prompt API](https://learn.microsoft.com/microsoft-edge/web-platform/prompt-api)
* [Summarize, write, and rewrite text with the Writing Assistance APIs](https://learn.microsoft.com/microsoft-edge/web-platform/writing-assistance-apis)


<!-- ====================================================================== -->
## Contributing

If you want to make changes to the playgrounds and samples source code, clone this repository and then follow these steps:

* To make changes to the source HTML content for one of the playgrounds or samples:

  This project uses Eleventy to generate the static HTML files. This is useful to avoid having to write the same HTML boilerplate for each playground.

  1. Find the playground or sample you want to edit in the `templates` directory.

     Playgrounds start with the `playground-` prefix, and samples start with the `sample-` prefix.

  1. Make your changes to the HTML file.

  1. Run `npm run build` to regenerate the static HTML files in the `playgrounds` and `samples` directories.

* To make changes to the JavaScript or CSS code for the playgrounds or samples:

  Make your changes directly to the JavaScript or CSS files in the `static` directory.

Then run the playgrounds locally:

1. Run `npm run build` to generate the static site.
1. Run `cd ../../` to go to the Demos repository's parent directory.
1. Start a local HTTP server from that parent directory. For example: `npx http-server -p 8080`.
1. Go to `http://localhost:8080/Demos/built-in-ai/` in your browser.
