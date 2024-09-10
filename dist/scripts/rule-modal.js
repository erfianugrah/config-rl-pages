// rule-modal.js
import { viewRule, editRule, deleteRule } from './rule-actions.js';
import { dragStart, dragOver, drop, dragEnd } from './drag-and-drop.js';

export function createRuleModal(rule, index) {
  const modal = document.createElement('div');
  modal.className =
    'bg-white shadow-md rounded px-6 py-4 mb-4 cursor-move transition-all duration-200 hover:shadow-lg';
  modal.setAttribute('data-id', index);
  modal.setAttribute('draggable', 'true');
  modal.innerHTML = `
    <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-semibold text-gray-800">${rule.name}</h3>
        <span class="text-gray-500 opacity-50 hover:opacity-100 transition-opacity duration-200">☰</span>
    </div>
    <p class="text-sm text-gray-600 mb-4">${rule.description || 'No description'}</p>
    <div class="flex justify-between">
        <button class="viewRule bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">View</button>
        <button class="editRule bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">Edit</button>
        <button class="deleteRule bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200">Delete</button>
    </div>
  `;

  modal.querySelector('.viewRule').onclick = () => viewRule(rule);
  modal.querySelector('.editRule').onclick = () => editRule(rule, index);
  modal.querySelector('.deleteRule').onclick = () => deleteRule(index);

  modal.addEventListener('dragstart', dragStart);
  modal.addEventListener('dragover', dragOver);
  modal.addEventListener('drop', drop);
  modal.addEventListener('dragend', dragEnd);

  return modal;
}
