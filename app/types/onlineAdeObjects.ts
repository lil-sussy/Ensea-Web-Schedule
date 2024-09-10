export const classesID = new Map<string, number>(); // Useful to make api request to ADE
export const classList: string[] = []; // Useful to parse data from ical events
export const classTree = new Map<String, String[]>(); // Useful to perform search queries in search engine

const _1G1_TD1 = "1G1 TD1";
const _1G1_TD2 = "1G1 TD2";
const _1G1_TD3 = "1G1 TD3";

const _1G2_TD1 = "1G2 TD1";
const _1G2_TD2 = "1G2 TD2";
const _1G2_TD3 = "1G2 TD3";

const _1G3_TD1 = "1G3 TD1";
const _1G3_TD2 = "1G3 TD2";
const _1G3_TD3 = "1G3 TD3";

const _1DA_TD1 = "1DA TD1";

const _1DA_TD2 = "1DA TD2";

const _1DC_TP1 = "1DC TP1";

const _1ère_A_ENSEA = "1ère A ENSEA";
const _1ère_B_ENSEA = "1ère B ENSEA";
const _1ère_DA = "1ère DA";
const _1DAVN = "1DAVN";
const _1ère_DC = "1ère DC";
const _1G1_TP1 = "1G1 TP1";
const _1G1_TP2 = "1G1 TP2";
const _1G1_TP3 = "1G1 TP3";
const _1G1_TP4 = "1G1 TP4";
const _1G1_TP5 = "1G1 TP5";
const _1G1_TP6 = "1G1 TP6";
const _1G2_TP1 = "1G2 TP1";
const _1G2_TP2 = "1G2 TP2";
const _1G2_TP3 = "1G2 TP3";
const _1G2_TP4 = "1G2 TP4";
const _1G2_TP5 = "1G2 TP4";
const _1G2_TP6 = "1G2 TP4";
const _1G3_TP1 = "1G3 TP1";
const _1G3_TP2 = "1G3 TP2";
const _1G3_TP3 = "1G3 TP3";
const _1G3_TP4 = "1G3 TP4";
const _1G3_TP5 = "1G3 TP5";
const _1G3_TP6 = "1G3 TP6";
const _1DA_TP1 = "1DA TP1";
const _1DA_TP2 = "1DA TP2";
const _1DA_TP3 = "1DA TP3";
const _1DA_TP4 = "1DA TP4";

//1ère A G1
classesID.set(_1G1_TP1, 430);
classesID.set(_1G1_TP2, 431);
classesID.set(_1G1_TP3, 433);
classesID.set(_1G1_TP4, 434);
classesID.set(_1G1_TP5, 436);
classesID.set(_1G1_TP6, 440);

//1ère A G2
classesID.set(_1G2_TP1, 442);
classesID.set(_1G2_TP2, 443);
classesID.set(_1G2_TP3, 445);
classesID.set(_1G2_TP4, 451);
classesID.set(_1G2_TP5, 641);
classesID.set(_1G2_TP6, 642);

//1ère B G3
classesID.set(_1G3_TP1, 454);
classesID.set(_1G3_TP2, 455);
classesID.set(_1G3_TP3, 459);
classesID.set(_1G3_TP4, 460);
classesID.set(_1G3_TP5, 462);
classesID.set(_1G3_TP6, 573);

//1ère D G1
classesID.set(_1DA_TP1, 591);
classesID.set(_1DA_TP2, 579);
classesID.set(_1DA_TP3, 499);
classesID.set(_1DA_TP4, 486);

//1ère DC
classesID.set(_1DC_TP1, 520);
classList.push(_1ère_A_ENSEA);
classList.push(_1ère_B_ENSEA);
classList.push(_1ère_DA);
classList.push(_1DAVN);
classList.push(_1ère_DC);

//1ère A G1
classList.push(_1G1_TD1);
classList.push(_1G1_TD2);
classList.push(_1G1_TD3);

//1ère A G2
classList.push(_1G2_TD1);
classList.push(_1G2_TD2);
classList.push(_1G2_TD3);

//1ère B G3
classList.push(_1G3_TD1);
classList.push(_1G3_TD2);
classList.push(_1G3_TD3);
classList.push(_1DA_TD1);
classList.push(_1DA_TD2);

classesID.forEach((value, key) => {
	classList.push(key);
});

classList.push(_1ère_A_ENSEA);
classList.push(_1ère_B_ENSEA);
classList.push(_1ère_DA);
classList.push(_1DAVN);
classList.push(_1ère_DC);

//1ère A G1
classTree.set("1G1 TP1", [_1G1_TD1, _1ère_A_ENSEA]);
classTree.set("1G1 TP2", [_1G1_TD1, _1ère_A_ENSEA]);
classList.push(_1G1_TD1);

classTree.set("1G1 TP3", [_1G1_TD2, _1ère_A_ENSEA]);
classTree.set("1G1 TP4", [_1G1_TD2, _1ère_A_ENSEA]);
classList.push(_1G1_TD2);

classTree.set("1G1 TP5", [_1G1_TD3, _1ère_A_ENSEA]);
classTree.set("1G1 TP6", [_1G1_TD3, _1ère_A_ENSEA]);
classList.push(_1G1_TD3);

//1ère A G2
classTree.set("1G2 TP1", [_1G2_TD1, _1ère_A_ENSEA]);
classTree.set("1G2 TP2", [_1G2_TD1, _1ère_A_ENSEA]);
classList.push(_1G2_TD1);

classTree.set("1G2 TP3", [_1G2_TD2, _1ère_A_ENSEA]);
classTree.set("1G2 TP4", [_1G2_TD2, _1ère_A_ENSEA]);
classList.push(_1G2_TD2);

classTree.set("1G2 TP5", [_1G2_TD3, _1ère_A_ENSEA]);
classTree.set("1G2 TP6", [_1G2_TD3, _1ère_A_ENSEA]);
classList.push(_1G2_TD3);

//1ère B G3
classTree.set("1G3 TP1", [_1G3_TD1, _1ère_B_ENSEA]);
classTree.set("1G3 TP2", [_1G3_TD1, _1ère_B_ENSEA]);
classList.push(_1G3_TD1);

classTree.set("1G3 TP3", [_1G3_TD2, _1ère_B_ENSEA]);
classTree.set("1G3 TP4", [_1G3_TD2, _1ère_B_ENSEA]);
classList.push(_1G3_TD2);

classTree.set("1G3 TP5", [_1G3_TD3, _1ère_B_ENSEA]);
classTree.set("1G3 TP6", [_1G3_TD3, _1ère_B_ENSEA]);
classList.push(_1G3_TD3);

classTree.set("1DA TP1", [_1DA_TD1, _1ère_DA, _1DAVN]);
classTree.set("1DA TP2", [_1DA_TD1, _1ère_DA, _1DAVN]);
classList.push(_1DA_TD1);

classTree.set("1DA TP3", [_1DA_TD2, _1ère_DA, _1DAVN]);
classTree.set("1DA TP4", [_1DA_TD2, _1ère_DA, _1DAVN]);
classList.push(_1DA_TD2);

//1ère DC
classTree.set(_1DC_TP1, [_1DC_TP1, _1ère_DC]);

//2ème Année D
const _2ème_D = "2ème D";
const _2DA_INA = "2DA_INA";
const _2D = "2D";
classList.push(_2D);
classList.push(_2ème_D);

const _2DA_TP1 = "2DA TP1";
const _2DA_TP2 = "2DA TP2";
const _2DA_TP3 = "2DA TP3";
const _2DA_TP4 = "2DA TP4";
classTree.set(_2DA_INA, [_2ème_D]);
classesID.set(_2DA_INA, 612);
classTree.set(_2DA_TP1, [_2D, _2ème_D]);
classesID.set("2DA TP1", 600);
classTree.set(_2DA_TP2, [_2D, _2ème_D]);
classesID.set("2DA TP2", 607);
classTree.set(_2DA_TP3, [_2D, _2ème_D]);
classesID.set("2DA TP3", 493);
classTree.set(_2DA_TP4, [_2D, _2ème_D]);
classesID.set("2DA TP4", 553);

//2ème Année
const _2ème_ENSEA = "2ème ENSEA";
const _2G1_TD1 = "2G1 TD1 (Info / Signal)";
const _2G1_TD2 = "2G1 TD2 (internationale";
const _2G1_TD3 = "2G1 TD3 (Signal / Elec)";
const _2G2_TD1 = "2G2 TD1 (Info/ Elec)";
const _2G2_TD2 = "2G2 TD2 (Info/ Elec)";
const _2G2_TD3 = "2G2 TD3 (Info/ Autom)";
const _2G3_TD1 = "2G3 TD1 (Elec / Autom)";
const _2G3_TD2 = "2G3 TD2 (Signal / Info)";
classList.push(_2ème_ENSEA);
classList.push(_2G1_TD1);
classList.push(_2G1_TD2);
classList.push(_2G1_TD3);
classList.push(_2G2_TD1);
classList.push(_2G2_TD2);
classList.push(_2G2_TD3);
classList.push(_2G3_TD1);
classList.push(_2G3_TD2);
classTree.set("2G1 TP1", [_2ème_ENSEA, _2G1_TD1]);
classesID.set("2G1 TP1", 464);
classTree.set("2G1 TP2", [_2ème_ENSEA, _2G1_TD1]);
classesID.set("2G1 TP2", 465);
classTree.set("2G1 TP3", [_2ème_ENSEA, _2G1_TD2]);
classesID.set("2G1 TP3", 467);
classTree.set("2G1 TP4", [_2ème_ENSEA, _2G1_TD2]);
classesID.set("2G1 TP4", 468);
classTree.set("2G1 TP5", [_2ème_ENSEA, _2G1_TD3]);
classesID.set("2G1 TP5", 540);
classTree.set("2G1 TP6", [_2ème_ENSEA, _2G1_TD3]);
classesID.set("2G1 TP6", 448);
classTree.set("2G2 TP1", [_2ème_ENSEA, _2G2_TD1]);
classesID.set("2G2 TP1", 470);
classTree.set("2G2 TP2", [_2ème_ENSEA, _2G2_TD1]);
classesID.set("2G2 TP2", 471);
classTree.set("2G2 TP3", [_2ème_ENSEA, _2G2_TD2]);
classesID.set("2G2 TP3", 473);
classTree.set("2G2 TP4", [_2ème_ENSEA, _2G2_TD2]);
classesID.set("2G2 TP4", 474);
classTree.set("2G2 TP5", [_2ème_ENSEA, _2G2_TD3]);
classesID.set("2G2 TP5", 605);
classTree.set("2G2 TP6", [_2ème_ENSEA, _2G2_TD3]);
classesID.set("2G2 TP6", 606);
classTree.set("2G3 TP1", [_2ème_ENSEA, _2G3_TD1]);
classesID.set("2G3 TP1", 479);
classTree.set("2G3 TP2", [_2ème_ENSEA, _2G3_TD1]);
classesID.set("2G3 TP2", 480);
classTree.set("2G3 TP3", [_2ème_ENSEA, _2G3_TD2]);
classesID.set("2G3 TP3", 482);
classTree.set("2G3 TP4", [_2ème_ENSEA, _2G3_TD2]);
classesID.set("2G3 TP4", 483);
classesID.set("2G3 TP5", 542); // ??
classesID.set("2G3 TP6", 549);

//3ème D
const _3ème_D = "3ème D";
const _3DN = "3DN";
const _3DRT = "3DRT";
classList.push(_3ème_D);
classList.push(_3DN);
classList.push(_3DRT);

classTree.set("3D - TP1", [_3ème_D]);
classTree.set("3D - TP2", [_3ème_D]);
classTree.set("3D - TP3", [_3ème_D]);
classTree.set("3D - TP4", [_3ème_D]);
classTree.set("3DINA", [_3ème_D]);

const _3ème_AEI = "3ème AEI";
const _3ème_ESC = "3ème ESC";
const _3ème_ESE = "3ème ESE";
const _3ème_EVE = "3ème EVE";
const _3ème_IS = "3ème IS";
const _3ème_MSC = "3ème MSC";
const _3ème_RTS = "3ème RTS";
const _3ème_SIA = "3ème SIA";
classTree.set("AEI TP1", [_3ème_D, _3ème_AEI]);
classTree.set("AE2 TP2", [_3ème_D, _3ème_AEI]);
classTree.set("ESC TP1", [_3ème_D, _3ème_ESC]);
classTree.set("ESC TP2", [_3ème_D, _3ème_ESC]);
classTree.set("EVE TP1", [_3ème_D, _3ème_EVE]);
classTree.set("EVE TP2", [_3ème_D, _3ème_EVE]);
classTree.set("ESE TP1", [_3ème_D, _3ème_ESE]);
classTree.set("ESE TP2", [_3ème_D, _3ème_ESE]);
classTree.set("IS TP1", [_3ème_D, _3ème_IS]);
classTree.set("IS TP2", [_3ème_D, _3ème_IS]);
classTree.set("MSC TP1", [_3ème_D, _3ème_MSC]);
classTree.set("MSC TP2", [_3ème_D, _3ème_MSC]);
classTree.set("RTS TP1", [_3ème_D, _3ème_RTS]);
classTree.set("RTS TP2", [_3ème_D, _3ème_RTS]);
classTree.set("SIA TP1", [_3ème_D, _3ème_SIA]);
classTree.set("SIA TP2", [_3ème_D, _3ème_SIA]);

classesID.set("3D INA", 457);
classesID.set("3DN", 597);
classesID.set("3DN -TP1", 616);
classesID.set("3DN -TP2", 598);
classesID.set("3DRT", 614);
classesID.set("3DRT - TP1", 615);
classesID.set("3DRT - TP2", 618);
classesID.set("3D - TP1", 593);
classesID.set("3D - TP2", 595);
classesID.set("3D - TP3", 596);
classesID.set("3D - TP4", 631);
classesID.set("3ème AEI", 508);
classesID.set("AEI TP1", 523);
classesID.set("SIT TP1", 613);
classesID.set("SIT TP2", 611);
classesID.set("SIT TP3", 610);
classesID.set("SIA TP1", 589);
classesID.set("SIA TP2", 590);
classesID.set("RT TP1", 586);
classesID.set("RT TP2", 587);
classesID.set("PIM TP1", 450);
classesID.set("PIM TP2", 594);
classesID.set("MSC TP1", 494);
classesID.set("MSC TP2", 489);
classesID.set("DSML TP1", 617);
classesID.set("DSML TP2", 619);
classesID.set("DSML TP3", 496);
classesID.set("ESC TP1", 514);
classesID.set("ESC TP2", 518);
classesID.set("ESE TP1", 526);
classesID.set("ESE TP2", 528);
classesID.set("ESI TP1", 572);
classesID.set("ESI TP2", 439);
classesID.set("ESI TP3", 568);
classesID.set("EVE TP1", 551);
classesID.set("EVE TP2", 552);
classesID.set("IAR TP1", 608);
classesID.set("IAR TP2", 603);
classesID.set("IAR TP3", 602);
classesID.set("IS TP1", 575);
classesID.set("IS TP2", 582);

classTree.set("FAME Gr 1", ["FAME"]);
classTree.set("FAME Gr 2", ["FAME"]);
classesID.set("FAME Gr 1", 516);
classesID.set("FAME Gr 2", 592);
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

classesID.forEach((value, key) => {
	classList.push(key);
});
