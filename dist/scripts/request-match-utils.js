// request-match-utils.js
import { LABELS, REQUEST_MATCH_FIELDS, REQUEST_MATCH_OPERATORS } from './config-variables.js';

export function createConditionFields(ruleIndex, conditionIndex, condition = {}) {
  return `
    <div class="grid grid-cols-3 gap-4 mb-4" id="condition${ruleIndex}_${conditionIndex}">
      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="field${ruleIndex}_${conditionIndex}">
          ${LABELS.CONDITION_FIELD}
        </label>
        <select class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="field${ruleIndex}_${conditionIndex}"
                name="rules[${ruleIndex}].requestMatch.conditions[${conditionIndex}].field" required>
          ${REQUEST_MATCH_FIELDS.map(
            (field) =>
              `<option value="${field.value}" ${condition.field === field.value ? 'selected' : ''}>${field.label}</option>`
          ).join('')}
        </select>
      </div>
      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="operator${ruleIndex}_${conditionIndex}">
          ${LABELS.CONDITION_OPERATOR}
        </label>
        <select class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="operator${ruleIndex}_${conditionIndex}"
                name="rules[${ruleIndex}].requestMatch.conditions[${conditionIndex}].operator" required>
          ${REQUEST_MATCH_OPERATORS.map(
            (op) =>
              `<option value="${op.value}" ${condition.operator === op.value ? 'selected' : ''}>${op.label}</option>`
          ).join('')}
        </select>
      </div>
      <div>
        <label class="block text-gray-700 text-sm font-bold mb-2" for="value${ruleIndex}_${conditionIndex}">
          ${LABELS.CONDITION_VALUE}
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               id="value${ruleIndex}_${conditionIndex}"
               name="rules[${ruleIndex}].requestMatch.conditions[${conditionIndex}].value"
               type="text" value="${condition.value || ''}" required>
      </div>
    </div>
  `;
}

export function addCondition(ruleIndex) {
  const conditionsContainer = document.getElementById(`requestMatchConditions${ruleIndex}`);
  const newConditionIndex = conditionsContainer.children.length;
  const newConditionHTML = createConditionFields(ruleIndex, newConditionIndex);
  conditionsContainer.insertAdjacentHTML('beforeend', newConditionHTML);
}
