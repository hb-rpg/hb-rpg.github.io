import { flattenAndCombineSelectionPackage } from './UpdateUtility.js';
import { columnHeaderRow, dataRow, makeSection } from '../../../Framework/PDFs/Helpers.js';
import { Item } from '../Contracts/TaggedData.js';
// "Coin" trinkets are produced by the sell-trinket coin factory; their name always carries
// this marker and the coins they're worth is Amount × Value (see ItemData genericCoinFactory).
const COIN_TRINKET_MARKER = 'Coins from selling trinket';
const isCoinTrinket = (item) => item.Name.includes(COIN_TRINKET_MARKER);
// ── Page 1 (bottom): Weapons, Gear, Additional Gear ──────────────────────────
export function buildPlayerGear(data) {
    const items = flattenAndCombineSelectionPackage(data.ItemSelections(), data);
    const trinkets = flattenAndCombineSelectionPackage(data.TrinketSelections(), data);
    // Fold any "coin" trinkets into the adventurer's coin pile instead of listing each separately.
    const earnedCoins = trinkets
        .filter(isCoinTrinket)
        .reduce((sum, trinket) => sum + (trinket.Amount ?? 0) * (trinket.Value ?? 0), 0);
    const gear = [...items, ...trinkets.filter(trinket => !isCoinTrinket(trinket))];
    if (earnedCoins > 0) {
        const coins = gear.find(item => item.Name === 'Coins');
        if (coins) {
            // Replace (never mutate — Items are shared singletons) with a merged copy.
            gear[gear.indexOf(coins)] = new Item('Coins', (coins.Amount ?? 0) + earnedCoins, coins.Description, coins.Value);
        }
        else {
            gear.push(new Item('Coins', earnedCoins, 'Coins earned from selling trinkets'));
        }
    }
    const allItems = gear.sort((a, b) => a.Name.localeCompare(b.Name));
    return [
        makeSection('GEAR', [GEAR_NAME_COL_WIDTH, '*', GEAR_AMOUNT_COL_WIDTH, REFERENCE_COL_WIDTH], [
            columnHeaderRow(['NAME', 'DESCRIPTION', 'AMOUNT', 'REFERENCE']),
            ...Array.from({ length: allItems.length + EXTRA_GEAR_ROWS }, (_, i) => {
                const item = allItems[i];
                return dataRow([
                    item?.Name ?? '',
                    item?.Description ?? '',
                    item?.Amount !== undefined ? String(item.Amount) : '',
                    '',
                ], i % 2 === 1);
            }),
        ])
    ];
}
