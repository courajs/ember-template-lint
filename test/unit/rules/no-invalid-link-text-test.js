'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

const allowEmptyLinksConfigFalse = {
  allowEmptyLinks: false,
};

generateRuleTests({
  name: 'no-invalid-link-text',

  config: true,

  good: [
    '<a href="https://myurl.com">Click here to read more about this amazing adventure</a>',
    '{{#link-to}} click here to read more about our company{{/link-to}}',
    '<LinkTo>Read more about ways semantic HTML can make your code more accessible.</LinkTo>',
    '<LinkTo>{{foo}} more</LinkTo>',
    '<a href="https://myurl.com" aria-labelledby="some-id"></a>',
    '<a href="https://myurl.com" aria-label="click here to read about our company"></a>',
    '<a href="https://myurl.com" aria-hidden="true"></a>',
    '<a href="https://myurl.com" hidden></a>',
    '<a href="https://myurl.com"></a>',
    {
      config: allowEmptyLinksConfigFalse,
      template: '<a href="https://myurl.com" aria-labelledby="some-id"></a>',
    },
    {
      config: allowEmptyLinksConfigFalse,
      template:
        '<a href="https://myurl.com" aria-label="click here to read about our company"></a>',
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<a href="https://myurl.com" aria-hidden="true"></a>',
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<a href="https://myurl.com" hidden></a>',
    },
  ],

  bad: [
    {
      template: '<a href="https://myurl.com">click here</a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 42,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<a href=\\"https://myurl.com\\">click here</a>",
            },
          ]
        `);
      },
    },
    {
      template: '<LinkTo>click here</LinkTo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 27,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<LinkTo>click here</LinkTo>",
            },
          ]
        `);
      },
    },
    {
      template: '{{#link-to}}click here{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 34,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "{{#link-to}}click here{{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<a href="https://myurl.com"></a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 32,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<a href=\\"https://myurl.com\\"></a>",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<a href="https://myurl.com"> </a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<a href=\\"https://myurl.com\\"> </a>",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<a href="https://myurl.com"> &nbsp; \n</a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 4,
              "endLine": 2,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<a href=\\"https://myurl.com\\"> &nbsp; 
          </a>",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<a aria-labelledby="" href="https://myurl.com">Click here</a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 61,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<a aria-labelledby=\\"\\" href=\\"https://myurl.com\\">Click here</a>",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<a aria-labelledby=" " href="https://myurl.com">Click here</a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 62,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<a aria-labelledby=\\" \\" href=\\"https://myurl.com\\">Click here</a>",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<a aria-label="Click here" href="https://myurl.com">Click here</a>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 66,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<a aria-label=\\"Click here\\" href=\\"https://myurl.com\\">Click here</a>",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<LinkTo></LinkTo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 17,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<LinkTo></LinkTo>",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '<LinkTo> &nbsp; \n</LinkTo>',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 9,
              "endLine": 2,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "<LinkTo> &nbsp; 
          </LinkTo>",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '{{#link-to}}{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 24,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "{{#link-to}}{{/link-to}}",
            },
          ]
        `);
      },
    },
    {
      config: allowEmptyLinksConfigFalse,
      template: '{{#link-to}} &nbsp; \n{{/link-to}}',
      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 12,
              "endLine": 2,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Links should have descriptive text",
              "rule": "no-invalid-link-text",
              "severity": 2,
              "source": "{{#link-to}} &nbsp; 
          {{/link-to}}",
            },
          ]
        `);
      },
    },
  ],
});
