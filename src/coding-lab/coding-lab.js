/** Code Lab — run code simulation */
export function runCode() {
  const code = document.getElementById("codeEditor")?.value;
  const output = document.getElementById("codeOutput");
  if (!output) return;
  if (!code) {
    output.innerText = "Please enter code.";
    return;
  }
  if (code.includes("print")) {
    output.innerText = "Python execution simulated successfully.";
  } else if (code.includes("console.log")) {
    output.innerText = "JavaScript execution simulated successfully.";
  } else {
    output.innerText = "Code validated successfully.";
  }
}
