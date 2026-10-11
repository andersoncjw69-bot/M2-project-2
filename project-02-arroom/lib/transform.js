export const MIN_SCALE = 0.2;
export const MAX_SCALE = 3.0;

// TODO 5: Work out the new size and the new turn from a gesture.
//
// Outcome: nextScale(startScale, ratio) multiplies the scale the sculpture had when the pinch began by the pinch ratio,
// never below MIN_SCALE or above MAX_SCALE. nextRotation(startRotation, twist) gives the new turn (radians
// around the vertical axis) from the turn at the start of the gesture and the finger twist so far, so that
// a clockwise twist of the fingers turns the sculpture clockwise as seen from above.
// Neither function touches position: pinching or twisting never moves a placed sculpture.
// Verify:  nextScale(1, 10) is 3 and nextScale(1, 0.01) is 0.2; nextScale(1.5, 0.5) is 0.75.
// In the room, pinch hard both ways: the sculpture stops at both limits; twist: it turns with your fingers.
// Reflect (in your Notes doc): the pinch event reports a ratio, not a size. What is it a ratio of?
//
// Your code below ↓
export function nextScale(startScale, ratio) {
  const scaled = startScale * ratio;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaled));
}

export function nextRotation(startRotation, twist) {
  return startRotation - twist;
}
