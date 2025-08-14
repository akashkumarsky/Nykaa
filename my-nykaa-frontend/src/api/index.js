const API_BASE_URL = 'http://localhost:8081/api';

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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // FIXED: Check if the response has a JSON body before trying to parse it.
    // This makes the helper robust enough to handle responses with no content (e.g., 204 status).
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        // If there's no JSON, we don't return anything.
        return; 
    }
};

export const api = {
    get: (endpoint) => fetchWithAuth(endpoint),
    post: (endpoint, body) => fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body) => fetchWithAuth(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint) => fetchWithAuth(endpoint, { method: 'DELETE' }),
};