"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    // dereference the request body
    const requestBody = req.body;

    if (!requestBody.text || !requestBody.locale)
      return res.status(400).send({ error: "Required field(s) missing" });

    const text = requestBody.text;
    const locale = requestBody.locale;

    if (text === "")
      return res.status(400).send({ error: "No text to translate" });

    permittedLocaleValues = ["american-to-british", "british-to-american"];

    if (permittedLocaleValues.indexOf(locale) === -1)
      return res.status(400).send({ error: "Invalid value for locale field" });

    if (!Translator.requiresTranslation(text, locale))
      if (locale === "american-to-british") {
        // return should contain `text` and `translation`
        const translationResult = Translator.toBritishEnglish(text);
        if (translationResult) {
          return res.status(200).send({
            text,
            translation: translationResult,
          });
        }
        return res
          .status(200)
          .send({ text, translation: "Everything looks good to me!" });
      } else {
        const translationResult = Translator.toAmericanEnglish(text);
        if (translationResult) {
          return res.status(200).send({ text, translation: translationResult });
        }

        return res
          .status(200)
          .send({ text, translation: "Everything looks good to me!" });
      }
  });
};
