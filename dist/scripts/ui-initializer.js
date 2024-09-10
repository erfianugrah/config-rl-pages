// ui-initializer.js
import { createRuleForm, updateRuleModals } from './rule-forms.js';
import { saveConfiguration } from './config-saver.js';
import { ADD_RULE_BUTTON_TEXT, MESSAGES } from './config-variables.js';

export function initializeUI() {
  document.getElementById('addNewRule').onclick = () => {
    document.getElementById('ruleModals').classList.add('hidden');
    document.getElementById('addNewRule').classList.add('hidden');
    document.getElementById('configForm').classList.remove('hidden');
    document.getElementById('rulesContainer').innerHTML = '';
    createRuleForm();
  };

  document.getElementById('addNewRule').textContent = ADD_RULE_BUTTON_TEXT;

  document.getElementById('cancelEdit').onclick = () => {
    document.getElementById('ruleModals').classList.remove('hidden');
    document.getElementById('addNewRule').classList.remove('hidden');
    document.getElementById('configForm').classList.add('hidden');
  };

  document.getElementById('configForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRule = {};

    for (let [key, value] of formData.entries()) {
      if (key.startsWith('rules[')) {
        const match = key.match(/rules\[(\d+)\]\.(.+)/);
        if (match) {
          const [, , path] = match;
          const keys = path.split('.');
          let current = newRule;
          for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
              if (keys[i] === 'parameters[]') {
                current['parameters'] = current['parameters'] || [];
                current['parameters'].push(value);
              } else {
                current[keys[i]] = value;
              }
            } else {
              current[keys[i]] = current[keys[i]] || {};
              current = current[keys[i]];
            }
          }
        }
      }
    }

    const editIndex = parseInt(
      document.querySelector('#rulesContainer > div').getAttribute('data-id')
    );
    if (!isNaN(editIndex) && editIndex < window.currentRules.length) {
      window.currentRules[editIndex] = newRule;
    } else {
      window.currentRules.push(newRule);
    }

    try {
      await saveConfiguration();
      updateRuleModals();
      document.getElementById('ruleModals').classList.remove('hidden');
      document.getElementById('addNewRule').classList.remove('hidden');
      document.getElementById('configForm').classList.add('hidden');
    } catch (error) {
      document.getElementById('message').textContent = MESSAGES.SAVE_ERROR + error.message;
      document.getElementById('message').className = 'mt-4 text-center font-bold text-red-600';
    }
  };
}
