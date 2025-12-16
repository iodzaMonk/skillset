// Alias Vitest's API to `jest` so existing Jest-style tests keep working
import { vi, type SpyInstance as ViSpyInstance } from "vitest";

globalThis.jest = vi;

declare global {
  // Allow `jest` global in TypeScript

  var jest: typeof vi;

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type SpyInstance<T = any, A extends any[] = any[]> = ViSpyInstance<T, A>;
  }
}
