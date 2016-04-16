var haiku = require('./haiku');

function formatOutput(haiku) {
  haiku.forEach(function(line) {
    if (Array.isArray(line)) line = line.join(" ");
    console.log(line);
  });
}

haiku.syllableArraySetup("cmudict.txt");
formatOutput(haiku.createHaiku([5,7,5]));
