import { test, expect } from "vitest";
import { decodeDeckCode } from "../src/features/deck/decodeDeckCode.js";

const decoded = 'CMAAAAAAAAAACAQAAAD5MAIAAABQGAAABEGNGAIDAMAAHGYBV4AQEBAAAKMQCBADAAAAJUIB3UAQCAYAXQAQCBAAAYAQKAEAAEBQIAAADPKQDIYCUYBAEAYADW5QCAQEACYADUQBAABQCAAA2QAQCAYACUAQKAADAMAQGAABAECABMABAICQBAYBQ4AQCAYADU';

test.describe('Test for decoding', () => {

    test('decodes champion and cards in expected format', () => {
        const result = decodeDeckCode(decoded)

        console.log(result)

        const {deck} = result;


        expect(typeof deck.chosenChampion).toBe('string')
        for (const entry of [...deck.mainDeck, ...deck.sideboard]){
            expect(entry.cardCode).toMatch(/^[A-Z]+-\d+[a-z]*$/)
        }
    })
})