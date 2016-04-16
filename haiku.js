var fs = require('fs');

var syllableArray;

String.prototype.clean = function(){
  return this.replace(/[^A-Za-z]/g, '');
}

function syllableArraySetup(dictFile, text){
  syllableArray = formatData(readCmudictFile(dictFile), (typeof text !== 'undefined'));
}

function readCmudictFile(file) {
    return fs.readFileSync(file).toString();
}

function formatData(data, hasText) {
    var lines = data.toString().split("\n"),
        syllableArray = hasText ? {} : [];

    lines.slice(0, -1).forEach(function(line) {
        parseLine(line, syllableArray, hasText);
    });
    console.log(syllableArray);
    return syllableArray;
}

function parseLine(line, obj, hasText) {
  var lineSplit = line.split("  ");
  var word = lineSplit[0];
  var syllables = syllableCount(lineSplit[1]);

  if (hasText) {
    obj[word.clean()] = syllables;
  } else {
    (obj[syllables] = obj[syllables] || []).push(word.clean());
  }
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
