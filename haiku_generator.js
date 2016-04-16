var haiku = require('./haiku');
var cmuDictFile = process.argv[2];
var textFile = process.argv[3];

function formatOutput(haiku) {
    console.log("");
    haiku.forEach(function(line) {
        if (Array.isArray(line)) line = line.join(" ");
        console.log(line);
    });
    console.log("");
}

haiku.setup(cmuDictFile, textFile);

if (textFile) {
    haiku.findHaikus(formatOutput);
} else {
    formatOutput(haiku.createHaiku());
}
