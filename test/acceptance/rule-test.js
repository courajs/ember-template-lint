'use strict';

const path = require('path');

const defaultTestHarness = require('../../lib/helpers/rule-test-harness');
const Rule = require('../../lib/rules/_base');
const generateRuleTests = require('../helpers/rule-test-harness');

function verifyWithExternalSnapshot(results) {
  expect(results).toMatchSnapshot();
}

describe('rule public api', function () {
  describe('general test harness support', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'test',
          rules: {
            'no-elements': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    this.log({
                      message: 'Do not use any HTML elements!',
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      name: 'no-elements',
      config: true,

      good: ['{{haha-wtf}}'],

      bad: [
        {
          name: 'uses static result - multiple',
          template: '<div></div><div></div>',
          results: [
            // does not need endLine/endColumn when using `results` style
            {
              column: 0,
              line: 1,
              message: 'Do not use any HTML elements!',
              source: '<div></div>',
            },
            {
              column: 11,
              line: 1,
              endColumn: 22,
              endLine: 1,
              message: 'Do not use any HTML elements!',
              source: '<div></div>',
            },
          ],
        },
        {
          name: 'uses static result',
          template: '<div></div>',
          result: {
            column: 0,
            line: 1,
            endColumn: 11,
            endLine: 1,
            message: 'Do not use any HTML elements!',
            source: '<div></div>',
          },
        },
        {
          name: 'uses static result - does not need endLine/endColumn',
          template: '<div></div>',
          result: {
            column: 0,
            line: 1,
            message: 'Do not use any HTML elements!',
            source: '<div></div>',
          },
        },
        {
          name: 'can use verifyResults directly (with inline snapshots)',
          template: '<div></div>',
          verifyResults(results) {
            expect(results).toMatchInlineSnapshot(`
              Array [
                Object {
                  "column": 0,
                  "endColumn": 11,
                  "endLine": 1,
                  "filePath": "layout.hbs",
                  "line": 1,
                  "message": "Do not use any HTML elements!",
                  "rule": "no-elements",
                  "severity": 2,
                  "source": "<div></div>",
                },
              ]
            `);
          },
        },
        {
          name: 'can use verifyResults directly (with external snapshots)',
          template: '<div></div>',
          verifyResults: verifyWithExternalSnapshot,
        },
      ],
    });
  });

  describe('async rule visitor support', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'test',
          rules: {
            'rule-with-async-visitor-hook': class extends Rule {
              async visitor() {
                await new Promise((resolve) => setTimeout(resolve, 10));
                return {
                  ElementNode(node) {
                    this.log({
                      message: 'Do not use any <promise> HTML elements!',
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      name: 'rule-with-async-visitor-hook',
      config: true,

      good: ['{{haha-wtf}}'],

      bad: [
        {
          name: 'uses async visitor',
          template: '<promise></promise>',
          results: [
            {
              column: 0,
              line: 1,
              endColumn: 19,
              endLine: 1,
              message: 'Do not use any <promise> HTML elements!',
              source: '<promise></promise>',
            },
          ],
        },
      ],
    });
  });

  describe('mode === fix', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'fix-test',
          rules: {
            'can-fix': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    if (node.tag !== 'MySpecialThing') {
                      return;
                    }

                    if (this.mode === 'fix') {
                      node.tag = 'EvenBettererThing';
                    } else {
                      this.log({
                        isFixable: true,
                        message: 'Do not use MySpecialThing',
                        node,
                      });
                    }
                  },
                };
              }
            },
          },
        },
      ],

      name: 'can-fix',
      config: true,

      bad: [
        {
          template: '<MySpecialThing/>',
          result: {
            column: 0,
            line: 1,
            endColumn: 17,
            endLine: 1,
            isFixable: true,
            message: 'Do not use MySpecialThing',
            source: '<MySpecialThing/>',
          },
          fixedTemplate: '<EvenBettererThing/>',
        },
        {
          template: '<MySpecialThing>contents here</MySpecialThing>',
          result: {
            column: 0,
            line: 1,
            endColumn: 46,
            endLine: 1,
            isFixable: true,
            message: 'Do not use MySpecialThing',
            source: '<MySpecialThing>contents here</MySpecialThing>',
          },
          fixedTemplate: '<EvenBettererThing>contents here</EvenBettererThing>',
        },
      ],
    });
  });

  describe('log results', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'log-test',
          rules: {
            'log-result': class extends Rule {
              visitor() {
                return {
                  ElementNode(node) {
                    if (node.tag === 'MySpecialThingExplicit') {
                      this.log({
                        message: 'Do not use MySpecialThingExplicit',
                        node,
                      });
                    }

                    if (node.tag === 'MySpecialThingInferred') {
                      this.log({
                        message: 'Do not use MySpecialThingInferred',
                        node,
                      });
                    }

                    if (node.tag === 'MySpecialThingInferredDoesNotClobberExplicit') {
                      this.log({
                        message: 'Unclobbered error message',
                        node,
                        source: '<MySpecialThingInferredDoesNotClobberExplicit/>',
                      });
                    }
                  },
                };
              }
            },
          },
        },
      ],

      name: 'log-result',
      config: true,

      bad: [
        {
          template: '<MySpecialThingExplicit/>',
          result: {
            column: 0,
            line: 1,
            endColumn: 25,
            endLine: 1,
            message: 'Do not use MySpecialThingExplicit',
            source: '<MySpecialThingExplicit/>',
          },
        },
        {
          template: '<MySpecialThingInferred/>',
          result: {
            column: 0,
            line: 1,
            endColumn: 25,
            endLine: 1,
            message: 'Do not use MySpecialThingInferred',
            source: '<MySpecialThingInferred/>',
          },
        },
        {
          template: '<MySpecialThingInferredDoesNotClobberExplicit/>',
          result: {
            column: 0,
            line: 1,
            endColumn: 47,
            endLine: 1,
            message: 'Unclobbered error message',
            source: '<MySpecialThingInferredDoesNotClobberExplicit/>',
          },
        },
      ],
    });
  });

  describe('local properties', function () {
    generateRuleTests({
      plugins: [
        {
          name: 'local-properties-test',
          rules: {
            'no-html-in-files': class extends Rule {
              visitor() {
                let fileMatches =
                  path.posix.join(this.workingDir, this.filePath) === 'foo/bar/baz.hbs';

                return {
                  ElementNode(node) {
                    if (!fileMatches) {
                      return;
                    }

                    this.log({
                      message: 'Do not use any HTML elements!',
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      name: 'no-html-in-files',
      config: true,

      bad: [
        {
          meta: {
            filePath: 'foo/bar/baz.hbs',
          },
          template: '<div></div>',
          verifyResults(results) {
            expect(results).toMatchInlineSnapshot(`
              Array [
                Object {
                  "column": 0,
                  "endColumn": 11,
                  "endLine": 1,
                  "filePath": "foo/bar/baz.hbs",
                  "line": 1,
                  "message": "Do not use any HTML elements!",
                  "rule": "no-html-in-files",
                  "severity": 2,
                  "source": "<div></div>",
                },
              ]
            `);
          },
        },
        {
          meta: {
            filePath: 'baz.hbs',
            workingDir: 'foo/bar',
          },
          template: '<div></div>',
          verifyResults(results) {
            expect(results).toMatchInlineSnapshot(`
              Array [
                Object {
                  "column": 0,
                  "endColumn": 11,
                  "endLine": 1,
                  "filePath": "baz.hbs",
                  "line": 1,
                  "message": "Do not use any HTML elements!",
                  "rule": "no-html-in-files",
                  "severity": 2,
                  "source": "<div></div>",
                },
              ]
            `);
          },
        },
      ],
    });
  });
});

describe('regression tests', function () {
  class Group {
    constructor(name, callback) {
      this.name = name;
      this.populateTests = callback;
      this.tests = [];
      this.beforeAll = [];
      this.beforeEach = [];
      this.runLog = null;
    }

    async run() {
      this.runLog = [];

      await this.populateTests();

      for (let callback of this.beforeAll) {
        await callback();
      }

      for (let test of this.tests) {
        for (let callback of this.beforeEach) {
          await callback();
        }

        await test.run();

        this.runLog.push(test.name);
      }
    }
  }

  class Test {
    constructor(name, callback) {
      this.name = name;
      this.run = callback;
    }
  }

  test('avoids config state mutation across tests', async function () {
    let group;
    defaultTestHarness({
      groupingMethod(name, callback) {
        group = new Group(name, callback);
      },

      groupMethodBefore(callback) {
        group.beforeEach.push(callback);
      },

      testMethod(name, callback) {
        group.tests.push(new Test(name, callback));
      },

      name: 'rule-with-async-visitor-hook',
      config: 'lol',

      plugins: [
        {
          name: 'rule-with-async-visitor-hook',
          rules: {
            'rule-with-async-visitor-hook': class extends Rule {
              async visitor() {
                await new Promise((resolve) => setTimeout(resolve, 10));

                return {
                  ElementNode(node) {
                    this.log({
                      message: `Current configuration is ${this.config}`,
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      good: [],

      bad: [
        {
          config: 'foo',
          template: `<div></div>`,
          result: {
            message: 'Current configuration is foo',
            line: 1,
            column: 0,
            source: '<div></div>',
          },
        },
        {
          // no config
          template: `<div></div>`,
          result: {
            message: 'Current configuration is lol',
            line: 1,
            column: 0,
            source: '<div></div>',
          },
        },
      ],
    });

    // should not fail
    await group.run();

    expect(group.runLog).toMatchInlineSnapshot(`
      Array [
        "<div></div>: logs errors",
        "<div></div>: passes when rule is disabled",
        "<div></div>: passes when disabled via inline comment - single rule",
        "<div></div>: passes when disabled via long-form inline comment - single rule",
        "<div></div>: passes when disabled via inline comment - all rules",
        "<div></div>: logs errors",
        "<div></div>: passes when rule is disabled",
        "<div></div>: passes when disabled via inline comment - single rule",
        "<div></div>: passes when disabled via long-form inline comment - single rule",
        "<div></div>: passes when disabled via inline comment - all rules",
      ]
    `);
  });

  test('throws a helpful error if test harness is setup incorrectly', async function () {
    let group;
    defaultTestHarness({
      groupingMethod(name, callback) {
        group = new Group(name, callback);
      },

      groupMethodBefore(callback) {
        // this is the main difference between the prior test,
        // this is using a "beforeAll` concept which _would_ introduce
        // leakage; so it should force an error during the test runs
        group.beforeAll.push(callback);
      },

      testMethod(name, callback) {
        group.tests.push(new Test(name, callback));
      },

      name: 'rule-with-async-visitor-hook',
      config: 'lol',

      plugins: [
        {
          name: 'rule-with-async-visitor-hook',
          rules: {
            'rule-with-async-visitor-hook': class extends Rule {
              async visitor() {
                await new Promise((resolve) => setTimeout(resolve, 10));

                return {
                  ElementNode(node) {
                    this.log({
                      message: `Current configuration is ${this.config}`,
                      node,
                    });
                  },
                };
              }
            },
          },
        },
      ],

      good: [],

      bad: [
        {
          config: 'foo',
          template: `<div></div>`,
          result: {
            message: 'Current configuration is foo',
            line: 1,
            column: 0,
            source: '<div></div>',
          },
        },
        {
          // no config; when using beforeAll instead of beforeEach the bad test
          // just above changes the shared config (for the tests around "when
          // disabled") and causes _this_ bad test to not emit any errors
          template: `<div></div>`,
          result: {
            message: 'Current configuration is lol',
            line: 1,
            column: 0,
            source: '<div></div>',
          },
        },
      ],
    });

    await expect(() => group.run()).rejects.toThrowErrorMatchingInlineSnapshot(
      `"ember-template-lint: Test harness found invalid setup (\`groupingMethodBefore\` not called once per test). Maybe you meant to pass \`groupingMethodBefore: beforeEach\`?"`
    );

    expect(group.runLog).toMatchInlineSnapshot(`
      Array [
        "<div></div>: logs errors",
      ]
    `);
  });
});
