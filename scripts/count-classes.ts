
import { CLASSES, BACKGROUNDS, RACES, FEATS } from '../src/data/dnd-data';

console.log("--- DATA AUDIT ---");
console.log(`✅ Classi: ${CLASSES.length}`);
console.log(`✅ Sottoclassi (Specializzazioni): ${CLASSES.reduce((acc, c) => acc + (c.suboptions?.length || 0), 0)}`);
console.log(`✅ Razze: ${RACES.length}`);
console.log(`✅ Background: ${BACKGROUNDS.length}`);
console.log(`✅ Talenti: ${FEATS?.length || 0}`);

console.log("\n--- DETTAGLI SOTTOCLASSI ---");
CLASSES.forEach(c => {
    const subs = c.suboptions?.map(s => s.name).join(", ");
    console.log(`- ${c.name}: ${subs}`);
});
