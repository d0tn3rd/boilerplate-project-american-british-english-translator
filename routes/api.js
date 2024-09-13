"use strict";

const Translator = require("../components/translator.js");

const requiresTranslation = (inputString, locale) => {
  // hello world
};
module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    // dereference the request body
    requestBody = req.body;

    if (!requestBody.text || !requestBody.locale)
      return res.status(400).send({ error: "Required field(s) missing" });

    text = requestBody.text;
    locale = requestBody.locale;

    if (text === "")
      return res.status(400).send({ error: "No text to translate" });

    permittedLocaleValues = ["american-to-british", "british-to-american"];

    if (permittedLocaleValues.indexOf(locale) === -1)
      return res.status(400).send({ error: "Invalid value for locale field" });

    if (!requiresTranslation(text, locale))
      return res
        .status(200)
        .send({ text, translation: "Everything looks good to me!" });

    // return should contain `text` and `translation`
  });
};
