const fs = require('fs');
const path = require('path');

const AI_GEN_URL = 'http://localhost:3000/api/dnd/ai-generate';
const CHAT_URL = 'http://localhost:3000/api/dnd/chat';
const PDF_URL = 'http://localhost:3000/api/dnd/generate';
const OUTPUT_DIR = 'C:/Users/micha/.gemini/antigravity/brain/60c3e6d9-dbab-430b-897f-ff5930157027';

async function generatePDF(name, data) {
    console.log(`Generating PDF for ${name}...`);
    const response = await fetch(PDF_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`PDF Error: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(path.join(OUTPUT_DIR, `${name}.pdf`), Buffer.from(buffer));
    console.log(`Saved ${name}.pdf`);
}

async function testQuickBuild() {
    console.log("\nTesting Quick Build (Gemini 3 Flash Preview)...");
    const payload = {
        level: 3,
        race: "Tiefling",
        class: "Warlock",
        background: "Criminale",
        sourceFilter: ["PHB14", "XGE"]
    };

    try {
        const res = await fetch(AI_GEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        console.log("AI Generation Successful. Name:", data.characterName);
        await generatePDF("test_quick_warlock_lv3", data);
    } catch (e) {
        fs.writeFileSync('error_log.txt', `Quick Build Failed: ${e.message}\n` + (e.stack || ''), { flag: 'a' });
        console.error("Quick Build Failed:", e);
    }
}

async function testChatMode() {
    console.log("\nTesting Chat Mode (Gemini 3 Pro Preview)...");
    // Simulate a conversation that ends in generation
    const history = [
        { role: 'model', parts: [{ text: "Dimmi, chi vuoi creare?" }] },
        { role: 'user', parts: [{ text: "Voglio un Paladino Dragonide di livello 5, nobile ma decaduto. Usa una spada a due mani." }] }
    ];

    try {
        const res = await fetch(CHAT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history,
                message: "Crea la scheda ora. Genera il JSON."
            })
        });

        if (!res.ok) throw new Error(await res.text());
        const jsonRes = await res.json();
        const aiText = jsonRes.response;

        // Extract JSON
        const match = aiText.match(/```json\n([\s\S]*?)\n```/);
        if (match) {
            const data = JSON.parse(match[1]);
            console.log("Chat Generation Successful. Name:", data.characterName);
            await generatePDF("test_chat_paladin_lv5", data);
        } else {
            console.error("Chat did not return JSON. Response:", aiText.substring(0, 100) + "...");
        }
    } catch (e) {
        fs.writeFileSync('error_log.txt', `Chat Mode Failed: ${e.message}\n` + (e.stack || ''), { flag: 'a' });
        console.error("Chat Mode Failed:", e);
    }
}

(async () => {
    await testQuickBuild();
    await testChatMode();
})();
