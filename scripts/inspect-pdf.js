
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function inspect() {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'character-sheet-template.pdf');
    try {
        const pdfBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        const validFields = fields.map(f => f.getName()).sort();

        console.log("--- CHECKBOXES ---");
        validFields.filter(n => n.includes('Box') || n.includes('Check')).forEach(n => console.log(n));

        console.log("\n--- SPELLS ---");
        validFields.filter(n => n.includes('Spell')).forEach(n => console.log(n));

        console.log("\n--- TEXT AREAS ---");
        validFields.filter(n => n.includes('Prof') || n.includes('Back') || n.includes('Feat')).forEach(n => console.log(n));


    } catch (e) {
        console.error("Error inspecting PDF:", e);
    }
}

inspect();
