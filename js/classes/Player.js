import { collision, platformCollision } from '../utils.js';
import { Sprite } from './Sprite.js';

/** @type {{ position: { x: Number, y: Number }, velocity: { x: Number, y: Number }, collisionBlocks: CollisionBlock[], platformCollisionBlocks: CollisionBlock[], hitbox: { position: { x: Number, y: Number }, width: Number, height: Number }, animations: { Idle: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, Run: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, Jump: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, Fall: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, FallLeft: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, RunLeft: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, IdleLeft: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, JumpLeft: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number } }, lastDirection: 'right' | 'left', camerabox: { position: { x: Number, y: Number }, width: Number, height: Number } }} */
export class Player extends Sprite {
	/**
	 *
	 * @param {{ position: { x: Number, y: Number }, scale: Number, collisionBlocks: CollisionBlock[], platformCollisionBlocks: CollisionBlock[], imageSrc: String, frameRate: Number, animations: { Idle: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, Run: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, Jump: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, Fall: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, FallLeft: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, RunLeft: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, IdleLeft: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number }, JumpLeft: { imageSrc: String, frameRate: Number, image: HTMLImageElement, frameBuffer: Number } } }}
	 */
	constructor({ position, scale = 0.5, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, animations }) {
		super({ scale, imageSrc, frameRate });
		this.position = position;
		this.velocity = {
			x: 0,
			y: 1,
		};
		this.collisionBlocks = collisionBlocks;
		this.platformCollisionBlocks = platformCollisionBlocks;
		this.hitbox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 10,
			height: 10,
		};
		this.animations = animations;
		this.lastDirection = 'right';

		for (let key in this.animations) {
			const image = new Image();

			image.src = this.animations[key].imageSrc;
			this.animations[key].image = image;
		}

		this.camerabox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		};
	}

	/**
	 *
	 * @param {'Idle' | 'Run' | 'Jump' | 'Fall' | 'FallLeft' | 'RunLeft' | 'IdleLeft' | 'JumpLeft'} key
	 */
	switchSprite(key) {
		if (this.image === this.animations[key].image || !this.loaded) return;

		this.currentFrame = 0;
		this.image = this.animations[key].image;
		this.frameBuffer = this.animations[key].frameBuffer;
		this.frameRate = this.animations[key].frameRate;
	}

	updateCamerabox() {
		this.camerabox = {
			position: {
				x: this.position.x - 50,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		};
	}

	checkForHorizontalCanvasCollision() {
		if (this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 || this.hitbox.position.x + this.velocity.x <= 0) {
			this.velocity.x = 0;
		}
	}

	/**
	 *
	 * @param {{ scaledCanvasWidth: Number, camera: { position: { x: Number, y: Number } } }}
	 */
	shouldPanCameraLeft({ scaledCanvasWidth, camera }) {
		const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;

		if (cameraboxRightSide >= 576) return;

		if (cameraboxRightSide >= scaledCanvasWidth + Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	/**
	 *
	 * @param {{ camera: { position: { x: Number, y: Number } } }}
	 */
	shouldPanCameraRight({ camera }) {
		if (this.camerabox.position.x <= 0) return;

		if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
			camera.position.x -= this.velocity.x;
		}
	}

	/**
	 *
	 * @param {{ camera: { position: { x: Number, y: Number } } }}
	 */
	shouldPanCameraDown({ camera }) {
		if (this.camerabox.position.y + this.velocity.y <= 0) return;

		if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
			camera.position.y -= this.velocity.y;
		}
	}

	/**
	 *
	 * @param {{ scaledCanvasHeight: Number, camera: { position: { x: Number, y: Number } } }}
	 */
	shouldPanCameraUp({ scaledCanvasHeight, camera }) {
		const cameraboxBottomSide = this.camerabox.position.y + this.camerabox.height;

		if (cameraboxBottomSide + this.velocity.y >= 432) return;

		if (cameraboxBottomSide >= Math.abs(camera.position.y) + scaledCanvasHeight) {
			camera.position.y -= this.velocity.y;
		}
	}

	update() {
		this.updateFrames();
		this.updateHitbox();
		this.updateCamerabox();
		this.draw();
		this.position.x += this.velocity.x;
		this.updateHitbox();
		this.checkForHorizontalCollisions();
		this.applyGravity();
		this.updateHitbox();
		this.checkForVerticalCollisions();
	}

	updateHitbox() {
		this.hitbox = {
			position: {
				x: this.position.x + 35,
				y: this.position.y + 26,
			},
			width: 14,
			height: 27,
		};
	}

	checkForHorizontalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (collision({ firstObj: this.hitbox, secondObj: collisionBlock })) {
				if (this.velocity.x > 0) {
					const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

					this.velocity.x = 0;
					this.position.x = collisionBlock.position.x - offset - 0.01;
					break;
				}

				if (this.velocity.x < 0) {
					const offset = this.hitbox.position.x - this.position.x;

					this.velocity.x = 0;
					this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
					break;
				}
			}
		}
	}

	applyGravity() {
		const gravity = 0.1;

		this.velocity.y += gravity;
		this.position.y += this.velocity.y;
	}

	checkForVerticalCollisions() {
		for (let i = 0; i < this.collisionBlocks.length; i++) {
			const collisionBlock = this.collisionBlocks[i];

			if (collision({ firstObj: this.hitbox, secondObj: collisionBlock })) {
				if (this.velocity.y > 0) {
					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.velocity.y = 0;
					this.position.y = collisionBlock.position.y - offset - 0.01;
					break;
				}

				if (this.velocity.y < 0) {
					const offset = this.hitbox.position.y - this.position.y;

					this.velocity.y = 0;
					this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
					break;
				}
			}
		}

		for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
			const platformCollisionBlock = this.platformCollisionBlocks[i];

			if (platformCollision({ firstObj: this.hitbox, secondObj: platformCollisionBlock })) {
				if (this.velocity.y > 0) {
					const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

					this.velocity.y = 0;
					this.position.y = platformCollisionBlock.position.y - offset - 0.01;
					break;
				}
			}
		}
	}
}
