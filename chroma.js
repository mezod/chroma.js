(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.chroma = factory());
}(this, (function () { 'use strict';

var _input = {};
var _guess_formats = [];

function unpack(args) {
    if (args.length >= 3) {
        return [].slice.call(args);
    } else {
        return args[0];
    }
}

function clip_rgb(rgb) {
    rgb._clipped = false;
    rgb._unclipped = rgb.slice(0);
    for (var i=0; i <= 3; i++) {
        if (i < 3) {
            if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
            if (rgb[i] < 0) { rgb[i] = 0; }
            if (rgb[i] > 255) { rgb[i] = 255; }
        } else {
            if (rgb[i] < 0) { rgb[i] = 0; }
            if (rgb[i] < 1) { rgb[i] = 1; }
        }
    }
    if (!rgb._clipped) { delete rgb._unclipped; }
    return rgb;
}

// for browser-safe type checking+
// ported from jQuery's $.type
var classToType;
var i;
var len;
var name;
var ref;
classToType = {};
ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
for (i = 0, len = ref.length; i < len; i++) {
    name = ref[i];
    classToType["[object " + name + "]"] = name.toLowerCase();
}

var type = function(obj) {
    var strType;
    strType = Object.prototype.toString.call(obj);
    return classToType[strType] || "object";
};

var round = Math.round;

var _guess_formats_sorted = false;

var Color = function Color() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    this._rgb = null;

    // last argument could be the mode
    var mode = args[args.length-1];

    if (_input[mode]) {
        console.log('found mode', mode);
        this._rgb = clip_rgb(_input[mode](unpack(args.slice(0,-1))));
    } else {
        // sort input type guess by desc priotity
        if (!_guess_formats_sorted) {
            _guess_formats_sorted = _guess_formats.sort(function (a,b) { return b.p - a.p; });
        }

        for (var i = 0, list = _guess_formats_sorted; i < list.length; i += 1) {
            var chk = list[i];

            mode = chk.test.apply(chk, args);
            if (mode) { break; }
        }

        if (mode) { this._rgb = clip_rgb(_input[mode].apply(_input, args)); }
    }

    if (!this._rgb) {
        console.warn('unknown format: '+args);
        this._rgb = [0,0,0];
    }

    // add alpha if missing
    if (this._rgb.length == 3) { this._rgb.push(1); }
};

function chroma$1() {
    var i = arguments.length, argsArray = Array(i);
    while ( i-- ) argsArray[i] = arguments[i];

    return new (Function.prototype.bind.apply( Color, [ null ].concat( argsArray) ));
}

chroma$1._input = _input;

_input.rgb = function() { return unpack(arguments); };
chroma$1.rgb = function() {
var i = arguments.length, argsArray = Array(i);
while ( i-- ) argsArray[i] = arguments[i];
 return chroma$1.apply(void 0, argsArray.concat( ['rgb'] )); };

Color.prototype.rgb = function(round$$1) {
    if ( round$$1 === void 0 ) round$$1=true;

    if (!round$$1) { return this._rgb.slice(0); }
    return [
        Math.round(this._rgb[0]),
        Math.round(this._rgb[1]),
        Math.round(this._rgb[2]),
        this._rgb[3]
    ];
};

_guess_formats.push({
    p: 3,
    test: function(n) {
        var a = unpack(arguments);
        if (type(a) == 'array' && a.length == 3) { return 'rgb'; }
        if (type(a) == 'array' && a.length == 4 && type(a[3]) == 'number' &&
            a[3] >= 0 && a[3] <= 1) { return 'rgb'; }
    }
});

function cmyk2rgb() {
    var c,m,y,k, r,g,b, alpha, args = unpack(arguments);
    var assign;
    (assign = args, c = assign[0], m = assign[1], y = assign[2], k = assign[3]);
    alpha = args.length > 4 ? args[4] : 1;
    if (k == 1) { return [0,0,0,alpha]; }
    r = c >= 1 ? 0 : 255 * (1-c) * (1-k);
    g = m >= 1 ? 0 : 255 * (1-m) * (1-k);
    b = y >= 1 ? 0 : 255 * (1-y) * (1-k);
    return [r,g,b,alpha];
}

function rgb2cmyk(mode) {
    if ( mode === void 0 ) mode='rgb';

    var r,g,b, c,m,y,k, f;
    var assign;
    (assign = unpack(arguments), r = assign[0], g = assign[1], b = assign[2]);
    r = r / 255;
    g = g / 255;
    b = b / 255;
    k = 1 - Math.max(r,Math.max(g,b));
    f = k < 1 ? 1 / (1-k) : 0;
    c = (1-r-k) * f;
    m = (1-g-k) * f;
    y = (1-b-k) * f;
    return [c,m,y,k];
}

_input.cmyk = function() { return cmyk2rgb(unpack(arguments)); };
chroma$1.cmyk = function() {
var i = arguments.length, argsArray = Array(i);
while ( i-- ) argsArray[i] = arguments[i];
 return chroma$1.apply(void 0, argsArray.concat( ['cmyk'] )); };

Color.prototype.cmyk = function() {
	return rgb2cmyk(this._rgb);
};

var isHexRGB = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
var isHexRGBA = /^#?([A-Fa-f0-9]{8})$/;

function hex2rgb(hex) {
    var u, r, g, b, a, rgb;
    if (hex.match(isHexRGB)) {
        if (hex.length == 4 || hex.length == 7) { hex = hex.substr(1); }
        if (hex.length == 3) {
            hex = hex.split("");
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        u = parseInt(hex, 16);
        r = u >> 16;
        g = u >> 8 & 0xFF;
        b = u & 0xFF;
        return [r,g,b,1];
    }

    // match rgba hex format, eg #FF000077
    if (hex.match(isHexRGBA)) {
        if (hex.length == 9) { hex = hex.substr(1); }
        u = parseInt(hex, 16);
        r = u >> 24 & 0xFF;
        g = u >> 16 & 0xFF;
        b = u >> 8 & 0xFF;
        a = Math.round((u & 0xFF) / 0xFF * 100) / 100;
        return [r,g,b,a];
    }

    // check for css colors, too
    if (_input.css && (rgb = _input.css(hex))) { return rgb; }
    
    throw 'unknown color: '+hex;
}

var round$1 = Math.round;

function hsl2rgb() {
    var h,s,l, t3,c,t2,t1, r,g,b, args = unpack(arguments);
    var assign;
    (assign = args, h = assign[0], s = assign[1], l = assign[2]);
    if (s === 0) {
        r = g = b = l*255;
    } else {
        t3 = [0,0,0];
        c = [0,0,0];
        t2 = l < 0.5 ? l * (1+s) : l+s-l*s;
        t1 = 2 * l - t2;
        h /= 360;
        t3[0] = h + 1/3;
        t3[1] = h;
        t3[2] = h - 1/3;
        for (var i=0; i<3; i++) {
            if (t3[i] < 0) { t3[i] += 1; }
            if (t3[i] > 1) { t3[i] -= 1; }
            if (6 * t3[i] < 1) { c[i] = t1 + (t2 - t1) * 6 * t3[i]; }
            else if (2 * t3[i] < 1) { c[i] = t2; }
            else if (3 * t3[i] < 2) { c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6; }
            else { c[i] = t1; }
        }
        var assign$1;
        (assign$1 = [round$1(c[0]*255),round$1(c[1]*255),round$1(c[2]*255)], r = assign$1[0], g = assign$1[1], b = assign$1[2]);
    }
    if (args.length > 3) { return [r,g,b,args[3]]; }
    return [r,g,b];
}

/*
	X11 color names

	http://www.w3.org/TR/css3-color/#svg-color
*/

var w3cx11 = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflower: '#6495ed',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    laserlemon: '#ffff54',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrod: '#fafad2',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    maroon2: '#7f0000',
    maroon3: '#b03060',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    purple2: '#7f007f',
    purple3: '#a020f0',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
};

var isRGB = /rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/;
var isRGBA = /rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/;
var isRGBpercent = /rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/;
var isRGBApercent = /rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/;
var isHSL = /hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/;

function css2rgb(css) {
    var m, rgb, hsl;
    css = css.toLowerCase();
    // named X11 colors
    if (w3cx11[css]) { return hex2rgb(w3cx11[css]); }
    // rgb(250,20,0)
    if ((m = css.match(isRGB))) {
        rgb = m.slice(1,4);
        for (var i=0; i<3; i++) {
            rgb[i] = +rgb[i];
        }
        rgb[3] = 1;  // default alpha
    }
    // rgba(250,20,0,0.4)
    else if ((m = css.match(isRGBA))) {
        rgb = m.slice(1,5);
        for (var i$1=0; i$1<4; i$1++) {
            rgb[i$1] = +rgb[i$1];
        }
    }
    // rgb(100%,0%,0%)
    else if ((m = css.match(isRGBpercent))) {
        rgb = m.slice(1,4);
        for (var i$2=0; i$2<3; i$2++) {
            rgb[i$2] = round(rgb[i$2] * 2.55);
        }
        rgb[3] = 1;  // default alpha 
    }
    // rgba(100%,0%,0%,0.4)
    else if ((m = css.match(isRGBApercent))) {
        rgb = m.slice(1,5);
        for (var i$3=0; i$3<3; i$3++) {
            rgb[i$3] = round(rgb[i$3] * 2.55);
        }
        rgb[3] = +rgb[3];
    }
    // hsl(0,100%,50%)
    else if ((m = css.match(isHSL))) {
        hsl = m.slice(1,4);
        hsl[1] *= 0.01;
        hsl[2] *= 0.01;
        rgb = hsl2rgb(hsl);
        rgb[3] = 1;
    }
    // hsla(0,100%,50%,0.5)
    else if ((m = css.match(isHSL))) {
        hsl = m.slice(1,4);
        hsl[1] *= 0.01;
        hsl[2] *= 0.01;
        rgb = hsl2rgb(hsl);
        rgb[3] = +m[4];
    }
    return rgb;
}

function rgb2css(rgba) {
    var mode;
    mode = rgba[3] < 1 ? 'rgba' : 'rgb';
    if (mode == 'rgb') { return mode+'('+rgba.slice(0,3).map(round).join(',')+')'; }
    return mode+'('+rgba.slice(0,3).map(round).join(',')+','+rgba[3]+')';
}

var rnd$1 = function (a) { return round(a*100)/100; };

function hsl2css(hsl, alpha) {
    var mode;
    mode = alpha < 1 ? 'hsla' : 'hsl';
    hsl[0] = rnd$1(hsl[0] || 0);
    hsl[1] = rnd$1(hsl[1]*100) + '%';
    hsl[2] = rnd$1(hsl[2]*100) + '%';
    if (mode == 'hsla') { hsl[3] = alpha; }
    return mode + '(' + hsl.join(',') + ')';
}

// import {unpack, type} from '../utils';
_input.css = function(h) { return css2rgb(h); };

chroma$1.css = function() {
var i = arguments.length, argsArray = Array(i);
while ( i-- ) argsArray[i] = arguments[i];
 return chroma$1.apply(void 0, argsArray.concat( ['css'] )); };

Color.prototype.css = function(mode) {
    if ( mode === void 0 ) mode='rgb';

    if (mode.substr(0,3) == 'rgb') {
        return rgb2css(this._rgb);
    } else if (mode.substr(0,3) == 'hsl') {
        return hsl2css(this.hsl(), this.alpha());
    }
};

var brewer = {
	// sequential
	OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
	PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
	BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
	Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
	BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
	YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
	YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
	Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
	RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
	Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
	YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
	Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
	GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
	Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
	YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
	PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
	Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
	PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
	Viridis: ['#440154', '#482777', '#3f4a8a', '#31678e', '#26838f', '#1f9d8a', '#6cce5a', '#b6de2b', '#fee825'],

	// diverging

	Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
	RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
	RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
	PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
	PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
	RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
	BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
	RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
	PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],

	// qualitative

	Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
	Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
	Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
	Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
	Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
	Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
	Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
	Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2'],

};

// add lowercase aliases for case-insensitive matches
for (var i$1 = 0, list = Object.keys(brewer); i$1 < list.length; i$1 += 1) {
	var key = list[i$1];

	brewer[key.toLowerCase()] = brewer[key];
}

chroma$1.colors = w3cx11;
chroma$1.brewer = brewer;

return chroma$1;

})));
