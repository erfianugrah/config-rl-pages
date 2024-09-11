// rule-forms.js
import {
  MESSAGES,
  LABELS,
  FINGERPRINT_PARAMS,
  REQUEST_MATCH_FIELDS,
  REQUEST_MATCH_OPERATORS,
} from './config-variables.js';
import { addCondition, createConditionFields } from './request-match-utils.js';
import { addFingerprint, addToList } from './fingerprint-utils.js';
import { updateActionFields } from './action-utils.js';
import { ADD_RULE_BUTTON_TEXT } from './config-variables.js';
import { createRuleModal } from './rule-modal.js';

export function createRuleForm(rule = {}, editIndex = null) {
  const ruleIndex = editIndex !== null ? editIndex : window.currentRules.length;
  const ruleForm = document.createElement('div');
  ruleForm.className = 'bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4';
  ruleForm.setAttribute('data-id', ruleIndex);
  ruleForm.innerHTML = `
        <div class="mb-4">
            <h3 class="text-lg font-semibold">Rule ${ruleIndex + 1}</h3>
        </div>
        <input type="hidden" name="rules[${ruleIndex}].order" value="${ruleIndex + 1}">
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleName${ruleIndex}">
                ${LABELS.RULE_NAME}
            </label>
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleName${ruleIndex}" name="rules[${ruleIndex}].name" type="text" required>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleDescription${ruleIndex}">
                ${LABELS.DESCRIPTION}
            </label>
            <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleDescription${ruleIndex}" name="rules[${ruleIndex}].description"></textarea>
        </div>
        <div class="mb-4">
            <h4 class="text-md font-semibold mb-2">Rate Limit</h4>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="limit${ruleIndex}">
                        ${LABELS.REQUEST_LIMIT}
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="limit${ruleIndex}" name="rules[${ruleIndex}].rateLimit.limit" type="number" required>
                </div>
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2" for="period${ruleIndex}">
                        ${LABELS.TIME_PERIOD}
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="period${ruleIndex}" name="rules[${ruleIndex}].rateLimit.period" type="number" required>
                </div>
            </div>
        </div>
        <div class="mb-4">
            <h4 class="text-md font-semibold mb-2">${LABELS.REQUEST_MATCH}</h4>
            <div class="mb-2">
                <label class="inline-flex items-center">
                    <span class="mr-2">Logic:</span>
                    <select name="rules[${ruleIndex}].requestMatch.logic" class="form-select">
                        <option value="AND" ${rule.requestMatch && rule.requestMatch.logic === 'OR' ? '' : 'selected'}>AND</option>
                        <option value="OR" ${rule.requestMatch && rule.requestMatch.logic === 'OR' ? 'selected' : ''}>OR</option>
                    </select>
                </label>
            </div>
            <div id="requestMatchConditions${ruleIndex}"></div>
            <button type="button" class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="addCondition(${ruleIndex})">
                Add Condition
            </button>
        </div>
        <div class="mb-4">
            <h4 class="text-md font-semibold mb-2">Action</h4>
            <select id="actionType${ruleIndex}" name="rules[${ruleIndex}].action.type" class="form-select mb-2" onchange="updateActionFields(${ruleIndex})">
                <option value="log">Log</option>
                <option value="simulate">Simulate</option>
                <option value="block">Block (403)</option>
                <option value="rateLimit" selected>Rate Limit (429)</option>
                <option value="customResponse">Custom JSON Response</option>
            </select>
            <div id="actionFields${ruleIndex}"></div>
        </div>
        <div class="mb-4">
            <h4 class="text-md font-semibold mb-2">${LABELS.FINGERPRINT_PARAMS}</h4>
            <div class="mb-4">
                <p class="text-sm text-gray-600">${MESSAGES.CLIENT_IP_INCLUDED}</p>
            </div>
            <div>
                <select id="fingerprintParam${ruleIndex}" class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
                    ${FINGERPRINT_PARAMS.map((param) => `<option value="${param.value}">${param.label}</option>`).join('')}
                </select>
                <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="addFingerprint(${ruleIndex})">Add</button>
                <div id="fingerprintList${ruleIndex}" class="mt-4 p-2 border rounded min-h-[100px]"></div>
            </div>
        </div>
    `;
  document.getElementById('rulesContainer').appendChild(ruleForm);

  // Populate request match conditions
  const conditionsContainer = document.getElementById(`requestMatchConditions${ruleIndex}`);
  let conditions = [];
  if (rule.requestMatch) {
    if (Array.isArray(rule.requestMatch.conditions)) {
      conditions = rule.requestMatch.conditions;
    } else if (typeof rule.requestMatch === 'object') {
      conditions = Object.keys(rule.requestMatch)
        .filter((key) => key.startsWith('conditions['))
        .map((key) => rule.requestMatch[key]);
    }
  }

  if (conditions.length > 0) {
    conditions.forEach((condition, index) => {
      const conditionHTML = createConditionFields(ruleIndex, index, condition);
      conditionsContainer.insertAdjacentHTML('beforeend', conditionHTML);
    });
  }

  // Populate form fields
  ruleForm.querySelector(`[name="rules[${ruleIndex}].name"]`).value = rule.name || '';
  ruleForm.querySelector(`[name="rules[${ruleIndex}].description"]`).value = rule.description || '';
  ruleForm.querySelector(`[name="rules[${ruleIndex}].rateLimit.limit"]`).value =
    rule.rateLimit?.limit || '';
  ruleForm.querySelector(`[name="rules[${ruleIndex}].rateLimit.period"]`).value =
    rule.rateLimit?.period || '';

  // Populate fingerprint parameters if they exist
  if (rule.fingerprint && rule.fingerprint.parameters) {
    const fingerprintList = ruleForm.querySelector(`#fingerprintList${ruleIndex}`);
    rule.fingerprint.parameters.forEach((param) => addToList(fingerprintList, param, ruleIndex));
  }

  // Populate action fields
  if (rule.action) {
    ruleForm.querySelector(`[name="rules[${ruleIndex}].action.type"]`).value = rule.action.type;
    updateActionFields(ruleIndex, rule.action.type);
    if (rule.action.type === 'customResponse') {
      ruleForm.querySelector(`[name="rules[${ruleIndex}].action.statusCode"]`).value =
        rule.action.statusCode;
      ruleForm.querySelector(`[name="rules[${ruleIndex}].action.body"]`).value = rule.action.body;
    }
  } else {
    updateActionFields(ruleIndex, 'rateLimit');
  }
}

export function updateRuleModals() {
  const container = document.getElementById('ruleModals');
  container.className = 'flex flex-col space-y-4 mb-8';
  container.innerHTML = '';
  window.currentRules.forEach((rule, index) => {
    container.appendChild(createRuleModal(rule, index));
  });

  const addNewRuleButton = document.getElementById('addNewRule');
  addNewRuleButton.className =
    'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200 mb-4';
  addNewRuleButton.textContent = ADD_RULE_BUTTON_TEXT;
}

window.updateRuleModals = updateRuleModals;
