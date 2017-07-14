import {round} from '../../utils';

var rnd = (a) => round(a*100)/100;

export function rgb2css(rgba) {
    var mode;
    mode = rgba[3] < 1 ? 'rgba' : 'rgb';
    if (mode == 'rgb') return mode+'('+rgba.slice(0,3).map(round).join(',')+')';
    return mode+'('+rgba.slice(0,3).map(round).join(',')+','+rgba[3]+')';
}
