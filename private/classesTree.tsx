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

//2ème Année D
const _2ème_D = '2ème D'
const _2DA_INA = '2DA_INA'
const _2D = '2D'
scheduleList.push(_2D)
scheduleList.push(_2ème_D)

const _2DA_TP1 = '2DA TP1'
const _2DA_TP2 = '2DA TP2'
const _2DA_TP3 = '2DA TP3'
const _2DA_TP4 = '2DA TP4'
scheduleTree.set(_2DA_INA, [_2ème_D])
scheduleIDs.set(_2DA_INA, 612)
scheduleTree.set(_2DA_TP1, [_2D, _2ème_D])
scheduleIDs.set('2DA TP1', 600)
scheduleTree.set(_2DA_TP2, [_2D, _2ème_D])
scheduleIDs.set('2DA TP2', 607)
scheduleTree.set(_2DA_TP3, [_2D, _2ème_D])
scheduleIDs.set('2DA TP3', 493)
scheduleTree.set(_2DA_TP4, [_2D, _2ème_D])
scheduleIDs.set('2DA TP4', 553)

//2ème Année
const _2ème_ENSEA = '2ème ENSEA'
const _2G1_TD1 = '2G1 TD1 (Info / Signal)'
const _2G1_TD2 = '2G1 TD2 (internationale'
const _2G1_TD3 = '2G1 TD3 (Signal / Elec)'
const _2G2_TD1 = '2G2 TD1 (Info/ Elec)'
const _2G2_TD2 = '2G2 TD2 (Info/ Elec)'
const _2G2_TD3 = '2G2 TD3 (Info/ Autom)'
const _2G3_TD1 = '2G3 TD1 (Elec / Autom)'
const _2G3_TD2 = '2G3 TD2 (Signal / Info)'
scheduleList.push(_2ème_ENSEA)
scheduleList.push(_2G1_TD1)
scheduleList.push(_2G1_TD2)
scheduleList.push(_2G1_TD3)
scheduleList.push(_2G2_TD1)
scheduleList.push(_2G2_TD2)
scheduleList.push(_2G2_TD3)
scheduleList.push(_2G3_TD1)
scheduleList.push(_2G3_TD2)
scheduleTree.set('2G1 TP1', [_2ème_ENSEA, _2G1_TD1])
scheduleIDs.set('2G1 TP1', 464)
scheduleTree.set('2G1 TP2', [_2ème_ENSEA, _2G1_TD1])
scheduleIDs.set('2G1 TP2', 465)
scheduleTree.set('2G1 TP3', [_2ème_ENSEA, _2G1_TD2])
scheduleIDs.set('2G1 TP3', 467)
scheduleTree.set('2G1 TP4', [_2ème_ENSEA, _2G1_TD2])
scheduleIDs.set('2G1 TP4', 468)
scheduleTree.set('2G1 TP5', [_2ème_ENSEA, _2G1_TD3])
scheduleIDs.set('2G1 TP5', 540)
scheduleTree.set('2G1 TP6', [_2ème_ENSEA, _2G1_TD3])
scheduleIDs.set('2G1 TP6', 448)
scheduleTree.set('2G2 TP1', [_2ème_ENSEA, _2G2_TD1])
scheduleIDs.set('2G2 TP1', 470)
scheduleTree.set('2G2 TP2', [_2ème_ENSEA, _2G2_TD1])
scheduleIDs.set('2G2 TP2', 471)
scheduleTree.set('2G2 TP3', [_2ème_ENSEA, _2G2_TD2])
scheduleIDs.set('2G2 TP3', 473)
scheduleTree.set('2G2 TP4', [_2ème_ENSEA, _2G2_TD2])
scheduleIDs.set('2G2 TP4', 474)
scheduleTree.set('2G2 TP5', [_2ème_ENSEA, _2G2_TD3])
scheduleIDs.set('2G2 TP5', 605)
scheduleTree.set('2G2 TP6', [_2ème_ENSEA, _2G2_TD3])
scheduleIDs.set('2G2 TP6', 606)
scheduleTree.set('2G3 TP1', [_2ème_ENSEA, _2G3_TD1])
scheduleIDs.set('2G3 TP1', 479)
scheduleTree.set('2G3 TP2', [_2ème_ENSEA, _2G3_TD1])
scheduleIDs.set('2G3 TP2', 480)
scheduleTree.set('2G3 TP3', [_2ème_ENSEA, _2G3_TD2])
scheduleIDs.set('2G3 TP3', 482)
scheduleTree.set('2G3 TP4', [_2ème_ENSEA, _2G3_TD2])
scheduleIDs.set('2G3 TP4', 483)
scheduleIDs.set('2G3 TP5', 542)  // ??
scheduleIDs.set('2G3 TP6', 549)

//3ème D
const _3ème_D = '3ème D'
const _3DN = '3DN'
const _3DRT = '3DRT'
scheduleList.push(_3ème_D)
scheduleList.push(_3DN)
scheduleList.push(_3DRT)

scheduleTree.set('3D - TP1', [_3ème_D])
scheduleTree.set('3D - TP2', [_3ème_D])
scheduleTree.set('3D - TP3', [_3ème_D])
scheduleTree.set('3D - TP4', [_3ème_D])
scheduleTree.set('3DINA', [_3ème_D])

const _3ème_AEI = '3ème AEI'
const _3ème_ESC = '3ème ESC'
const _3ème_ESE = '3ème ESE'
const _3ème_EVE = '3ème EVE'
const _3ème_IS = '3ème IS'
const _3ème_MSC = '3ème MSC'
const _3ème_RTS = '3ème RTS'
const _3ème_SIA = '3ème SIA'
scheduleTree.set('AEI TP1', [_3ème_D, _3ème_AEI])
scheduleTree.set('AE2 TP2', [_3ème_D, _3ème_AEI])
scheduleTree.set('ESC TP1', [_3ème_D, _3ème_ESC])
scheduleTree.set('ESC TP2', [_3ème_D, _3ème_ESC])
scheduleTree.set('EVE TP1', [_3ème_D, _3ème_EVE])
scheduleTree.set('EVE TP2', [_3ème_D, _3ème_EVE])
scheduleTree.set('ESE TP1', [_3ème_D, _3ème_ESE])
scheduleTree.set('ESE TP2', [_3ème_D, _3ème_ESE])
scheduleTree.set('IS TP1', [_3ème_D, _3ème_IS])
scheduleTree.set('IS TP2', [_3ème_D, _3ème_IS])
scheduleTree.set('MSC TP1', [_3ème_D, _3ème_MSC])
scheduleTree.set('MSC TP2', [_3ème_D, _3ème_MSC])
scheduleTree.set('RTS TP1', [_3ème_D, _3ème_RTS])
scheduleTree.set('RTS TP2', [_3ème_D, _3ème_RTS])
scheduleTree.set('SIA TP1', [_3ème_D, _3ème_SIA])
scheduleTree.set('SIA TP2', [_3ème_D, _3ème_SIA])

scheduleIDs.set('3D INA', 457)
scheduleIDs.set('3DN', 597)
scheduleIDs.set('3DN -TP1', 616)
scheduleIDs.set('3DN -TP2', 598)
scheduleIDs.set('3DRT', 614)
scheduleIDs.set('3DRT - TP1', 615)
scheduleIDs.set('3DRT - TP2', 618)
scheduleIDs.set('3D - TP1', 593)
scheduleIDs.set('3D - TP2', 595)
scheduleIDs.set('3D - TP3', 596)
scheduleIDs.set('3D - TP4', 631)
scheduleIDs.set('3ème AEI', 508)
scheduleIDs.set('AEI TP1', 523)
scheduleIDs.set('SIT TP1', 613)
scheduleIDs.set('SIT TP2', 611)
scheduleIDs.set('SIT TP3', 610)
scheduleIDs.set('SIA TP1', 589)
scheduleIDs.set('SIA TP2', 590)
scheduleIDs.set('RT TP1', 586)
scheduleIDs.set('RT TP2', 587)
scheduleIDs.set('PIM TP1', 450)
scheduleIDs.set('PIM TP2', 594)
scheduleIDs.set('MSC TP1', 494)
scheduleIDs.set('MSC TP2', 489)
scheduleIDs.set('DSML TP1', 617)
scheduleIDs.set('DSML TP2', 619)
scheduleIDs.set('DSML TP3', 496)
scheduleIDs.set('ESC TP1', 514)
scheduleIDs.set('ESC TP2', 518)
scheduleIDs.set('ESE TP1', 526)
scheduleIDs.set('ESE TP2', 528)
scheduleIDs.set('ESI TP1', 572)
scheduleIDs.set('ESI TP2', 439)
scheduleIDs.set('ESI TP3', 568)
scheduleIDs.set('EVE TP1', 551)
scheduleIDs.set('EVE TP2', 552)
scheduleIDs.set('IAR TP1', 608)
scheduleIDs.set('IAR TP2', 603)
scheduleIDs.set('IAR TP3', 602)
scheduleIDs.set('IS TP1', 575)
scheduleIDs.set('IS TP2', 582)

scheduleTree.set('FAME Gr 1', ["FAME"])
scheduleTree.set('FAME Gr 2', ["FAME"])
scheduleIDs.set('FAME Gr 1', 516)
scheduleIDs.set('FAME Gr 2', 592)
/*
649 "Chinois"
601 "IAR"
560 "CNAM"
561 "CNAM gr1"
534 "Défense et sécurité"
656 "Drone groupe 1"
657 "Drone groupe 2"
646 "Drones"
535 "D&S groupe 1"
643 "D&S groupe 2"
495 "DSML"
538 "Electronique et signal pour la musique"
581 "Entr groupe 1"
539 "E&S groupe 1"
543 "E&S groupe 2"
438 "ESI"
515 "FAME"
516 "FAME Gr 1"
592 "FAME Gr 2"
628 "FORMATIONS_COURTES"
202 "Français langue étrangère"
545 "I.A. et Big Data"
546 "IA groupe 1"
547 "IA groupe 2"
554 "Image et réalité virtuelle"
555 "Image groupe 1"
556 "Image groupe 2"
580 "Innovation et entrepreneuriat"

557 "Internet of Things"
558 "IoT groupe 1"
559 "IoT groupe 2"
648 "Japonais"

647 "LV3 ENSEA"
437 "MASTERES"
562 "Microélec groupe 1"
477 "Microélec groupe 2"
476 "Microélectronique"
567 "Multiphys groupe 1"
475 "Options"
449 "PIM"
661 "PREMASTER"
660 "PREMASTER"
650 "Russe"
563 "Sécurité des systèmes d'information"
609 "SIT"
544 "SP Gr1"
498 "SP Gr2"
564 "SSI groupe 1"
565 "SSI groupe 2"
497 "Summer Program"
566 "Systèmes multiphysiques"
490 "VALEO"
570 "VE groupe 1"
571 "VE groupe 2"
569 "Véhicule électrique"
*/


scheduleIDs.forEach((value, key) => {
  scheduleList.push(key)
})