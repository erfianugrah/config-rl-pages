// fingerprint-utils.js
import { FINGERPRINT_TOOLTIPS } from './config-variables.js';

export function addFingerprint(ruleIndex) {
  const select = document.getElementById(`fingerprintParam${ruleIndex}`);
  const list = document.getElementById(`fingerprintList${ruleIndex}`);
  addToList(list, select.value, ruleIndex);
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
