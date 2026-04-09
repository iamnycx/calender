export const BINDING_VIEWBOX_WIDTH = 455;
export const BINDING_VIEWBOX_HEIGHT = 51;

const LEFT_START_X = 1;
const RIGHT_START_X = 277;
const LEFT_COUNT = 14;
const RIGHT_COUNT = 15;
const STEP_X = 12;

const leftHoles = Array.from(
  { length: LEFT_COUNT },
  (_, index) => LEFT_START_X + index * STEP_X,
);
const rightHoles = Array.from(
  { length: RIGHT_COUNT },
  (_, index) => RIGHT_START_X + index * STEP_X,
);

export const HOLE_X_POSITIONS = [...leftHoles, ...rightHoles];
