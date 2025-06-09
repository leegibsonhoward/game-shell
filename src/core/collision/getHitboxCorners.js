// core/collision/getHitboxCorners.js

import { getHitbox } from "./getHitbox.js";

export function getHitboxCorners(entity) {
  const box = getHitbox(entity);
  return [
    [box.x, box.y],
    [box.x + box.width, box.y],
    [box.x, box.y + box.height],
    [box.x + box.width, box.y + box.height],
  ];
}
