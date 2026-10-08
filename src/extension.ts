import { execFile } from "node:child_process";
import * as vscode from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";
import { MINIMUM, accepts } from "./version";

let client: LanguageClient | undefined;

/** The tail of every start, stop, and restart so far; each waits for the one before it. */
let queue: Promise<void> = Promise.resolve();

/** Runs [task] once everything queued before it has finished, whether that succeeded or not. */
function enqueue(task: () => Promise<void>): Promise<void> {
  const run = queue.then(task);
  queue = run.catch(() => undefined);
  return run;
}

function settings(): { path: string; roots: string[]; strict: boolean } {
  const config = vscode.workspace.getConfiguration("schemata");
  return {
    path: config.get<string>("path", "schemata"),
    roots: config.get<string[]>("roots", []),
    strict: config.get<boolean>("strict", false),
  };
}

/** Runs `<path> --version`; resolves to its output, or undefined when it cannot be run. */
function versionOf(path: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    execFile(path, ["--version"], { timeout: 10_000 }, (error, stdout) => {
      resolve(error ? undefined : stdout);
    });
  });
}

async function start(): Promise<void> {
  const { path, roots, strict } = settings();
  const output = await versionOf(path);
  if (output === undefined) {
    void vscode.window.showErrorMessage(
      `Schemata: could not run "${path}". Install it with "brew install msbolton/schemata/schemata", ` +
        `or set schemata.path to the binary.`,
    );
    return;
  }
  if (!accepts(output)) {
    void vscode.window.showErrorMessage(
      `Schemata: "${path}" is ${output.trim() || "an unknown version"}; the language server needs ` +
        `${MINIMUM.join(".")} or later. Upgrade it, or set schemata.path to a newer binary.`,
    );
    return;
  }
  const server: ServerOptions = { command: path, args: ["lsp"] };
  const options: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "schemata" }],
    initializationOptions: { roots, strict },
    synchronize: { configurationSection: "schemata" },
  };
  const candidate = new LanguageClient("schemata", "Schemata", server, options);
  client = candidate;
  try {
    await candidate.start();
  } catch (error) {
    // A server that fails to start must not leave a half-started client behind, or take the
    // extension's activation down with it.
    if (client === candidate) client = undefined;
    const reason = error instanceof Error ? error.message : String(error);
    void vscode.window.showErrorMessage(`Schemata: the language server did not start: ${reason}`);
  }
}

async function stop(): Promise<void> {
  const running = client;
  client = undefined;
  if (running) await running.stop();
}

function restart(): Promise<void> {
  return enqueue(async () => {
    await stop();
    await start();
  });
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  context.subscriptions.push(
    vscode.commands.registerCommand("schemata.restartServer", restart),
    vscode.workspace.onDidChangeConfiguration(async (event) => {
      if (event.affectsConfiguration("schemata.path")) await restart();
    }),
  );
  await enqueue(start);
}

export function deactivate(): Promise<void> {
  return enqueue(stop);
}
