import fitz, os, sys

pdf_dir = r'c:\Users\aarup\OneDrive\Desktop\proj111'
pdfs = ['PRD.pdf', 'BRS Document.pdf', 'PRODUCT DOCUMENTATION.pdf', 'UI HIERARCHY.pdf']

output_file = os.path.join(pdf_dir, 'pdf_contents.txt')
with open(output_file, 'w', encoding='utf-8') as f:
    for pdf_name in pdfs:
        path = os.path.join(pdf_dir, pdf_name)
        doc = fitz.open(path)
        f.write(f'\n\n========== {pdf_name} ({doc.page_count} pages) ==========\n')
        for i in range(doc.page_count):
            page = doc[i]
            text = page.get_text()
            if text.strip():
                f.write(f'--- Page {i+1} ---\n')
                f.write(text)
                f.write('\n')
        doc.close()

print(f'Done! Written to {output_file}')
print(f'File size: {os.path.getsize(output_file)} bytes')
