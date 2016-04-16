var fs = require('fs');

var syllableArray;

String.prototype.clean = function(){
  return this.replace(/[^A-Za-z]/g, '');
}

function syllableArraySetup(dictFile, text){
  syllableArray = formatData(readCmudictFile(dictFile), text);
}

function readCmudictFile(file) {
    return fs.readFileSync(file).toString();
}

function formatData(data, text) {
    var lines = data.toString().split("\n"),
        syllableArray = [];

    lines.slice(0, -1).forEach(function(line) {
        parseLine(line, syllableArray);
    });
    return syllableArray;
}

function parseLine(line, arr) {
  var lineSplit = line.split("  ");
  var word = lineSplit[0];
  var syllables = syllableCount(lineSplit[1]);

  (arr[syllables] = arr[syllables] || []).push(word.clean());
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

module.exports.syllableArraySetup = syllableArraySetup;
module.exports.createHaiku = createHaiku;
// module.exports.findHaiku = findHaiku;
