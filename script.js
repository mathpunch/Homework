document.getElementById('solve-button').addEventListener('click', async () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = async () => {
            try {
                const result = await Tesseract.recognize(img, 'eng', {
                    logger: info => console.log(info) // Optional: log progress
                });
                const extractedText = result.data.text;
                document.getElementById('result').innerText = `Extracted Text: \n${extractedText}`;

                const solutions = solveProblems(extractedText);
                document.getElementById('result').innerText += `\n\nSolutions: \n${solutions.join('\n')}`;
            } catch (error) {
                console.error("Error during OCR:", error);
                document.getElementById('result').innerText = "OCR processing failed.";
            }
        };

        img.onerror = () => {
            console.error("Error loading image");
            document.getElementById('result').innerText = "Error loading image.";
        };
    } else {
        document.getElementById('result').innerText = "Please upload an image.";
    }
});

// Example solveProblems function
function solveProblems(text) {
    const lines = text.split('\n');
    const solutions = [];
    
    lines.forEach(line => {
        line = line.trim();
        if (line) {
            // Simple math problem example
            if (isMathProblem(line)) {
                try {
                    const result = eval(line);
                    solutions.push(`Math: ${line} = ${result}`);
                } catch {
                    solutions.push(`Math: ${line} = Error`);
                }
            } else {
                solutions.push(`Unrecognized: ${line}`);
            }
        }
    });
    
    return solutions;
}

function isMathProblem(line) {
    return /\d+[\+\-\*\/]\d+/.test(line);
}
