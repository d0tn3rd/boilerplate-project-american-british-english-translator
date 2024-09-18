const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("second suite", () => {});
  test("Translation with text and locale field", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "I ate yogurt for breakfast.",
        locale: "american-to-british",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, "I ate yogurt for breakfast.");
        assert.equal(
          res.body.translation,
          'I ate <span class="highlight">yoghurt</span> for breakfast.',
        );
        done();
      });
  });

  test("Translation with text and invalid locale field: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "I ate yogurt for breakfast", locale: "bad-locale-field" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid value for locale field");
        done();
      });
  });

  test("Translation with missing text field: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ locale: "american-to-british" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("Translation with missing locale field: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "I ate yogurt for breakfast." })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("Translation with empty text: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "",
        locale: "american-to-british",
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "error");
        assert.equal(res.body.error, "No text to translate");

        done();
      });
  });

  test("Translation with text that needs no translation: POST request to /api/translate", (done) => {
    const output = {
      text: "SaintPeter and nhcarrigan give their regards!",
      translation: "Everything looks good to me!",
    };
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: output["text"], // should need no translation
        locale: "american-to-british",
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, "text");
        assert.property(res.body, "translation");
        assert.deepEqual(res.body, output);
        done();
      });
  });
});
