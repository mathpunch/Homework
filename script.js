document.getElementById('solve-button').addEventListener('click', async () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = async () => {
            try {
                const result = await Tesseract.recognize(img, 'eng');
                const extractedText = result.data.text;
                document.getElementById('result').innerText = `Extracted Text: \n${extractedText}`;

                const solutions = solveProblems(extractedText);
                document.getElementById('result').innerText += `\n\nSolutions: \n${solutions.join('\n')}`;
            } catch (error) {
                console.error("Error during OCR:", error);
                document.getElementById('result').innerText = "OCR processing failed.";
            }
        };
    } else {
        document.getElementById('result').innerText = "Please upload an image.";
    }
});

// Define solveProblems and other helper functions as described previously...
