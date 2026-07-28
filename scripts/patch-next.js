import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Patch Next.js instrumentation loading
const targetFile1 = path.resolve(
  __dirname,
  "../node_modules/next/dist/server/lib/router-utils/instrumentation-globals.external.js"
);

if (fs.existsSync(targetFile1)) {
  let content = fs.readFileSync(targetFile1, "utf8");
  const targetStr = `if ((0, _iserror.default)(err) && err.code !== 'ENOENT' && err.code !== 'MODULE_NOT_FOUND' && err.code !== 'ERR_MODULE_NOT_FOUND') {`;
  const replacementStr = `if ((0, _iserror.default)(err) && err.code !== 'ENOENT' && err.code !== 'MODULE_NOT_FOUND' && err.code !== 'ERR_MODULE_NOT_FOUND' && !err.message?.includes('Dynamic require')) {`;

  if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    fs.writeFileSync(targetFile1, content, "utf8");
    console.log("[patch-next] Successfully patched Next.js instrumentation handler.");
  } else if (content.includes(replacementStr)) {
    console.log("[patch-next] Next.js instrumentation handler already patched.");
  }
}

// 2. Patch OpenNext codePatcher ENOENT handling
const targetFile2 = path.resolve(
  __dirname,
  "../node_modules/@opennextjs/aws/dist/build/patch/codePatcher.js"
);

if (fs.existsSync(targetFile2)) {
  let content = fs.readFileSync(targetFile2, "utf8");
  const targetSnippet = `const content = await fs.readFile(filePath, "utf-8");`;

  if (content.includes(targetSnippet) && !content.includes(`try {\n            const content = await fs.readFile`)) {
    content = content.replace(
      `const content = await fs.readFile(filePath, "utf-8");`,
      `try {\n            const content = await fs.readFile(filePath, "utf-8");`
    );
    content = content.replace(
      `await fs.writeFile(filePath, patchedContent);\n    }));`,
      `await fs.writeFile(filePath, patchedContent);\n        } catch (err) {\n            if (err.code === 'ENOENT') return;\n            throw err;\n        }\n    }));`
    );
    fs.writeFileSync(targetFile2, content, "utf8");
    console.log("[patch-next] Successfully patched OpenNext codePatcher for missing files.");
  } else {
    console.log("[patch-next] OpenNext codePatcher already patched.");
  }
}

// 3. Patch OpenNext next-server plugin return statement in loadCustomCacheHandlers
const targetFile3 = path.resolve(
  __dirname,
  "../node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/next-server.js"
);

if (fs.existsSync(targetFile3)) {
  let content = fs.readFileSync(targetFile3, "utf8");
  const unpatchedTarget = `globalThis[handlersSetSymbol] = new Set(globalThis[handlersMapSymbol].values());\n\`;`;
  const patchedTarget = `globalThis[handlersSetSymbol] = new Set(globalThis[handlersMapSymbol].values());\n  return;\n\`;`;

  if (content.includes(unpatchedTarget)) {
    content = content.replace(unpatchedTarget, patchedTarget);
    fs.writeFileSync(targetFile3, content, "utf8");
    console.log("[patch-next] Successfully patched OpenNext loadCustomCacheHandlers rule.");
  } else {
    console.log("[patch-next] OpenNext loadCustomCacheHandlers rule already patched.");
  }
}

// 4. Patch OpenNext helper.js initOutputDir EBUSY handling for Windows
const targetFile4 = path.resolve(
  __dirname,
  "../node_modules/@opennextjs/aws/dist/build/helper.js"
);

if (fs.existsSync(targetFile4)) {
  let content = fs.readFileSync(targetFile4, "utf8");
  const unpatchedTarget = `export function initOutputDir(options) {\n    fs.rmSync(options.outputDir, { recursive: true, force: true });`;
  const patchedTarget = `export function initOutputDir(options) {\n    try {\n        fs.rmSync(options.outputDir, { recursive: true, force: true });\n    } catch (err) {\n        if (err.code !== 'EBUSY') throw err;\n    }`;

  if (content.includes(unpatchedTarget)) {
    content = content.replace(unpatchedTarget, patchedTarget);
    fs.writeFileSync(targetFile4, content, "utf8");
    console.log("[patch-next] Successfully patched OpenNext helper.js initOutputDir for Windows EBUSY.");
  } else {
    console.log("[patch-next] OpenNext helper.js initOutputDir already patched.");
  }
}

// 5. Patch @protobufjs/codegen for Cloudflare Worker EvalError handling
const targetFile5 = path.resolve(
  __dirname,
  "../node_modules/@protobufjs/codegen/index.js"
);

if (fs.existsSync(targetFile5)) {
  let content = fs.readFileSync(targetFile5, "utf8");
  const unpatchedTarget = `return Function(source)(); // eslint-disable-line no-new-func`;
  const patchedTarget = `try {\n                return Function(source)();\n            } catch (err) {\n                if (err instanceof EvalError || (err && err.message && err.message.includes('disallowed'))) {\n                    return function() { return {}; };\n                }\n                throw err;\n            }`;

  if (content.includes(unpatchedTarget) && !content.includes(`err instanceof EvalError`)) {
    content = content.replace(unpatchedTarget, patchedTarget);
    fs.writeFileSync(targetFile5, content, "utf8");
    console.log("[patch-next] Successfully patched @protobufjs/codegen for Cloudflare Workers.");
  } else {
    console.log("[patch-next] @protobufjs/codegen already patched.");
  }
}
