// rule-actions.js
import { FINGERPRINT_TOOLTIPS } from './config-variables.js';
import { createRuleForm } from './rule-forms.js';
import { saveConfiguration } from './config-saver.js';
import { updateRuleModals } from './rule-forms.js';

export function viewRule(rule) {
  const viewModal = document.createElement('div');
  viewModal.className =
    'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
  viewModal.innerHTML = `
    <div class="relative p-8 border w-full max-w-xl shadow-lg rounded-md bg-white">
        <h3 class="text-2xl leading-6 font-medium text-gray-900 mb-4">Rule Details</h3>
        <pre class="text-left whitespace-pre-wrap break-words bg-gray-100 p-4 rounded">${JSON.stringify(rule, null, 2)}</pre>
        <button id="closeViewModal" class="mt-6 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200">
            Close
        </button>
    </div>
  `;
  document.body.appendChild(viewModal);
  document.getElementById('closeViewModal').onclick = () => document.body.removeChild(viewModal);
}

export function editRule(rule, index) {
  document.getElementById('ruleModals').classList.add('hidden');
  document.getElementById('addNewRule').classList.add('hidden');
  document.getElementById('configForm').classList.remove('hidden');

  document.getElementById('rulesContainer').innerHTML = '';
  createRuleForm(rule, index);

  // Populate form fields
  const form = document.getElementById('configForm');
  form.querySelector(`[name="rules[${index}].name"]`).value = rule.name || '';
  form.querySelector(`[name="rules[${index}].description"]`).value = rule.description || '';
  form.querySelector(`[name="rules[${index}].rateLimit.limit"]`).value =
    rule.rateLimit?.limit || '';
  form.querySelector(`[name="rules[${index}].rateLimit.period"]`).value =
    rule.rateLimit?.period || '';

  // Populate fingerprint parameters
  if (rule.fingerprint && rule.fingerprint.parameters) {
    const fingerprintList = document.getElementById(`fingerprintList${index}`);
    fingerprintList.innerHTML = ''; // Clear existing parameters
    rule.fingerprint.parameters.forEach((param) => addToList(fingerprintList, param, index));
  }

  // Populate request match conditions
  if (rule.requestMatch && rule.requestMatch.conditions) {
    const conditionsContainer = document.getElementById(`requestMatchConditions${index}`);
    rule.requestMatch.conditions.forEach((condition, conditionIndex) => {
      addCondition(index);
      const conditionFields = conditionsContainer.lastElementChild;
      conditionFields.querySelector(
        `[name="rules[${index}].requestMatch.conditions[${conditionIndex}].field"]`
      ).value = condition.field;
      conditionFields.querySelector(
        `[name="rules[${index}].requestMatch.conditions[${conditionIndex}].operator"]`
      ).value = condition.operator;
      conditionFields.querySelector(
        `[name="rules[${index}].requestMatch.conditions[${conditionIndex}].value"]`
      ).value = condition.value;
    });
  }

  // Populate action fields
  if (rule.action) {
    form.querySelector(`[name="rules[${index}].action.type"]`).value = rule.action.type;
    updateActionFields(index, rule.action.type);
    if (rule.action.type === 'customResponse') {
      form.querySelector(`[name="rules[${index}].action.statusCode"]`).value =
        rule.action.statusCode;
      form.querySelector(`[name="rules[${index}].action.body"]`).value = rule.action.body;
    }
  }
}

export function deleteRule(index) {
  if (confirm('Are you sure you want to delete this rule?')) {
    window.currentRules.splice(index, 1);
    updateRuleModals();
    saveConfiguration();
  }
}

export function addToList(list, value, ruleIndex) {
  const item = document.createElement('div');
  item.className = 'flex justify-between items-center mb-2 p-2 bg-gray-100 rounded';
  item.innerHTML = `
        <span>${value}</span>
        <input type="hidden" name="rules[${ruleIndex}].fingerprint.parameters[]" value="${value}">
        <button type="button" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">Remove</button>
    `;
  item.querySelector('button').onclick = () => list.removeChild(item);
  list.appendChild(item);

  const tooltip = document.createElement('div');
  tooltip.className = 'hidden absolute z-10 p-2 bg-gray-800 text-white text-sm rounded shadow-lg';
  tooltip.textContent = FINGERPRINT_TOOLTIPS[value] || 'No description available';
  item.appendChild(tooltip);

  item.querySelector('span').onmouseenter = () => tooltip.classList.remove('hidden');
  item.querySelector('span').onmouseleave = () => tooltip.classList.add('hidden');
}
