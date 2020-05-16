const debug = process.env["DEBUG"];
const { inspect } = require('util');
const ins = (x) => { if (debug) console.log(inspect(x, {depth: null})) };

const { buildLexer } = require('@ull-esit-pl-1920/p10-t2-lexgen-code-alu0101100654');

const SPACE = /(?<SPACE>\s+|\/\/.*)/;
const RESERVEDWORD = /(?<RESERVEDWORD>\b(const|let)\b)/;
const ID = /(?<ID>\b([a-z_]\w*))\b/;
const STRING = /(?<STRING>"([^\\"]|\\.")*")/;
const OP = /(?<OP>[+*\/=-])/;

const myTokens = [
  ['SPACE', SPACE], ['RESERVEDWORD', RESERVEDWORD], ['ID', ID],
  ['STRING', STRING], ['OP', OP]
];

let str, lexer, r;
lexer = buildLexer(myTokens);

str = 'const varName = "value"';
ins(str);
r = lexer(str);
ins(r);
let expected = [
  { type: 'RESERVEDWORD', value: 'const' },
  { type: 'ID', value: 'varName' },
  { type: 'OP', value: '=' },
  { type: 'STRING', value: '"value"' }
];

test(str, () => {
  expect(r).toEqual(expected);
});

str = 'let x = a + \nb';
ins(str);
r = lexer(str);
expected = [
  { type: 'RESERVEDWORD', value: 'let' },
  { type: 'ID', value: 'x' },
  { type: 'OP', value: '=' },
  { type: 'ID', value: 'a' },
  { type: 'OP', value: '+' },
  { type: 'ID', value: 'b' }
];
ins(r);
test(str, () => {
  expect(r).toEqual(expected);
});

str = ' // Entrada con errores\nlet x = 42*c';
ins(str);
r = lexer(str);
ins(r);
expected = [
  { type: 'RESERVEDWORD', value: 'let' },
  { type: 'ID', value: 'x' },
  { type: 'OP', value: '=' },
  { type: 'ERROR', value: '42*c' }
];

test(str, () => {
  expect(r).toEqual(expected);
});

// Nuevas adiciones
str = ' // /*dsdadas*/ //';
ins(str);
r = lexer(str);
expected = [];

test(str, () => {
  expect(r).toEqual(expected);
});

const tokensWithError = [
  ['SPACE', SPACE], ['RESERVEDWORD', RESERVEDWORD], ['ID', ID],
['STRING', STRING], ['OP', OP], ['ERROR', /.*/]
];

const newLexer = buildLexer(tokensWithError);
test(str, () => {
  expect(() => newLexer(str)).toThrow("Error. No se permite un token de tipo ERROR");
});

str = 'Esto solo debería dar un error Ç+3\nY no debería dar dos Ç+3';
ins(str);
r = lexer(str);
expected = [
  {
    type: 'ERROR',
    value: 'Esto solo debería dar un error Ç+3\nY no debería dar dos Ç+3'
  }
];

test(str, () => {
  expect(r).toEqual(expected);
});

str = 'Esta cadena de texto debería ser inválida\n';
ins(str);
r = lexer(str);
expected = [
  {
    type: 'ERROR',
    value: 'Esta cadena de texto debería ser inválida\n',
  }
];

test(str, () => {
  expect(r).toEqual(expected);
});