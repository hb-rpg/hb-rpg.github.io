// @vitest-environment happy-dom
import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { ReligionData } from '../Configuration/DietiesData.js'
import { Deity } from '../Contracts/Diety.js'

// Maps a public image URL ("/Images/…") to its file on disk under wwwroot.
const toDiskPath = (url: string) => path.join(process.cwd(), 'wwwroot', url)

describe('Deity constructor argument order', () => {
    // Guards the bug where an unused FullDescription param shifted every arg, leaving
    // SymbolPath holding the rune path and RunePath undefined.
    test('assigns SymbolPath then RunePath positionally', () => {
        const d = new Deity({ name: 'Test', id: 0 }, 'desc', 'symbol/path.jpg', 'rune/path.jpg')
        expect(d.SymbolPath).toBe('symbol/path.jpg')
        expect(d.RunePath).toBe('rune/path.jpg')
    })
})

describe('Deity symbol and rune images resolve to real files', () => {
    for (const deity of ReligionData.possibleDeities) {
        const name = deity.Pronoun.name

        test(`${name} symbol`, () => {
            expect(deity.SymbolPath, `${name} has no SymbolPath`).toBeTruthy()
            expect(deity.SymbolPath!, `${name} symbol URL has a double slash`).not.toMatch(/\/\//)
            expect(existsSync(toDiskPath(deity.SymbolPath!)), `missing file: ${deity.SymbolPath}`).toBe(true)
        })

        test(`${name} rune`, () => {
            expect(deity.RunePath, `${name} has no RunePath`).toBeTruthy()
            expect(deity.RunePath!, `${name} rune URL has a double slash`).not.toMatch(/\/\//)
            expect(existsSync(toDiskPath(deity.RunePath!)), `missing file: ${deity.RunePath}`).toBe(true)
        })
    }
})
