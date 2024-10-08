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
import { addToList, addFingerprint } from './fingerprint-utils.js';
import { updateActionFields } from './action-utils.js';
import { createRuleModal } from './rule-modal.js';
import { saveConfiguration } from './config-saver.js';

export function createRuleForm(rule = {}, editIndex = null) {
  console.log('Creating rule form:', rule);
  const ruleIndex = editIndex !== null ? editIndex : window.currentRules.length;
  // Ensure rateLimit object exists
  if (!rule.rateLimit) {
    rule.rateLimit = { limit: '', period: '' };
  }

  // Ensure action object exists
  if (!rule.action) {
    rule.action = { type: 'rateLimit' };
  }
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
  <div class="mb-6">
    <h4 class="text-md font-semibold mb-2">Action</h4>
    <div class="inline-block bg-gray-50 p-4 rounded-md shadow-sm">
      <div class="mb-4 max-w-md">
        <label class="block text-sm font-medium text-gray-700 mb-1" for="actionType${ruleIndex}">
          Action Type
        </label>
        <select id="actionType${ruleIndex}" name="rules[${ruleIndex}].action.type" 
                class="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                onchange="updateActionFields(${ruleIndex})">
          <option value="log" ${rule.action?.type === 'log' ? 'selected' : ''}>Log</option>
          <option value="simulate" ${rule.action?.type === 'simulate' ? 'selected' : ''}>Simulate</option>
          <option value="block" ${rule.action?.type === 'block' ? 'selected' : ''}>Block (403)</option>
          <option value="rateLimit" ${rule.action?.type === 'rateLimit' ? 'selected' : ''}>Rate Limit (429)</option>
          <option value="customResponse" ${rule.action?.type === 'customResponse' ? 'selected' : ''}>Custom JSON Response</option>
        </select>
      </div>
      <div id="actionFields${ruleIndex}" class="space-y-4">
        <!-- Additional action fields will be dynamically added here -->
      </div>
    </div>
  </div>
  <div class="mb-6">
    <h4 class="text-md font-semibold mb-2">${LABELS.FINGERPRINT_PARAMS}</h4>
    <div class="bg-gray-50 p-4 rounded-md shadow-sm">
      <div class="flex flex-wrap items-end space-x-4 mb-4">
        <div class="flex-grow max-w-md">
          <label class="block text-sm font-medium text-gray-700 mb-1">Parameter Type</label>
          <select id="fingerprintParam${ruleIndex}" class="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm" onchange="updateFingerprintFields(${ruleIndex})">
            ${FINGERPRINT_PARAMS.map((param) => `<option value="${param.value}">${param.label}</option>`).join('')}
          </select>
        </div>
        <div id="fingerprintAdditionalFields${ruleIndex}" class="flex-grow">
          <!-- Additional fields will be dynamically added here -->
        </div>
        <button type="button" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md" onclick="addFingerprint(${ruleIndex})">
          Add Parameter
        </button>
      </div>
      <div id="fingerprintList${ruleIndex}" class="mt-4 p-2 border rounded min-h-[100px] shadow-inner bg-white"></div>
    </div>
  </div>
  `;

  document.getElementById('rulesContainer').appendChild(ruleForm);

  // Populate request match conditions and groups
  const conditionsContainer = document.getElementById(`requestMatchConditions${ruleIndex}`);
  if (rule.requestMatch && rule.requestMatch.conditions) {
    console.log('Populating conditions for rule:', ruleIndex);
    populateConditions(ruleIndex, rule.requestMatch.conditions, conditionsContainer);
  }

  // Set up fingerprint parameter type change event
  const fingerprintParamSelect = document.getElementById(`fingerprintParam${ruleIndex}`);
  fingerprintParamSelect.addEventListener('change', () => updateFingerprintFields(ruleIndex));

  // Initial update of fingerprint fields
  updateFingerprintFields(ruleIndex);

  console.log('Rule form created:', ruleForm);

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

function updateFingerprintFields(ruleIndex) {
  const selectedType = document.getElementById(`fingerprintParam${ruleIndex}`).value;
  const additionalFieldsContainer = document.getElementById(
    `fingerprintAdditionalFields${ruleIndex}`
  );

  let additionalFieldsHTML = '';

  const inputClasses =
    'w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white';

  if (selectedType === 'headers.name' || selectedType === 'headers.nameValue') {
    additionalFieldsHTML += `
      <div class="flex space-x-2">
        <div class="flex-grow">
          <label class="block text-sm font-medium text-gray-700 mb-1">Header Name</label>
          <input type="text" id="headerName${ruleIndex}" class="${inputClasses}">
        </div>
    `;

    if (selectedType === 'headers.nameValue') {
      additionalFieldsHTML += `
        <div class="flex-grow">
          <label class="block text-sm font-medium text-gray-700 mb-1">Header Value</label>
          <input type="text" id="headerValue${ruleIndex}" class="${inputClasses}">
        </div>
      `;
    }

    additionalFieldsHTML += `</div>`;
  } else if (selectedType === 'body' || selectedType === 'body.custom') {
    additionalFieldsHTML += `
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          ${selectedType === 'body' ? 'Request Body' : 'Body Field (JSON path)'}
        </label>
        <input type="text" id="bodyField${ruleIndex}" class="${inputClasses}">
      </div>
    `;
  }

  additionalFieldsContainer.innerHTML = additionalFieldsHTML;
}

export function populateConditions(ruleIndex, conditions, container, groupIndex = null) {
  console.log(`Populating conditions for rule ${ruleIndex}, group ${groupIndex}:`, conditions);
  console.log('Container:', container);

  if (
    !conditions ||
    (Array.isArray(conditions) && conditions.length === 0) ||
    Object.keys(conditions).length === 0
  ) {
    console.log('No conditions to populate');
    return;
  }

  const conditionsArray = Array.isArray(conditions) ? conditions : Object.values(conditions);

  conditionsArray.forEach((condition, index) => {
    console.log(`Processing condition ${index}:`, condition);

    if (index > 0) {
      const operatorHtml = createOperator(
        groupIndex !== null
          ? `rules[${ruleIndex}].requestMatch.conditions[${groupIndex}].conditions[${index - 1}]`
          : `rules[${ruleIndex}].requestMatch.conditions[${index - 1}]`,
        condition.operator
      );
      console.log(`Inserting operator HTML: ${operatorHtml}`);
      container.insertAdjacentHTML('beforeend', operatorHtml);
    }

    if (condition.type === 'group') {
      console.log(`Creating condition group for rule ${ruleIndex}, index ${index}`);
      const groupHTML = createConditionGroup(ruleIndex, index, condition);
      console.log(`Inserting group HTML: ${groupHTML}`);
      container.insertAdjacentHTML('beforeend', groupHTML);
      const groupContainer = document.getElementById(`groupConditions${ruleIndex}_${index}`);
      populateConditions(ruleIndex, condition.conditions, groupContainer, index);
    } else {
      console.log(`Creating condition field for rule ${ruleIndex}, index ${index}`);
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

  console.log(`Finished populating conditions for rule ${ruleIndex}, group ${groupIndex}`);
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
  const rule = {
    rateLimit: {},
    action: {},
    fingerprint: { parameters: [] },
    requestMatch: { conditions: [] },
  };

  formData.forEach((value, key) => {
    const match = key.match(/rules\[(\d+)\]\.(.+)/);
    if (match) {
      const [, , path] = match;
      const keys = path.split('.');
      let current = rule;
      keys.forEach((keyPart, i) => {
        if (i === keys.length - 1) {
          if (keyPart === 'parameters[]') {
            current.parameters.push(value);
          } else {
            current[keyPart] = value;
          }
        } else {
          current[keyPart] = current[keyPart] || {};
          current = current[keyPart];
        }
      });
    }
  });

  // Convert numeric values
  rule.rateLimit.limit = Number(rule.rateLimit.limit);
  rule.rateLimit.period = Number(rule.rateLimit.period);
  if (rule.action.type === 'customResponse') {
    rule.action.statusCode = Number(rule.action.statusCode);
  }

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
