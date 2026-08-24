import * as pdfjsLib from "pdfjs-dist";

// Configure pdfjs worker if available in browser
try {
  if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "3.11.174"}/pdf.worker.min.js`;
  }
} catch (e) {
  console.warn("Could not set up pdfjs workerSrc directly", e);
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  // Plain text / Markdown / JSON
  if (fileType.includes("text") || fileName.endsWith(".txt") || fileName.endsWith(".md") || fileName.endsWith(".json")) {
    return await file.text();
  }

  // PDF extraction
  if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || "")
          .join(" ");
        fullText += `--- PAGE ${i} ---\n${pageText}\n\n`;
      }

      const cleaned = fullText.trim();
      if (cleaned.length > 30) {
        return cleaned;
      }
      throw new Error("Extracted text was too short or empty.");
    } catch (pdfErr) {
      console.warn("PDF extraction fallback:", pdfErr);
      // Fallback: simple text attempt or informative message
      try {
        const rawText = await file.text();
        if (rawText && rawText.length > 50) {
          // Remove binary control characters
          return rawText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ");
        }
      } catch (_) {}
      throw new Error("Unable to parse text from this PDF. Please copy-paste the text directly into the editor for instant analysis.");
    }
  }

  // Generic fallback
  return await file.text();
}
