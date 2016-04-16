var fs = require('fs');

var syllableArray;
var text;

String.prototype.clean = function() {
    return this.replace(/[^A-Za-z]/g, '').toUpperCase();
}

Array.prototype.range = function(length, start) {
    start = start || 0;
    return Array.apply(null, Array(length)).map(function(_, i) {
        return i + start;
    });
}

Array.prototype.equal = function(arr2) {
    i = this.length;
    if (i !== arr2.length) return false;
    while (i--) {
        if (this[i] !== arr2[i]) return false;
    }
    return true;
}

function setup(dictFile, textFile) {
    syllableArray = formatData(readFile(dictFile), (typeof textFile !== 'undefined'));
    text = readFile(textFile).split(" ")
        .map(function(word) {
            return word.clean()
        })
        .filter(function(word) {
            return word !== ''
        });
}

function readFile(file) {
    return fs.readFileSync(file).toString();
}

function formatData(data, hasText) {
    var lines = data.toString().split("\n"),
        syllableArray = hasText ? {} : [];

    lines.slice(0, -1).forEach(function(line) {
        parseLine(line, syllableArray, hasText);
    });
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
    return phonemes.split(/\d/).length - 1
}

function createHaiku(structure) {
    var haiku = [];
    var line, index, wordList;

    structure = structure || [5, 7, 5];

    structure.forEach(function(syllableNum) {
        if (Array.isArray(syllableNum)) {
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

function foundStructure(lineEnds) {
    var line,
        structure = [];

    for (var i = 1; i < lineEnds.length; i++) {
        lineWeight = text.slice(lineEnds[i - 1], lineEnds[i])
            .reduce(function(a, b) {
                return a + syllableArray[b];
            }, 0);
        structure.push(lineWeight ? lineWeight : -1);
    }
    return structure;
}

function findOneHaiku(lineEnds, structure) {
    var currStructure = [];
    while (!currStructure.equal(structure) && lineEnds[lineEnds.length - 1] < text.length) {
        currStructure = foundStructure(lineEnds);
        currStructure.forEach(function(lineWeight, i) {
            if (lineWeight < structure[i]) {
                lineEnds.forEach(function(_, j) {
                    if (j > i) {
                        lineEnds[j]++;
                    }
                });
            } else if (lineWeight > structure[i]) {
                lineEnds[i]++;
            } else if (lineWeight === -1) {
                lineEnds = [].range(structure.length + 1, lineEnds[i + 1]);
            }
        });
    }

    if (lineEnds[lineEnds.length - 1] < text.length) {
        return extractHaiku(lineEnds);
    }
}

function extractHaiku(lineEnds) {
    var haiku = [],
        line;
    for (var i = 1; i < lineEnds.length; i++) {
        line = text.slice(lineEnds[i - 1], lineEnds[i])
        haiku.push(line);
    }
    return haiku;
}

function findHaikus(structure) {
    var haikus = [];
    var haiku;
    var lineEnds;


    structure = structure || [5, 7, 5];
    lineEnds = [].range(structure.length + 1);

    while (lineEnds[lineEnds.length - 1] < text.length) {
        haiku = findOneHaiku(lineEnds, structure);
        if (haiku) {
            haikus.push(haiku);
            lineEnds = [].range(structure.length + 1, lineEnds[0] + 1);
        }
    }
    console.log(haikus);
    return haikus;
}

module.exports.setup = setup;
module.exports.createHaiku = createHaiku;
module.exports.findHaikus = findHaikus;
