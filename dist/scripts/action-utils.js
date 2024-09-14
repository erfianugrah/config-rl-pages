// action-utils.js
export function updateActionFields(ruleIndex, actionType) {
  const actionFields = document.getElementById(`actionFields${ruleIndex}`);
  const selectedType = actionType || document.getElementById(`actionType${ruleIndex}`).value;

  const inputClasses =
    'w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm bg-white';

  let fieldsHTML = '';
  switch (selectedType) {
    case 'customResponse':
      fieldsHTML = `
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="customStatusCode${ruleIndex}">Status Code:</label>
          <input type="number" id="customStatusCode${ruleIndex}" name="rules[${ruleIndex}].action.statusCode" class="${inputClasses}" required>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="customResponseBody${ruleIndex}">Response Body (JSON):</label>
          <textarea id="customResponseBody${ruleIndex}" name="rules[${ruleIndex}].action.body" class="${inputClasses} h-24" rows="4" required></textarea>
        </div>
      `;
      break;
    case 'block':
    case 'rateLimit':
      fieldsHTML = `
        <div class="text-sm text-gray-600">
          This action will ${selectedType === 'block' ? 'block the request with a 403 status' : 'rate limit the request with a 429 status'}.
        </div>
      `;
      break;
    case 'log':
    case 'simulate':
      fieldsHTML = `
        <div class="text-sm text-gray-600">
          This action will ${selectedType === 'log' ? 'log the request without taking action' : 'simulate rate limiting without actually blocking requests'}.
        </div>
      `;
      break;
  }

  actionFields.innerHTML = fieldsHTML;
}
