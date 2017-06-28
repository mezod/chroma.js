export function unpack(args) {
    if (args.length >= 3) {
        return [].slice.call(args);
    } else {
        return args[0];
    }
}

export function clip_rgb(rgb) {
    rgb._clipped = false;
    rgb._unclipped = rgb.slice(0);
    for (let i=0; i <= 3; i++) {
        if (i < 3) {
            if (rgb[i] < 0 || rgb[i] > 255) rgb._clipped = true;
            if (rgb[i] < 0) rgb[i] = 0;
            if (rgb[i] > 255) rgb[i] = 255;
        } else {
            if (rgb[i] < 0) rgb[i] = 0;
            if (rgb[i] < 1) rgb[i] = 1;
        }
    }
    if (!rgb._clipped) delete rgb._unclipped;
    return rgb;
}

// for browser-safe type checking+
// ported from jQuery's $.type
var classToType, i, len, name, ref;
classToType = {};
ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
for (i = 0, len = ref.length; i < len; i++) {
    name = ref[i];
    classToType["[object " + name + "]"] = name.toLowerCase();
}

export var type = function(obj) {
    var strType;
    strType = Object.prototype.toString.call(obj);
    return classToType[strType] || "object";
};
