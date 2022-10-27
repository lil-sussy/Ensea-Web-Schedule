const scheduleTree = new Map();  // Exported

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
scheduleTree.set(_1ère_A_ENSEA, [_1ère_A_ENSEA])
scheduleTree.set(_1ère_B_ENSEA, [_1ère_B_ENSEA])
scheduleTree.set(_1ère_DA, [_1ère_DA])
scheduleTree.set(_1DAVN, [_1DAVN])
scheduleTree.set(_1ère_DC, [_1ère_DC])

//1ère A G1
scheduleTree.set('1G1 TP1', [_1G1_TD1, _1ère_A_ENSEA])
scheduleTree.set('1G1 TP2', [_1G1_TD1, _1ère_A_ENSEA])
scheduleTree.set(_1G1_TD1, [_1G1_TD1])

scheduleTree.set('1G1 TP3', [_1G1_TD2, _1ère_A_ENSEA])
scheduleTree.set('1G1 TP4', [_1G1_TD2, _1ère_A_ENSEA])
scheduleTree.set(_1G1_TD2, [_1G1_TD2])

scheduleTree.set('1G1 TP5', [_1G1_TD3, _1ère_A_ENSEA])
scheduleTree.set('1G1 TP6', [_1G1_TD3, _1ère_A_ENSEA])
scheduleTree.set(_1G1_TD3, [_1G1_TD3])

//1ère A G2
scheduleTree.set('1G2 TP1', [_1G2_TD1, _1ère_A_ENSEA])
scheduleTree.set('1G2 TP2', [_1G2_TD1, _1ère_A_ENSEA])
scheduleTree.set(_1G2_TD1, [_1G2_TD1])

scheduleTree.set('1G2 TP3', [_1G2_TD2, _1ère_A_ENSEA])
scheduleTree.set('1G2 TP4', [_1G2_TD2, _1ère_A_ENSEA])
scheduleTree.set(_1G2_TD2, [_1G2_TD2])

scheduleTree.set('1G2 TP5', [_1G2_TD3, _1ère_A_ENSEA])
scheduleTree.set('1G2 TP6', [_1G2_TD3, _1ère_A_ENSEA])
scheduleTree.set(_1G2_TD3, [_1G2_TD3])


//1ère B G3
scheduleTree.set('1G3 TP1', [_1G3_TD1, _1ère_B_ENSEA])
scheduleTree.set('1G3 TP2', [_1G3_TD1, _1ère_B_ENSEA])
scheduleTree.set(_1G3_TD1, [_1G3_TD1])

scheduleTree.set('1G3 TP3', [_1G3_TD2, _1ère_B_ENSEA])
scheduleTree.set('1G3 TP4', [_1G3_TD2, _1ère_B_ENSEA])
scheduleTree.set(_1G3_TD2, [_1G3_TD2])

scheduleTree.set('1G3 TP5', [_1G3_TD3, _1ère_B_ENSEA])
scheduleTree.set('1G3 TP6', [_1G3_TD3, _1ère_B_ENSEA])
scheduleTree.set(_1G3_TD3, [_1G3_TD3])


scheduleTree.set('1DA TP1', [_1DA_TD1, _1ère_DA, _1DAVN])
scheduleTree.set('1DA TP2', [_1DA_TD1, _1ère_DA, _1DAVN])
scheduleTree.set(_1DA_TD1, [_1DA_TD1])

scheduleTree.set('1DA TP3', [_1DA_TD2, _1ère_DA, _1DAVN])
scheduleTree.set('1DA TP4', [_1DA_TD2, _1ère_DA, _1DAVN])
scheduleTree.set(_1DA_TD2, [_1DA_TD2])

//1ère DC
scheduleTree.set(_1DC_TP1, [_1DC_TP1, _1ère_DC])

export default scheduleTree