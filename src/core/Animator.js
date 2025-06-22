/**
 * Animator handles frame-based animations from a sprite sheet.
 * It supports multiple named animations and frame timing.
 */
export default class Animator {
  constructor(config) {
    // Sprite sheet image
    this.image = config.image;

    // Dimensions of a single animation frame
    this.frameWidth = config.frameWidth;
    this.frameHeight = config.frameHeight;

    // Animation definitions: { idle: [0], walk: [1,2,3,4] }
    this.animations = config.animations;

    // Duration of each frame in ms
    this.frameDuration = config.frameDuration || 100;

    // Active animation key
    this.current = config.default || Object.keys(this.animations)[0];

    console.log("Animator init → current:", this.current);
console.log("Frames:", this.animations[this.current]);

    // Time tracking
    this.elapsed = 0;
    this.frameIndex = 0;
  }

  /**
   * Advance the animation by delta time (ms)
   */
  update(deltaTime) {
    const anim = this.animations[this.current];
  const frames = Array.isArray(anim) ? anim : anim.frames;

  if (!frames || !Array.isArray(frames) || frames.length === 0) return;

  this.elapsed += deltaTime;
  if (this.elapsed >= this.frameDuration) {
    this.elapsed -= this.frameDuration;
    this.frameIndex = (this.frameIndex + 1) % frames.length;
  }
  }

  /**
   * Get current frame position (in sprite sheet coordinates)
   */
  getCurrentFrame() {
     const anim = this.animations[this.current];
  if (!anim) return null;

  const frames = Array.isArray(anim) ? anim : anim.frames;
  if (!Array.isArray(frames)) return null;

  const frameId = frames[this.frameIndex] ?? 0; // fallback to 0
  const image = anim.image || this.image;

  const cols = Math.floor(image.width / this.frameWidth || 1); // avoid /0

  console.log("DEBUG frame:", {
    current: this.current,
    frameId,
    frameIndex: this.frameIndex,
    totalFrames: frames.length,
    imageWidth: image?.width,
    imageLoaded: image instanceof HTMLImageElement
  });
  return {
    x: (frameId % cols) * this.frameWidth,
    y: Math.floor(frameId / cols) * this.frameHeight,
    width: this.frameWidth,
    height: this.frameHeight,
    image
  };
  }

  /**
   * Change to a different animation by name
   */
  setAnimation(name) {
    if (this.current !== name && this.animations[name]) {
      this.current = name;
      this.frameIndex = 0;
      this.elapsed = 0;
    }
  }
}
