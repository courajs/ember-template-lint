// no-whitespace-within-word-test.js

'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-whitespace-within-word',
  config: true,

  good: [
    'Welcome',
    'It is possible to get some examples of in-word emph a sis past this rule.',
    'However, I do not want a rule that flags annoying false positives for correctly-used single-character words.',
    '<div>Welcome</div>',
    '<div enable-background="a b c d e f g h i j k l m">We want to ignore values of HTML attributes</div>',
    `<style>
  .my-custom-class > * {
    border: 2px dotted red;
  }
</style>`,
  ],

  bad: [
    {
      template: 'W e l c o m e',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 13,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace in layout detected.",
              "rule": "no-whitespace-within-word",
              "severity": 2,
              "source": "W e l c o m e",
            },
          ]
        `);
      },
    },
    {
      template: 'W&nbsp;e&nbsp;l&nbsp;c&nbsp;o&nbsp;m&nbsp;e',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 43,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace in layout detected.",
              "rule": "no-whitespace-within-word",
              "severity": 2,
              "source": "W&nbsp;e&nbsp;l&nbsp;c&nbsp;o&nbsp;m&nbsp;e",
            },
          ]
        `);
      },
    },
    {
      template: 'Wel c o me',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 10,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace in layout detected.",
              "rule": "no-whitespace-within-word",
              "severity": 2,
              "source": "Wel c o me",
            },
          ]
        `);
      },
    },
    {
      template: 'Wel&nbsp;c&emsp;o&nbsp;me',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 25,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace in layout detected.",
              "rule": "no-whitespace-within-word",
              "severity": 2,
              "source": "Wel&nbsp;c&emsp;o&nbsp;me",
            },
          ]
        `);
      },
    },
    {
      template: '<div>W e l c o m e</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 18,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace in layout detected.",
              "rule": "no-whitespace-within-word",
              "severity": 2,
              "source": "W e l c o m e",
            },
          ]
        `);
      },
    },
    {
      template: '<div>Wel c o me</div>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 5,
              "endColumn": 15,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Excess whitespace in layout detected.",
              "rule": "no-whitespace-within-word",
              "severity": 2,
              "source": "Wel c o me",
            },
          ]
        `);
      },
    },
  ],
});
