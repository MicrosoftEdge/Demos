// Use this script to minify all JSON files in the current directory.
// This is useful when new JSON files are created.

const fs = require('fs');

function minify(file) {
  const input = fs.readFileSync(file, 'utf8');
  const output = input.replace(/\r\n\s+/g, '');
  fs.writeFileSync(file.replace('.json', '-min.json'), output);
}

fs.readdir(__dirname, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
      if (file.endsWith('.json') && !file.endsWith('-min.json')) {
        minify(file);
      }
    })
  }
});
