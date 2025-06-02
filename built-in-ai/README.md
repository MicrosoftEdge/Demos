# Built-in AI Playground

➡️ **[Open the playground](https://microsoftedge.github.io/Demos/built-in-ai/)** ⬅️

The files in this directory are playgrounds for the built-in AI APIs in Microsoft Edge.

To learn more, see [Prompt a built-in language model with the Prompt API](https://learn.microsoft.com/microsoft-edge/web-platform/prompt-api) and [Summarize, write, and rewrite text with the Writing Assistance APIs](https://learn.microsoft.com/microsoft-edge/web-platform/writing-assistance-apis).

## Contributing

To make changes to the playground source code, clone this repository and follow these steps:

* To make changes to the source HTML content for one of the playgrounds:

  This project uses Eleventy to generate the static HTML files. This is useful to avoid having to write the same HTML boilerplate for each playground.

  1. Find the playground you want to edit in the `templates` directory. 
  1. Make your changes to the HTML file.
  1. Run `npm run build` to regenerate the static HTML files in the `playgrounds` directory.

* To make changes to the JavaScript or CSS code for the playgrounds:

  Make your changes directly to the JavaScript or CSS files in the `static` directory.
