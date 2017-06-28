const pkg = require( './package.json' );

import buble from 'rollup-plugin-buble';

export default {
    entry: 'src/index.js',
    moduleName: 'chroma',
    plugins: [ buble({transforms: {dangerousForOf:true} }) ],
    targets: [
        { dest: pkg.main, format: 'umd' },
        { dest: pkg.module, format: 'es' }
    ]
};