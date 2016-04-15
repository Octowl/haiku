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
  var haiku = [];
  var line, index, wordList;
  structure.forEach(function(syllableNum){
    if(Array.isArray(syllableNum)) {
      line = createHaiku(syllableNum);
    } else {
      wordList = syllableArray[syllableNum];
      index = Math.floor(Math.random() * wordList.length);
      line = wordList[index];
    }
    haiku.push(line);
  });
  return haiku;
}

module.exports.createHaiku = createHaiku;
