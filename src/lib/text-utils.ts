const MAX_NOTE_LINES = 10;
const MAX_CHARS_PER_LINE = 22;

export function splitTextIntoLines(text: string, maxLines = MAX_NOTE_LINES) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (candidate.length > MAX_CHARS_PER_LINE) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word.slice(0, MAX_CHARS_PER_LINE));
        currentLine = word.slice(MAX_CHARS_PER_LINE);
      }
    } else {
      currentLine = candidate;
    }

    if (lines.length === maxLines) {
      return lines;
    }
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  while (lines.length < maxLines) {
    lines.push("");
  }

  return lines;
}
