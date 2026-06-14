import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Auth APIs
export const registerUser = (data) =>
    axios.post(`${BASE_URL}/api/auth/register`, data);

export const loginUser = (data) =>
    axios.post(`${BASE_URL}/api/auth/login`, data);

// Expense APIs
export const addExpense = (data) =>
    axios.post(`${BASE_URL}/api/expenses`, data, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const getAllExpenses = () =>
    axios.get(`${BASE_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const deleteExpense = (id) =>
    axios.delete(`${BASE_URL}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

export const getExpensesByCategory = (category) =>
    axios.get(`${BASE_URL}/api/expenses/category/${category}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });