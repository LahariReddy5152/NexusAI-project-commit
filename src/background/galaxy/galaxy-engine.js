/**
 * Global background bootstrap — single mount for entire dashboard SPA.
 */
import { initNexusCosmos, NexusCosmosEngine } from "../../shared/animations/galaxy-background.js";

export function ensureCosmosBackground() {
  if (!window.__nexusCosmos) {
    initNexusCosmos();
  }
  return window.__nexusCosmos;
}

ensureCosmosBackground();

export { initNexusCosmos, NexusCosmosEngine };
export { initNexusCosmos as initGalaxyBackground, NexusCosmosEngine as NexusGalaxyBackground };
