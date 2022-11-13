export const canvas = document.querySelector('canvas');
export const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

export const scaledCanvas = {
	width: canvas.width / 4,
	height: canvas.height / 4,
};
