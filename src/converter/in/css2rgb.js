import {unpack, round} from '../../utils';
import {hex2rgb} from './hex2rgb';
import {hsl2rgb} from './hsl2rgb';
import {w3cx11} from '../../colors/w3cx11';

var isRGB = /rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/,
    isRGBA = /rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/,
    isRGBpercent = /rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/,
    isRGBApercent = /rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/,
    isHSL = /hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/,
    isHSLA = /hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/;

export function css2rgb(css) {
    var m, rgb, hsl;
    css = css.toLowerCase();
    // named X11 colors
    if (w3cx11[css]) return hex2rgb(w3cx11[css]);
    // rgb(250,20,0)
    if ((m = css.match(isRGB))) {
        rgb = m.slice(1,4);
        for (let i=0; i<3; i++) {
            rgb[i] = +rgb[i];
        }
        rgb[3] = 1;  // default alpha
    }
    // rgba(250,20,0,0.4)
    else if ((m = css.match(isRGBA))) {
        rgb = m.slice(1,5);
        for (let i=0; i<4; i++) {
            rgb[i] = +rgb[i];
        }
    }
    // rgb(100%,0%,0%)
    else if ((m = css.match(isRGBpercent))) {
        rgb = m.slice(1,4);
        for (let i=0; i<3; i++) {
            rgb[i] = round(rgb[i] * 2.55);
        }
        rgb[3] = 1;  // default alpha 
    }
    // rgba(100%,0%,0%,0.4)
    else if ((m = css.match(isRGBApercent))) {
        rgb = m.slice(1,5);
        for (let i=0; i<3; i++) {
            rgb[i] = round(rgb[i] * 2.55);
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
