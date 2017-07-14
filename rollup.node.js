var fs = require("fs"),
    rollup = require("rollup");

rollup.rollup({
  entry: "src/index.js"
}).then(function(bundle) {
  var code = bundle.generate({format: "cjs"}).code;
  return new Promise(function(resolve, reject) {
    fs.writeFile("chroma.es.js", code, "utf8", function(error) {
      if (error) return reject(error);
      else resolve();
    });
  });
}).catch(abort);

function abort(error) {
  console.error(error.stack);
}