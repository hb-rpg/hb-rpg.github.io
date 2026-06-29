import { PDFFont, PDFPage } from "pdf-lib";
import { COLOR_BLACK, COLOR_WHITE, HEADER_FILL } from "./Constants";

export function drawLabel(page: PDFPage, text: string, x: number, y: number, font: PDFFont, size = 6) {
    page.drawText(text, { x, y, size, font, color: COLOR_BLACK })
}

export function drawCell(page: PDFPage, x: number, y: number, width: number, height: number, shaded = false) {
    page.drawRectangle({
        x, y, width, height,
        borderColor: COLOR_BLACK, borderWidth: 0.5,
        color: shaded ? HEADER_FILL : COLOR_WHITE,
    })
}

export function addTextField(
    ctx: DrawingContext,
    page: PDFPage,
    x: number, y: number, width: number, height: number,
    value = '',
    multiline = false,
): void {
    const field = ctx.form.createTextField(ctx.nextFieldName())
    field.setText(value)
    if (multiline) field.enableMultiline()
    field.addToPage(page, {
        x: x + 1, y: y + 1, width: width - 2, height: height - 2,
        borderWidth: 0,
        backgroundColor: COLOR_WHITE,
        textColor: COLOR_BLACK,
        font: ctx.bodyFont,
    })
}