/**
 * Generate NexusAI logo PNG, ICO, ICNS, and favicon assets
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Resvg } from "@resvg/resvg-js";
import pngToIco from "png-to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const logoDir = path.join(root, "assets", "logo");
const pngDir = path.join(logoDir, "png");
const buildDir = path.join(root, "build");

const SIZES = [64, 128, 256, 512, 1024];

function renderSvg(svgPath, width) {
  const svg = fs.readFileSync(svgPath, "utf8");
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: {
      loadSystemFonts: true,
      defaultFontFamily: "Segoe UI"
    }
  });
  return resvg.render().asPng();
}

function writePng(filePath, buffer) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  console.log("Created", path.relative(root, filePath));
}

async function main() {
  fs.mkdirSync(pngDir, { recursive: true });
  fs.mkdirSync(buildDir, { recursive: true });

  const sources = {
    appIcon: path.join(logoDir, "nexusai-app-icon.svg"),
    icon: path.join(logoDir, "nexusai-icon.svg"),
    horizontalTransparent: path.join(logoDir, "nexusai-horizontal-transparent.svg"),
    horizontalDark: path.join(logoDir, "nexusai-horizontal-dark.svg"),
    horizontalLight: path.join(logoDir, "nexusai-horizontal-light.svg"),
    wordmark: path.join(logoDir, "nexusai-wordmark.svg"),
    favicon: path.join(logoDir, "favicon.svg")
  };

  for (const size of SIZES) {
    writePng(path.join(pngDir, `nexusai-app-icon-${size}.png`), renderSvg(sources.appIcon, size));
    writePng(path.join(pngDir, `nexusai-icon-${size}.png`), renderSvg(sources.icon, size));
  }

  for (const size of SIZES) {
    writePng(path.join(pngDir, `nexusai-horizontal-transparent-${size}.png`), renderSvg(sources.horizontalTransparent, size));
    writePng(path.join(pngDir, `nexusai-horizontal-dark-${size}.png`), renderSvg(sources.horizontalDark, size));
    writePng(path.join(pngDir, `nexusai-horizontal-light-${size}.png`), renderSvg(sources.horizontalLight, size));
  }

  writePng(path.join(buildDir, "icon.png"), renderSvg(sources.appIcon, 512));
  writePng(path.join(pngDir, "nexusai-wordmark-512.png"), renderSvg(sources.wordmark, 512));

  const favicon32 = renderSvg(sources.favicon, 32);
  const favicon16 = renderSvg(sources.favicon, 16);
  writePng(path.join(logoDir, "favicon-32x32.png"), favicon32);
  writePng(path.join(logoDir, "favicon-16x16.png"), favicon16);

  const icoBuffer = await pngToIco([
    path.join(logoDir, "favicon-16x16.png"),
    path.join(logoDir, "favicon-32x32.png"),
    path.join(pngDir, "nexusai-app-icon-64.png"),
    path.join(pngDir, "nexusai-app-icon-128.png"),
    path.join(pngDir, "nexusai-app-icon-256.png")
  ]);
  fs.writeFileSync(path.join(buildDir, "icon.ico"), icoBuffer);
  fs.writeFileSync(path.join(logoDir, "favicon.ico"), icoBuffer);
  fs.writeFileSync(path.join(root, "favicon.ico"), icoBuffer);
  console.log("Created build/icon.ico, assets/logo/favicon.ico, favicon.ico");

  const { default: png2icons } = await import("png2icons");
  const icns = png2icons.createICNS(renderSvg(sources.appIcon, 1024), png2icons.BILINEAR, 0);
  fs.writeFileSync(path.join(buildDir, "icon.icns"), icns);
  fs.writeFileSync(path.join(logoDir, "icon.icns"), icns);
  console.log("Created build/icon.icns, assets/logo/icon.icns");

  console.log("Logo asset generation complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
