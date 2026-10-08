export type Version = [number, number, number];

/** The first version of `schemata` that reads the 2.0 syntax this extension highlights. */
export const MINIMUM: Version = [2, 0, 0];

/** Reads the output of `schemata --version` (`schemata 0.8.0`, or `0.8.0-dev+sha` for a build). */
export function parseVersion(output: string): Version | undefined {
  const match = /^schemata (\d+)\.(\d+)\.(\d+)/.exec(output.trim());
  if (!match) return undefined;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function supports(version: Version): boolean {
  for (let i = 0; i < 3; i++) {
    if (version[i] !== MINIMUM[i]) return version[i] > MINIMUM[i];
  }
  return true;
}
