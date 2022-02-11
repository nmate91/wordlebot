const { calculateBestWord } = require('./stats');
const { words } = require('./words');

const solutions = {};

const replaceAt = (str, index, ch) => {
    return str.replace(/./g, (c, i) => (i == index ? ch : c));
};

for (const solution of words) {
    console.log('For solution: ', solution);
    let found = false;
    let possibleWords = words;
    let guess = '.....';
    let excludeLetters = [],
        includeLetters = [],
        excludeCombination = [];
    let i = 0;
    while (!found) {
        const recommendedGuess = calculateBestWord(possibleWords);

        console.log('Recommended guess: ', recommendedGuess);

        if (recommendedGuess === solution) {
            found = true;
            console.log('Found!! ', recommendedGuess);
            solutions[recommendedGuess] = i + 1;
        } else {
            ++i;
        }

        const bestPossibleWord = recommendedGuess.split('');
        let guessIndexes = {};
        for (let index = 0; index < bestPossibleWord.length; ++index) {
            const letter = bestPossibleWord[index];
            if (solution.includes(letter)) {
                const filteredI = solution
                    .split('')
                    .map((x, i) => ({ x, i }))
                    .filter((l) => l.x === letter);

                for (let sIndex = 0; sIndex < filteredI.length; sIndex++) {
                    const solutionLetterIndex = filteredI[sIndex];
                    if (solutionLetterIndex.i === index) {
                        guess = replaceAt(guess, index, letter);
                        const firstIndex = includeLetters.indexOf(letter);
                        if (firstIndex >= 0) {
                            includeLetters[firstIndex] = null;
                            includeLetters = includeLetters.filter((x) => x);
                        }
                    } else if (
                        filteredI.length >
                        guess.split('').filter((x) => x === letter).length
                    ) {
                        if (
                            filteredI.filter((x) => x.x === letter).length >
                            includeLetters.filter((x) => x === letter).length
                        ) {
                            includeLetters.push(letter);
                        }
                        if (solution[index] !== letter)
                            excludeCombination.push({
                                letter,
                                position: index,
                            });
                    } else {
                        if (solution[index] !== letter)
                            excludeCombination.push({
                                letter,
                                position: index,
                            });
                    }
                }
            } else {
                excludeLetters.push(letter);
            }
        }

        //console.log('Include: ', includeLetters);
        //console.log('Exclude: ', excludeLetters);
        //console.log('Exclude combinations: ', excludeCombination);

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

        //console.log(possibleSolutions.length);
        //console.log(possibleSolutions);

        possibleWords = possibleSolutions;
    }
}

console.log(solutions);

let max = 0;
let maxKey = '';

const cannotSolve = [];

for (let key in solutions) {
    if (solutions[key] >= max) {
        max = solutions[key];
        maxKey = key;
    }
}

for (let key in solutions) {
    if (solutions[key] >= 7) {
        cannotSolve.push(key);
    }
}

console.log('Cannot solve: ', cannotSolve);
