// core/collision/getCorners.js
export function getEntityCorners(entity) {
  return [
    [entity.x, entity.y],
    [entity.x + entity.width, entity.y],
    [entity.x, entity.y + entity.height],
    [entity.x + entity.width, entity.y + entity.height],
  ];
}