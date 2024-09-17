const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js");

suite("Unit Tests", () => {
  suite("translation", () => {
    test("Translate Mangoes are my favorite fruit. to British English", function () {
      assert.equal(
        Translator.toBritishEnglish("Mangoes are my favorite fruit.").replace(
          /<span\s[='a-z]*>|<\/span>/g,
          "",
        ),
        "Mangoes are my favourite fruit.",
      );
    });

    test("Translate I ate yogurt for breakfast. to British English", function () {
      assert.equal(
        Translator.toBritishEnglish("I ate yogurt for breakfast.").replace(
          /<span\s[='a-z]*>|<\/span>/g,
          "",
        ),
        "I ate yoghurt for breakfast.",
      );
    });

    test("Translate We had a party at my friend's condo. to British English", function () {
      assert.equal(
        Translator.toBritishEnglish(
          "We had a party at my friend's condo.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "We had a party at my friend's flat.",
      );
    });

    test("Translate Can you toss this in the trashcan for me? to British English", function () {
      assert.equal(
        Translator.toBritishEnglish(
          "Can you toss this in the trashcan for me?",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "Can you toss this in the bin for me?",
      );
    });
    test("Translate The parking lot was full. to British English", function () {
      assert.equal(
        Translator.toBritishEnglish("The parking lot was full.").replace(
          /<span\s[='a-z]*>|<\/span>/g,
          "",
        ),
        "The car park was full.",
      );
    });

    // lower case
    test("Translate Like a high tech Rube Goldberg machine. to British English", function () {
      assert.equal(
        Translator.toBritishEnglish(
          "Like a high tech Rube Goldberg machine.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "Like a high tech Heath Robinson device.",
      );
    });

    test("Translate To play hooky means to skip class or work. to British English", function () {
      assert.equal(
        Translator.toBritishEnglish(
          "To play hooky means to skip class or work.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "To bunk off means to skip class or work.",
      );
    });

    // titles, after lowering the case
    test("Translate No Mr. Bond, I expect you to die. to British English", function () {
      assert.equal(
        Translator.toBritishEnglish(
          "No Mr. Bond, I expect you to die.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "No Mr Bond, I expect you to die.",
      );
    });

    // titles after lowering the case
    test("Translate Dr. Grosh will see you now. to British English", function () {
      assert.equal(
        Translator.toBritishEnglish("Dr. Grosh will see you now.").replace(
          /<span\s[='a-z]*>|<\/span>/g,
          "",
        ),
        "Dr Grosh will see you now.",
      );
    });

    // time -> : -> .
    test("Translate Lunch is at 12:15 today. to British English", function () {
      assert.equal(
        Translator.toBritishEnglish("Lunch is at 12:15 today.").replace(
          /<span\s[='a-z]*>|<\/span>/g,
          "",
        ),
        "Lunch is at 12.15 today.",
      );
    });

    test("Translate We watched the footie match for a while. to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish(
          "We watched the footie match for a while.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "We watched the soccer match for a while.",
      );
    });

    test("Translate Paracetamol takes up to an hour to work. to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish(
          "Paracetamol takes up to an hour to work.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "Tylenol takes up to an hour to work.",
      );
    });

    test("Translate First, caramelise the onions. to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish("First, caramelise the onions.").replace(
          /<span\s[='a-z]*>|<\/span>/g,
          "",
        ),
        "First, caramelize the onions.",
      );
    });

    test("Translate I spent the bank holiday at the funfair. to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish(
          "I spent the bank holiday at the funfair.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "I spent the public holiday at the carnival.",
      );
    });

    test("Translate I had a bicky then went to the chippy. to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish(
          "I had a bicky then went to the chippy.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "I had a cookie then went to the fish-and-chip shop.",
      );
    });
    test("Translate I've just got bits and bobs in my bum bag. to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish(
          "I've just got bits and bobs in my bum bag.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "I've just got odds and ends in my fanny pack.",
      );
    });
    test("Translate The car boot sale at Boxted Airfield was called off. to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish(
          "The car boot sale at Boxted Airfield was called off.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "The swap meet at Boxted Airfield was called off.",
      );
    });

    test("Translate Have you met Mrs Kalyani? to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish("Have you met Mrs Kalyani?").replace(
          /<span\s[='a-z]*>|<\/span>/g,
          "",
        ),
        "Have you met Mrs. Kalyani?",
      );
    });

    // leave the capitalization as is, since lowercase is needed only to search
    test("Translate Prof Joyner of King's College, London. to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish(
          "Prof Joyner of King's College, London.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "Prof. Joyner of King's College, London.",
      );
    });

    test("Translate Tea time is usually around 4 or 4.30. to American English", function () {
      assert.equal(
        Translator.toAmericanEnglish(
          "Tea time is usually around 4 or 4.30.",
        ).replace(/<span\s[='a-z]*>|<\/span>/g, ""),
        "Tea time is usually around 4 or 4:30.",
      );
    });
  });

  suite("highlight", () => {
    test("Highlight translation in Mangoes are my favorite fruit.", () => {
      assert.equal(
        Translator.toBritishEnglish("Mangoes are my favorite fruit."),
        "Mangoes are my <span class='highlight'>favourite</span> fruit.",
      );
    });

    test("Highlight translation in I ate yogurt for breakfast.", () => {
      assert.equal(
        Translator.toBritishEnglish("I ate yogurt for breakfast."),
        "I ate <span class='highlight'>yoghurt</span> for breakfast.",
      );
    });

    test("Highlight translation in We watched the footie match for a while.", () => {
      assert.equal(
        Translator.toAmericanEnglish(
          "We watched the footie match for a while.",
        ),
        "We watched the <span class='highlight'>soccer</span> match for a while.",
      );
    });

    test("Highlight translation in Paracetamol takes up to an hour to work.", () => {
      assert.equal(
        Translator.toAmericanEnglish(
          "Paracetamol takes up to an hour to work.",
        ),
        "<span class='highlight'>Tylenol</span> takes up to an hour to work.",
      );
    });
  });
});
