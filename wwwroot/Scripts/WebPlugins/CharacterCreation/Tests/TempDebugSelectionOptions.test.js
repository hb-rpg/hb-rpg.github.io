// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { makeSampleCharacter } from "../../../Framework/PDFs/Harness/SampleCharacter.js";
import { logAllSelectionOptions, snapshotSelectionOptions } from "../Utility/DebugSelectionOptions.js";
import { updateRaceItemsData, updateRaceLanguageData, updateRaceEdgesData, updateRaceSkillsData, updateRaceDrawbackData, updateNameData, } from "../Utility/UpdateUtility.js";
const capture = (run) => {
    const out = [];
    let depth = 0;
    const g = vi.spyOn(console, "group").mockImplementation((...a) => { out.push({ text: a[0], collapsed: false, depth }); depth++; });
    const gc = vi.spyOn(console, "groupCollapsed").mockImplementation((...a) => { out.push({ text: a[0], collapsed: true, depth }); depth++; });
    const ge = vi.spyOn(console, "groupEnd").mockImplementation(() => { depth--; });
    const l = vi.spyOn(console, "log").mockImplementation((...a) => { out.push({ text: a[0], collapsed: false, depth }); });
    run();
    g.mockRestore();
    gc.mockRestore();
    ge.mockRestore();
    l.mockRestore();
    expect(depth).toBe(0);
    return out;
};
const show = (out) => out
    .map(o => "  ".repeat(o.depth) + (o.collapsed ? "▶ " : "") + o.text).join("\n");
Object.defineProperty(globalThis, "location", {
    value: { search: "?debug=1", hostname: "localhost" }, configurable: true, writable: true,
});
describe("temp: collapse irrelevant parts", () => {
    it("expands only what an Ancestry change actually moved", () => {
        const data = makeSampleCharacter();
        const before = snapshotSelectionOptions(data);
        // Exactly what createAncestryPickerModel's onUpdate runs.
        data.Race("Dwarf");
        updateRaceItemsData(data, "Ancestry");
        updateRaceLanguageData(data);
        updateRaceEdgesData(data, "Ancestry");
        updateRaceSkillsData(data, "Ancestry");
        updateRaceDrawbackData(data, "Ancestry");
        updateNameData(data);
        const out = capture(() => logAllSelectionOptions(data, "Ancestry", before));
        console.log("=== ANCESTRY CHANGED ===\n" + show(out));
        const packages = out.filter(o => o.depth === 1);
        const expanded = packages.filter(p => !p.collapsed).map(p => p.text);
        const collapsed = packages.filter(p => p.collapsed).map(p => p.text);
        expect(expanded.length).toBeGreaterThan(0);
        expect(collapsed.length).toBeGreaterThan(0);
        // untouched-by-ancestry packages stay collapsed but present
        expect(collapsed.some(c => c.startsWith("Religion"))).toBe(true);
        expect(out.find(o => o.text.startsWith("[selection options]")).text).not.toContain("no changes");
    });
    it("collapses everything and says so when a save changes nothing", () => {
        const data = makeSampleCharacter();
        const before = snapshotSelectionOptions(data);
        const out = capture(() => logAllSelectionOptions(data, "Ancestry", before));
        console.log("=== NO-OP SAVE ===\n" + show(out));
        expect(out[0].text).toContain("no changes");
        expect(out.filter(o => o.depth === 1).every(p => p.collapsed)).toBe(true);
    });
    it("expands everything when no baseline is given", () => {
        const data = makeSampleCharacter();
        const out = capture(() => logAllSelectionOptions(data, "Ancestry"));
        expect(out.filter(o => o.depth === 1).every(p => !p.collapsed)).toBe(true);
    });
});
