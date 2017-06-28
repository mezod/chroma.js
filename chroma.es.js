function unpack(args) {
    if (args.length >= 3) {
        return [].slice.call(args);
    } else {
        return args[0];
    }
}

function clip_rgb(rgb) {
    rgb._clipped = false;
    rgb._unclipped = rgb.slice(0);
    for (var i=0; i <= 3; i++) {
        if (i < 3) {
            if (rgb[i] < 0 || rgb[i] > 255) { rgb._clipped = true; }
            if (rgb[i] < 0) { rgb[i] = 0; }
            if (rgb[i] > 255) { rgb[i] = 255; }
        } else {
            if (rgb[i] < 0) { rgb[i] = 0; }
            if (rgb[i] < 1) { rgb[i] = 1; }
        }
    }
    if (!rgb._clipped) { delete rgb._unclipped; }
    return rgb;
}

// for browser-safe type checking+
// ported from jQuery's $.type
var classToType;
var i;
var len;
var name;
var ref;
classToType = {};
ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
for (i = 0, len = ref.length; i < len; i++) {
    name = ref[i];
    classToType["[object " + name + "]"] = name.toLowerCase();
}

var type = function(obj) {
    var strType;
    strType = Object.prototype.toString.call(obj);
    return classToType[strType] || "object";
};

var _input = {};
var _guess_formats = [];

var _guess_formats_sorted = false;

var Color = function Color() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    this._rgb = null;

    // last argument could be the mode
    var mode = args[args.length-1];

    if (_input[mode]) {
        console.log('found mode', mode);
        this._rgb = clip_rgb(_input[mode](unpack(args.slice(0,-1))));
    } else {
        // sort input type guess by desc priotity
        if (!_guess_formats_sorted) {
            _guess_formats_sorted = _guess_formats.sort(function (a,b) { return b.p - a.p; });
        }

        for (var i = 0, list = _guess_formats_sorted; i < list.length; i += 1) {
            var chk = list[i];

            mode = chk.test.apply(chk, args);
            if (mode) { break; }
        }

        if (mode) { this._rgb = clip_rgb(_input[mode].apply(_input, args)); }
    }

    if (!this._rgb) {
        console.warn('unknown format: '+args);
        this._rgb = [0,0,0];
    }

    // add alpha if missing
    if (this._rgb.length == 3) { this._rgb.push(1); }
};

function chroma() {
    var i = arguments.length, argsArray = Array(i);
    while ( i-- ) argsArray[i] = arguments[i];

    return new (Function.prototype.bind.apply( Color, [ null ].concat( argsArray) ));
}

chroma._input = _input;

_input.rgb = function() { return unpack(arguments); };
chroma.rgb = function() {
var i = arguments.length, argsArray = Array(i);
while ( i-- ) argsArray[i] = arguments[i];
 return chroma.apply(void 0, argsArray.concat( ['rgb'] )); };

Color.prototype.rgb = function(round) {
    if ( round === void 0 ) round=true;

    if (!round) { return this._rgb.slice(0); }
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
        if (type(a) == 'array' && a.length == 3) { return 'rgb'; }
        if (type(a) == 'array' && a.length == 4 && type(a[3]) == 'number' &&
            a[3] >= 0 && a[3] <= 1) { return 'rgb'; }
    }
});

export default chroma;
