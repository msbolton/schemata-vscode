# Schemata for VS Code

Language support for [Schemata](https://github.com/msbolton/Schemata) `.schemata` files:
highlighting, diagnostics as you type, go to definition, hover, find references, rename,
formatting, and the outline.

## Install

1. Install the compiler, version 2.0.0 or later: `brew install msbolton/schemata/schemata`, or a
   binary from the [releases](https://github.com/msbolton/Schemata/releases). This extension
   highlights the 2.0 syntax and starts the language server from a 2.0.0 or later release, or from
   a development build of any version; `schemata upgrade` rewrites 1.x files to 2.0. For 1.x
   schemas, stay on extension 1.2.0.
2. Download `schemata-vscode-<version>.vsix` from this repository's releases and run
   "Extensions: Install from VSIX…" in VS Code.

## Settings

| Setting | Default | Meaning |
|---|---|---|
| `schemata.path` | `schemata` | The binary to run. A bare name is looked up on `PATH`. |
| `schemata.roots` | `[]` | Directories, relative to the workspace folder, whose whole subtree is one schema set. Without roots, each directory is its own set. |
| `schemata.strict` | `false` | Report implicit ordinals as errors. |

"Schemata: Restart Language Server" restarts the server, for example after upgrading the compiler.

The compiler's guide describes what the server does, how schema sets work, and what happens while
a file does not parse.
