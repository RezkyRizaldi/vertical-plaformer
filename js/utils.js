/**
 *
 * @param {{ firstObj: any, secondObj: any }}
 * @returns {Boolean} collision detection
 */
export const collision = ({ firstObj, secondObj }) =>
	firstObj.position.y + firstObj.height >= secondObj.position.y &&
	firstObj.position.y <= secondObj.position.y + secondObj.height &&
	firstObj.position.x <= secondObj.position.x + secondObj.width &&
	firstObj.position.x + firstObj.width >= secondObj.position.x;

/**
 *
 * @param {{ firstObj: any, secondObj: any }}
 * @returns {Boolean} platform collision detection
 */
export const platformCollision = ({ firstObj, secondObj }) =>
	firstObj.position.y + firstObj.height >= secondObj.position.y &&
	firstObj.position.y + firstObj.height <= secondObj.position.y + secondObj.height &&
	firstObj.position.x <= secondObj.position.x + secondObj.width &&
	firstObj.position.x + firstObj.width >= secondObj.position.x;
