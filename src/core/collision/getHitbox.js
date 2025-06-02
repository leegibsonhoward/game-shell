/**
 * Returns the true collision box of an entity
 * Falls back to full body if no custom hitbox is present
 */
export function getHitbox(entity) {
  if (!entity.hitbox) {
    return { x: entity.x, y: entity.y, width: entity.width, height: entity.height };
  }
  const { offsetX, offsetY, width, height } = entity.hitbox;
  return {
    x: entity.x + offsetX,
    y: entity.y + offsetY,
    width,
    height
  };
}
