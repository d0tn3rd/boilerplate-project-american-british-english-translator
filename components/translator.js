const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

const britishToAmericanSpelling = Object.keys(americanToBritishSpelling).reduce(
  function (accumulator, currentVal) {
    accumulator[americanToBritishSpelling[currentVal]] = currentVal;
    return accumulator;
  },
  {},
);

const britishToAmericanTitles = Object.keys(americanToBritishTitles).reduce(
  function (accumulator, currentVal) {
    accumulator[americanToBritishTitles[currentVal]] = currentVal;
    return accumulator;
  },
  {},
);

const capitalizeWord = function (word) {
  let firstLetter = word[0];
  let letterArr = word.split("");
  letterArr[0] = firstLetter.toUpperCase();
  return letterArr.join("");
};

const isCapitalCaseWord = function (word) {
  const letter = word[0];
  return letter === letter.toUpperCase() && letter.toLowerCase !== letter;
};

const capitalizedAmericanToBritishTitles = Object.keys(
  americanToBritishTitles,
).reduce(function (aggregator, current) {
  aggregator[capitalizeWord(current)] = capitalizeWord(
    americanToBritishTitles[current],
  );
  return aggregator;
}, []);

const capitalizedBritishToAmericanTitles = Object.keys(
  britishToAmericanTitles,
).reduce(function (aggregator, current) {
  aggregator[capitalizeWord(current)] = capitalizeWord(
    britishToAmericanTitles[current],
  );
  return aggregator;
}, {});

class Translator {
  static toBritishEnglish(americanEnglishString) {
    let translationNeeded = false;
    let result = americanEnglishString;

    const tokens = result.split(" ");
    const caseMap = tokens.map((word) => isCapitalCaseWord(word));
    console.log("caseMap: ", caseMap);
    const tokensLowerCase = tokens.map((token) => token.toLowerCase());

    console.log("tokensLowerCase: ", tokensLowerCase);

    // replace the tokens separately
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (
        americanToBritishSpelling[token] ||
        americanToBritishSpelling[capitalizeWord(token)]
      ) {
        translationNeeded = true;
        tokensLowerCase[i] = americanToBritishSpelling[token];
      }
      if (americanOnly[token] || americanOnly[capitalizeWord(token)]) {
        translationNeeded = true;
        tokensLowerCase[i] = americanOnly[token]; // conveniently these are
      }
    }
    // check last token explicitly
    // sentence can never end with Title so
    const lastToken = tokensLowerCase[tokens.length - 1];
    console.log("lastToken: ", lastToken);
    if (
      lastToken[lastToken.length - 1] === "." ||
      lastToken[lastToken.length - 1] === "?"
    ) {
      const sentenceEndPunctuation = lastToken[lastToken.length - 1];
      const searchTerm = lastToken.slice(0, -1);
      if (americanToBritishSpelling[searchTerm]) {
        translationNeeded = true;
        tokensLowerCase[tokensLowerCase.length - 1] =
          americanToBritishSpelling[searchTerm] + sentenceEndPunctuation;
      }
      if (americanOnly[searchTerm]) {
        translationNeeded = true;
        tokensLowerCase[tokensLowerCase.length - 1] =
          americanOnly[searchTerm] + sentenceEndPunctuation;
      }
    }

    console.log("tokensLowerCase: ", tokensLowerCase);

    result = tokensLowerCase.join(" ");

    // now search word wise
    for (const americanWord of Object.keys(americanOnly)) {
      const tokenIndex = result.indexOf(americanWord);
      if (tokenIndex !== -1) {
        console.log("found in american only");
        translationNeeded = true;
        result = result.replace(americanWord, americanOnly[americanWord]);
      }
    }

    for (const americanWord of Object.keys(americanToBritishSpelling)) {
      if (americanEnglishString.indexOf(americanWord) !== -1) {
        translationNeeded = true;
        result = result.replace(
          americanWord,
          americanToBritishSpelling[americanWord],
        );
      }
    }
    const finalTokens = result.split(" ");
    // restore the case
    for (let i = 0; i < caseMap.length; i++) {
      if (caseMap[i]) {
        // this word was capital
        finalTokens[i] = capitalizeWord(finalTokens[i]);
      }
    }

    result = finalTokens.join(" ");

    // handle the time strings
    const regex = /\d+\:\d{2}/;
    const matches = result.match(regex);

    if (matches) {
      translationNeeded = true;
      result = result.replace(matches[0], matches[0].replace(":", "."));
    }

    // check the titles

    const sentenceTokens = result.split(" ");
    for (const title of Object.keys(americanToBritishTitles)) {
      const titleIndex = sentenceTokens.indexOf(title);
      if (titleIndex !== -1) {
        translationNeeded = true;
        const britishTitle = americanToBritishTitles[title];
        // update the sentencneTokens array
        sentenceTokens[titleIndex] = britishTitle;
        result = sentenceTokens.join(" ");
      }
    }
    for (const title of Object.keys(capitalizedAmericanToBritishTitles)) {
      const titleIndex = sentenceTokens.indexOf(title);
      if (titleIndex !== -1) {
        translationNeeded = true;
        const britishTitle = capitalizedAmericanToBritishTitles[title];
        sentenceTokens[titleIndex] = britishTitle;
        result = sentenceTokens.join(" ");
      }
    }

    return translationNeeded ? result : false;
  }

  static toAmericanEnglish(britishEnglishString) {
    // search british only words
    let result = britishEnglishString;
    let translationNeeded = false;
    for (const britishWord of Object.keys(britishOnly)) {
      if (britishEnglishString.indexOf(britishWord) !== -1) {
        //  word was found
        translationNeeded = true;
        result = result.replace(britishWord, britishOnly[britishWord]);
      }
    }
    for (const britishWord of Object.keys(britishToAmericanSpelling)) {
      if (britishEnglishString.indexOf(britishWord) !== -1) {
        translationNeeded = true;
        result = result.replace(
          britishWord,
          britishToAmericanSpelling[britishWord],
        );
      }
    }

    const regex = /\d+\.\d{2}/;

    const matches = result.match(regex);
    if (matches) {
      translationNeeded = true;
      result = result.replace(matches[0], matches[0].replace(".", ":"));
    }

    const sentenceTokens = result.split(" ");

    for (const title of Object.keys(britishToAmericanTitles)) {
      const titleIndex = sentenceTokens.indexOf(title);
      const americanTitle = britishToAmericanSpelling[title];
      if (titleIndex !== -1) {
        translationNeeded = true;
        sentenceTokens[titleIndex] = americanTitle;
        result = sentenceTokens.join(" ");
      }
    }

    for (const title of Object.keys(capitalizedBritishToAmericanTitles)) {
      const titleIndex = sentenceTokens.indexOf(title);
      const americanTitle = capitalizedBritishToAmericanTitles[title];
      if (titleIndex !== -1) {
        translationNeeded = true;
        sentenceTokens[titleIndex] = americanTitle;
        result = sentenceTokens.join(" ");
      }
    }

    return translationNeeded ? result : false;
  }
}

module.exports = Translator;
