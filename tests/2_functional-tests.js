const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");

myPort = process.env.PORT || 3000;

suite("Functional Tests", () => {
  describe("POST /api/translate", () => {
    it("Translation with text and locale field", (done) => {
      request(`127.0.0.1:${port}`)
        .post("/api/translate")
        .send({
          text: "I ate yogurt for breakfast.",
          locale: "american-to-british",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.text).to.be("I ate yogurt for breakfast.");
          expect(res.body.translation).to.be("I ate yoghurt for breakfast.");
          done();
        });
    });

    it("Translation with text and invalid locale field: POST request to /api/translate", (done) => {
      chai
        .request(server)
        .post("/api/translate")
        .send({ text: "Hello", locale: "bad-locale-field" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be("Invalid value for locale field");
          expect(Object.keys(res.body).length == 1);
          done();
        });
    });

    it("Translation with missing text field: POST request to /api/translate", () => {
      chai
        .request(server)
        .post("/api/translate")
        .send({ locale: "american-to-british" })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be("Required field(s) missing");
          expect(Object.keys(res.body).length == 1); // just the error key
          done();
        });
    });

    it("Translation with missing locale field: POST request to /api/translate", () => {
      chai
        .request(server)
        .post("/api/translate")
        .send({ text: "I ate yogurt for breakfast." })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be("Required field(s) missing");
          expect(Object.keys(res.body).length == 1); // just the error key
          done();
        });
    });

    it("Translation with empty text: POST request to /api/translate", () => {
      chai
        .request(server)
        .post("/api/translate")
        .send({
          text: "",
          locale: "american-to-british",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.an("object");
          expect(res.body.error).to.be("No text to translate");
          expect(Object.keys(res.body).length == 1); // just the error key
          done();
        });
    });

    it("Translation with text that needs no translation: POST request to /api/translate", () => {
      chai
        .request(server)
        .post("/api/translate")
        .send({
          text: "I ate you for breakfast.", // should need no translation
          locale: "american-to-british",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.text).to.be(text);
          expect(res.body.translation).to.be("No text to translate");
          done();
        });
    });
  });
});
