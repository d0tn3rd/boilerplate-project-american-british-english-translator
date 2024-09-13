const chai = require("chai");
const assert = chai.assert;

const Translator = require("../components/translator.js");

suite("Unit Tests", () => {
  it("Translate Mangoes are my favorite fruit. to British English", function () {
    assert.equal(
      Translator.toBritishEnglish(
        "Mangoes are my favorite fruit. to British English",
      ),
      "Mangoes are my favourite fruit.",
    );
  });

  // check american words in an array combination of amercian-only keys and american-to-british-spelling-keys
  // and lowercase them
  it("Translate I ate yogurt for breakfast. to British English", function () {
    assert.equal(
      Translator.toBritishEnglish("I ate yogurt for breakfast."),
      "I ate yoghurt for breakfast.",
    );
  });

  it("Translate We had a party at my friend's condo. to British English", function () {
    assert.equal(
      Translator.toBritishEnglish("We had a party at my friend's condo."),
      "We had a party at my friend's flat.",
    );
  });

  it("Translate Can you toss this in the trashcan for me? to British English", function () {
    assert.equal(
      Translator.toBritishEnglish("Can you toss this in the trashcan for me?"),
      "Can you toss this in the bin for me?",
    );
  });
  // some words like full wont be found in either of the keys so no translation needed
  it("Translate The parking lot was full. to British English", function () {
    assert.equal(Translator.toBritishEnglish("The car park was full."), "");
  });

  // lower case
  it("Translate Like a high tech Rube Goldberg machine. to British English", function () {
    assert.equal(
      Translator.toBritishEnglish("Like a high tech Rube Goldberg machine."),
      "Like a high tech Heath Robinson device.",
    );
  });

  it("Translate To play hooky means to skip class or work. to British English", function () {
    assert.equal(
      Translator.toBritishEnglish("To play hooky means to skip class or work."),
      "To bunk off means to skip class or work.",
    );
  });

  // titles, after lowering the case
  it("Translate No Mr. Bond, I expect you to die. to British English", function () {
    assert.equal(
      Translator.toBritishEnglish("No Mr. Bond, I expect you to die."),
      "No Mr Bond, I expect you to die.",
    );
  });

  // titles after lowering the case
  it("Translate Dr. Grosh will see you now. to British English", function () {
    assert.equal(
      Translator.toBritishEnglish("Dr. Grosh will see you now."),
      "Dr Grosh will see you now.",
    );
  });

  // time -> : -> .
  it("Translate Lunch is at 12:15 today. to British English", function () {
    assert.equal(
      Translator.toBritishEnglish("Lunch is at 12:15 today."),
      "Lunch is at 12.15 today.",
    );
  });

  it("Translate We watched the footie match for a while. to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish("We watched the footie match for a while."),
      "We watched the soccer match for a while.",
    );
  });

  it("Translate Paracetamol takes up to an hour to work. to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish("Paracetamol takes up to an hour to work."),
      "Tylenol takes up to an hour to work.",
    );
  });

  it("Translate First, caramelise the onions. to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish("First, caramelise the onions."),
      "First, caramelize the onions.",
    );
  });

  it("Translate I spent the bank holiday at the funfair. to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish("I spent the bank holiday at the funfair."),
      "I spent the public holiday at the carnival.",
    );
  });

  it("Translate I had a bicky then went to the chippy. to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish("I had a bicky then went to the chippy."),
      "I had a cookie then went to the fish-and-chip shop.",
    );
  });
  it("Translate I've just got bits and bobs in my bum bag. to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish(
        "I've just got bits and bobs in my bum bag.",
      ),
      "I've just got odds and ends in my fanny pack.",
    );
  });
  it("Translate The car boot sale at Boxted Airfield was called off. to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish(
        "The car boot sale at Boxted Airfield was called off.",
      ),
      "The swap meet at Boxted Airfield was called off.",
    );
  });

  it("Translate Have you met Mrs Kalyani? to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish("Have you met Mrs Kalyani?"),
      "Have you met Mrs. Kalyani?",
    );
  });

  // leave the capitalization as is, since lowercase is needed only to search
  it("Translate Prof Joyner of King's College, London. to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish("Prof Joyner of King's College, London."),
      "Prof. Joyner of King's College, London.",
    );
  });

  it("Translate Tea time is usually around 4 or 4.30. to American English", function () {
    assert.equal(
      Translator.toAmericanEnglish("Tea time is usually around 4 or 4.30."),
      "Tea time is usually around 4 or 4:30.",
    );
  });
});
