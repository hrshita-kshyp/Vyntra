import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { vyntraMarkPaths } from "../src/assets/vyntraMark.js";

const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
mkdirSync(`${publicDirectory}brand`, { recursive: true });
const paths = vyntraMarkPaths.map((d) => `<path d="${d}"/>`).join("");
const svg = (width, height, viewBox, content) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">${content}</svg>\n`;

writeFileSync(
  `${publicDirectory}brand/vyntra-mark.svg`,
  svg(
    40,
    40,
    "0 0 40 40",
    `<title>Vyntra</title><g fill="#203a30">${paths}</g>`,
  ),
);
writeFileSync(
  `${publicDirectory}brand/vyntra-mark-light.svg`,
  svg(
    40,
    40,
    "0 0 40 40",
    `<title>Vyntra</title><g fill="#eef1e5">${paths}</g>`,
  ),
);
writeFileSync(
  `${publicDirectory}brand/vyntra-logo.svg`,
  svg(
    200,
    48,
    "0 0 200 48",
    `<title>Vyntra</title><g fill="#203a30" transform="translate(0 4)">${paths}</g><text x="51" y="34" fill="#203a30" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="-1.7">vyntra</text>`,
  ),
);
writeFileSync(
  `${publicDirectory}brand/vyntra-app-icon.svg`,
  svg(
    512,
    512,
    "0 0 64 64",
    `<rect width="64" height="64" rx="14" fill="#203a30"/><g fill="#eef1e5" transform="translate(12 12)">${paths}</g>`,
  ),
);
writeFileSync(
  `${publicDirectory}logo.svg`,
  svg(
    40,
    40,
    "0 0 64 64",
    `<style>@media(prefers-color-scheme:dark){.tile{fill:#eef1e5}.mark{fill:#203a30}}</style><rect class="tile" width="64" height="64" rx="14" fill="#203a30"/><g class="mark" fill="#eef1e5" transform="translate(12 12)">${paths}</g>`,
  ),
);
console.log(
  "Generated Vyntra mark, light mark, wordmark, app icon, and favicon.",
);
