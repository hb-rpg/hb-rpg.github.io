import { grayscale, rgb } from "pdf-lib";
// ── Page dimensions (US Letter, 72pt = 1 inch) ───────────────────────────────
export const PAGE_WIDTH = 612;
export const PAGE_HEIGHT = 792;
export const MARGIN = 36;
export const CONTENT_TOP = PAGE_HEIGHT - MARGIN - 30;
export const TABLE_WIDTH = PAGE_WIDTH - MARGIN * 2;
// ── Colors ────────────────────────────────────────────────────────────────────
export const HEADER_FILL = grayscale(0.85);
export const COLOR_BLACK = rgb(0, 0, 0);
export const COLOR_WHITE = rgb(1, 1, 1);
