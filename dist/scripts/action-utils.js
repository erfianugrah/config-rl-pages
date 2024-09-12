// action-utils.js
export function updateActionFields(ruleIndex, actionType) {
  const actionFields = document.getElementById(`actionFields${ruleIndex}`);
  const selectedType = actionType || document.getElementById(`actionType${ruleIndex}`).value;

  let fieldsHTML = '';
  switch (selectedType) {
    case 'customResponse':
      fieldsHTML = `
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="customStatusCode${ruleIndex}">Status Code:</label>
          <input type="number" id="customStatusCode${ruleIndex}" name="rules[${ruleIndex}].action.statusCode" class="form-input" required>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="customResponseBody${ruleIndex}">Response Body (JSON):</label>
          <textarea id="customResponseBody${ruleIndex}" name="rules[${ruleIndex}].action.body" class="form-textarea" rows="4" required></textarea>
        </div>
      `;
      break;
    default:
      fieldsHTML = ''; // No additional fields for other action types
  }

  actionFields.innerHTML = fieldsHTML;
}
