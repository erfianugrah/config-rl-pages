import {
  addCondition,
  addConditionGroup,
  addConditionToGroup,
  removeCondition,
  removeConditionGroup,
} from './request-match-utils.js';
import { updateRuleModals } from './rule-forms.js';
import { addFingerprint } from './fingerprint-utils.js';
import { updateActionFields } from './action-utils.js';

// Make these functions globally accessible
window.addCondition = addCondition;
window.addConditionGroup = addConditionGroup;
window.addConditionToGroup = addConditionToGroup;
window.removeCondition = removeCondition;
window.removeConditionGroup = removeConditionGroup;
window.updateRuleModals = updateRuleModals;
window.addFingerprint = addFingerprint;
window.updateActionFields = updateActionFields;
