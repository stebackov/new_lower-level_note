'use strict'

const allNotes = input.notes.all;
const selectedNotes = input.notes.selected;
const selectedNote = selectedNotes[0];

let targetFilename;

function characterNumericalValue(characters) {
    let multiplicationValue = 0;
    
    return [...characters.matchAll(/[a-z]/g)].reduce((acc, v, i, arr) => {
        const letterValue = (v[0].charCodeAt(0) - 97) % 26;
        multiplicationValue++;
        
        if (i === arr.length - 1) {
            acc += letterValue * 26 ** (arr.length - multiplicationValue);
        } else {
            acc += (letterValue + 1) * 26 ** (arr.length - multiplicationValue);
        }
        
        return acc;
     }, 0);
}

function enumerationCharacter(i) {
    let letters = '';
    
    while (i >= 0) {
        letters = String.fromCharCode((i % 26) + 97) + letters;
        i = Math.floor(i / 26) - 1;
    }
    
    return letters;
}

function retrieveID(filename) {
    return String(filename.match(/(?<!\S)[0-9]{1,}[,]{0,1}[0-9]+[a-z0-9]{0,}(?!\S)|(?<!\S)[0-9]{1,}(?!\S)/));
}
    
function generateFilename(filename, newLevel = false) {
    const filenameParts = Array.from(filename.matchAll(/[0-9]+|[,a-z]+/g));
    const idSuffix = filenameParts[filenameParts.length - 1].toString();
    
    if (newLevel) {
        if (idSuffix.match(/[a-z]{1,}/)) {
            filenameParts.push(String(1));
        } else if (filenameParts.length === 1) {
            filenameParts.push(',' + String(1));
        } else {
            filenameParts.push(enumerationCharacter(0));
        }
    } else {
        if (idSuffix.match(/[a-z]{1,}/)) {
            filenameParts[filenameParts.length - 1] = enumerationCharacter(characterNumericalValue(idSuffix) + 1);
        } else {
            filenameParts[filenameParts.length - 1] = parseInt(idSuffix, 10) + 1;
        }
    }
    
    return filenameParts.join('');
}

targetFilename = retrieveID(selectedNote.filename);
    
if (selectedNotes.length === 1 && !selectedNote.filename.match(/^[A-Za-zА-Яа-я-]{1,}.{0,1}[A-Za-zА-Яа-я-]{0,}[0-9]{0,4}[a-zа-я]{0,}$/) && !selectedNote.filename.match(/^\d{12,14}$/) && !retrieveID(selectedNote.filename).match(/^\d{12,14}$/) && retrieveID(selectedNote.filename) !== 'null') {
    targetFilename = generateFilename(targetFilename, true);
    
    for (const note of allNotes) {
        if (!note.filename.match(/^[A-Za-zА-Яа-я-]{1,}.{0,1}[A-Za-zА-Яа-я-]{0,}[0-9]{0,4}[a-zа-я]{0,}$/) && !note.filename.match(/^\d{12,14}$/)) {
            while (retrieveID(note.filename) === targetFilename){
                targetFilename = generateFilename(targetFilename);
            }
        }
    }
} else {
    cancel();
}
    
output.changeFile.filename = targetFilename;
output.changeFile.content = `# ${targetFilename}\n\n`;
