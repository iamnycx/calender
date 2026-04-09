type HookProps = {
  className?: string;
};

export default function Hook({ className }: HookProps) {
  return (
    <g id="hook" className={className}>
      <path
        d="M224 1C224 0.447716 224.448 0 225 0H230C230.552 0 231 0.447715 231 1V14C231 16.2091 229.209 18 227 18H225C224.448 18 224 17.5523 224 17V1Z"
      />
    </g>
  );
}
