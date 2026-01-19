
const { PDFDocument, PDFName } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function main() {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'character-sheet-template.pdf');
    const pdfBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    console.log("--- CHECKBOXES ---");
    // Inspect specific problematic boxes
    const boxesToCheck = ['Check Box 23', 'Check Box 11', 'Check Box 18'];
    for (const name of boxesToCheck) {
        try {
            const field = form.getField(name);
            if (field) {
                const widgets = field.acroField.getWidgets();
                const widget = widgets[0];
                const onValue = widget.getOnValue(); // Returns PDFName
                const exportVal = onValue ? onValue.decodeText() : 'N/A';
                console.log(`Field '${name}': ExportValue='${exportVal}'`);
            } else {
                console.log(`Field '${name}' NOT FOUND`);
            }
        } catch (e) {
            console.log(`Error inspecting '${name}': ${e.message}`);
        }
    }

    console.log("\n--- WEAPONS ---");
    // Dump exact char codes for Wpn fields to detect hidden spaces
    const wpnFields = fields.filter(f => f.getName().includes("Wpn"));
    wpnFields.forEach(f => {
        const name = f.getName();
        const escaped = name.split('').map(c => c.charCodeAt(0)).join(',');
        console.log(`'${name}' -> Chars: [${escaped}]`);
    });
}

main();
