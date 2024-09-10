// config-loader.js
export async function loadConfiguration(apiEndpoint) {
  const response = await fetch(apiEndpoint);
  if (!response.ok) {
    throw new Error('Failed to load configuration');
  }
  return response.json();
}
