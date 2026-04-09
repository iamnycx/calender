type WireProps = {
  className?: string;
};

export default function Wire({ className }: WireProps) {
  return (
    <g id="wire" className={className}>
      <path
        d="M47 36C47 36 183 36 198.5 36C214 36 214 12 228 12C240.5 12 239.5 36 255 36C314.36 36 407 36 407 36"
        strokeWidth={2}
        fill="none"
      />
    </g>
  );
}
