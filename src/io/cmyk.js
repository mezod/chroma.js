import {unpack, type} from '../utils';
import {_input, _guess_formats} from './index';
import {default as chroma, Color} from '../color';

import {cmyk2rgb} from '../converter/in/cmyk2rgb';
import {rgb2cmyk} from '../converter/out/rgb2cmyk';

_input.cmyk = function() { return cmyk2rgb(unpack(arguments)); };
chroma.cmyk = function() { return chroma(...arguments, 'cmyk'); };

Color.prototype.cmyk = function() {
	return rgb2cmyk(this._rgb);
};
