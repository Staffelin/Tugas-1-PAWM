// Function to start the quiz and provide the known angles and n1 value
function startQuiz() {
    // Generate a random incoming angle between 0 and 90 degrees
    const randomAngle = Math.floor(Math.random() * 91);
    document.getElementById('random-angle-display').textContent = randomAngle;

    // Known value for n1 (Material 1)
    const n1 = 1.000;  // Air or vacuum
    document.getElementById('n1-display').textContent = n1.toFixed(3);

    // Randomly generate correct values for n2 and n3 (these are what the user has to guess)
    const correctN2 = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(3);  // Between 1.2 and 1.6
    const correctN3 = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(3);  // Between 1.2 and 1.6

    // Calculate refracted angles using Snell's law
    const angleRad = randomAngle * (Math.PI / 180);
    
    // Calculate refracted angle 1
    const sinRefractedAngle1 = (n1 / correctN2) * Math.sin(angleRad);
    const refractedAngle1 = Math.asin(sinRefractedAngle1) * (180 / Math.PI);

    // Calculate refracted angle 2
    const refractedAngle1Rad = refractedAngle1 * (Math.PI / 180);
    const sinRefractedAngle2 = (correctN2 / correctN3) * Math.sin(refractedAngle1Rad);
    const refractedAngle2 = Math.asin(sinRefractedAngle2) * (180 / Math.PI);

    // Display refracted angles
    document.getElementById('refracted-angle1-display').textContent = refractedAngle1.toFixed(2);
    document.getElementById('refracted-angle2-display').textContent = refractedAngle2.toFixed(2);

    // Store correct n2 and n3 values to compare with user input
    this.correctN2 = parseFloat(correctN2);
    this.correctN3 = parseFloat(correctN3);

    // Optionally clear previous feedback
    document.getElementById('quiz-feedback').textContent = "";
}

// Function to submit quiz answers and check correctness
function submitQuiz() {
    const answerN2 = parseFloat(document.getElementById('answer-n2').value);
    const answerN3 = parseFloat(document.getElementById('answer-n3').value);

    // Compare the user's answers with the correct n2 and n3 values
    if (Math.abs(answerN2 - this.correctN2) < 0.01 && 
        Math.abs(answerN3 - this.correctN3) < 0.01) {
        document.getElementById('quiz-feedback').textContent = 'Correct! Well done.';
    } else {
        document.getElementById('quiz-feedback').textContent = `Incorrect. The correct values were n2: ${this.correctN2.toFixed(3)} and n3: ${this.correctN3.toFixed(3)}. Try again.`;
    }
}

// Initialize the quiz when the page loads
window.onload = function() {
    startQuiz();
};
