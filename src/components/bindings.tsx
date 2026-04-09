import Binds from "./bindings/binds";
import {
  BINDING_VIEWBOX_HEIGHT,
  BINDING_VIEWBOX_WIDTH,
} from "./bindings/constants";
import Holes from "./bindings/holes";
import Hook from "./bindings/hook";
import Wire from "./bindings/wire";

export default function Bindings() {
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-9 z-40 overflow-hidden">
      <svg
        viewBox={`0 0 ${BINDING_VIEWBOX_WIDTH} ${BINDING_VIEWBOX_HEIGHT}`}
        className="block h-12 w-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <Holes className="fill-background" />
        <Binds className="stroke-foreground" />
        <Wire className="stroke-foreground" />
        <Hook className="fill-foreground" />
      </svg>
    </div>
  );
}
