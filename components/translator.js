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
    const caseMap = tokens.reduce(function (accumulator, current) {
      if (isCapitalCaseWord(current)) {
        accumulator[current.toLowerCase()] = true;
      }
      return accumulator;
    }, {});

    const tokensLowerCase = tokens.map((token) => token.toLowerCase());

    // replace the tokens separately
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (
        americanToBritishSpelling[token] ||
        americanToBritishSpelling[capitalizeWord(token)]
      ) {
        translationNeeded = true;
        tokensLowerCase[i] =
          "<span class='highlight'>" +
          americanToBritishSpelling[token] +
          "</span>";
      }
      if (americanOnly[token] || americanOnly[capitalizeWord(token)]) {
        translationNeeded = true;
        tokensLowerCase[i] =
          "<span class='highlight'>" + americanOnly[token] + "</span>";
      }
    }

    // check last token explicitly
    // sentence can never end with Title so
    const lastToken = tokensLowerCase[tokens.length - 1];
    if (
      lastToken[lastToken.length - 1] === "." ||
      lastToken[lastToken.length - 1] === "?"
    ) {
      const sentenceEndPunctuation = lastToken[lastToken.length - 1];
      const searchTerm = lastToken.slice(0, -1);
      if (americanToBritishSpelling[searchTerm]) {
        translationNeeded = true;
        tokensLowerCase[tokensLowerCase.length - 1] =
          "<span class='highlight'>" +
          americanToBritishSpelling[searchTerm] +
          "</span>" +
          sentenceEndPunctuation;
      }
      if (americanOnly[searchTerm]) {
        translationNeeded = true;
        tokensLowerCase[tokensLowerCase.length - 1] =
          "<span class='highlight'>" +
          americanOnly[searchTerm] +
          "</span>" +
          sentenceEndPunctuation;
      }
    }

    result = tokensLowerCase.join(" ");

    // now search word wise
    for (const americanWord of Object.keys(americanOnly)) {
      const tokenIndex = result.indexOf(americanWord);

      if (tokenIndex !== -1) {
        const matchingWordPieces = americanWord.split(" ");

        const tokensWithoutPunctuation = [...tokensLowerCase];
        const tempLastToken = tokensLowerCase[tokensLowerCase.length - 1];

        tokensWithoutPunctuation[tokensWithoutPunctuation.length - 1] =
          tempLastToken.slice(0, -1);
        // all matching word pieces should be in tokens lower case
        const matchingWordPiecesAvailableInTargetString =
          matchingWordPieces.reduce(function (acc, curr) {
            acc = acc && tokensWithoutPunctuation.indexOf(curr) !== -1;
            return acc;
          }, true);
        if (matchingWordPiecesAvailableInTargetString) {
          translationNeeded = true;
          result = result.replace(
            americanWord,
            "<span class='highlight'>" + americanOnly[americanWord] + "</span>",
          );
        }
      }
    }

    for (const americanWord of Object.keys(americanToBritishSpelling)) {
      const tokenIndex = result.indexOf(americanWord);

      if (tokenIndex !== -1) {
        const matchingWordPieces = americanWord.split(" ");
        const tokensWithoutPunctuation = [...tokensLowerCase];
        const tempLastToken = tokensLowerCase[tokensLowerCase.length - 1];

        tokensWithoutPunctuation[tokensWithoutPunctuation.length - 1] =
          tempLastToken.slice(0, -1);
        // all matching word pieces should be in tokens lower case
        const matchingWordPiecesAvailableInTargetString =
          matchingWordPieces.reduce(function (acc, curr) {
            acc = acc && tokensWithoutPunctuation.indexOf(curr) !== -1;
            return acc;
          }, true);
        if (matchingWordPiecesAvailableInTargetString) {
          translationNeeded = true;
          result = result.replace(
            americanWord,
            "<span class='highlight'>" +
              americanToBritishSpelling[americanWord] +
              "</span>",
          );
        }
      }
    }
    const finalTokens = result.split(" ");

    // restore the case
    for (let i = 0; i < finalTokens.length; i++) {
      const finalToken = finalTokens[i];

      if (finalToken.indexOf("<span") !== -1) {
        continue;
      } else {
        if (caseMap[finalToken]) {
          finalTokens[i] = capitalizeWord(finalToken);
          delete caseMap[finalToken];
        }
      }
    }

    result = finalTokens.join(" ");

    // handle the time strings
    const regex = /\d+\:\d{2}/;
    const matches = result.match(regex);

    if (matches) {
      translationNeeded = true;
      result = result.replace(
        matches[0],
        "<span class='highlight'>" + matches[0].replace(":", ".") + "</span>",
      );
    }

    // check the titles

    const sentenceTokens = result.split(" ");
    for (const title of Object.keys(americanToBritishTitles)) {
      const titleIndex = sentenceTokens.indexOf(title);
      if (titleIndex !== -1) {
        translationNeeded = true;
        const britishTitle = americanToBritishTitles[title];
        // update the sentencneTokens array
        sentenceTokens[titleIndex] =
          "<span class='highlight'>" + britishTitle + "</span>";
        result = sentenceTokens.join(" ");
      }
    }
    for (const title of Object.keys(capitalizedAmericanToBritishTitles)) {
      const titleIndex = sentenceTokens.indexOf(title);
      if (titleIndex !== -1) {
        translationNeeded = true;
        const britishTitle = capitalizedAmericanToBritishTitles[title];
        sentenceTokens[titleIndex] =
          "<span class='highlight'>" + britishTitle + "</span>";
        result = sentenceTokens.join(" ");
      }
    }

    return translationNeeded ? result : false;
  }

  static toAmericanEnglish(britishEnglishString) {
    // search british only words
    let result = britishEnglishString;
    let translationNeeded = false;

    const tokens = result.split(" ");
    const caseMap = tokens.reduce(function (accumulator, current) {
      if (isCapitalCaseWord(current)) {
        accumulator[current.toLowerCase()] = true;
      }
      return accumulator;
    }, {});
    const tokensLowerCase = tokens.map((token) => token.toLowerCase());

    // replace the tokens separately
    for (let i = 0; i < tokensLowerCase.length; i++) {
      const token = tokensLowerCase[i];

      if (
        britishToAmericanSpelling[token] ||
        britishToAmericanSpelling[capitalizeWord(token)]
      ) {
        translationNeeded = true;
        tokensLowerCase[i] =
          "<span class='highlight'>" +
          britishToAmericanSpelling[token] +
          "</span>";
      }
      if (britishOnly[token] || britishOnly[capitalizeWord(token)]) {
        translationNeeded = true;
        tokensLowerCase[i] =
          "<span class='highlight'>" + britishOnly[token] + "</span>";
      }
    }

    // check last token explicitly
    // sentence can never end with Title so
    const lastToken = tokensLowerCase[tokens.length - 1];
    if (
      lastToken[lastToken.length - 1] === "." ||
      lastToken[lastToken.length - 1] === "?"
    ) {
      const sentenceEndPunctuation = lastToken[lastToken.length - 1];
      const searchTerm = lastToken.slice(0, -1);
      if (britishToAmericanSpelling[searchTerm]) {
        translationNeeded = true;
        tokensLowerCase[tokensLowerCase.length - 1] =
          "<span class='highlight'>" +
          britishToAmericanSpelling[searchTerm] +
          "</span>" +
          sentenceEndPunctuation;
      }
      if (britishOnly[searchTerm]) {
        translationNeeded = true;
        tokensLowerCase[tokensLowerCase.length - 1] =
          "<span class='highlight'>" +
          britishOnly[searchTerm] +
          "</span>" +
          sentenceEndPunctuation;
      }
    }

    result = tokensLowerCase.join(" ");

    // search word wise
    for (const britishWord of Object.keys(britishOnly)) {
      const tokenIndex = result.indexOf(britishWord);

      if (tokenIndex !== -1) {
        //  word was found

        const matchingWordPieces = britishWord.split(" ");
        const tokensWithoutPunctuation = [...tokensLowerCase];
        const tempLastToken = tokensLowerCase[tokensLowerCase.length - 1];

        tokensWithoutPunctuation[tokensWithoutPunctuation.length - 1] =
          tempLastToken.slice(0, -1);
        // all matching word pieces should be in tokens lower case
        const matchingWordPiecesAvailableInTargetString =
          matchingWordPieces.reduce(function (acc, curr) {
            acc = acc && tokensWithoutPunctuation.indexOf(curr) !== -1;
            return acc;
          }, true);
        if (matchingWordPiecesAvailableInTargetString) {
          translationNeeded = true;
          result = result.replace(
            britishWord,
            "<span class='highlight'>" + britishOnly[britishWord] + "</span>",
          );
        }
      }
    }
    for (const britishWord of Object.keys(britishToAmericanSpelling)) {
      const tokenIndex = result.indexOf(britishWord);
      if (tokenIndex !== -1) {
        const matchingWordPieces = britishWord.split(" ");
        const tokensWithoutPunctuation = [...tokensLowerCase];
        const tempLastToken = tokensLowerCase[tokensLowerCase.length - 1];

        tokensWithoutPunctuation[tokensWithoutPunctuation.length - 1] =
          tempLastToken.slice(0, -1);
        // all matching word pieces should be in tokens lower case
        const matchingWordPiecesAvailableInTargetString =
          matchingWordPieces.reduce(function (acc, curr) {
            acc = acc && tokensWithoutPunctuation.indexOf(curr) !== -1;
            return acc;
          }, true);
        if (matchingWordPiecesAvailableInTargetString) {
          translationNeeded = true;
          result = result.replace(
            britishWord,
            "<span class='highlight'>" +
              britishToAmericanSpelling[britishWord] +
              "</span>",
          );
        }
      }
    }

    // restore the case

    const finalTokens = result.split(" ");
    // restore the case
    for (let i = 0; i < finalTokens.length; i++) {
      const finalToken = finalTokens[i];

      if (finalToken.indexOf("<span") !== -1) {
        continue;
      } else {
        if (caseMap[finalToken]) {
          finalTokens[i] = capitalizeWord(finalToken);
          delete caseMap[finalToken];
        }
      }
    }

    result = finalTokens.join(" ");

    const regex = /\d+\.\d{2}/;

    const matches = result.match(regex);
    if (matches) {
      translationNeeded = true;
      result = result.replace(
        matches[0],
        "<span class='highlight'>" + matches[0].replace(".", ":") + "</span>",
      );
    }

    const sentenceTokens = result.split(" ");

    for (const title of Object.keys(britishToAmericanTitles)) {
      const titleIndex = sentenceTokens.indexOf(title);
      const americanTitle = britishToAmericanSpelling[title];
      if (titleIndex !== -1) {
        translationNeeded = true;
        sentenceTokens[titleIndex] =
          "<span class='highlight'>" + americanTitle + "</span>";
        result = sentenceTokens.join(" ");
      }
    }

    for (const title of Object.keys(capitalizedBritishToAmericanTitles)) {
      const titleIndex = sentenceTokens.indexOf(title);
      const americanTitle = capitalizedBritishToAmericanTitles[title];
      if (titleIndex !== -1) {
        translationNeeded = true;
        sentenceTokens[titleIndex] =
          "<span class='highlight'>" + americanTitle + "</span>";
        result = sentenceTokens.join(" ");
      }
    }

    return translationNeeded ? result : false;
  }
}

module.exports = Translator;
