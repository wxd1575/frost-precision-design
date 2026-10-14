import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { builtinModules } from "node:module";
import { join, resolve } from "node:path";

const root = resolve(__dirname, "../..");
const srcDir = join(root, "src");

const listSourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return listSourceFiles(full);
    return /\.(ts|tsx)$/.test(name) && !/\.(test|spec)\./.test(name) ? [full] : [];
  });

const packageName = (specifier: string): string => {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
};

describe("declared dependencies", () => {
  // Regression: @supabase/supabase-js resolved from ~/node_modules locally but was
  // missing from package.json, so the Vercel build failed with module_not_found.
  it("declares every package imported from src/ in package.json", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const declared = new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
    ]);
    const builtins = new Set(builtinModules);

    const imported = new Set<string>();
    const importPattern =
      /^\s*(?:import|export)\b[^"'`;]*?\bfrom\s*["']([^"']+)["']|^\s*import\s*["']([^"']+)["']|\bimport\(\s*["']([^"']+)["']\s*\)/gm;
    for (const file of listSourceFiles(srcDir)) {
      for (const match of readFileSync(file, "utf8").matchAll(importPattern)) {
        const specifier = match[1] ?? match[2] ?? match[3];
        if (/^(\.|@\/|node:)/.test(specifier) || builtins.has(specifier)) continue;
        imported.add(packageName(specifier));
      }
    }

    const missing = [...imported].filter((name) => !declared.has(name));
    expect(missing).toEqual([]);
  });
});
