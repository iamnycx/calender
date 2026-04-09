const MAX_NOTE_LINES = 10;
const MAX_CHARS_PER_LINE = 24;

function splitTextIntoLines(text: string): string[] {
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

    if (lines.length === MAX_NOTE_LINES) {
      return lines;
    }
  }

  if (currentLine && lines.length < MAX_NOTE_LINES) {
    lines.push(currentLine);
  }

  while (lines.length < MAX_NOTE_LINES) {
    lines.push("");
  }

  return lines;
}

interface NotesLegacyProps {
  text: string;
  title?: string;
  metadata?: string;
  onClick?: () => void;
}

export default function NotesLegacy({
  text,
  title = "Notes",
  metadata,
  onClick,
}: NotesLegacyProps) {
  const noteLines = splitTextIntoLines(text);

  return (
    <button
      type="button"
      onClick={onClick}
      className="font-kamal mt-16 block w-full appearance-none space-y-2 border-0 bg-transparent px-4 text-left"
    >
      <h1 className="font-black tracking-tight">{title}</h1>
      <div className="relative overflow-hidden text-[0.65rem] tracking-wide">
        <ol>
          {noteLines.map((line, index) => (
            <li
              key={`${index}-${line}`}
              className="border-foreground/40 flex min-h-4 items-end border-b"
            >
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </div>
      {metadata && (
        <p className="text-foreground/55 text-[0.56rem] font-semibold tracking-wide uppercase">
          {metadata}
        </p>
      )}
    </button>
  );
}
