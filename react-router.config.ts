import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Disable SSR to avoid Bun compatibility issues with renderToPipeableStream
  ssr: false,
} satisfies Config;
