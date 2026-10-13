import {PDFParse} from "pdf-parse";

export class ResumeParserService {
    async extractTextFromPdf(pdfBuffer:Buffer):Promise<string>{
        try {
            //  special glasses for the parser reader to read the buffer data
            const unit8ArrayData = new Uint8Array(pdfBuffer)
            
            //along with the buffer data and glass we pass it to the reader 
            const parser = new PDFParse(unit8ArrayData)
            const parseData = await parser.getText()

            await parser.destroy()

            return parseData?.text || ''    
        } catch (error) {
            console.log("Error parsing PDF resume Text: ",error)
            throw new Error("Error on extracting text from the provided PDF file. The file might be corrupted or password-protected")
        }
    }
}