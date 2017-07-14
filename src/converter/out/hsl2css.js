import {round} from '../../utils';

var rnd = (a) => round(a*100)/100;

export function hsl2css(hsl, alpha) {
    var mode;
    mode = alpha < 1 ? 'hsla' : 'hsl';
    hsl[0] = rnd(hsl[0] || 0);
    hsl[1] = rnd(hsl[1]*100) + '%';
    hsl[2] = rnd(hsl[2]*100) + '%';
    if (mode == 'hsla') hsl[3] = alpha;
    return mode + '(' + hsl.join(',') + ')';
}
