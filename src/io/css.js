
// import {unpack, type} from '../utils';
import {_input, _guess_formats} from './index';
import {default as chroma, Color} from '../color';

import {css2rgb} from '../converter/in/css2rgb';
import {rgb2css} from '../converter/out/rgb2css';
import {hsl2css} from '../converter/out/hsl2css';

_input.css = function(h) { return css2rgb(h); };

chroma.css = function() { return chroma(...arguments, 'css'); };

Color.prototype.css = function(mode='rgb') {
    if (mode.substr(0,3) == 'rgb') {
        return rgb2css(this._rgb);
    } else if (mode.substr(0,3) == 'hsl') {
        return hsl2css(this.hsl(), this.alpha());
    }
};

