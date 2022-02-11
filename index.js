const { calculateBestWord } = require('./stats');
const { words } = require('./words');

const guess = process.argv[2];

let excludeLetters,
    includeLetters,
    excludeCombination = [];

if (process.argv[3]) {
    includeLetters = process.argv[3].split('include=')[1].split('');
}
if (process.argv[4]) {
    excludeLetters = process.argv[4].split('exclude=')[1].split('');
}
if (process.argv[5]) {
    excludeCombination = process.argv[5]
        .split('combinations=')[1]
        .split(',')
        .map((c) => {
            const split = c.split(':');
            const letter = split[0];
            const position = Number(split[1]);
            return { letter, position };
        });
}

console.log('Include: ', includeLetters);
console.log('Exclude: ', excludeLetters);
console.log('Exclude combinations: ', excludeCombination);

const possibleSolutions = words
    .filter((word) => {
        return (
            !excludeLetters.find((letter) => word.includes(letter)) &&
            includeLetters.every((letter) => word.includes(letter)) &&
            (!excludeCombination.length ||
                !excludeCombination.find(
                    (c) => word[c.position] === c.letter
                )) &&
            word.match(new RegExp(`${guess}`))
        );
    })
    .filter((word) => {
        const includedLetter = includeLetters.find((letter) =>
            guess.includes(letter)
        );
        if (includedLetter) {
            return (
                word.split('').indexOf(includedLetter) !==
                word.split('').lastIndexOf(includedLetter)
            );
        }
        return word;
    });

console.log(possibleSolutions.length);
console.log(possibleSolutions);

const recommendedGuess = calculateBestWord(possibleSolutions);

console.log('Recommended guess: ', recommendedGuess);
