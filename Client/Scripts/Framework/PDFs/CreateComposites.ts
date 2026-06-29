import { PDFPage } from "pdf-lib";
import { MARGIN, PAGE_HEIGHT, PAGE_WIDTH } from "./Constants";
import { addTextField, drawCell, drawLabel } from "./CreatePrimitives";

export function drawSectionHeader(page: PDFPage, text: string, x: number, y: number, width: number, fonts: Fonts) {
    drawCell(page, x, y, width, 10, true)
    drawLabel(page, text, x + 2, y + 2, fonts.bold, 7)
}

export function drawTableHeader(page: PDFPage, columns: Column[], x: number, y: number, rowHeight: number, fonts: Fonts) {
    let columnX = x
    for (const column of columns) {
        drawCell(page, columnX, y, column.width, rowHeight, true)
        drawLabel(page, column.label, columnX + 2, y + 3, fonts.bold, 6)
        columnX += column.width
    }
}

export function drawTableRow(
    ctx: DrawingContext,
    page: PDFPage,
    columns: Column[],
    x: number, y: number, rowHeight: number,
    values: string[],
    shaded = false,
) {
    let columnX = x
    columns.forEach((column, i) => {
        drawCell(page, columnX, y, column.width, rowHeight, shaded)
        addTextField(ctx, page, columnX, y, column.width, rowHeight, values[i] ?? '')
        columnX += column.width
    })
}

export function drawPageHeader(page: PDFPage, fonts: Fonts, pageNumber: number) {
    const chapterRefs = ['Ch 2-3', 'Ch 2-4', 'Ch 2-5']
    drawLabel(page, 'Chapter 2 – Character Creation', MARGIN, PAGE_HEIGHT - MARGIN - 8, fonts.bold, 13)
    drawLabel(page, 'v. 10/03/2025', PAGE_WIDTH - MARGIN - 70, PAGE_HEIGHT - MARGIN - 8, fonts.regular, 7)
    drawLabel(page, `Character Sheet page ${pageNumber}`, PAGE_WIDTH - MARGIN - 80, MARGIN - 10, fonts.italic, 7)
    drawLabel(page, `Character Creation ${chapterRefs[pageNumber - 1]}`, PAGE_WIDTH - MARGIN - 80, MARGIN - 18, fonts.italic, 7)
}

export interface TableConfiguration {

}

export function drawTable(page: PDFPage, data: string[][], configuration : TableConfiguration) {
    
}