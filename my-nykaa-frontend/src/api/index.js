const API_BASE_URL = 'http://localhost:8081/api';

/**
 * A helper function for making authenticated API requests.
 * @param {string} endpoint - The API endpoint to call (e.g., '/orders').
 * @param {object} options - The options for the fetch request (method, body, etc.).
 * @returns {Promise<any>} - The JSON response from the API.
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const storedUser = localStorage.getItem('nykaaUser');
  const token = storedUser ? JSON.parse(storedUser).jwtToken : null;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: 'An unknown error occurred.' }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  // Handle responses that might not have a body (like a 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  } else {
    return; // No JSON body to parse
  }
};

export const api = {
  get: (endpoint) => fetchWithAuth(endpoint),
  post: (endpoint, body) =>
    fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    fetchWithAuth(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};
