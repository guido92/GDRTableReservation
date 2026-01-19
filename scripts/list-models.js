const { GoogleGenerativeAI } = require("@google/generative-ai");

const fs = require('fs');
const path = require('path');

// Try to read .env.local manually
let apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    try {
        const envPath = path.join(__dirname, '..', '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            const match = envContent.match(/GEMINI_API_KEY=(.*)/);
            if (match && match[1]) {
                apiKey = match[1].trim();
            }
        }
    } catch (e) {
        console.error("Failed to read .env.local", e);
    }
}

if (!apiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is not set and could not be found in .env.local");
    process.exit(1);
}

// We can use the REST API directly to list models as the SDK wrap might vary by version
async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        const models = data.models || [];
        const chatModels = models.filter(m => m.supportedGenerationMethods.includes("generateContent"));

        fs.writeFileSync('models.json', JSON.stringify(chatModels, null, 2));
        console.log("Models written to models.json");

    } catch (error) {
        console.error("Failed to list models:", error.message);
    }
}

listModels();
