import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { plugin, defaultConfig } from '@formkit/vue';
// import * as t from './formkit.config.ts';
import { de, en } from '@formkit/i18n';
import { createAutoAnimatePlugin } from '@formkit/addons';

import '@formkit/themes/genesis';

const isCheckboxAndRadioMultiple = (node: any) =>
  (node.props.type === 'checkbox' || node.props.type === 'radio') &&
  node.props.options;

function addAsteriskPlugin(node: any) {
  node.on('created', () => {
    const schemaFn = node.props.definition.schema;
    node.props.definition.schema = (sectionsSchema: any = {}) => {
      const isRequired = node.props.parsedRules.some(
        (rule: any) => rule.name === 'required'
      );

      if (isRequired) {
        if (isCheckboxAndRadioMultiple(node)) {
          sectionsSchema.legend = {
            children: ['$label', ' *'],
          };
        } else {
          sectionsSchema.label = {
            children: ['$label', ' *'],
          };
        }
      }
      return schemaFn(sectionsSchema);
    };
  });
}

function messageToHTMLPlugin(node: any) {
  const icon =
    '<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 100" x="0px" y="0px"><title>Artboard 10</title><path d="M50,19A31,31,0,1,0,81,50,31,31,0,0,0,50,19Zm0,56A25,25,0,1,1,75,50,25,25,0,0,1,50,75Z"></path><rect x="47" y="34" width="6" height="19"></rect><circle cx="50" cy="62" r="3"></circle></svg>';

  node.on('created', () => {
    const original = node.props.definition.schema;
    node.context.warningIcon = icon;
    node.props.definition.schema = (extensions: any) => {
      if (!extensions.message) {
        extensions.message = {
          attrs: {
            innerHTML: '$warningIcon + " " + $message.value',
          },
          children: null,
        };
      }
      return original(extensions);
    };
  });
}

createApp(App)
  .use(
    plugin,
    defaultConfig({
      locales: { de, en },
      locale: 'de',
      plugins: [
        addAsteriskPlugin,
        messageToHTMLPlugin,
        createAutoAnimatePlugin(),
      ],
    })
  )
  .mount('#app');
