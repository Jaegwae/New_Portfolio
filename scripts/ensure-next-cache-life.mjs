import path from "node:path";

import * as nextConfigModule from "next/dist/server/config.js";
import { writeCacheLifeTypes } from "next/dist/server/lib/router-utils/cache-life-type-utils.js";
import { PHASE_PRODUCTION_BUILD } from "next/dist/shared/lib/constants.js";

async function main() {
  const projectDir = process.cwd();
  const loadConfig = nextConfigModule.default?.default ?? nextConfigModule.default ?? nextConfigModule;
  const nextConfig = await loadConfig(PHASE_PRODUCTION_BUILD, projectDir);
  const cacheLifeFilePath = path.join(projectDir, nextConfig.distDir, "types", "cache-life.d.ts");

  writeCacheLifeTypes(nextConfig.cacheLife, cacheLifeFilePath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
