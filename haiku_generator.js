var haiku = require('./haiku');
var cmuDictFile = process.argv[2];
var textFile = process.argv[3];

function formatOutput(haiku) {
  haiku.forEach(function(line) {
    if (Array.isArray(line)) line = line.join(" ");
    console.log(line);
  });
}

haiku.syllableArraySetup(cmuDictFile, textFile);
formatOutput(haiku.createHaiku([5,7,5]));
