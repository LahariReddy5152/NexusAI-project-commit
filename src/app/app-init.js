/** Platform bootstrap — side effects moved from monolithic dashboard.js */
import { updateAnalytics, renderJobs, unlockCertificates } from "./app-platform.js";
import { sendMessage } from "../virtual-recruiter/vr-chat.js";
export function initAppPlatform() {
  renderJobs();
  unlockCertificates();

  const savedName = localStorage.getItem("profileName");
  if (savedName) {
    const el = document.getElementById("profileName");
    if (el) el.innerText = savedName;
  }

  const savedEmail = localStorage.getItem("profileEmail");
  if (savedEmail) {
    const el = document.getElementById("profileEmail");
    if (el) el.innerText = savedEmail;
  }

  updateAnalytics();
  if (document.getElementById("interviewSection") && typeof window.initInterviewSection === "function") {
    window.initInterviewSection();
  }

  const chatInput = document.getElementById("chatInput");
  if (chatInput) {
    chatInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    });
  }
}
