import { COLOR_BLACK, COLOR_WHITE, HEADER_FILL } from "./Constants";
export function drawLabel(page, text, x, y, font, size = 6) {
    page.drawText(text, { x, y, size, font, color: COLOR_BLACK });
}
export function drawCell(page, x, y, width, height, shaded = false) {
    page.drawRectangle({
        x, y, width, height,
        borderColor: COLOR_BLACK, borderWidth: 0.5,
        color: shaded ? HEADER_FILL : COLOR_WHITE,
    });
}
export function addTextField(ctx, page, x, y, width, height, value = '', multiline = false) {
    const field = ctx.form.createTextField(ctx.nextFieldName());
    field.setText(value);
    if (multiline)
        field.enableMultiline();
    field.addToPage(page, {
        x: x + 1, y: y + 1, width: width - 2, height: height - 2,
        borderWidth: 0,
        backgroundColor: COLOR_WHITE,
        textColor: COLOR_BLACK,
        font: ctx.bodyFont,
    });
}
