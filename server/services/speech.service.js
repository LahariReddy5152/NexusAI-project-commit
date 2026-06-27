const FILLERS = ["um", "uh", "like", "you know", "basically", "actually", "sort of", "kind of"];
const CONFIDENCE = ["i led", "i implemented", "i designed", "we shipped", "result was", "improved by"];

export function analyzeSpeechTranscript(text, questionContext = "") {
  if (!text?.trim()) {
    return { success: false, message: "Transcript is required" };
  }

  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const fillerCount = FILLERS.reduce(
    (n, f) => n + (text.toLowerCase().match(new RegExp(`\\b${f}\\b`, "g"))?.length || 0),
    0
  );
  const unique = new Set(words);
  const repetitionRatio = words.length ? Math.round((1 - unique.size / words.length) * 100) : 0;
  const wpm = words.length ? Math.round((words.length / Math.max(text.split(/[.!?]+/).length, 1)) * 15) : 0;
  const confidenceHits = CONFIDENCE.filter((c) => text.toLowerCase().includes(c)).length;
  const hasStructure = /\b(first|then|finally|because|step|situation|action|result)\b/i.test(text);

  let clarity = 60;
  let confidence = 55;
  let structure = 50;
  const suggestions = [];

  if (fillerCount <= 2) clarity += 15;
  else suggestions.push("Reduce filler words — pause briefly instead of saying um/like.");
  if (repetitionRatio < 15) clarity += 10;
  else suggestions.push("Improve clarity — avoid repeating the same phrases.");
  if (wpm > 90 && wpm < 180) clarity += 10;
  if (wpm > 180) suggestions.push("Slow speaking speed slightly for better clarity.");
  if (confidenceHits >= 1) confidence += 20;
  else suggestions.push("Use active ownership language (I led, I implemented).");
  if (hasStructure) structure += 25;
  else suggestions.push("Improve structure — use signposting (First, Then, Result) or STAR.");
  if (suggestions.length === 0) suggestions.push("Strong delivery — maintain this clarity and structure.");

  const overall = Math.min(100, Math.round((clarity + confidence + structure) / 3));

  return {
    success: true,
    transcript: text,
    fillerCount,
    repetitionRatio,
    wordsPerMinute: wpm,
    confidenceHits,
    scores: { clarity: Math.min(100, clarity), confidence: Math.min(100, confidence), structure: Math.min(100, structure), overall },
    suggestions,
    questionContext: questionContext.slice(0, 200)
  };
}

export function synthesizeSpeechPayload(text) {
  return {
    success: true,
    text,
    engine: "browser",
    instruction: "Use window.speechSynthesis with a clear voice for playback."
  };
}
