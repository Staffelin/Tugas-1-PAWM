// Function to generate a random incoming angle and start the quiz
function startQuiz() {
    // Generate a random incoming angle between 0 and 90 degrees
    const randomAngle = Math.floor(Math.random() * 91);
    document.getElementById('random-angle-display').textContent = randomAngle;

    // Optionally clear previous feedback
    document.getElementById('quiz-feedback').textContent = "";

    // Store the correct n values for this quiz session (you can modify these values)
    this.correctN1 = 1.000;
    this.correctN2 = 1.500;
    this.correctN3 = 1.333;

    // Save the random angle to use in the quiz evaluation
    this.randomAngle = randomAngle;
}

// Function to submit quiz answers and evaluate them
function submitQuiz() {
    const answerN1 = parseFloat(document.getElementById('answer-n1').value);
    const answerN2 = parseFloat(document.getElementById('answer-n2').value);
    const answerN3 = parseFloat(document.getElementById('answer-n3').value);

    // Use the same Snell's Law logic to check if answers are correct
    const angleRad = this.randomAngle * (Math.PI / 180);

    // Calculate the expected refracted angles based on the stored correct n values
    const sinRefractedAngle1 = (this.correctN1 / this.correctN2) * Math.sin(angleRad);
    const refractedAngle1 = Math.asin(sinRefractedAngle1) * (180 / Math.PI);
    const refractedAngle1Rad = refractedAngle1 * (Math.PI / 180);
    const sinRefractedAngle2 = (this.correctN2 / this.correctN3) * Math.sin(refractedAngle1Rad);
    const refractedAngle2 = Math.asin(sinRefractedAngle2) * (180 / Math.PI);

    // Compare the user's answers with the correct n values
    if (Math.abs(answerN1 - this.correctN1) < 0.01 && 
        Math.abs(answerN2 - this.correctN2) < 0.01 && 
        Math.abs(answerN3 - this.correctN3) < 0.01) {
        document.getElementById('quiz-feedback').textContent = 'Correct! Well done.';
    } else {
        document.getElementById('quiz-feedback').textContent = 'Incorrect. Try again.';
    }
}

// Initialize the quiz when the page loads
window.onload = function() {
    startQuiz();
};
