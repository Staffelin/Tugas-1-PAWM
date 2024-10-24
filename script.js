// Get the canvas element and its 2D drawing context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define the coordinates of the target at the bottom-right corner
const targetX = canvas.width;  // X-coordinate of the target (aligned with the bottom-right corner)
const targetY = canvas.height;  // Y-coordinate of the target (bottom of the canvas)
const targetRadius = 150;  // Radius of the target in pixels

// Set canvas width to match its actual display width and define a fixed height
canvas.width = canvas.clientWidth;
canvas.height = 300;

// Main function to update the light refraction simulation and check for target hit
function updateLab() {
    // Get user inputs for the incoming angle and refractive indices of the three materials
    const angle = parseFloat(document.getElementById('angle-input').value);
    const n1 = parseFloat(document.getElementById('material1').value);
    const n2 = parseFloat(document.getElementById('material2').value);
    const n3 = parseFloat(document.getElementById('material3').value);
    
    // Display the updated values on the screen
    document.getElementById('angle-display').textContent = angle;
    document.getElementById('material1-display').textContent = n1.toFixed(3);
    document.getElementById('material2-display').textContent = n2.toFixed(3);
    document.getElementById('material3-display').textContent = n3.toFixed(3);

    // Convert the incoming angle to radians for trigonometric calculations
    const angleRad = angle * (Math.PI / 180);
    // Calculate the sine of the refracted angle at the first boundary using Snell's law
    const sinRefractedAngle1 = (n1 / n2) * Math.sin(angleRad);

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

    // Draw the incoming ray (from the left) with the specified angle of incidence
    const lengthRay = mediumWidth - 50;  // Set the length of the incoming ray
    const x1 = xBoundary1 - lengthRay * Math.cos(angleRad);  // Calculate x endpoint of the ray
    const y1 = yMid - lengthRay * Math.sin(angleRad);  // Calculate y endpoint of the ray

    ctx.beginPath();
    ctx.moveTo(xBoundary1, yMid);  // Start the incoming ray at the boundary
    ctx.lineTo(x1, y1);  // Draw the ray to the calculated endpoint
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
