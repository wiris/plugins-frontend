# Trying out the demos in development mode

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Trying out the demos in development mode</small>

By default, these demos download the latest version of the MathType plugins from npm.
This document explains what to do if you are modifying the source code of the plugins in this repo, and want to try that out instead.

All the commands can be executed either from the root of the project, or from the demo path. We recommend running them on the project root to avoid complexity.

## Requirements

- [**yarn**](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) (_currently: v1.22.19_)
- [**nx**](https://nx.dev/getting-started/installation#installing-nx-globally) (_latest_) - Optional

## Set up environment variables

The following editors require a license key:

- **CKEditor4**: Mandatory
- **Froala**: Optional

For that reason, you'll need to create an `env` file with those keys or add them to your existing `.env` file. Follow the example below:

```bash
CKEDITOR4_API_KEY=XXXXXX
froala_API_KEY=XXXXXX
```

## Build and start a demo in development mode

Assuming that you already executed the `yarn` command, you'll have to build the desired package and start the demo:

> If the editor gets stuck loading click [here](#known-issues)

```js
$ nx build <EDITOR>
$ nx start <FRAMEWORK>-<EDITOR>
```

> In case you haven't installed `nx`, you'll have to add `yarn` at the beginning of each one of the previous commands.

| FRAMEWORK | Editor and Version  | EDITOR/PACKAGE                                   |
| --------- | ------------------- | ------------------------------------------------ |
| html      | CKEditor V4         | [ckeditor4](../../demos/html/ckeditor4)          |
| html      | CKEditor V5         | [ckeditor5](../../demos/html/ckeditor5)          |
| html      | Froala              | [froala](../../demos/html/froala)                |
| html      | Generic integration | [generic](../../demos/html/generic)              |
| html      | TinyMCE V5          | [tinymce5](../../demos/html/tinymce5)            |
| html      | TinyMCE V6          | [tinymce6](../../demos/html/tinymce6)            |
| vue       | CKEditor V5         | [ckeditor5](../../demos/vue/ckeditor5/README.md) |

Each time you apply a change to a package and want to see the changes in your demo, you'll have to re-run the previous two commands.

## Hot reload

In order to apply the changes made in the source code on this repo automatically to the started demo, you will need to activate the Hot reload feature:

1. Run the demo with local packages with the command:
   > If the editor gets stuck loading click [here](#known-issues)

```js
$ nx start <FRAMEWORK>-<EDITOR>
```

2. Open a second terminal.
3. Use the command:

```js
$ nx start <EDITOR>
```

This feature only works with demos that use the `HTML` Framework.

## Known issues

- If the editor is not loading, try the following steps:
  1. Delete the `dist` folder of the `<EDITOR>` you are trying to deploy.
  2. Re-run the command `nx start <FRAMEWORK>-<EDITOR>` if you are using the hot reload feature, or `nx start <EDITOR>` if you are not.
