const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Load Env manually since we aren't in Next.js
try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    for (const line of envConfig.split('\n')) {
        const [key, value] = line.split('=');
        if (key && value) process.env[key.trim()] = value.trim();
    }
} catch (e) {
    console.warn("Could not read .env.local", e);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you online?");
        const response = await result.response;
        console.log(`[SUCCESS] ${modelName} replied: ${response.text()}`);
        return true;
    } catch (e) {
        console.error(`[FAILED] ${modelName}:`, e.message);
        return false;
    }
}

(async () => {
    console.log("--- DIRECT SDK VERIFICATION ---");
    await testModel("gemini-3-flash-preview");
    await testModel("gemini-3-pro-preview");
    await testModel("gemini-2.0-flash-exp"); // Fallback check
})();
