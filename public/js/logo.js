let animationFrame;
let lastMouseX = 0;
let lastMouseY = 0;

const MOVEMENT_LIMIT_PERCENTAGE = 70; // How close pupils can get to edge (0-100%)
const BLINK_MIN_INTERVAL = 3000; // Minimum ms between blinks
const BLINK_MAX_INTERVAL = 6000; // Maximum ms between blinks
const BLINK_FRAMES = 12; // Number of frames for complete blink cycle (close + open)
const BOTH_EYES_BLINK_CHANCE = 0.95; // 95% chance both eyes blink together

// Pre-calculate eye data to avoid DOM queries on every frame
const pupils = document.querySelectorAll('.pupil');
const eyeMasks = document.querySelectorAll('.eye-mask');
const eyeData = Array.from(document.querySelectorAll('.eye')).map((eye, index) => {
	const pupil = pupils[index];
	const eyeMask = eyeMasks[index];
	if (pupil && eyeMask) {
		const eyeCX = parseFloat(eye.getAttribute('cx'));
		const eyeCY = parseFloat(eye.getAttribute('cy'));
		const eyeRX = parseFloat(eye.getAttribute('rx'));
		const eyeRY = parseFloat(eye.getAttribute('ry'));
		const pupilR = parseFloat(pupil.getAttribute('r'));
		
		// Pre-calculate boundaries
		const maxMoveX = (eyeRX - pupilR) * MOVEMENT_LIMIT_PERCENTAGE * 0.01;
		const maxMoveY = (eyeRY - pupilR) * MOVEMENT_LIMIT_PERCENTAGE * 0.01;
		
		return {
			pupil,
			eye,
			eyeMask,
			eyeCX,
			eyeCY,
			maxMoveX,
			maxMoveY,
			ryOriginal: eyeRY, // Store original height for blinking
			ryCurrent: eyeRY,  // Current height during animation
			blinkFrame: 0,     // Current blink animation frame (0 = not blinking)
		};
	}
}).filter(Boolean);

// Cache SVG element and create reusable point
const svg = document.querySelector('svg');
const svgPoint = svg.createSVGPoint();

// Optimized coordinate conversion
const getRelativeCoordinates = (clientX, clientY) => {
	svgPoint.x = clientX;
	svgPoint.y = clientY;
	return svgPoint.matrixTransform(svg.getScreenCTM().inverse());
}

// Blink animation function
const updateBlinks = () => {
	for (let i = 0; i < eyeData.length; i++) {
		const data = eyeData[i];
		
		if (data.blinkFrame > 0) {
			// Currently blinking - update animation
			const halfFrames = BLINK_FRAMES / 2;
			let progress;
			
			if (data.blinkFrame <= halfFrames) {
				// Closing phase
				progress = data.blinkFrame / halfFrames;
			} else {
				// Opening phase
				progress = (BLINK_FRAMES - data.blinkFrame) / halfFrames;
			}
			
			// Smooth easing function (ease-in-out)
			progress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
			
			// Calculate new eye height (close to nearly 0)
			data.ryCurrent = data.ryOriginal * (1 - progress * 0.98);
			data.eye.setAttribute('ry', data.ryCurrent);
			data.eyeMask.setAttribute('ry', data.ryCurrent);
			
			data.blinkFrame--;
			
			if (data.blinkFrame === 0) {
				// Blink complete - ensure eye is fully open
				data.ryCurrent = data.ryOriginal;
				data.eye.setAttribute('ry', data.ryCurrent);
				data.eyeMask.setAttribute('ry', data.ryCurrent);
			}
		}
	}
}

// Schedule random blinks
const scheduleNextBlink = () => {
	const delay = BLINK_MIN_INTERVAL + Math.random() * (BLINK_MAX_INTERVAL - BLINK_MIN_INTERVAL);
	
	setTimeout(() => {
		// Trigger blink on random eye(s)
		const shouldBlinkBoth = Math.random() < BOTH_EYES_BLINK_CHANCE;
		
		if (shouldBlinkBoth) {
			// Blink both eyes
			eyeData.forEach(data => {
				if (data.blinkFrame === 0) { // Only if not already blinking
					data.blinkFrame = BLINK_FRAMES;
				}
			});
		} else {
			// Blink random single eye
			const randomEye = eyeData[Math.floor(Math.random() * eyeData.length)];
			if (randomEye.blinkFrame === 0) {
				randomEye.blinkFrame = BLINK_FRAMES;
			}
		}
		
		scheduleNextBlink(); // Schedule next blink
	}, delay);
}

// Optimized pupil movement with minimal calculations
const updatePupils = (mouseX, mouseY) => {
	for (let i = 0; i < eyeData.length; i++) {
		const data = eyeData[i];
		
		// Calculate offset from eye center
		const deltaX = mouseX - data.eyeCX;
		const deltaY = mouseY - data.eyeCY;
		
		// Use original boundaries - don't adjust for blinking
		// The mask will handle the clipping automatically
		const normalizedX = deltaX / data.maxMoveX;
		const normalizedY = deltaY / data.maxMoveY;
		const ellipseTest = normalizedX * normalizedX + normalizedY * normalizedY;
		
		let newX, newY;
		if (ellipseTest <= 1.0) {
			// Within boundary - direct assignment
			newX = data.eyeCX + deltaX;
			newY = data.eyeCY + deltaY;
		} else {
			// Outside boundary - scale to fit
			const scale = 1.0 / Math.sqrt(ellipseTest);
			newX = data.eyeCX + deltaX * scale;
			newY = data.eyeCY + deltaY * scale;
		}
		
		// Update pupil position (mask will clip it automatically)
		data.pupil.setAttribute('cx', newX);
		data.pupil.setAttribute('cy', newY);
	}
}

const animate = () => {
	updateBlinks();
	updatePupils(lastMouseX, lastMouseY);
	requestAnimationFrame(animate);
};

// Start animation loop and blink scheduling
requestAnimationFrame(animate);
scheduleNextBlink();

// Mouse handling
document.addEventListener('mousemove', (event) => {
	const coords = getRelativeCoordinates(event.clientX, event.clientY);
	lastMouseX = coords.x;
	lastMouseY = coords.y;
}, { passive: true });

// Touch handling
document.addEventListener('touchmove', (event) => {
	event.preventDefault();
	const touch = event.touches[0];
	const coords = getRelativeCoordinates(touch.clientX, touch.clientY);
	lastMouseX = coords.x;
	lastMouseY = coords.y;
});