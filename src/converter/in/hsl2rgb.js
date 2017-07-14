import {unpack} from '../../utils';

var round = Math.round;

export function hsl2rgb() {
    var h,s,l, t3,c,t2,t1, r,g,b, args = unpack(arguments);
    [h,s,l] = args;
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
        for (let i=0; i<3; i++) {
            if (t3[i] < 0) t3[i] += 1;
            if (t3[i] > 1) t3[i] -= 1;
            if (6 * t3[i] < 1) c[i] = t1 + (t2 - t1) * 6 * t3[i];
            else if (2 * t3[i] < 1) c[i] = t2;
            else if (3 * t3[i] < 2) c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6;
            else c[i] = t1;
        }
        [r,g,b] = [round(c[0]*255),round(c[1]*255),round(c[2]*255)];
    }
    if (args.length > 3) return [r,g,b,args[3]];
    return [r,g,b];
}
