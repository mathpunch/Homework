document.getElementById('solve-button').addEventListener('click', async () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = async () => {
            const result = await Tesseract.recognize(img, 'eng');
            const extractedText = result.data.text;
            document.getElementById('result').innerText = `Extracted Text: \n${extractedText}`;

            // Solve problems based on detected subjects
            const solutions = solveProblems(extractedText);
            document.getElementById('result').innerText += `\n\nSolutions: \n${solutions.join('\n')}`;
        };
    } else {
        document.getElementById('result').innerText = "Please upload an image.";
    }
});

// Function to solve various problems
function solveProblems(text) {
    const lines = text.split('\n');
    const solutions = [];
    
    lines.forEach(line => {
        line = line.trim();
        if (line) {
            if (isMathProblem(line)) {
                try {
                    const result = eval(line);
                    solutions.push(`Math: ${line} = ${result}`);
                } catch {
                    solutions.push(`Math: ${line} = Error`);
                }
            } else if (isScienceQuestion(line)) {
                solutions.push(`Science: ${line} = ${getScienceAnswer(line)}`);
            } else if (isEnglishQuestion(line)) {
                solutions.push(`English: ${line} = ${getEnglishAnswer(line)}`);
            } else if (isHistoryQuestion(line)) {
                solutions.push(`History: ${line} = ${getHistoryAnswer(line)}`);
            } else {
                solutions.push(`Unrecognized: ${line}`);
            }
        }
    });
    
    return solutions;
}

// Identify problem types
function isMathProblem(line) {
    return /\d+[\+\-\*\/]\d+/.test(line);
}

function isScienceQuestion(line) {
    return /What|How|Why/.test(line);
}

function isEnglishQuestion(line) {
    return line.includes("define") || line.includes("summarize");
}

function isHistoryQuestion(line) {
    return line.includes("when") || line.includes("who");
}

// Science answer retrieval (simple examples)
function getScienceAnswer(question) {
    const answers = {
        "What is photosynthesis?": "Photosynthesis is the process by which green plants use sunlight to synthesize foods with the help of chlorophyll.",
        "How does gravity work?": "Gravity is a force that attracts two bodies towards each other, proportional to their masses.",
        // Add more facts as needed
    };
    return answers[question] || "Answer not found.";
}

// English answer retrieval
function getEnglishAnswer(question) {
    const answers = {
        "define photosynthesis": "Photosynthesis: The process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water.",
        // Add more definitions as needed
    };
    return answers[question] || "Definition not found.";
}

// History answer retrieval
function getHistoryAnswer(question) {
    const answers = {
        "Who was Albert Einstein?": "Albert Einstein was a theoretical physicist who developed the theory of relativity.",
        "When was the Declaration of Independence signed?": "The Declaration of Independence was signed on July 4, 1776.",
        // Add more historical facts as needed
    };
    return answers[question] || "Historical information not found.";
}
