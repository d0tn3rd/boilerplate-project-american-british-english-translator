const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const expect = chai.expect;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");

suite("Functional Tests", () => {
  test("Translation with text and locale field", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "I ate yogurt for breakfast.",
        locale: "american-to-british",
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);

        // assert.typeOf(res.body, "object");
        // assert(res.body.text === "I ate yogurt for breakfast.");
        // assert(res.body.translation === "I ate yoghurt for breakfast.");
        done();
      });
  });

  test("Translation with text and invalid locale field: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "I ate yogurt for breakfast", locale: "bad-locale-field" })
      .end((err, res) => {
        // assert(res.statusCode === 400);
        expect(res.status).to.equal(400);
        // assert.typeOf(res.body, "object");
        // assert(res.body.error === "Invalid value for locale field");
        // assert(Object.keys(res.body).length === 1);
        done();
      });
  });

  test("Translation with missing text field: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ locale: "american-to-british" })
      .end((err, res) => {
        // assert(res.statusCode === 400);
        expect(res.status).to.equal(400);
        // assert.typeOf(res.body, "object");
        // assert(res.body.error === "Required field(s) missing");
        // assert(Object.keys(res.body).length === 1);
        done();
      });
  });

  test("Translation with missing locale field: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "I ate yogurt for breakfast." })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        // assert(res.statusCode === 400);
        // assert.typeOf(res.body, "object");
        // assert(res.body.error === "Required field(s) missing");
        // assert(Object.keys(res.body).length == 1); // just the error key
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
        // assert(res.statusCode === 400);
        expect(res.status).to.equal(400);
        // assert.typeOf(res.body, "object");
        // assert(res.body.error === "No text to translate");
        // assert(Object.keys(res.body).length == 1); // just the error key
        done();
      });
  });

  test("Translation with text that needs no translation: POST request to /api/translate", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({
        text: "I ate you for breakfast.", // should need no translation
        locale: "american-to-british",
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        // assert(res.statusCode === 200);
        // assert.typeOf(res.body, "object");
        // assert(res.body.text === text);
        // assert(res.body.translation === "Everything looks good to me!");
        done();
      });
  });
});
