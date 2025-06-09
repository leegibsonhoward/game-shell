// src/core/collision/SAT.js

/**
 * Projects a polygon onto an axis and returns min/max projection values.
 * @param {Array} points - Array of points like { x, y }
 * @param {Object} axis - The axis vector { x, y }
 * @returns {{min: number, max: number}}
 */
function projectOntoAxis(points, axis) {
  let min = Infinity;
  let max = -Infinity;

  for (const point of points) {
    const projection = point.x * axis.x + point.y * axis.y;
    min = Math.min(min, projection);
    max = Math.max(max, projection);
  }

  return { min, max };
}

/**
 * Gets normalized perpendicular axes from polygon edges.
 * @param {Array} polygon - Array of points { x, y }
 * @returns {Array} - Array of unit normal vectors { x, y }
 */
function getPolygonAxes(polygon) {
  const axes = [];

  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y };

    // Perpendicular (normal) to the edge
    const normal = { x: -edge.y, y: edge.x };
    const length = Math.hypot(normal.x, normal.y);

    // Normalize
    axes.push({ x: normal.x / length, y: normal.y / length });
  }

  return axes;
}

/**
 * Converts an AABB to a polygon of 4 corners
 * @param {Object} box - AABB with { x, y, width, height }
 * @returns {Array} - Polygon [{x, y}, ...]
 */
function aabbToPolygon(box) {
  return [
    { x: box.x, y: box.y },
    { x: box.x + box.width, y: box.y },
    { x: box.x + box.width, y: box.y + box.height },
    { x: box.x, y: box.y + box.height },
  ];
}

/**
 * Checks if two convex polygons intersect using the Separating Axis Theorem (SAT)
 * @param {Array} polyA - Array of points
 * @param {Array} polyB - Array of points
 * @returns {boolean}
 */
function polygonsIntersect(polyA, polyB) {
  const axes = [...getPolygonAxes(polyA), ...getPolygonAxes(polyB)];

  for (const axis of axes) {
    const projA = projectOntoAxis(polyA, axis);
    const projB = projectOntoAxis(polyB, axis);

    if (projA.max < projB.min || projB.max < projA.min) {
      return false; // No overlap on this axis → separation exists
    }
  }

  return true; // All projections overlap → polygons intersect
}

/**
 * Public utility: Check if a box intersects a polygon
 * @param {Object} box - AABB: { x, y, width, height }
 * @param {Array} polygon - Polygon [{ x, y }, ...]
 * @returns {boolean}
 */
export function aabbIntersectsPolygon(box, polygon) {
  const boxPoly = aabbToPolygon(box);
  return polygonsIntersect(boxPoly, polygon);
}
