import { MESSAGES, LABELS, FINGERPRINT_PARAMS, ADD_RULE_BUTTON_TEXT } from './config-variables.js';
import {
  createConditionFields,
  createOperator,
  createConditionGroup,
  addCondition,
  addConditionGroup,
  addConditionToGroup,
  removeCondition,
  removeConditionGroup,
} from './request-match-utils.js';
import { addToList } from './fingerprint-utils.js';
import { updateActionFields } from './action-utils.js';
import { createRuleModal } from './rule-modal.js';
import { saveConfiguration } from './config-saver.js';

export function createRuleForm(rule = {}, editIndex = null) {
  console.log('Creating rule form:', rule);
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
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleName${ruleIndex}" name="rules[${ruleIndex}].name" type="text" value="${rule.name || ''}" required>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="ruleDescription${ruleIndex}">
        ${LABELS.DESCRIPTION}
      </label>
      <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="ruleDescription${ruleIndex}" name="rules[${ruleIndex}].description">${rule.description || ''}</textarea>
    </div>
    <div class="mb-4">
      <h4 class="text-md font-semibold mb-2">Rate Limit</h4>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="limit${ruleIndex}">
            ${LABELS.REQUEST_LIMIT}
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="limit${ruleIndex}" name="rules[${ruleIndex}].rateLimit.limit" type="number" value="${rule.rateLimit?.limit || ''}" required>
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="period${ruleIndex}">
            ${LABELS.TIME_PERIOD}
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="period${ruleIndex}" name="rules[${ruleIndex}].rateLimit.period" type="number" value="${rule.rateLimit?.period || ''}" required>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <h4 class="text-md font-semibold mb-2">${LABELS.REQUEST_MATCH}</h4>
      <div id="requestMatchConditions${ruleIndex}"></div>
      <div class="mt-4">
        <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onclick="addCondition(${ruleIndex})">
          Add Condition
        </button>
        <button type="button" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onclick="addConditionGroup(${ruleIndex})">
          Add Condition Group
        </button>
      </div>
    </div>
    <div class="mb-4">
      <h4 class="text-md font-semibold mb-2">Action</h4>
      <select id="actionType${ruleIndex}" name="rules[${ruleIndex}].action.type" class="form-select mb-2" onchange="updateActionFields(${ruleIndex})">
        <option value="log" ${rule.action?.type === 'log' ? 'selected' : ''}>Log</option>
        <option value="simulate" ${rule.action?.type === 'simulate' ? 'selected' : ''}>Simulate</option>
        <option value="block" ${rule.action?.type === 'block' ? 'selected' : ''}>Block (403)</option>
        <option value="rateLimit" ${rule.action?.type === 'rateLimit' ? 'selected' : ''}>Rate Limit (429)</option>
        <option value="customResponse" ${rule.action?.type === 'customResponse' ? 'selected' : ''}>Custom JSON Response</option>
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
      </div>
      <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onclick="addFingerprint(${ruleIndex})">Add</button>
      <div id="fingerprintList${ruleIndex}" class="mt-4 p-2 border rounded min-h-[100px]"></div>
    </div>
  `;

  document.getElementById('rulesContainer').appendChild(ruleForm);

  // Populate request match conditions and groups
  const conditionsContainer = document.getElementById(`requestMatchConditions${ruleIndex}`);
  if (rule.requestMatch && rule.requestMatch.conditions) {
    populateConditions(ruleIndex, rule.requestMatch.conditions, conditionsContainer);
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

  console.log('Rule form created:', ruleForm);
}

function populateConditions(ruleIndex, conditions, container, groupIndex = null) {
  console.log(`Populating conditions: ruleIndex=${ruleIndex}, groupIndex=${groupIndex}`);
  console.log('Conditions:', conditions);

  conditions.forEach((condition, index) => {
    console.log(`Processing condition ${index}:`, condition);

    if (index > 0) {
      const operatorHtml = createOperator(
        groupIndex !== null
          ? `rules[${ruleIndex}].requestMatch.conditions[${groupIndex}].conditions[${index - 1}]`
          : `rules[${ruleIndex}].requestMatch.conditions[${index - 1}]`,
        condition.operator || 'and'
      );
      console.log(`Inserting operator HTML: ${operatorHtml}`);
      container.insertAdjacentHTML('beforeend', operatorHtml);
    }

    if (condition.type === 'group') {
      const groupHTML = createConditionGroup(ruleIndex, index, condition);
      console.log(`Inserting group HTML: ${groupHTML}`);
      container.insertAdjacentHTML('beforeend', groupHTML);
      const groupContainer = document.getElementById(`groupConditions${ruleIndex}_${index}`);
      populateConditions(ruleIndex, condition.conditions, groupContainer, index);
    } else {
      const conditionHTML = createConditionFields(
        ruleIndex,
        groupIndex !== null ? `${groupIndex}_${index}` : index,
        condition,
        groupIndex !== null
      );
      console.log(`Inserting condition HTML: ${conditionHTML}`);
      container.insertAdjacentHTML('beforeend', conditionHTML);
    }
  });

  console.log('Finished populating conditions');
}

export function updateRuleModals() {
  console.log('Updating rule modals');
  const container = document.getElementById('ruleModals');
  container.innerHTML = '';
  window.currentRules.forEach((rule, index) => {
    container.appendChild(createRuleModal(rule, index));
  });

  const addNewRuleButton = document.getElementById('addNewRule');
  addNewRuleButton.textContent = ADD_RULE_BUTTON_TEXT;
  console.log('Finished updating rule modals');
}

function serializeRuleForm(form) {
  console.log('Serializing rule form');
  const formData = new FormData(form);
  const rule = {};
  formData.forEach((value, key) => {
    const match = key.match(/rules\[(\d+)\]\.(.+)/);
    if (match) {
      const [, , path] = match;
      const keys = path.split('.');
      let current = rule;
      keys.forEach((keyPart, i) => {
        if (i === keys.length - 1) {
          current[keyPart] = value;
        } else {
          current[keyPart] = current[keyPart] || {};
          current = current[keyPart];
        }
      });
    }
  });
  console.log('Serialized rule:', rule);
  return rule;
}

export function initializeRuleForm() {
  console.log('Initializing rule form');
  document.getElementById('configForm').onsubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    const newRule = serializeRuleForm(e.target);
    const editIndex = parseInt(
      document.querySelector('#rulesContainer > div').getAttribute('data-id')
    );
    if (!isNaN(editIndex) && editIndex < window.currentRules.length) {
      console.log(`Updating existing rule at index ${editIndex}`);
      window.currentRules[editIndex] = newRule;
    } else {
      console.log('Adding new rule');
      window.currentRules.push(newRule);
    }
    try {
      console.log('Saving configuration');
      await saveConfiguration();
      console.log('Configuration saved successfully');
      updateRuleModals();
    } catch (error) {
      console.error('Error saving configuration:', error);
      document.getElementById('message').textContent = `${MESSAGES.SAVE_ERROR}: ${error.message}`;
    }
  };
  console.log('Rule form initialized');
}

// Ensure these functions are available globally
window.addCondition = addCondition;
window.addConditionGroup = addConditionGroup;
window.addConditionToGroup = addConditionToGroup;
window.removeCondition = removeCondition;
window.removeConditionGroup = removeConditionGroup;
window.updateRuleModals = updateRuleModals;

console.log('All functions exported and made globally available');
