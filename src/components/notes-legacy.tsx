import { splitTextIntoLines } from "~/lib/text-utils";

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
  const noteLines = splitTextIntoLines(text, 10);

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
