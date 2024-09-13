// request-match-utils.js

import { LABELS, REQUEST_MATCH_FIELDS, REQUEST_MATCH_OPERATORS } from './config-variables.js';

export function createConditionFields(
  ruleIndex,
  conditionIndex,
  condition = {},
  isGroupCondition = false
) {
  const namePrefix = isGroupCondition
    ? `rules[${ruleIndex}].requestMatch.conditions[${conditionIndex.split('_')[0]}].conditions[${conditionIndex.split('_')[1]}]`
    : `rules[${ruleIndex}].requestMatch.conditions[${conditionIndex}]`;

  return `
    <div class="condition-field grid grid-cols-5 gap-2 items-center mb-2 p-2 border rounded" id="condition${ruleIndex}_${conditionIndex}">
      <div>
        <label class="block text-sm font-medium text-gray-700">${LABELS.CONDITION_FIELD}</label>
        <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="${namePrefix}.field" required>
          ${REQUEST_MATCH_FIELDS.map((field) => `<option value="${field.value}" ${condition.field === field.value ? 'selected' : ''}>${field.label}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">${LABELS.CONDITION_OPERATOR}</label>
        <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="${namePrefix}.comparator" required>
          ${REQUEST_MATCH_OPERATORS.map((op) => `<option value="${op.value}" ${condition.comparator === op.value ? 'selected' : ''}>${op.label}</option>`).join('')}
        </select>
      </div>
      <div class="col-span-2">
        <label class="block text-sm font-medium text-gray-700">${LABELS.CONDITION_VALUE}</label>
        <input class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" name="${namePrefix}.value" type="text" value="${condition.value || ''}" required>
      </div>
      <div>
        <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm" onclick="removeCondition(${ruleIndex}, '${conditionIndex}')">
          Remove
        </button>
      </div>
    </div>
  `;
}

export function createOperator(namePrefix, selectedOperator = 'and') {
  return `
    <div class="flex justify-center items-center my-2">
      <select class="operator-select form-select block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="${namePrefix}.operator">
        <option value="and" ${selectedOperator === 'and' ? 'selected' : ''}>AND</option>
        <option value="or" ${selectedOperator === 'or' ? 'selected' : ''}>OR</option>
      </select>
    </div>
  `;
}

export function createConditionGroup(ruleIndex, groupIndex, group = {}) {
  const groupId = `group${ruleIndex}_${groupIndex}`;
  return `
    <div class="condition-group border-2 border-gray-300 p-4 mb-4" id="${groupId}">
      <div class="flex justify-between items-center mb-4">
        <h5 class="text-lg font-semibold">Condition Group</h5>
        <button type="button" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm" onclick="removeConditionGroup(${ruleIndex}, ${groupIndex})">
          Remove Group
        </button>
      </div>
      <div id="groupConditions${ruleIndex}_${groupIndex}">
        <!-- Group conditions will be inserted here -->
      </div>
      <div class="mt-4">
        <button type="button" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm" onclick="addConditionToGroup(${ruleIndex}, ${groupIndex})">
          Add Condition to Group
        </button>
      </div>
    </div>
  `;
}

export function addCondition(ruleIndex) {
  const conditionsContainer = document.getElementById(`requestMatchConditions${ruleIndex}`);
  const currentConditions = conditionsContainer.children.length;

  if (currentConditions > 0) {
    const operatorHtml = createOperator(
      `rules[${ruleIndex}].requestMatch.conditions[${currentConditions - 1}]`
    );
    conditionsContainer.insertAdjacentHTML('beforeend', operatorHtml);
  }

  const newConditionHTML = createConditionFields(ruleIndex, currentConditions);
  conditionsContainer.insertAdjacentHTML('beforeend', newConditionHTML);
}

export function addConditionGroup(ruleIndex) {
  const conditionsContainer = document.getElementById(`requestMatchConditions${ruleIndex}`);
  const currentConditions = conditionsContainer.children.length;

  if (currentConditions > 0) {
    const operatorHtml = createOperator(
      `rules[${ruleIndex}].requestMatch.conditions[${currentConditions - 1}]`
    );
    conditionsContainer.insertAdjacentHTML('beforeend', operatorHtml);
  }

  const newGroupHTML = createConditionGroup(ruleIndex, currentConditions, { conditions: [] });
  conditionsContainer.insertAdjacentHTML('beforeend', newGroupHTML);

  addConditionToGroup(ruleIndex, currentConditions);
}

export function addConditionToGroup(ruleIndex, groupIndex) {
  const groupContainer = document.getElementById(`groupConditions${ruleIndex}_${groupIndex}`);
  const currentConditions = groupContainer.children.length;

  if (currentConditions > 0) {
    const operatorHtml = createOperator(
      `rules[${ruleIndex}].requestMatch.conditions[${groupIndex}].conditions[${currentConditions - 1}]`
    );
    groupContainer.insertAdjacentHTML('beforeend', operatorHtml);
  }

  const newConditionHTML = createConditionFields(
    ruleIndex,
    `${groupIndex}_${currentConditions}`,
    {},
    true
  );
  groupContainer.insertAdjacentHTML('beforeend', newConditionHTML);
}

export function removeCondition(ruleIndex, conditionIndex) {
  const conditionElement = document.getElementById(`condition${ruleIndex}_${conditionIndex}`);
  if (conditionElement) {
    const parentContainer = conditionElement.parentElement;
    const prevSibling = conditionElement.previousElementSibling;
    const nextSibling = conditionElement.nextElementSibling;

    conditionElement.remove();

    if (prevSibling && prevSibling.classList.contains('flex')) {
      prevSibling.remove();
    } else if (nextSibling && nextSibling.classList.contains('flex')) {
      nextSibling.remove();
    }

    // Renumber remaining conditions
    const remainingConditions = parentContainer.querySelectorAll('.condition-field');
    remainingConditions.forEach((condition, index) => {
      condition.id = `condition${ruleIndex}_${index}`;
    });
  }
}

export function removeConditionGroup(ruleIndex, groupIndex) {
  const groupElement = document.getElementById(`group${ruleIndex}_${groupIndex}`);
  if (groupElement) {
    const parentContainer = groupElement.parentElement;
    const prevSibling = groupElement.previousElementSibling;
    const nextSibling = groupElement.nextElementSibling;

    groupElement.remove();

    if (prevSibling && prevSibling.classList.contains('flex')) {
      prevSibling.remove();
    } else if (nextSibling && nextSibling.classList.contains('flex')) {
      nextSibling.remove();
    }

    // Renumber remaining groups
    const remainingGroups = parentContainer.querySelectorAll('.condition-group');
    remainingGroups.forEach((group, index) => {
      group.id = `group${ruleIndex}_${index}`;
    });
  }
}
