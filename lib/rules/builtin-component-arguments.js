'use strict';

const { builders } = require('ember-template-recast');

const Rule = require('./_base');

const FORBIDDEN_ATTRIBUTES = {
  Input: new Set(['checked', 'type', 'value']),
  Textarea: new Set(['value']),
};

module.exports = class BuiltinComponentArguments extends Rule {
  visitor() {
    return {
      ElementNode(node) {
        let { attributes, tag } = node;

        if (tag in FORBIDDEN_ATTRIBUTES) {
          let forbiddenAttributes = FORBIDDEN_ATTRIBUTES[tag];
          for (let attribute of attributes) {
            if (forbiddenAttributes.has(attribute.name)) {
              if (this.mode === 'fix') {
                if (attribute.name === 'checked' && attribute.isValueless) {
                  attribute.value = builders.mustache('true');
                }
                attribute.name = `@${attribute.name}`;
              } else {
                this.log({
                  message: BuiltinComponentArguments.generateErrorMessage(node.tag, attribute.name),
                  node: attribute,
                  isFixable: true,
                });
              }
            }
          }
        }
      },
    };
  }

  static generateErrorMessage(component, argument) {
    return `Setting the \`${argument}\` attribute on the builtin <${component}> component is not allowed. Did you mean \`@${argument}\`?`;
  }
};
