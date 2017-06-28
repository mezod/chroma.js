import {_input, _guess_formats} from './io/index';
import {unpack, clip_rgb} from './utils';

var _guess_formats_sorted = false;

export class Color {

    constructor(...args) {
        this._rgb = null;

        // last argument could be the mode
        var mode = args[args.length-1];

        if (_input[mode]) {
            console.log('found mode', mode);
            this._rgb = clip_rgb(_input[mode](unpack(args.slice(0,-1))));
        } else {
            // sort input type guess by desc priotity
            if (!_guess_formats_sorted) {
                _guess_formats_sorted = _guess_formats.sort((a,b) => b.p - a.p);
            }

            for (let chk of _guess_formats_sorted) {
                mode = chk.test(...args);
                if (mode) break;
            }

            if (mode) this._rgb = clip_rgb(_input[mode](...args));
        }

        if (!this._rgb) {
            console.warn('unknown format: '+args);
            this._rgb = [0,0,0];
        }

        // add alpha if missing
        if (this._rgb.length == 3) this._rgb.push(1);
    }

}

export default function chroma() {
    return new Color(...arguments);
}

chroma._input = _input;