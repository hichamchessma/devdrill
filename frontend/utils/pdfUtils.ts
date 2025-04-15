import jsPDF from 'jspdf';

/**
 * Generates a PDF from the given content and triggers a download.
 * @param content - The content to be included in the PDF. Can be plain text or simple HTML.
 * @param filename - The name of the file to be downloaded.
 */
export async function generatePDF(content: string, filename: string): Promise<Blob> {
    const pdf = new jsPDF();
    pdf.text(content, 10, 10);
    // Compatible toutes versions : utilise arraybuffer
    const arrayBuffer = pdf.output('arraybuffer');
    return new Blob([arrayBuffer], { type: 'application/pdf' });
}
// Si tu veux toujours télécharger le PDF, utilise downloadPDF séparément.

/**
 * Triggers the download of a given Blob as a file in the browser.
 * @param blob - The Blob to be downloaded.
 * @param filename - The name of the file to be downloaded.
 */
export function downloadPDF(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Converts a Blob into a File object.
 * @param blob - The Blob to be converted.
 * @param filename - The name of the resulting file.
 * @returns The File object.
 */
export function toFile(blob: Blob, filename: string): File {
    return new File([blob], filename, { type: blob.type });
}
