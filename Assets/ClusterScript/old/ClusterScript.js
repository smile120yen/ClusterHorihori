const item = $.subNode("Cube");
const period = 3;
const width = 4;

const trapezoidalWave = (t) => {
  if (t < 0.25) {
    return t * 4;
  } else 
  if (t < 0.5) {
    return 1;
  } else
  if (t < 0.75) {
    return 3 - t * 4;
  } else {
    return 0;
  }
};

$.onUpdate(deltaTime => {
  let time = $.state.time ?? 0;
  time += deltaTime;
  $.state.time = time;
  const pos = new Vector3(
    trapezoidalWave(time % period / period) * width - width / 2, 
    0, 
    0);
  item.setPosition(pos);
});