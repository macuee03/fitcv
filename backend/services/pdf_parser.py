import io
from pypdf import PdfReader

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Mengekstrak seluruh teks dari file PDF binary stream
    """
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)
        
        extracted_text = []
        for page in reader.pages:
            text = page.extract_text()
            if text:
                extracted_text.append(text)
                
        return " ".join(extracted_text).strip()
    except Exception as e:
        raise ValueError(f"Gagal memproses file PDF: {str(e)}")