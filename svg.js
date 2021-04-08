const svg = (function() {

    const pos = (item, scale) => {
        let svgRect = item.getBoundingClientRect();
        let viewBox = item.getAttribute('viewBox');
        let vb = viewBox.split(' ').map(i => Number(i) * scale);

        let vbox = {
            x: vb[0] < 0 ? 0 : vb[0],
            y: vb[1] < 0 ? 0 : vb[1],
            width: vb[2],
            height: vb[3]
        }
        let left = (svgRect.width - vbox.width) / 2; // korekta przesunięcia svg
        if (left < 0) left = 0;
        let top = (svgRect.height - vbox.height) / 2;
        if (top < 0) top = 0;

        // let cx = (vb[0] + (vb[2] / 2)) / scale;
        // let cy = (vb[1] + (vb[3] / 2)) / scale;
        // console.log('%c center:', 'background: #ffcc00; color: #003300', cx, cy)

        return {
            x: svgRect.left + left,
            y: svgRect.top + top
        }
    }

    const getSVGelem = type => document.createElementNS('http://www.w3.org/2000/svg', type);

    const g = (id = false, cla = false, trans = false, click = false) => {
        let g = getSVGelem('g');
        if (id) g.setAttribute('id', id);
        if (cla) g.setAttribute('class', cla);
        if (trans) g.setAttribute('transform', trans);
        if (click) g.setAttribute('onclick', click);
        return g;
    }

    const svg = (id = false, cla = false, vbox = false) => {
        let svg = getSVGelem('svg');
        if (id) svg.setAttribute('id', id);
        if (cla) svg.setAttribute('class', cla);
        if (vbox) svg.setAttribute('viewBox', vbox);
        return svg;
    }

    const polygon = (cla = false, points = false) => {
        let polygon = getSVGelem('polygon');
        if (cla) polygon.setAttribute('class', cla);
        if (points) polygon.setAttribute('points', points);
        return polygon;
    }

    const path = (id = false, cla = false, d = false) => {
        let path = getSVGelem('path');
        if (id) path.setAttribute('id', id);
        if (cla) path.setAttribute('class', cla);
        if (d) path.setAttribute('d', d);
        return path;
    }

    const circle = (r, cx = '0', cy = '0', cla = false) => {
        let circle = getSVGelem('circle');
        circle.setAttribute('r', r);
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        if (cla) circle.setAttribute('class', cla);
        return circle;
    }

    const text = (cla = false, x = 0, y = 1) => {
        let text = getSVGelem('text');
        if (cla) text.setAttribute('class', cla);
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        return text;
    }

    const tspan = (cla = false) => {
        let tspan = getSVGelem('tspan');
        if (cla) tspan.setAttribute('class', cla);
        return tspan;
    }

    const textp = (href, startOffset = '50%') => {
        let textPath = getSVGelem('textPath');
        textPath.setAttribute('href', href);
        if (startOffset) textPath.setAttribute('startOffset', startOffset);
        return textPath;
    }

    const animateTransform = (attributeName, type, dur, repeatCount) => {
        let at = getSVGelem('animateTransform');
        at.setAttribute('attributeName', attributeName);
        at.setAttribute('attributeType', 'XML');
        at.setAttribute('type', type);
        at.setAttribute('dur', dur);
        at.setAttribute('repeatCount', repeatCount);
        at.setAttribute('fill', 'freeze');
        return at;
    }

    const rect = (width, height, rx = 0, x = 0, y = 0) => {
        let r = getSVGelem('rect');
        r.setAttribute('width', width);
        r.setAttribute('height', height);
        if (rx) r.setAttribute('rx', rx);
        if (x) r.setAttribute('x', x);
        if (y) r.setAttribute('y', y);
        return r;
    }

    const toData = (item, attributeExceptions = [], classExceptions = []) => {

        if (classExceptions.some(e => item.classList.contains(e))) return false;

        let data = {
            t: item.nodeName
        };

        for (let attribute of item.attributes) {
            if (attributeExceptions.some(e => e == attribute.name)) continue;
            if (typeof data.a == 'undefined') data.a = {};
            data.a[attribute.name] = attribute.value;
        }

        if (item.children.length > 0) {
            data.c = []
            for (let child of item.children) {
                let dataFromChild = toData(child, attributeExceptions, classExceptions);
                if (dataFromChild) data.c.push(dataFromChild)
            }
        }

        return data;
    }

    const fromData = (data, attributeExceptions = [], classExceptions = []) => {
        let itemClass = data.a ? Object.keys(data.a).find(e => e == 'class') : null;
        if (itemClass && classExceptions.some(e => data.a.class.indexOf(e) > -1)) return null;

        let elem = getSVGelem(data.t);

        if (typeof data.a != 'undefined') {
            for (let key in data.a) {
                if (attributeExceptions.some(e => e == key)) continue;
                elem.setAttribute(key, data.a[key]);
            }
        }

        if (typeof data.c != 'undefined') {
            for (let c of data.c) {
                let child = fromData(c, attributeExceptions, classExceptions);
                if (child) elem.append(child);
            }
        }

        return elem;
    }

    const clear = (item) => {

        while (item.children.length > 0) {
            item.children[0].remove();
        }
    }

    const clone = (item, attributes) => {
        let newItem = getSVGelem(item.nodeName);
        for (let attr of attributes) {
            let value = item.getAttribute(attr);
            newItem.setAttribute(attr, value);
        }
        return newItem;
    }

    const copyAtributes = (elem_1, elem_2, attrib) => {
        for (let att of attrib) {
            let a = elem_1.getAttribute(att);
            elem_2.setAttribute(att, a);
        }
    }

    return {
        g,
        svg,
        polygon,
        path,
        circle,
        text,
        tspan,
        textp,
        animateTransform,
        rect,

        pos,
        elem: getSVGelem,

        toData,
        fromData,
        clear,
        clone,
        copyAtributes
    }
}())