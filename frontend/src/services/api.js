import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
});

// ---- Career APIs ----
export const fetchAllCareers = (params = {}) => API.get('/careers', { params });
export const fetchCareerById = (id) => API.get(`/careers/${id}`);
export const fetchCategories = () => API.get('/careers/categories/list');
export const fetchBranches = () => API.get('/careers/branches/list');
export const fetchCareersByBranch = (branch) => API.get(`/careers/branch/${branch}`);
export const compareCareers = (careerIds) => API.post('/careers/compare', { careerIds });

// ---- Quiz APIs ----
export const fetchQuizQuestions = () => API.get('/quiz/questions');
export const submitQuizAnswers = (answers) => API.post('/quiz/submit', answers);

export default API;
