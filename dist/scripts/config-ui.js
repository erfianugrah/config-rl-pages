// config-ui.js
import { initializeUI } from './ui-initializer.js';
import { loadConfiguration } from './config-loader.js';
import { API_ENDPOINTS, MESSAGES } from './config-variables.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize currentRules as an empty array
  window.currentRules = [];

  initializeUI();

  // Load existing configuration
  loadConfiguration(API_ENDPOINTS.CONFIG)
    .then((config) => {
      if (config.rules && config.rules.length > 0) {
        window.currentRules = config.rules.sort((a, b) => a.order - b.order);
        window.updateRuleModals();
      }
    })
    .catch((error) => {
      console.error('Error loading configuration:', error);
      document.getElementById('message').textContent = MESSAGES.LOAD_ERROR;
      document.getElementById('message').className = 'mt-4 text-center font-bold text-red-600';
    });
});
