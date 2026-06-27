import { openInterviewPrepCard, showInterviewPanel } from "./interview-prep.js";

export function openInterviewTrack(track) {
  if (typeof generateInterviewQuestions === "function") {
    generateInterviewQuestions(track);
    return;
  }
  openInterviewPrepCard("technical");
  showInterviewPanel("technical");
}
