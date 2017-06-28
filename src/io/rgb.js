
import {unpack, type} from '../utils';
import {_input, _guess_formats} from './index';
import {default as chroma, Color} from '../color';

_input.rgb = function() { return unpack(arguments); };
chroma.rgb = function() { return chroma(...arguments, 'rgb'); };

Color.prototype.rgb = function(round=true) {
    if (!round) return this._rgb.slice(0);
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
        if (type(a) == 'array' && a.length == 3) return 'rgb';
        if (type(a) == 'array' && a.length == 4 && type(a[3]) == 'number' &&
            a[3] >= 0 && a[3] <= 1) return 'rgb';
    }
});
