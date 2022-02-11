const { words } = require('./words');

//todo json
const calculateStats = () => {
    const abc = [...Array(26)].map((_) => String.fromCharCode(i++), (i = 97));
    const baseArray = [...Array(5)].map((_) => i++, (i = 0));
    return baseArray.map((i) =>
        abc.reduce((aggr, letter) => {
            aggr[letter] = {
                count: words.filter((word) => word[i] === letter).length,
            };
            return aggr;
        }, {})
    );
};

const stats = calculateStats();

const calculateBestWord = (wordList) => {
    const bestWordsList = wordList.reduce((aggr, word) => {
        aggr[word] = word
            .split('')
            .reduce((aggr, letter, i) => aggr + stats[i][letter].count, 0);
        return aggr;
    }, {});
    return Object.keys(bestWordsList).sort(
        (a, b) => bestWordsList[b] - bestWordsList[a]
    )[0];
};

module.exports = { calculateBestWord };
