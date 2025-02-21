import MathML from "../src/mathml";

const constants = require("./const");

test("Validate Math Hand formula", () => {
  expect(MathML.removeSemantics(constants.mathHand)).toBe(constants.mathHandValid);
});

test("Validate Chem Hand formula", () => {
  expect(MathML.removeSemantics(constants.chemHand)).toBe(constants.chemHandValid);
});

test("Validate Math not Hand formula", () => {
  expect(MathML.removeSemantics(constants.mathNoMrow)).toBe(constants.mathNoMrowValid);
});

test("Validate Chem not Hand formula", () => {
  expect(MathML.removeSemantics(constants.chemNoMrow)).toBe(constants.chemNoMrowValid);
});

test("Validate Multiple semantics Hand formula 01", () => {
  expect(MathML.removeSemantics(constants.semantics01)).toBe(constants.semanticsValid01);
});

test("Validate Multiple semantics Hand formula 02", () => {
  expect(MathML.removeSemantics(constants.semantics02)).toBe(constants.semanticsValid02);
});

test("Validate Multiple semantics Hand formula 03", () => {
  expect(MathML.removeSemantics(constants.semantics03)).toBe(constants.semanticsValid03);
});

test("Validate Multiple semantics Hand formula 04", () => {
  expect(MathML.removeSemantics(constants.semantics04)).toBe(constants.semanticsValid04);
});

test("Validate formula without annotation and semantics", () => {
  expect(MathML.removeSemantics(constants.noSemanticsNoAnnotation)).toBe(constants.noSemanticsNoAnnotation);
});
