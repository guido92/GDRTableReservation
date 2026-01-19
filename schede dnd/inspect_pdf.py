
import pypdf
import os

pdf_path = "CharacterSheet_3Pgs_ Complete.pdf"
output_path = "fields.txt"

try:
    reader = pypdf.PdfReader(pdf_path)
    fields = reader.get_fields()
    
    with open(output_path, "w", encoding="utf-8") as f:
        if fields:
            f.write(f"Found {len(fields)} fields.\n")
            for field_name, value in fields.items():
                # Print field name and maybe some type info to help mapping
                f.write(f"Field: {field_name} | Type: {value.get('/FT')} | Value: {value.get('/V')}\n")
        else:
             f.write("No form fields found in this PDF.\n")
    print(f"Fields written to {output_path}")

except Exception as e:
    print(f"Error: {e}")
