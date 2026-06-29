// pdfmake document-definition types — the subset used by the character-sheet
// generator. pdfmake (v0.3) ships no type declarations and there is no
// @types/pdfmake installed, so these model the content schema we actually use.
// Modeled on https://pdfmake.github.io document definitions.

export type Alignment = 'left' | 'right' | 'center' | 'justify'

/** pdfmake margins: a single value, [horizontal, vertical], or [left, top, right, bottom]. */
export type Margin = number | [number, number] | [number, number, number, number]

/** Column / table-column width: a fixed point value, '*' (fill remaining), or 'auto'. */
export type Width = number | '*' | 'auto'

/** Per-edge border visibility: [left, top, right, bottom]. */
export type Border = [boolean, boolean, boolean, boolean]

/** Visual style properties that may appear on any content node or table cell. */
export interface StyleProperties {
    bold?: boolean
    italics?: boolean
    font?: string
    fontSize?: number
    lineHeight?: number
    color?: string
    fillColor?: string
    alignment?: Alignment
    margin?: Margin
}

/** Extra properties a content node may carry when it is used as a table cell. */
export interface CellProperties {
    colSpan?: number
    rowSpan?: number
    border?: Border
    minHeight?: number
}

/** Base every concrete node extends: style + cell props, so any node may serve as a cell. */
interface NodeBase extends StyleProperties, CellProperties {}

/** Inline text value: a plain string/number, or a sequence of (optionally styled) runs. */
export type TextValue = string | number | Array<string | TextNode>

export interface TextNode extends NodeBase {
    text: TextValue
}

export interface ImageNode extends NodeBase {
    image: string
    width?: number
    height?: number
    fit?: [number, number]
}

export interface ColumnsNode extends NodeBase {
    columns: Column[]
    columnGap?: number
}

export interface StackNode extends NodeBase {
    stack: Content[]
}

export interface TableNode extends NodeBase {
    table: Table
    layout?: TableLayout
}

/** A table column is any content node that may additionally declare a width. */
export type Column = ContentNode & { width?: Width }

/** Row heights: one value for all rows, a per-row array, or a per-row function.
 *  pdfmake treats each value as a *minimum* (taller content still expands the row);
 *  'auto' (or a missing array entry) lets the row size to its content. */
export type TableHeights = number | number[] | ((row: number) => number | 'auto')

export interface Table {
    widths?: Width[]
    heights?: TableHeights
    body: TableCell[][]
    dontBreakRows?: boolean
}

/** A named built-in layout, or per-line width/color and padding callbacks. */
export type TableLayout = string | {
    hLineWidth?: (rowIndex: number, node: TableNode) => number
    vLineWidth?: (colIndex: number, node: TableNode) => number
    hLineColor?: (rowIndex: number, node: TableNode) => string
    vLineColor?: (colIndex: number, node: TableNode) => string
    paddingLeft?: (colIndex: number, node: TableNode) => number
    paddingRight?: (colIndex: number, node: TableNode) => number
    paddingTop?: (rowIndex: number, node: TableNode) => number
    paddingBottom?: (rowIndex: number, node: TableNode) => number
}

export type ContentNode = TextNode | ImageNode | ColumnsNode | StackNode | TableNode

export type Content = string | ContentNode

/** A table cell is any content node; cell-only props (colSpan, minHeight, …) live on NodeBase. */
export type TableCell = Content

export type PageFunction = (currentPage: number, pageCount: number) => Content

export interface DocumentDefinition {
    content: Content[]
    pageSize?: string
    pageMargins?: Margin
    pageOrientation?: 'portrait' | 'landscape'
    defaultStyle?: StyleProperties
    header?: PageFunction
    footer?: PageFunction
}

// pdfmake 0.3 output methods are async (Promise-based) rather than callback-based.
export interface CreatedPdf {
    download: (filename?: string) => Promise<void>
    open: () => Promise<void>
    getBlob: () => Promise<Blob>
}

export interface FontDefinition {
    normal: string
    bold?: string
    italics?: string
    bolditalics?: string
}

// pdfmake 0.3 API: virtual files and fonts are registered through methods rather than the
// old mutable `vfs` / `fonts` dictionaries.
export interface PdfMake {
    createPdf: (docDefinition: DocumentDefinition) => CreatedPdf
    addVirtualFileSystem: (vfs: Record<string, string>) => void
    addFonts: (fonts: Record<string, FontDefinition>) => void
    setFonts: (fonts: Record<string, FontDefinition>) => void
}
