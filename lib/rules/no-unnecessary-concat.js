'use strict';

const Rule = require('./_base');

module.exports = class NoUnnecessaryConcat extends Rule {
  visitor() {
    return {
      AttrNode(node) {
        if (node.value.type === 'ConcatStatement') {
          let concat = node.value;
          if (concat.parts.length === 1) {
            if (this.mode === 'fix') {
              node.value = concat.parts[0];
            } else {
              let source = this.sourceForNode(concat);
              let innerSource = this.sourceForNode(concat.parts[0]);
              let message = `Unnecessary string concatenation. Use ${innerSource} instead of ${source}.`;

              this.log({
                message,
                node: concat,
                source,
                isFixable: true,
              });
            }
          }
        }
      },
    };
  }
};
