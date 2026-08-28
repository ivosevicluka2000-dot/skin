#!/usr/bin/env node
import { spawn } from "node:child_process";
import process from "node:process";

const root = new URL("../", import.meta.url);
const shouldBuild = process.argv.includes("--build");

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed (${signal ?? code})`));
    });
  });
}

const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 22 || (major === 22 && minor < 13)) {
  throw new Error(`Node 22.13+ is required; current runtime is ${process.versions.node}`);
}

if (shouldBuild) await run("npm", ["run", "build"]);

await run(process.execPath, [
  "--test",
  "tests/source-contract.test.mjs",
  "tests/data-integrity.test.mjs",
  "tests/rendered-html.test.mjs",
  "tests/performance-budget.test.mjs",
]);

console.log("\nMVP browser-free verification passed.");
