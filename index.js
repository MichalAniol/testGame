const play = () => (function() {
    const body = document.querySelector('body');

    const back = document.getElementById('back');
    let backSvg = svg.fromData(tlo);
    back.append(backSvg);

    const start = document.getElementById('start');

    let btnBack = svg.fromData(startBtnBack);
    btnBack.setAttribute('class', 'btn-back');
    start.append(btnBack);

    let btn = svg.fromData(startBtn);
    btn.setAttribute('class', 'btn');
    start.append(btn);


    // start game
    let begin = true;
    const mouseoverBtn = e => {
        let onBtn = e.target.closest('.btn') != null;
        if (onBtn) {
            btnBack.style.opacity = '1';
        } else {
            btnBack.style.opacity = '0';
        }
    }
    document.addEventListener('mouseover', e => mouseoverBtn(e))

    const startGame = () => {
        start.style.opacity = '0';
        document.removeEventListener('mouseover', e => mouseoverBtn(e))
        btn.removeEventListener('click', startGame);
        btn.removeEventListener('touchstart', startGame);

        for (let i = 0; i < config.symbolList.length; i++) { // dla dzwięków safari mobile
            config.symbolList[i].sound.play();
            config.symbolList[i].sound.pause();
            config.symbolList[i].sound.currentTime = 0;
        }

        // let time = 0;
        // for (let item of config.symbolList) {
        //     setTimeout(() => {
        //         item.sound.play();
        //     }, time);
        //     time += 2000;
        // }

        setTimeout(() => {
            start.style.display = 'none';
            begin = false;
        }, 600);
    }
    if (config.isTouchDevice) {
        btn.addEventListener('touchstart', startGame);
    } else {
        btn.addEventListener('click', startGame);
    }


    // game
    const game = document.getElementById('game');
    let many = 12;
    const cards = [];


    const arrangement = () => {
        let manyCards = 4 * 3;
        let symbols = [];
        for (let i = 0; i < manyCards / 2; i++) {

            let rand = null;
            do {
                rand = Math.floor(Math.random() * config.symbolList.length);
            } while (symbols.some(e => e == rand))

            symbols.push(rand);
        }

        let res = []
        for (let i = 0; i < symbols.length; i++) {
            for (let j = 0; j < 2; j++) {
                let rand = Math.floor(Math.random() * manyCards);
                if (typeof res[rand] == 'undefined') {
                    res[rand] = symbols[i];
                } else {
                    for (let k = 0; k < manyCards; k++) {
                        let pos = rand + k;
                        if (pos >= manyCards) pos -= manyCards;
                        if (typeof res[pos] == 'undefined') {
                            res[pos] = symbols[i];
                            break;
                        }
                    }
                }
            }
        }

        return res;
    }

    let places = arrangement();

    for (let i = 0; i < many; i++) {
        let part = i;

        let face_wrap = document.createElement('div');
        face_wrap.className = 'face_wrap';
        face_wrap.id = 'f' + part;
        face_wrap.style.zIndex = 100 - i;
        game.append(face_wrap);

        let card_wrap = document.createElement('div');
        card_wrap.className = 'card_wrap';
        face_wrap.append(card_wrap);


        let images = [];
        config.kartaList.forEach((e, i) => {
            let img = svg.fromData(e);
            img.style.display = i == 0 ? 'initial' : 'none';
            img.id = 'f' + part + '_' + i;
            images.push(img);
            card_wrap.append(img);
        })

        let num = places[i];
        let symb = svg.fromData(config.symbolList[num].svg);
        symb.id = 's' + part;
        symb.style.display = 'none';
        card_wrap.append(symb);


        const hoverAnim = (function() {
            let counter = 0;
            let endFlag = false;
            let interval = null;
            let lastFrame = null;
            const endFrame = config.hoverAnim.frames.length - 1;

            const show = () => {
                let newFrame = config.hoverAnim.frames[counter];
                if (newFrame != lastFrame) {
                    images.forEach(e => {
                        if (e.id == 'f' + part + '_' + newFrame) {
                            e.style.display = 'initial';
                        } else {
                            e.style.display = 'none';
                        }
                    })
                    lastFrame = newFrame;
                }
            }

            const anim = () => {
                show();

                if (endFlag) {
                    counter--
                } else {
                    counter++
                }

                if (counter > endFrame) counter = endFrame;
                if (counter < 0) {
                    counter = 0;
                    clearInterval(interval);
                }

            }

            const start = () => {
                clearInterval(interval);
                interval = setInterval(anim, config.hoverAnim.time);
                counter = 1;
                endFlag = false;
                show();
                counter++
            }

            const end = () => {
                endFlag = true;
            }

            const reset = () => {
                counter = 0;
                clearInterval(interval);
            }

            return {
                start,
                end,
                reset
            }
        }())

        const clickAnim = (function() {
            let counter = 0;
            let endFlag = false;
            let interval = null;
            let lastFrame = null;
            const endFrame = config.clickAnim.frames.length - 1;

            const show = () => {
                let newFrame = config.clickAnim.frames[counter];
                if (newFrame != lastFrame) {
                    images.forEach(e => {
                        if (e.id == 'f' + part + '_' + newFrame) {
                            e.style.display = 'initial';
                        } else {
                            e.style.display = 'none';
                        }
                    })
                    lastFrame = newFrame;
                }

                symb.style.display = (newFrame == config.kartaList.length - 1) ? 'initial' : 'none';
            }

            const anim = () => {
                show();

                if (endFlag) {
                    counter--
                } else {
                    counter++
                }

                if (counter > endFrame) counter = endFrame;
                if (counter < 0) {
                    counter = 0;
                    clearInterval(interval);
                }

            }

            const start = () => {
                clearInterval(interval);
                interval = setInterval(anim, config.clickAnim.time);
                counter = 1;
                endFlag = false;
                show();
                counter++
            }

            const end = () => {
                endFlag = true;
            }

            const reset = () => {
                counter = 0;
                clearInterval(interval);
            }

            return {
                start,
                end,
                reset
            }
        }())

        cards.push({
            id: part,
            face_wrap,
            card_wrap,
            hendler: face_wrap.querySelector('.hendler'),
            images,
            hover: hoverAnim,
            click: clickAnim,
            symb,
            opened: false,
            used: false
        });
    }

    let lastCard = null;
    document.addEventListener('mousemove', e => {
        let item = null;
        cards.forEach(f => {
            if (f.area.left < e.clientX && f.area.right > e.clientX && f.area.top < e.clientY && f.area.bottom > e.clientY) item = f;
        })

        if (lastCard != item) {
            if (lastCard != null) cards[lastCard.id].hover.end();

            if (item != null && !item.opened) {
                cards[item.id].hover.start();
            }
            lastCard = item;
        }

        if (!begin) body.style.cursor = item != null ? 'pointer' : 'default';
    })

    let match = [];
    let lastClicked = null;
    const clickEvent = e => {
        if (begin) return;
        if (match.length >= 2) return;

        let item = null;
        cards.forEach(f => {
            if (f.area.left < e.clientX && f.area.right > e.clientX && f.area.top < e.clientY && f.area.bottom > e.clientY) item = f;
        })

        let areas = [];
        cards.forEach(f => { areas.push([f.area, f.hendler]) });
        console.log('%c areas:', 'background: #ffcc00; color: #003300', areas)

        if (item) {
            if (item.used) return;
            if (item.id == lastClicked) return;

            let sound = config.cardSound();
            sound.play()

            let card = cards[item.id];
            card.click.start();
            card.opened = true;
            card.hover.reset();

            match.push(item)

            if (match.length == 2) {
                let firstCard = places[match[0].id];
                let secondCard = places[match[1].id];
                if (firstCard == secondCard) {
                    // gdy karty takie same
                    setTimeout(() => {
                        config.symbolList[firstCard].sound.play();
                    }, config.czasOpoznieniaNazwySymbolu);
                    setTimeout(() => {
                        match[0].face_wrap.style.opacity = 0;
                        match[1].face_wrap.style.opacity = 0;
                        match[0].used = true;
                        match[1].used = true;
                        match = [];
                    }, config.czasKartyTakieSame);
                } else {
                    // gry kary się różnią
                    setTimeout(() => {
                        match[0].click.end();
                        match[1].click.end();
                        match[0].opened = false;
                        match[1].opened = false;
                        match = [];
                    }, config.czasKartySieRoznia);
                }
            }

            lastClicked = item.id;
        }
    }

    if (!config.isTouchDevice) document.addEventListener('click', clickEvent)

    const touchstartEvent = e => {
        if (begin) return;
        if (match.length >= 2) return;

        let item = null;
        let tu = e.touches[0];
        cards.forEach(f => {
            if (f.area.left < tu.clientX && f.area.right > tu.clientX && f.area.top < tu.clientY && f.area.bottom > tu.clientY) item = f;
        })

        if (item) {
            if (item.used) return;
            if (item.id == lastClicked) return;

            let sound = config.cardSound();
            sound.play()

            let card = cards[item.id];
            card.click.start();
            card.opened = true;
            card.hover.reset();

            match.push(item)

            if (match.length == 2) {
                let firstCard = places[match[0].id];
                let secondCard = places[match[1].id];
                if (firstCard == secondCard) {
                    // gdy karty takie same
                    setTimeout(() => {
                        let sound = config.symbolList[firstCard].sound;
                        sound.play();
                    }, config.czasOpoznieniaNazwySymbolu);
                    setTimeout(() => {
                        match[0].face_wrap.style.opacity = 0;
                        match[1].face_wrap.style.opacity = 0;
                        match[0].used = true;
                        match[1].used = true;
                        match = [];
                    }, config.czasKartyTakieSame);
                } else {
                    // gry kary się różnią
                    setTimeout(() => {
                        match[0].click.end();
                        match[1].click.end();
                        match[0].opened = false;
                        match[1].opened = false;
                        match = [];
                    }, config.czasKartySieRoznia);
                }
            }

            lastClicked = item.id;
        }
    }

    if (config.isTouchDevice) document.addEventListener('touchstart', touchstartEvent)


    // resize
    const reize = () => {
        back.style.height = window.innerHeight + 'px';
        back.style.width = (window.innerHeight * 3.331111111111111) + 'px';

        let w = Math.min(window.innerWidth / 5, window.innerHeight / 5);
        cards.forEach(e => {
            e.card_wrap.style.width = (w * 2.8) + 'px'
            e.area = e.hendler.getBoundingClientRect();
        });
    }
    reize();

    // window.onresize = reize;

    const winSize = { w: 0, h: 0 };
    setInterval(() => {
        let badRect = cards.some(e => { if (e.area.x == 0 || e.area.y == 0 || e.area.width == 0 || e.area.height == 0) return true })

        if (badRect || window.innerWidth != winSize.w || window.innerHeight != winSize.h) {
            winSize.w = window.innerWidth;
            winSize.h = window.innerHeight;
            reize();
        }
    }, 100);

}())

play();