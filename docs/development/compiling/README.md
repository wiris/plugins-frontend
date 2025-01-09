# Compiling the packages

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Compiling the packages</small>

The MathType Web plugins consist mostly of JavaScript.
In order to offer cross-browser compatibility and the latest features, most of these plugins need to be "compiled" using [Webpack].

[Webpack]: https://webpack.js.org/

## Table of contents

- [Bootstrap dependencies](#bootstrap-dependencies)
- [Compile individual packages](#compile-individual-packages)
- [Point to your own back-end](#point-to-your-own-back-end)
- [Clean up](#clean-up)

## Requirements

- [**yarn**](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) (_currently: v1.22.19_)
- [**nx**](https://nx.dev/getting-started/installation#installing-nx-globally) (_latest_) - Optional

## Bootstrap dependencies

First run the following command described in the [Bootstrapping](../../README.md#Bootstrapping) section:

```sh
$ yarn
```

the monorepo will bootstrap all the packages in the monorepo and the npm dependencies.

## Compile individual packages

To compile a single packages, run:

```sh
$ nx build <PACKAGE>
```

You can also build the packages in development mode:

```sh
$ nx build-dev <PACKAGE>
```

> In case you haven't installed `nx`, you'll have to add `yarn` at the beginning of each one of the previous commands.

Where PACKAGE can be:

- ckeditor4
- ckeditor5
- froala
- generic
- tinymce5
- tinymce6
- tinymce7

## Point to your own back-end

If your website hosts its own MathType Web services, instead of using the wiris.net services, then you must pass a flag indicating which technology your server uses (ASPX, Java, Ruby, or PHP), run the following command in the desired package folder:

```sh
$ SERVICE_PROVIDER_URI=[url] SERVICE_PROVIDER_SERVER=[tech] yarn build
```

Where `[tech]` is one of:

- `java`
- `php`

and `[url]` is the relative address to the main endpoint of the MathType Web services that you are hosting (e.g. `integration` if your PHP services are in the `integration/` directory).

You can use `build-dev` instead of `build` to build the package in development mode.

## Clean up

To delete files generated during the compilation process, run:

```sh
$ yarn clean
```
