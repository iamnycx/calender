import { HOLE_X_POSITIONS } from "./constants";

type HolesProps = {
  className?: string;
};

export default function Holes({ className }: HolesProps) {
  return (
    <g id="holes" className={className}>
      {HOLE_X_POSITIONS.map((x) => (
        <rect key={x} x={x} y={43} width={10} height={8} rx={0.5} />
      ))}
    </g>
  );
}
