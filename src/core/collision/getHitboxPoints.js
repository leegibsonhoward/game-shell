// core/collision/getHitboxPoints.js

import { getHitbox } from "../collision/getHitbox.js";

export function getHitboxPoints(entity) {
  const box = getHitbox(entity);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  return [
    [box.x, box.y],
    [box.x + box.width, box.y],
    [box.x, box.y + box.height],
    [box.x + box.width, box.y + box.height],
    [cx, box.y],           // top center
    [cx, box.y + box.height], // bottom center
    [box.x, cy],           // left center
    [box.x + box.width, cy], // right center
    [cx, cy],              // center
  ];
}
