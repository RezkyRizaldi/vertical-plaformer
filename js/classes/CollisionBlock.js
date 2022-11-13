import { c } from '../data/canvas.js';

/** @type {{ position: { x: Number, y: Number }, width: Number, height: Number }} */
export class CollisionBlock {
	/**
	 *
	 * @param {{ position: { x: Number, y: Number }, height: Number }}
	 */
	constructor({ position, height = 16 }) {
		this.position = position;
		this.width = 16;
		this.height = height;
	}

	draw() {
		c.fillStyle = 'rgba(255, 0, 0, 0.5)';
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

	update() {
		this.draw();
	}
}
