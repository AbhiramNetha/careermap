import axios from 'axios';
import { auth } from '../firebase';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
});

// Request interceptor to automatically attach authenticated Firebase UID
API.interceptors.request.use((config) => {
    const user = auth.currentUser;
    if (user) {
        config.headers['X-User-Uid'] = user.uid;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const fetchAllCareers = (params = {}) => API.get('/careers', { params });
export const fetchCareerById = (id) => API.get(`/careers/${id}`);
export const fetchCategories = () => API.get('/careers/categories/list');
export const fetchBranches = () => API.get('/careers/branches/list');
export const fetchCareersByBranch = (branch) => API.get(`/careers/branch/${branch}`);
export const compareCareers = (careerIds) => API.post('/careers/compare', { careerIds });

export const fetchQuizQuestions = () => API.get('/quiz/questions');
export const submitQuizAnswers = (answers) => API.post('/quiz/submit', answers);

// ATS Checker API
export const analyzeResume = (formData) => API.post('/ats/analyze', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

// Resume Builder APIs
export const fetchUserResumes = () => API.get('/resumes');
export const fetchResumeById = (id) => API.get(`/resumes/${id}`);
export const createResume = (resumeData) => API.post('/resumes', resumeData);
export const updateResume = (id, resumeData) => API.put(`/resumes/${id}`, resumeData);
export const deleteResume = (id) => API.delete(`/resumes/${id}`);

export default API;
