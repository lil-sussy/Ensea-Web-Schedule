io = require("socket.io-client")
const socket = io('ws://enseawebschedule.herokuapp.com')
const data = ''
socket.on("connect", () => {
    console.log('socket id { %s }', socket.id); // x8WIv7-mJelg7on_ALbx
    const engine = socket.io.engine;
    console.log('socket transport name : %s', engine.transport.name); // in most cases, prints "polling"

    engine.once("upgrade", () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log('socket transport name (upgraded) : %s', engine.transport.name); // in most cases, prints "websocket"
    });

    engine.on("packet", ({ type, data }) => {
        console.log('packet recieved type: %s, data: %s', type, data)
            // called for each packet received
    });

    engine.on("packetCreate", ({ type, data }) => {
        console.log('packet sent type: %s, data: %s', type, data)
            // called for each packet sent
    });

    engine.on("drain", () => {
        console.log("write buffer drained")
            // called when the write buffer is drained
    });

    engine.on("close", (reason) => {
        console.log('socket closed', reason)
            // called when the underlying connection is closed
    });
    socket.emit('uwu')
});

socket.on("disconnect", () => {
    console.log(socket.id); // undefined
});

socket.emit('uwu')
    /* packet recieved type: message, data: 2["uwu-ade-weekly-shcedule// CM Systèmes électroniques,1ère A ENSEA,DELACRESSONNIÈRE
     Bruno,Amphi Watteau,13h30 - 15h30, TD Analyse de Fourier 1A,1G1 TD3,FAUCARD Bastien,A111,15h30 - 17h30, Amphithéatre scolarité
      (capitalisation : réservé aux redoublants),1ère A ENSEA,1ère B ENSEA,2G1 TD1 (Info / Signal),2G1 TD2 (internationale),2G1 TD3 (Signal /
       Elec),2G2 TD1 (Info/ Elec),2G2 TD2 (Info/ Elec),2G2 TD3 (Info/ Autom),2G3 TD1 (Elec / Autom),2G3 TD2 (Signal / Info),TAUVEL Antoine,Amphi
        Watteau,17h30 - 18h30, TD Systèmes électronique,1G1 TD3,DUPERRIER Cédric,A111,08h00 - 10h00, TD Systèmes linéaires,1G1 TD3,JEBRI Ayoub,A110,
        10h00 - 12h00, CM Langage C,1ère A ENSEA,1ère B ENSEA,TAUVEL Antoine,Amphi Watteau,13h30 - 15h30, CM Electromagnétisme 1A,1ère A ENSEA,
        TEMCAMANI Farid,Amphi Watteau,15h30 - 17h30, TD Anglais 1A S5,1G1 TD1,1G1 TD2,1G1 TD3,BEDIRA Sami,TOPCZYNSKI Magalie,ROMON Emmanuelle,HAOUES
         Faiza,A206,A207,A208,A210,08h00 - 10h00, TDm Langage C,1G1 TD3,RENTON Guillaume,A205,08h00 - 12h00, CM Systèmes linéaires,1ère A ENSEA,
         1ère B ENSEA,DJEMAI Mohamed,Amphi Watteau,08h00 - 10h00, CM Analyse de Fourier,1ère A ENSEA,NICOLAU Florentina,Amphi Watteau,10h00 - 12h00
         , TD Allemand / Espagnol 1A S5,1G1 TD1,1G1 TD2,1G1 TD3,PAAPE Iris,FLINT LUH Stéphanie,CHIPI Eneko,GALDEANO Jean-François,MARINAS Ruth,A105
         ,A107,A106,A208,A209,13h30 - 15h30, TD Systèmes électronique,1G1 TD3,DUPERRIER Cédric,A111,15h30 - 17h30"] */