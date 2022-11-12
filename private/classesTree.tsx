export const scheduleIDs = new Map<string, number>();  // Useful to make api request to ADE
export const scheduleList = []  // Useful to parse data from ical events
export const scheduleTree = new Map<String, String[]>  // Useful to perform search queries in search engine

const _1G1_TD1 = '1G1 TD1'
const _1G1_TD2 = '1G1 TD2'
const _1G1_TD3 = '1G1 TD3'

const _1G2_TD1 = '1G2 TD1'
const _1G2_TD2 = '1G2 TD2'
const _1G2_TD3 = '1G2 TD3'

const _1G3_TD1 = '1G3 TD1'
const _1G3_TD2 = '1G3 TD2'
const _1G3_TD3 = '1G3 TD3'

const _1DA_TD1 = '1DA TD1'

const _1DA_TD2 = '1DA TD2'

const _1DC_TP1 = '1DC TP1'

const _1ère_A_ENSEA = '1ère A ENSEA'
const _1ère_B_ENSEA = '1ère B ENSEA'
const _1ère_DA = '1ère DA'
const _1DAVN = '1DAVN'
const _1ère_DC = '1ère DC'
const _1G1_TP1 = '1G1 TP1'
const _1G1_TP2 = '1G1 TP2'
const _1G1_TP3 = '1G1 TP3'
const _1G1_TP4 = '1G1 TP4'
const _1G1_TP5 = '1G1 TP5'
const _1G1_TP6 = '1G1 TP6'
const _1G2_TP1 = '1G2 TP1'
const _1G2_TP2 = '1G2 TP2'
const _1G2_TP3 = '1G2 TP3'
const _1G2_TP4 = '1G2 TP4'
const _1G2_TP5 = '1G2 TP4'
const _1G2_TP6 = '1G2 TP4'
const _1G3_TP1 = '1G3 TP1'
const _1G3_TP2 = '1G3 TP2'
const _1G3_TP3 = '1G3 TP3'
const _1G3_TP4 = '1G3 TP4'
const _1G3_TP5 = '1G3 TP5'
const _1G3_TP6 = '1G3 TP6'
const _1DA_TP1 = '1DA TP1'
const _1DA_TP2 = '1DA TP2'
const _1DA_TP3 = '1DA TP3'
const _1DA_TP4 = '1DA TP4'

//1ère A G1
scheduleIDs.set(_1G1_TP1, 430)
scheduleIDs.set(_1G1_TP2, 431)
scheduleIDs.set(_1G1_TP3, 433)
scheduleIDs.set(_1G1_TP4, 434)
scheduleIDs.set(_1G1_TP5, 436)
scheduleIDs.set(_1G1_TP6, 440)

//1ère A G2
scheduleIDs.set(_1G2_TP1, 442)
scheduleIDs.set(_1G2_TP2, 443)
scheduleIDs.set(_1G2_TP3, 445)
scheduleIDs.set(_1G2_TP4, 451)
scheduleIDs.set(_1G2_TP5, 641)
scheduleIDs.set(_1G2_TP6, 642)

//1ère B G3
scheduleIDs.set(_1G3_TP1, 454)
scheduleIDs.set(_1G3_TP2, 455)
scheduleIDs.set(_1G3_TP3, 459)
scheduleIDs.set(_1G3_TP4, 460)
scheduleIDs.set(_1G3_TP5, 462)
scheduleIDs.set(_1G3_TP6, 573)

//1ère D G1
scheduleIDs.set(_1DA_TP1, 591)
scheduleIDs.set(_1DA_TP2, 579)
scheduleIDs.set(_1DA_TP3, 499)
scheduleIDs.set(_1DA_TP4, 486)

//1ère DC
scheduleIDs.set(_1DC_TP1, 520)
scheduleList.push(_1ère_A_ENSEA)
scheduleList.push(_1ère_B_ENSEA)
scheduleList.push(_1ère_DA)
scheduleList.push(_1DAVN)
scheduleList.push(_1ère_DC)

//1ère A G1
scheduleList.push(_1G1_TD1)
scheduleList.push(_1G1_TD2)
scheduleList.push(_1G1_TD3)

//1ère A G2
scheduleList.push(_1G2_TD1)
scheduleList.push(_1G2_TD2)
scheduleList.push(_1G2_TD3)

//1ère B G3
scheduleList.push(_1G3_TD1)
scheduleList.push(_1G3_TD2)
scheduleList.push(_1G3_TD3)
scheduleList.push(_1DA_TD1)
scheduleList.push(_1DA_TD2)

scheduleIDs.forEach((value, key) => {
  scheduleList.push(key)
})

scheduleList.push(_1ère_A_ENSEA)
scheduleList.push(_1ère_B_ENSEA)
scheduleList.push(_1ère_DA)
scheduleList.push(_1DAVN)
scheduleList.push(_1ère_DC)

//1ère A G1
scheduleTree.set('1G1 TP1', [_1G1_TD1, _1ère_A_ENSEA])
scheduleTree.set('1G1 TP2', [_1G1_TD1, _1ère_A_ENSEA])
scheduleList.push(_1G1_TD1)

scheduleTree.set('1G1 TP3', [_1G1_TD2, _1ère_A_ENSEA])
scheduleTree.set('1G1 TP4', [_1G1_TD2, _1ère_A_ENSEA])
scheduleList.push(_1G1_TD2)

scheduleTree.set('1G1 TP5', [_1G1_TD3, _1ère_A_ENSEA])
scheduleTree.set('1G1 TP6', [_1G1_TD3, _1ère_A_ENSEA])
scheduleList.push(_1G1_TD3)

//1ère A G2
scheduleTree.set('1G2 TP1', [_1G2_TD1, _1ère_A_ENSEA])
scheduleTree.set('1G2 TP2', [_1G2_TD1, _1ère_A_ENSEA])
scheduleList.push(_1G2_TD1)

scheduleTree.set('1G2 TP3', [_1G2_TD2, _1ère_A_ENSEA])
scheduleTree.set('1G2 TP4', [_1G2_TD2, _1ère_A_ENSEA])
scheduleList.push(_1G2_TD2)

scheduleTree.set('1G2 TP5', [_1G2_TD3, _1ère_A_ENSEA])
scheduleTree.set('1G2 TP6', [_1G2_TD3, _1ère_A_ENSEA])
scheduleList.push(_1G2_TD3)


//1ère B G3
scheduleTree.set('1G3 TP1', [_1G3_TD1, _1ère_B_ENSEA])
scheduleTree.set('1G3 TP2', [_1G3_TD1, _1ère_B_ENSEA])
scheduleList.push(_1G3_TD1)

scheduleTree.set('1G3 TP3', [_1G3_TD2, _1ère_B_ENSEA])
scheduleTree.set('1G3 TP4', [_1G3_TD2, _1ère_B_ENSEA])
scheduleList.push(_1G3_TD2)

scheduleTree.set('1G3 TP5', [_1G3_TD3, _1ère_B_ENSEA])
scheduleTree.set('1G3 TP6', [_1G3_TD3, _1ère_B_ENSEA])
scheduleList.push(_1G3_TD3)


scheduleTree.set('1DA TP1', [_1DA_TD1, _1ère_DA, _1DAVN])
scheduleTree.set('1DA TP2', [_1DA_TD1, _1ère_DA, _1DAVN])
scheduleList.push(_1DA_TD1)

scheduleTree.set('1DA TP3', [_1DA_TD2, _1ère_DA, _1DAVN])
scheduleTree.set('1DA TP4', [_1DA_TD2, _1ère_DA, _1DAVN])
scheduleList.push(_1DA_TD2)

//1ère DC
scheduleTree.set(_1DC_TP1, [_1DC_TP1, _1ère_DC])

scheduleIDs.forEach((value, key) => {
  scheduleList.push(key)
})
