const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let targetX = canvas.width;
let targetY = canvas.height;
const targetRadius = 150;

canvas.width = canvas.clientWidth;
canvas.height = 300;

function updateTargetPosition() {
    targetX = canvas.width - targetRadius;
    targetY = canvas.height - targetRadius;
}

window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = 300;
    updateTargetPosition();
    updateLab();
});

function updateLab() {
    const angle = parseFloat(document.getElementById('angle-input').value);
    const n1 = parseFloat(document.getElementById('material1').value);
    const n2 = parseFloat(document.getElementById('material2').value);
    const n3 = parseFloat(document.getElementById('material3').value);

    document.getElementById('angle-display').textContent = angle;

    const angleRad = angle * (Math.PI / 180);

    let direction = 1;
    let isFromRight = false;
    if (angle > 90) {
        direction = -1;
        isFromRight = true;
    }

    const adjustedAngle = direction === 1 ? angleRad : Math.PI - angleRad;

    const sinRefractedAngle1 = (n1 / n2) * Math.sin(adjustedAngle);

    if (Math.abs(sinRefractedAngle1) > 1) {
        document.getElementById('output').textContent = 'Total Internal Reflection at first boundary';
        return;
    }

    const refractedAngle1 = Math.asin(sinRefractedAngle1) * (180 / Math.PI);

    const refractedAngle1Rad = refractedAngle1 * (Math.PI / 180);

    const sinRefractedAngle2 = (n2 / n3) * Math.sin(refractedAngle1Rad);

    if (Math.abs(sinRefractedAngle2) > 1) {
        document.getElementById('output').textContent = 'Total Internal Reflection at second boundary';
        return;
    }

    const refractedAngle2 = Math.asin(sinRefractedAngle2) * (180 / Math.PI);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mediumWidth = canvas.width / 3;
    const xBoundary1 = mediumWidth;
    const xBoundary2 = 2 * mediumWidth;
    const yMid = canvas.height / 2;

    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, yMid);
    ctx.lineTo(canvas.width, yMid);
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(xBoundary1, 0);
    ctx.lineTo(xBoundary1, canvas.height);
    ctx.moveTo(xBoundary2, 0);
    ctx.lineTo(xBoundary2, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    const lengthRay = mediumWidth - 50;
    let x1, y1;
    if (!isFromRight) {
        x1 = xBoundary1 - lengthRay * Math.cos(angleRad);
        y1 = yMid - lengthRay * Math.sin(angleRad);
        ctx.beginPath();
        ctx.moveTo(xBoundary1, yMid);
        ctx.lineTo(x1, y1);
    } else {
        x1 = xBoundary2 + lengthRay * Math.cos(Math.PI - angleRad);
        y1 = yMid + lengthRay * Math.sin(Math.PI - angleRad);
        ctx.beginPath();
        ctx.moveTo(xBoundary2, yMid);
        ctx.lineTo(x1, y1);
    }
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();

    const yBoundary2 = yMid + Math.tan(refractedAngle1Rad) * (xBoundary2 - xBoundary1);

    ctx.beginPath();
    ctx.moveTo(xBoundary1, yMid);
    ctx.lineTo(xBoundary2, yBoundary2);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();

    const x3 = canvas.width;
    const refractedAngle2Rad = refractedAngle2 * (Math.PI / 180);
    const y3 = yBoundary2 + Math.tan(refractedAngle2Rad) * (x3 - xBoundary2);

    ctx.beginPath();
    ctx.moveTo(xBoundary2, yBoundary2);
    ctx.lineTo(x3, y3);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '14px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Angle 1: ${angle.toFixed(2)}°`, 10, yMid - 10);
    ctx.fillText(`Refracted Angle 1: ${refractedAngle1.toFixed(2)}°`, xBoundary1 + 10, yMid + 20);
    ctx.fillText(`Refracted Angle 2: ${refractedAngle2.toFixed(2)}°`, xBoundary2 + 100, yMid + 20);

    document.getElementById('output').textContent = `Refracted Angle 2: ${refractedAngle2.toFixed(2)}°`;
}

updateLab();
