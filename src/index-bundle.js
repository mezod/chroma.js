'use strict';

var foo = 'hello world!';

import {default as chroma} from './color';

import './io/rgb';
import './io/cmyk';
import './io/css';

import {w3cx11} from './colors/w3cx11';
import {brewer} from './colors/colorbrewer';

chroma.colors = w3cx11;
chroma.brewer = brewer;

export default chroma;
