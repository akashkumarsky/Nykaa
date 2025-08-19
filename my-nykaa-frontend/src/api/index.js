const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const fetchWithAuth = async (endpoint, options = {}) => {
  const storedUser = localStorage.getItem('nykaaUser');
  const token = storedUser ? JSON.parse(storedUser).jwtToken : null;

  const headers = { ...options.headers };
  if (options.method === 'POST' || options.method === 'PUT') {
    headers['Content-Type'] = 'application/json';
  }

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

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  } else {
    return;
  }
};

export const api = {
  get: (endpoint) => fetchWithAuth(endpoint),
  post: (endpoint, body) =>
    fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) =>
    fetchWithAuth(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => fetchWithAuth(endpoint, { method: 'DELETE' }),

  // Categories
  getCategories: () => fetchWithAuth('/categories'),
  createCategory: (category) =>
    fetchWithAuth('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),
  updateCategory: (id, category) =>
    fetchWithAuth(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),
  deleteCategory: (id) =>
    fetchWithAuth(`/categories/${id}`, { method: 'DELETE' }),

  // Brands
  getBrands: () => fetchWithAuth('/brands'),
  createBrand: (brand) =>
    fetchWithAuth('/brands', {
      method: 'POST',
      body: JSON.stringify(brand),
    }),
  updateBrand: (id, brand) =>
    fetchWithAuth(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brand),
    }),
  deleteBrand: (id) => fetchWithAuth(`/brands/${id}`, { method: 'DELETE' }),
};
