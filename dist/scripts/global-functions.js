// global-functions.js
import { addCondition } from './request-match-utils.js';
import { addFingerprint } from './fingerprint-utils.js';
import { updateActionFields } from './action-utils.js';

// Make these functions globally accessible
window.addCondition = addCondition;
window.addFingerprint = addFingerprint;
window.updateActionFields = updateActionFields;
