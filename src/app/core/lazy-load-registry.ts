import { signal } from '@angular/core';

const loaded = signal<readonly string[]>([]);

/** Q9: names of the lazy feature areas whose code has been downloaded so far. */
export const loadedModules = loaded.asReadonly();

/**
 * Called once from the top level of each lazy route file. That code only runs when the
 * router imports the file, so this is proof the area was loaded on demand.
 */
export function registerLazyModule(name: string): void {
  if (loaded().includes(name)) {
    return;
  }
  console.info(`[lazy] ${name} module loaded`);
  loaded.update((names) => [...names, name]);
}
