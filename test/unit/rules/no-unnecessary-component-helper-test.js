'use strict';

const generateRuleTests = require('../../helpers/rule-test-harness');

generateRuleTests({
  name: 'no-unnecessary-component-helper',

  config: true,

  good: [
    // MustacheStatement
    '{{component SOME_COMPONENT_NAME}}',
    '{{component SOME_COMPONENT_NAME SOME_ARG}}',
    '{{component SOME_COMPONENT_NAME "Hello World"}}',
    '{{my-component}}',
    '{{my-component "Hello world"}}',
    '{{my-component "Hello world" 123}}',

    // BlockStatement:
    '{{#component SOME_COMPONENT_NAME}}{{/component}}',
    '{{#component SOME_COMPONENT_NAME SOME_ARG}}{{/component}}',
    '{{#component SOME_COMPONENT_NAME "Hello World"}}{{/component}}',
    '{{#my-component}}{{/my-component}}',
    '{{#my-component "Hello world"}}{{/my-component}}',
    '{{#my-component "Hello world" 123}}{{/my-component}}',

    // Inline usage is not affected by this rule:
    '(component SOME_COMPONENT_NAME)',
    '(component "my-component")',

    // Curly inline usage in an angle bracket component:
    '<Foo @bar={{component SOME_COMPONENT_NAME}} />',
    '<Foo @bar={{component "my-component"}} />',
    '<Foo @bar={{component SOME_COMPONENT_NAME}}></Foo>',
    '<Foo @bar={{component "my-component"}}></Foo>',

    // Static arguments in angle bracket components don't crash the rule:
    '<Foo @arg="foo" />',
    '<Foo class="foo" />',
    '<Foo data-test-bar="foo" />',

    // `if` expressions without `(component)` are allowed:
    '<Foo @arg={{if this.user.isAdmin "admin"}} />',

    // `if` expression with `(component)` are allowed:
    '<Foo @arg={{if this.user.isAdmin (component "my-component")}} />',

    // Component names of the form `addon-name@component-name` are exempt:
    "{{component 'addon-name@component-name'}}",
    "{{#component 'addon-name@component-name'}}{{/component}}",
  ],

  bad: [
    // MustacheStatement
    {
      template: '{{component "my-component-name"}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 33,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoke component directly instead of using \`component\` helper",
              "rule": "no-unnecessary-component-helper",
              "severity": 2,
              "source": "{{component \\"my-component-name\\"}}",
            },
          ]
        `);
      },
    },
    // BlockStatement:
    {
      template: '{{#component "my-component-name"}}{{/component}}',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 0,
              "endColumn": 48,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoke component directly instead of using \`component\` helper",
              "rule": "no-unnecessary-component-helper",
              "severity": 2,
              "source": "{{#component \\"my-component-name\\"}}{{/component}}",
            },
          ]
        `);
      },
    },
    {
      template:
        '<Foo @arg={{component "allowed-component"}}>{{component "forbidden-component"}}</Foo>',

      verifyResults(results) {
        expect(results).toMatchInlineSnapshot(`
          Array [
            Object {
              "column": 44,
              "endColumn": 79,
              "endLine": 1,
              "filePath": "layout.hbs",
              "line": 1,
              "message": "Invoke component directly instead of using \`component\` helper",
              "rule": "no-unnecessary-component-helper",
              "severity": 2,
              "source": "{{component \\"forbidden-component\\"}}",
            },
          ]
        `);
      },
    },
  ],
});
