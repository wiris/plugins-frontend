# ![MathType logo](docs/img/mathtype_logo.png) MathType Web Integrations

![MathType plugin example](docs/img/wiris_plugin_example.png)

**MathType Web** is the official open-source JavaScript library for [MathType by Wiris], the leading formula editor and equation writer for CMS, LMS, and web applications.

This repository contains the source code of the plugins for the most popular HTML editors, such as [CKEditor], [Froala], and [TinyMCE]. They are available from the [npm](https://www.npmjs.com/~wiris) directory. It also provides a collection of working examples, including step-by-step information, on how to integrate MathType in vanilla HTML, or even your own custom web editor.

Our main goal is to enable web developers to integrate MathType on the widest range of technologies available. We also try to keep the library light, simple, and free from third-party dependencies. Everything you need to build and deploy is in the sources.

**MathType can be used for free** up to a certain level of uses per natural year, [more details](https://www.wiris.com/en/pricing/?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=integrations).

## Table of contents

- [What is MathType](#what-is-mathtype)
- [Editors and platforms support](#editors-and-platforms-support)
- [Examples for developers](#examples-for-developers)
- [Releases](#releases)
- [Documentation and important links](#documentation-and-important-links)
- [Technical support](#technical-support)
- [Privacy policy](#privacy-policy)
- [License](#license)

## What is MathType

MathType is a formula editor and equation writer. It allows to type and handwrite mathematical notation on your applications. Developed and maintained by [Wiris](https://www.wiris.com/en/?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=integrations).

- **Ease of use**. Write equations with an interface that provides a user-friendly experience from day one; forget about having to learn LaTeX to write math on a computer.
- **Professionality**. MathType is an online equation editor that provides perfect quality math formulas.
- **Handwriting**. Working on a touch device? No worries, MathType will convert your handwritten formula into a clean digital equation ready to be used in your documents.
- **Accessibility**. MathType is compliant with accessibility requirements to create software for individuals with disabilities.
- **Multiple contexts**: MathType is seamlessly integrated into diverse platforms like Moodle, Microsoft Word, Google Apps, ...

## Editors and platforms support

We develop and maintain MathType Web plugins for [CKEditor], [Froala], and [TinyMCE].

We also offer a generic integration for a plain HTML editable `div`.
You can adapt this integration to use MathType in the web editor of your choice.

For the MathType integration for Moodle and other LMS see [here](https://www.wiris.com/es/soluciones/educacion/?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=integrations).

## Examples for developers

In order to manually try out each plugin, there's a set of developer demos on the [`demos`](demos) folder.

Refer to the [documentation](docs/demos/) for more information.

## Releases

All notable changes to this project are documented in the [CHANGES.md](CHANGES.md) file.

Visit the [MathType integrations release notes](https://docs.wiris.com/mathtype/en/mathtype-office-tools/mathtype-office-tools-release-notes.html?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=integrations) page for more information.

### Packages

| Name                                                                                    | Version                                                                                                                                                              | Description                                                 |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | --- |
| [`@wiris/mathtype-html-integration-devkit`](packages/mathtype-html-integration-devkit/) | <a href="https://www.npmjs.com/package/@wiris/mathtype-html-integration-devkit"><img src="https://img.shields.io/npm/v/@wiris/mathtype-html-integration-devkit"></a> | The JavaScript devkit to use MathType web in your projects. |
| [`@wiris/mathtype-generic`](packages/mathtype-generic)                                  | <a href="https://www.npmjs.com/package/@wiris/mathtype-generic"><img src="https://img.shields.io/npm/v/@wiris/mathtype-generic"></a>                                 | MathType Web for a generic HTML textarea.                   |
| [`@wiris/mathtype-ckeditor4`](packages/mathtype-ckeditor4)                              | <a href="https://www.npmjs.com/package/@wiris/mathtype-ckeditor4"><img src="https://img.shields.io/npm/v/@wiris/mathtype-ckeditor4"></a>                             | MathType Web for CKEditor4 editor.                          |
| [`@wiris/mathtype-ckeditor5`](packages/mathtype-ckeditor5)                              | <a href="https://www.npmjs.com/package/@wiris/mathtype-ckeditor5"><img src="https://img.shields.io/npm/v/@wiris/mathtype-ckeditor5"></a>                             | MathType Web for CKEditor5 editor.                          |
| [`@wiris/mathtype-froala`](packages/mathtype-froala)                                    | <a href="https://www.npmjs.com/package/@wiris/mathtype-froala"><img src="https://img.shields.io/npm/v/@wiris/mathtype-froala"></a>                                   | MathType Web for Froala editor.                             |     |
| [`@wiris/mathtype-tinymce5`](packages/mathtype-tinymce5)                                | <a href="https://www.npmjs.com/package/@wiris/mathtype-tinymce5"><img src="https://img.shields.io/npm/v/@wiris/mathtype-tinymce5"></a>                               | MathType Web for TinyMCE5 editor.                           |
| [`@wiris/mathtype-tinymce6`](packages/mathtype-tinymce6)                                | <img src="https://img.shields.io/npm/v/@wiris/mathtype-tinymce5">                                                                                                    | MathType Web for TinyMCE6 editor.                           |
| [`@wiris/mathtype-tinymce7`](packages/mathtype-tinymce7)                                | <img src="https://img.shields.io/npm/v/@wiris/mathtype-tinymce7">                                                                                                    | MathType Web for TinyMCE7 editor.                           |

## Documentation and important links

- [Documentation](docs/)
- [Trying out the demos](docs/demos/)
- [Integrating MathType in your website](docs/integration/)
- [Development guide](docs/development/)
- [Contributing guidelines](docs/contributing/)
- [Code of conduct](docs/code-of-conduct/)

## Technical support

If you have questions or need help integrating MathType, please contact us ([support@wiris.com](mailto:support@wiris.com)) instead of opening an issue.

## Privacy policy

The [MathType Privacy Policy](https://www.wiris.com/en/mathtype-privacy-policy/?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=integrations) covers the data processing operations for the MathType users. It is an addendum of the company’s general Privacy Policy and the [general Privacy Policy](https://www.wiris.com/en/privacy-policy?utm_source=npmjs&utm_medium=referral) still applies to MathType users.

## License

Copyright © 2010-2022 [Wiris](https://www.wiris.com/en/?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=integrations). Released under the [MIT License](LICENSE).

[MathType by Wiris]: https://www.wiris.com/en/mathtype/?utm_source=github&utm_medium=referral&utm_campaign=readme&utm_content=integrations
[CKEditor]: https://ckeditor.com/
[Froala]: https://froala.com/
[TinyMCE]: https://www.tiny.cloud/tinymce/
