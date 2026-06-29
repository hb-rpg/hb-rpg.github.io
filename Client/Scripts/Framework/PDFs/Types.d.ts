interface Fonts {
    bold: PDFFont
    regular: PDFFont
    italic: PDFFont
}

interface Column {
    label: string
    width: number
}

interface DrawingContext {
    form: PDFForm
    fonts: Fonts
    bodyFont: PDFFont
    nextFieldName: () => string
}