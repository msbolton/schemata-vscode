/** What `WorkspaceConfiguration.inspect` reports for one setting. */
export interface Inspected<T> {
  key: string;
  defaultValue?: T;
  globalValue?: T;
  workspaceValue?: T;
  workspaceFolderValue?: T;
}

/** The value the user set at the narrowest scope, or undefined when they set none. */
export function chosen<T>(inspected: Inspected<T> | undefined): T | undefined {
  if (inspected === undefined) return undefined;
  return inspected.workspaceFolderValue ?? inspected.workspaceValue ?? inspected.globalValue;
}

/**
 * The initialization options for the language server: only the settings the user set, so the
 * project's schemata.toml supplies the rest (SCH-104).
 */
export function initializationOptions(
  roots: Inspected<string[]> | undefined,
  strict: Inspected<boolean> | undefined,
): { roots?: string[]; strict?: boolean } {
  const options: { roots?: string[]; strict?: boolean } = {};
  const r = chosen(roots);
  if (r !== undefined) options.roots = r;
  const s = chosen(strict);
  if (s !== undefined) options.strict = s;
  return options;
}
