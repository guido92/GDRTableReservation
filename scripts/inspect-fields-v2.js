
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

        console.log("--- CHECKBOX INSPECTION ---");
        const checkboxes = fields.filter(f => f.constructor.name === 'PDFCheckBox');
        checkboxes.slice(0, 20).forEach(cb => {
            const name = cb.getName();
            // @ts-ignore
            const widgets = cb.acroField.getWidgets();
            const onValue = widgets[0].getOnValue();
            console.log(`Field: "${name}" | OnValue: "${onValue ? onValue.getName() : 'N/A'}"`);
        });

        console.log("\n--- ATTACK FIELDS DETAILED ---");
        const attk = fields.filter(f => f.getName().includes("Wpn"));
        attk.forEach(f => console.log(`Field: "${f.getName()}" Type: ${f.constructor.name}`));


    } catch (e) {
        console.error("Error inspecting PDF:", e);
    }
}

inspect();
