import { escapeHtml } from "../shared/helpers.js";

export function renderCodeBlock(code, lang) {
    if (!code) return "";
    const lines = String(code).split("\n");
    const numbered = lines.map((line, i) =>
        `<tr><td class="code-ln">${i + 1}</td><td class="code-line">${escapeHtml(line)}</td></tr>`
    ).join("");
    const blockId = "code-" + Math.random().toString(36).slice(2, 9);
    return `
<div class="code-block-wrapper" data-lang="${lang || "python"}">
  <div class="code-block-header">
    <span class="code-lang-badge">${(lang || "code").toUpperCase()}</span>
    <button type="button" class="copy-code-btn" onclick="copyCodeBlock('${blockId}')">Copy Code</button>
  </div>
  <div class="code-block-body">
    <table class="code-table" id="${blockId}"><tbody>${numbered}</tbody></table>
  </div>
</div>`;
}

export function copyCodeBlock(blockId) {
    const table = document.getElementById(blockId);
    if (!table) return;
    const code = [...table.querySelectorAll(".code-line")].map((td) => td.textContent).join("\n");
    navigator.clipboard.writeText(code).then(() => {
        const btn = table.closest(".code-block-wrapper")?.querySelector(".copy-code-btn");
        if (btn) { const orig = btn.textContent; btn.textContent = "Copied!"; setTimeout(() => { btn.textContent = orig; }, 1500); }
    }).catch(() => alert("Copy failed — select code manually."));
}
