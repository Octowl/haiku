var fs = require('fs');
var syllableArray = syllableArraySetup();

function syllableArraySetup(){
  var syllableArray;

  try {
    syllableArray = require('./syllableArray.json');
  } catch (e) {
    syllableArray = formatData(readCmudictFile('./cmudict.txt'))
  }

  return syllableArray;
}

function readCmudictFile(file) {
    return fs.readFileSync(file).toString();
}

function writeToFile(obj, filename) {
  fs.writeFile(filename, JSON.stringify(obj), "utf-8", function(err){
      if(err) throw err;
      console.log(filename + " has been saved!");
  });
}

function formatData(data) {
    var lines = data.toString().split("\n"),
        syllableArray = [];

    lines.slice(0, -1).forEach(function(line) {
        parseLine(line, syllableArray);
        // console.log("The word " + lineSplit[0] + " has this phoneme    layout: " + lineSplit[1]);
        // console.log("It has " + syllableCount(lineSplit[1]) + " syllables");
    });
    writeToFile(syllableArray, "syllableArray.json");
    return syllableArray;
}

function parseLine(line, arr) {
  var lineSplit = line.split("  ");
  var word = lineSplit[0];
  var syllables = syllableCount(lineSplit[1]);

  (arr[syllables] = arr[syllables] || []).push(word);
}

function syllableCount(phonemes) {
  return phonemes.split(/\d/).length-1
}

function createHaiku(structure) {
    console.log("this should log a haiku with the structure " + structure);
}

module.exports.createHaiku = createHaiku;
