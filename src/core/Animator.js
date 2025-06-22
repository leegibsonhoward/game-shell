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

    // Time tracking
    this.elapsed = 0;
    this.frameIndex = 0;
  }

  /**
   * Advance the animation by delta time (ms)
   */
  update(deltaTime) {
    this.elapsed += deltaTime;
    if (this.elapsed >= this.frameDuration) {
      this.elapsed -= this.frameDuration;
      this.frameIndex = (this.frameIndex + 1) % this.animations[this.current].length;
    }
  }

  /**
   * Get current frame position (in sprite sheet coordinates)
   */
  getCurrentFrame() {
    const frameId = this.animations[this.current][this.frameIndex];
    const cols = Math.floor(this.image.width / this.frameWidth);

    return {
      x: (frameId % cols) * this.frameWidth,
      y: Math.floor(frameId / cols) * this.frameHeight,
      width: this.frameWidth,
      height: this.frameHeight,
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
