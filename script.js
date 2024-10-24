// Get the canvas element and its 2D drawing context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define the coordinates and radius of the target
let targetX = canvas.width;
let targetY = canvas.height;
const targetRadius = 150;  // Radius of the target in pixels

// Set canvas width to match its actual display width and define a fixed height
canvas.width = canvas.clientWidth;
canvas.height = 300;

// Function to update target position based on canvas size
function updateTargetPosition() {
    targetX = canvas.width - targetRadius;
    targetY = canvas.height - targetRadius;
}

// Add event listener to update the canvas size and target position when the window is resized
window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = 300;  // Keep height fixed, or adjust as needed
    updateTargetPosition();
    updateLab();  // Redraw the simulation when resized
});


// Main function to update the light refraction simulation and check for target hit
function updateLab() {
    // Get user inputs for the incoming angle and refractive indices of the three materials
    const angle = parseFloat(document.getElementById('angle-input').value);
    const n1 = parseFloat(document.getElementById('material1').value);
    const n2 = parseFloat(document.getElementById('material2').value);
    const n3 = parseFloat(document.getElementById('material3').value);

    // Display the updated angle value
    document.getElementById('angle-display').textContent = angle;

    // Convert the incoming angle to radians for trigonometric calculations
    const angleRad = angle * (Math.PI / 180);

    // Determine the light direction based on the angle
    let direction = 1; // Left to right by default
    let isFromRight = false;
    if (angle > 90) {
        direction = -1; // Right to left
        isFromRight = true; // Light is coming from the right side
    }

    // Adjust angle for calculations to work with angles > 90° correctly
    const adjustedAngle = direction === 1 ? angleRad : Math.PI - angleRad;

    // Calculate the sine of the refracted angle at the first boundary using Snell's law
    const sinRefractedAngle1 = (n1 / n2) * Math.sin(adjustedAngle);

    // Check for total internal reflection at the first boundary
    if (Math.abs(sinRefractedAngle1) > 1) {
        document.getElementById('output').textContent = 'Total Internal Reflection at first boundary';
        return;  // Stop the function if total internal reflection occurs
    }

    // Calculate the first refracted angle in degrees
    const refractedAngle1 = Math.asin(sinRefractedAngle1) * (180 / Math.PI);

    // Convert the first refracted angle to radians for further calculations
    const refractedAngle1Rad = refractedAngle1 * (Math.PI / 180);

    // Calculate the sine of the refracted angle at the second boundary using Snell's law
    const sinRefractedAngle2 = (n2 / n3) * Math.sin(refractedAngle1Rad);

    // Check for total internal reflection at the second boundary
    if (Math.abs(sinRefractedAngle2) > 1) {
        document.getElementById('output').textContent = 'Total Internal Reflection at second boundary';
        return;  // Stop the function if total internal reflection occurs
    }

    // Calculate the second refracted angle in degrees
    const refractedAngle2 = Math.asin(sinRefractedAngle2) * (180 / Math.PI);

    // Clear the canvas before drawing new elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Divide the canvas into three sections representing the three different media
    const mediumWidth = canvas.width / 3;
    const xBoundary1 = mediumWidth;  // Boundary between medium 1 and medium 2
    const xBoundary2 = 2 * mediumWidth;  // Boundary between medium 2 and medium 3
    const yMid = canvas.height / 2;  // Midpoint of the canvas height

    // Draw dashed line in the middle of the canvas to represent the horizontal axis
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, yMid);
    ctx.lineTo(canvas.width, yMid);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);  // Reset line dash to solid lines

    // Draw boundary lines between the media
    ctx.beginPath();
    ctx.moveTo(xBoundary1, 0);
    ctx.lineTo(xBoundary1, canvas.height);
    ctx.moveTo(xBoundary2, 0);
    ctx.lineTo(xBoundary2, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Handle drawing of the incoming ray based on the direction (left to right or right to left)
    const lengthRay = mediumWidth - 50;  // Set the length of the incoming ray
    let x1, y1;
    if (!isFromRight) { // Left to right
        x1 = xBoundary1 - lengthRay * Math.cos(angleRad);  // Calculate x endpoint of the ray
        y1 = yMid - lengthRay * Math.sin(angleRad);  // Calculate y endpoint of the ray
        ctx.beginPath();
        ctx.moveTo(xBoundary1, yMid);  // Start the incoming ray at the boundary
        ctx.lineTo(x1, y1);  // Draw the ray to the calculated endpoint
    } else { // Right to left
        x1 = xBoundary2 + lengthRay * Math.cos(Math.PI - angleRad);  // Calculate x endpoint of the ray
        y1 = yMid + lengthRay * Math.sin(Math.PI - angleRad);  // Calculate y endpoint of the ray
        ctx.beginPath();
        ctx.moveTo(xBoundary2, yMid);  // Start the incoming ray at the boundary
        ctx.lineTo(x1, y1);  // Draw the ray to the calculated endpoint
    }
    ctx.strokeStyle = 'red';  // Set the color of the incoming ray
    ctx.lineWidth = 2;  // Set the line width of the ray
    ctx.stroke();

    // Draw the refracted ray at the first boundary between medium 1 and 2
    const yBoundary2 = yMid + Math.tan(refractedAngle1Rad) * (xBoundary2 - xBoundary1);  // Calculate y endpoint at second boundary

    ctx.beginPath();
    ctx.moveTo(xBoundary1, yMid);  // Start the refracted ray at the first boundary
    ctx.lineTo(xBoundary2, yBoundary2);  // Draw the ray to the calculated endpoint
    ctx.strokeStyle = 'blue';  // Set the color of the refracted ray
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw the refracted ray at the second boundary between medium 2 and 3
    const x3 = canvas.width;  // Set x endpoint of the ray at the far right
    const refractedAngle2Rad = refractedAngle2 * (Math.PI / 180);  // Convert angle to radians
    const y3 = yBoundary2 + Math.tan(refractedAngle2Rad) * (x3 - xBoundary2);  // Calculate y endpoint

    ctx.beginPath();
    ctx.moveTo(xBoundary2, yBoundary2);  // Start the ray at the second boundary
    ctx.lineTo(x3, y3);  // Draw the ray to the calculated endpoint
    ctx.strokeStyle = 'green';  // Set the color of the ray in medium 3
    ctx.lineWidth = 2;
    ctx.stroke();

    // Display the angles on the canvas
    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Angle 1: ${angle.toFixed(2)}°`, 10, yMid - 10);
    ctx.fillText(`Refracted Angle 1: ${refractedAngle1.toFixed(2)}°`, xBoundary1 + 10, yMid + 20);
    ctx.fillText(`Refracted Angle 2: ${refractedAngle2.toFixed(2)}°`, xBoundary2 + 100, yMid + 20); // Adjusted position


    // Display the final refracted angle value on the screen
    document.getElementById('output').textContent = `Refracted Angle 2: ${refractedAngle2.toFixed(2)}°`;

    // Check if the final ray of light hits the target located in the bottom-right corner
    const distanceToTarget = Math.sqrt(Math.pow(x3 - targetX, 2) + Math.pow(y3 - targetY, 2));  // Calculate distance between light ray and target
    if (distanceToTarget <= targetRadius) {
        document.getElementById('output').textContent += ' - The light hits the target!';  // Success message if the light hits the target
    } else {
        document.getElementById('output').textContent += ' - The light misses the target.';  // Failure message if the light misses
    }
}

// Initialize the simulation when the page loads
updateLab();
