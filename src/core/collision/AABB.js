// src/core/collision/AABB.js

import { getHitbox } from './getHitbox.js';

export function checkAABBCollision(a, b) {
  const boxA = getHitbox(a);
  const boxB = getHitbox(b);

  return (
    boxA.x < boxB.x + boxB.width &&
    boxA.x + boxA.width > boxB.x &&
    boxA.y < boxB.y + boxB.height &&
    boxA.y + boxA.height > boxB.y
  );
}
