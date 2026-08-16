// @vitest-environment happy-dom
// IsConfigured means "this step has been committed at least once" — it gates the preview's
// configured/unconfigured branch, the wizard's progressive reveal, and the Export button.
// It used to be set when the modal *opened*, so cancelling out left the step looking saved.
import { describe, it, expect } from "vitest"
import { makeSampleCharacter } from "../../../Framework/PDFs/Harness/SampleCharacter.js"
import { ConfiguredModals } from "../ViewModels/ModalConfigurationModels/ConfiguredModals.js"
import { AncestryViewModel } from "../ViewModels/ModalConfigurationModels/AncestryViewModel.js"

const flush = () => new Promise(r => setTimeout(r, 0))

describe("cancelling a step modal", () => {
    it("leaves a never-saved step unconfigured (the reported bug)", async () => {
        const data = makeSampleCharacter()
        const picker = ConfiguredModals.createAncestryPickerModel(data)
        const preview = picker.Model.previewViewModel.Model

        expect(preview.IsConfigured()).toBe(false)

        preview.Edit()
        await flush()
        expect(picker.Model.modal.Model.isVisible()).toBe(true)

        picker.Model.modal.Model.Close() // the x button
        expect(preview.IsConfigured()).toBe(false)
    })

    it("still marks the step configured on Done", async () => {
        const data = makeSampleCharacter()
        const picker = ConfiguredModals.createAncestryPickerModel(data)
        const preview = picker.Model.previewViewModel.Model

        preview.Edit()
        await flush()
        ;(picker.Model.itemConstructionModel as AncestryViewModel).ChosenRace("Dwarf")
        picker.Model.modal.Model.Done()

        expect(preview.IsConfigured()).toBe(true)
    })

    it("keeps an already-saved step configured when re-opened and cancelled", async () => {
        const data = makeSampleCharacter()
        const picker = ConfiguredModals.createAncestryPickerModel(data)
        const preview = picker.Model.previewViewModel.Model

        preview.Edit()
        await flush()
        ;(picker.Model.itemConstructionModel as AncestryViewModel).ChosenRace("Dwarf")
        picker.Model.modal.Model.Done()
        expect(preview.IsConfigured()).toBe(true)

        preview.Edit()
        await flush()
        picker.Model.modal.Model.Close()
        expect(preview.IsConfigured()).toBe(true)
    })

    it("Randomize still marks the step configured", () => {
        const data = makeSampleCharacter()
        const picker = ConfiguredModals.createAncestryPickerModel(data)
        const preview = picker.Model.previewViewModel.Model

        preview.Randomize()
        expect(preview.IsConfigured()).toBe(true)
    })

    it("does not drain saved picks when a re-opened multi-pick step is cancelled", async () => {
        const data = makeSampleCharacter()
        const picker = ConfiguredModals.createDeityPickerModel(data)
        const preview = picker.Model.previewViewModel.Model

        // Save the step so selectedValues is populated. SelectionPackageConfigurationModel.Randomize
        // is async and CreateObjectModel.Randomize does not await it, so flush before asserting.
        preview.Randomize()
        await flush()
        expect(preview.IsConfigured()).toBe(true)

        const countSelected = () => data.ReligionSelections()
            .ChoiceSelection()
            .reduce((n, c) => n + c.Payload.selectedValues.length, 0)

        const savedCount = countSelected()
        expect(savedCount).toBeGreaterThan(0)

        // Re-open and cancel — Init used to pop selectedValues empty with nothing to refill it.
        preview.Edit()
        await flush()
        picker.Model.modal.Model.Close()

        expect(countSelected()).toBe(savedCount)
    })
})
