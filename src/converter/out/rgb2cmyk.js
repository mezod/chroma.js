import {unpack} from '../../utils';

export function rgb2cmyk(mode='rgb') {
    var r,g,b, c,m,y,k, f;
    [r,g,b] = unpack(arguments);
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