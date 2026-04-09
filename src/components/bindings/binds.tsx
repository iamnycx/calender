import { HOLE_X_POSITIONS } from "./constants";

type BindsProps = {
  className?: string;
};

function createLeftArcPath(x: number) {
  return `M${x + 3} 39C${x + 2.916} 35.873 ${x + 3.049} 33 ${x + 2} 33C${x + 0.5} 33 ${x} 35.6863 ${x} 39C${x} 42.3137 ${x + 0.3281} 44.4427 ${x + 2} 45C${x + 4.3763} 45.7921 ${x + 6.5} 44 ${x + 6.5} 43`;
}

function createRightArcPath(x: number) {
  return `M${x + 7} 39C${x + 6.916} 35.873 ${x + 7.049} 33 ${x + 6} 33C${x + 4.5} 33 ${x + 4} 35.6863 ${x + 4} 39C${x + 4} 42.3137 ${x + 4.3281} 44.4427 ${x + 6} 45C${x + 7.5} 45.5 ${x + 8.5} 44 ${x + 10} 44`;
}

export default function Binds({ className }: BindsProps) {
  return (
    <g id="binds" className={className}>
      {HOLE_X_POSITIONS.map((x) => (
        <g key={x}>
          <path d={createLeftArcPath(x)} strokeWidth={2} fill="none" />
          <path d={createRightArcPath(x)} strokeWidth={2} fill="none" />
        </g>
      ))}
    </g>
  );
}
