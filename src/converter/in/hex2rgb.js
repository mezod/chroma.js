import {_input} from '../../io/index';

var isHexRGB = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    isHexRGBA = /^#?([A-Fa-f0-9]{8})$/;

export function hex2rgb(hex) {
    var u, r, g, b, a, rgb;
    if (hex.match(isHexRGB)) {
        if (hex.length == 4 || hex.length == 7) hex = hex.substr(1);
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
        if (hex.length == 9) hex = hex.substr(1);
        u = parseInt(hex, 16);
        r = u >> 24 & 0xFF;
        g = u >> 16 & 0xFF;
        b = u >> 8 & 0xFF;
        a = Math.round((u & 0xFF) / 0xFF * 100) / 100;
        return [r,g,b,a];
    }

    // check for css colors, too
    if (_input.css && (rgb = _input.css(hex))) return rgb;
    
    throw 'unknown color: '+hex;
}
