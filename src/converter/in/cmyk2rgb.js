import {unpack} from '../../utils';

export function cmyk2rgb() {
    var c,m,y,k, r,g,b, alpha, args = unpack(arguments);
    [c,m,y,k] = args;
    alpha = args.length > 4 ? args[4] : 1;
    if (k == 1) return [0,0,0,alpha];
    r = c >= 1 ? 0 : 255 * (1-c) * (1-k);
    g = m >= 1 ? 0 : 255 * (1-m) * (1-k);
    b = y >= 1 ? 0 : 255 * (1-y) * (1-k);
    return [r,g,b,alpha];
}
    