const AI_GEN_URL = 'http://localhost:3000/api/dnd/ai-generate';

async function verify() {
    console.log("Verifying API with current model...");
    try {
        const res = await fetch(AI_GEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                level: 1,
                race: "Human",
                class: "Fighter",
                sourceFilter: ["PHB14"]
            })
        });

        console.log(`Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.log(`Body: ${text.substring(0, 500)}...`);
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

verify();
