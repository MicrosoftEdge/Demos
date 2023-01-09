var fs = require('fs');

function minify(file) {
    var input = fs.readFileSync(file, 'utf8');
    var output = input.replace(/\n\t+/g,'');
    fs.writeFileSync(file.replace('.json','-min.json'), output);
}

fs.readdir(__dirname, (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        if (file.endsWith('.json')) {
              minify(file);         
        }
      })
    }
  })