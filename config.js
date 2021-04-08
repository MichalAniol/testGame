const CheckIsTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}
const detectMob = () => {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}



const config = {
    isTouchDevice: CheckIsTouchDevice(),
    mobile: detectMob(),

    kartaList: [
        karta1, // 0
        karta3, // 1
        karta4, // 2
        karta7,
        karta8,
        karta9,
        karta10,
        karta11,
        karta12,
        karta14,
        karta15,
        karta16
    ],


    hoverAnim: {
        frames: [0, 1, 2],
        time: 100
    },
    clickAnim: {
        frames: [0, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        time: 100
    },

    czasKartyTakieSame: 2200,
    czasKartySieRoznia: 1800,
    czasOpoznieniaNazwySymbolu: 1200,

    cardSound: () => (function() {
        let audio = new Audio('./sounds/karta_odwrocenie.mp3');
        audio.play()
        audio.pause()
        audio.currentTime = 0
        return audio
    }()),


    symbolList: [{
        svg: szabla,
        sound: new Audio('./sounds/szabla.mp3')
    }, {
        svg: szachy,
        sound: new Audio('./sounds/szachy.mp3')
    }, {
        svg: szafa,
        sound: new Audio('./sounds/szafa.mp3')
    }, {
        svg: szafka,
        sound: new Audio('./sounds/szafka.mp3')
    }, {
        svg: szalik,
        sound: new Audio('./sounds/szalik.mp3')
    }, {
        svg: szalupa,
        sound: new Audio('./sounds/szalupa.mp3')
    }, {
        svg: szatnia,
        sound: new Audio('./sounds/szatnia.mp3')
    }, {
        svg: szelki,
        sound: new Audio('./sounds/szelki.mp3')
    }, {
        svg: szeryf,
        sound: new Audio('./sounds/szeryf.mp3')
    }, {
        svg: szofer,
        sound: new Audio('./sounds/szofer.mp3')
    }, {
        svg: szopa,
        sound: new Audio('./sounds/szopa.mp3')
    }, {
        svg: szufelka,
        sound: new Audio('./sounds/szufelka.mp3')
    }, {
        svg: szyba,
        sound: new Audio('./sounds/szyba.mp3')
    }, {
        svg: szydelko,
        sound: new Audio('./sounds/szydelko.mp3')
    }, {
        svg: szyja,
        sound: new Audio('./sounds/szyja.mp3')
    }, {
        svg: szynka,
        sound: new Audio('./sounds/szynka.mp3')
    }, {
        svg: szyny,
        sound: new Audio('./sounds/szyny.mp3')
    }],



}