# Contributing to MathType Web Integrations

<small>[MathType Web Integrations](../../README.md) → [Documentation](../README.md) → Contributing guidelines</small>

We would love for you to contribute to this project and help make it better.

As a contributor, here are the guidelines we would like you to follow:

- [Code of Conduct](#code-of-conduct)
- [Questions or problems?](#questions-or-problems)
- [Reporting issues](#reporting-issues)
- [Coding Rules](#coding-rules)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

Please read and follow our [Code of Conduct](/docs/code-of-conduct/).

## Questions or problems

Do not open issues for general support questions as we want to keep GitHub issues for bug reports and feature requests.

Instead, we recommend you sending an e-mail to [support@wiris.com](mailto:support@wiris.com) to ask support-related questions.

## Reporting issues

If you find a bug in the source code, you can help us by [submitting an issue](#submitting-an-issue) to our [GitHub Repository][github]. Even better, you can submit a Pull Request with a fix.

### Submitting an Issue

Before you submit an issue, please search the issue tracker. An issue for your problem might already exist and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug, we need to reproduce and confirm it.

In order to reproduce bugs, we require that you provide a minimal reproduction.
Having a minimal reproducible scenario gives us a wealth of important information without going back and forth to you with additional questions.

A minimal reproduction allows us to quickly confirm a bug (or point out a coding problem) as well as confirm that we are fixing the right problem.

We require a minimal reproduction to save maintainers' time and ultimately be able to fix more bugs.
Often, developers find coding problems themselves while preparing a minimal reproduction.
We understand that sometimes it might be hard to extract essential bits of code from a larger codebase but we really need to isolate the problem before we can fix it.

Unfortunately, we are not able to investigate / fix bugs without a minimal reproduction, so if we don't hear back from you, we are going to close an issue that doesn't have enough info to be reproduced.

You can file new issues by selecting from our [new issue templates](https://github.com/wiris/html-integrations/issues/new/choose) and filling out the issue template.

## Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- Follow the [Commit Message Format guidelines](#commit-message-format).
- Lint all code.
- Once forked the project, create a new branch from `master` branch.
- Make sure to read the [Development guide](/docs/development/) before proposing any changes.

## Commit Message Guidelines

We have very precise rules over how our Git commit messages must be formatted.
This format leads to **easier to read commit history**.

> **Note**: You don't need to use this specification to contribute to this project, but we encourage you to do, so.

- Wrap message lines to about 72 characters or so.

- Each commit message consists of a **header**, a **body**, and a **footer**.

```
<header>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

- The `header` is mandatory and must conform to the [Commit Message Header](#commit-message-header) format.

- The `body` is mandatory for all commits except for those of type "docs".
  When the body is present it must be at least 20 characters long and must conform to the [Commit Message Body](#commit-message-body) format.

- The `footer` is optional. The [Commit Message Footer](#commit-message-footer) format describes what the footer is used for and the structure it must have.

### Commit Message Header

The commit message `header` should be structured as follows:

```
<type>(<scope>): <summary>
  │       │             │
  │       │             └─> Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─> Commit Scope: ckeditor4|ckeditor5|froala|generic|
  │                         devkit|tinymce|tinymce5|
  │                         demo|packaging|changelog|dev-infra|none
  │
  └─> Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

- The `<type>` and `<summary>` fields are mandatory.
- The `(<scope>)` field is optional.

#### Type

The recommended default values for `<type>` are the following:

- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
- `ci`: Changes to our CI configuration files and scripts (examples: GitHub, Jenkins).
- `docs`: Documentation only changes.
- `feat`: A new feature.
- `fix`: A bug fix.
- `perf`: A code change that improves performance.
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or correcting existing tests.

#### Scope

We use the "package name rule" as follows.

For brevity, `<scope>` will take one of these next values depending on the affected package:

| Scope value | Affected package                   |
| ----------- | ---------------------------------- |
| `devkit`    | `mathtype-html-integration-devkit` |
| `ckeditor4` | `mathtype-ckeditor4`               |
| `ckeditor5` | `mathtype-ckeditor5`               |
| `froala`    | `mathtype-froala`                  |
| `generic`   | `mathtype-generic`                 |
| `tinymce5`  | `mathtype-tinymce5`                |
| `tinymce6`  | `mathtype-tinymce6`                |
| `tinymce7`  | `mathtype-tinymce7`                |

There are usually a few exceptions to the above rules:

- `demo`: used when updating the integrations examples on the `/demos` folder.

- `packaging`: used for changes that change the npm package layout in all of our packages, e.g. public path changes, package.json changes done to all packages, d.ts file/format changes, changes to bundles, etc.

- `changelog`: used for updating the release notes in CHANGELOG.md

- `dev-infra`: used for dev-infra related changes within the directories /scripts and /tools

- `none` or empty string: useful for `test` and `refactor` changes that are done across all packages (e.g. `test: add missing unit tests`) and for docs changes that are not related to a specific package (e.g. `docs: fix typo in tutorial`).

#### Summary

Use the `<summary>` field to provide a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes".
- don't capitalize the first letter.
- no dot (.) at the end.

### Commit Message Body

Explain the motivation for the change in the commit message `body`.

Just as in the `<summary>`, use the imperative, present tense: "fix" not "fixed" nor "fixes".

This commit message should explain _why_ you are making the change.
You can include a comparison of the previous behavior with the new behavior in order to illustrate the impact of the change.

### Commit Message Footer

The `footer` can contain information about breaking changes and deprecations and is also the place to reference GitHub issues, Kanbanize card, Jira tickets, and other PRs that this commit closes or is related to.

In the case of Kanbanize, it is compulsory to add `#taskid {card_number}` to allow kanbanize to track commits.

For example:

```
BREAKING CHANGE: <breaking change summary>
<BLANK LINE>
<breaking change description + migration instructions>
<BLANK LINE>
<BLANK LINE>
Fixes #{issue_number}
#taskid {card_number}
```

or

```
DEPRECATED: <what is deprecated>
<BLANK LINE>
<deprecation description + recommended update path>
<BLANK LINE>
<BLANK LINE>
Closes #{pull_number}
#taskid {card_number}
```

Breaking Change section should start with the phrase `"BREAKING CHANGE: "` followed by a summary of the breaking change, a blank line, and a detailed description of the breaking change that also includes migration instructions.

Similarly, a Deprecation section should start with `"DEPRECATED: "` followed by a short description of what is deprecated, a blank line, and a detailed description of the deprecation that also mentions the recommended update path.

## Revert commits

If the commit reverts a previous commit, it should begin with `revert: `, followed by the header of the reverted commit.

The content of the commit message body should contain:

- information about the SHA of the commit being reverted in the following format: `This reverts commit <SHA>`,
- a clear description of the reason for reverting the commit message.

[conv-commits]: https://www.conventionalcommits.org/en/v1.0.0/
[github]: https://github.com/wiris/html-integrations

## Software Dependencies Update Plan

This project follows
[MathType Integrations' Software Update Plan](https://docs.google.com/document/d/1UPzpMuTsobs9Rsy1KIQM2x0ShYJaUzSkpWt5-7RT1Yg/edit?pli=1&tab=t.0#heading=h.pkcqcs7fz27t).
Please read the document and make sure you understand it completely.

To learn about Software Dependencies Update Plan, please read the
[Engineering Glossary](https://docs.google.com/document/d/1aIl7HxwxlJL9uQstJYZYmAWf8YW3td1RtP58RGrxU3E/edit#heading=h.1kq6jr8unr8h).
