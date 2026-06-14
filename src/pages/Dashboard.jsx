import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllExpenses, addExpense, deleteExpense } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0', '#4895ef'];

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await getAllExpenses();
            setExpenses(response.data);
        } catch (err) {
            setError('Failed to fetch expenses!');
        }
    };

    const handleAddExpense = async () => {
        if (!title || !amount || !category || !date) {
            setError('Please fill all required fields!');
            return;
        }
        try {
            await addExpense({ title, amount: parseFloat(amount), category, date, description });
            setSuccess('Expense added successfully!');
            setError('');
            setTitle('');
            setAmount('');
            setCategory('');
            setDate('');
            setDescription('');
            fetchExpenses();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to add expense!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            fetchExpenses();
        } catch (err) {
            setError('Failed to delete expense!');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Calculate total
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Pie chart data
    const categoryData = expenses.reduce((acc, exp) => {
        const existing = acc.find(item => item.name === exp.category);
        if (existing) {
            existing.value += exp.amount;
        } else {
            acc.push({ name: exp.category, value: exp.amount });
        }
        return acc;
    }, []);

    // Bar chart data
    const monthlyData = expenses.reduce((acc, exp) => {
        const month = new Date(exp.date).toLocaleString('default', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) {
            existing.amount += exp.amount;
        } else {
            acc.push({ month, amount: exp.amount });
        }
        return acc;
    }, []);

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.navTitle}>💰 Expense Tracker</h2>
                <div style={styles.navRight}>
                    <span style={styles.welcome}>Welcome, {username}!</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                {/* Summary Card */}
                <div style={styles.summaryCard}>
                    <h3 style={styles.summaryTitle}>Total Expenses</h3>
                    <h1 style={styles.summaryAmount}>₹{total.toFixed(2)}</h1>
                    <p style={styles.summaryCount}>{expenses.length} transactions</p>
                </div>

                {/* Add Expense Form */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Add New Expense</h3>

                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}

                    <div style={styles.formGrid}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Title *</label>
                            <input
                                placeholder="e.g. Grocery Shopping"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Amount (₹) *</label>
                            <input
                                type="number"
                                placeholder="e.g. 500"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Category *</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={styles.input}
                            >
                                <option value="">Select Category</option>
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Bills">Bills</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Health">Health</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Date *</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Description</label>
                            <input
                                placeholder="Optional description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>&nbsp;</label>
                            <button
                                onClick={handleAddExpense}
                                style={styles.addBtn}
                            >
                                + Add Expense
                            </button>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                {expenses.length > 0 && (
                    <div style={styles.chartsRow}>
                        {/* Pie Chart */}
                        <div style={styles.chartCard}>
                            <h3 style={styles.cardTitle}>Spending by Category</h3>
                            <PieChart width={300} height={250}>
                                <Pie
                                    data={categoryData}
                                    cx={150}
                                    cy={110}
                                    outerRadius={90}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value}`} />
                                <Legend />
                            </PieChart>
                        </div>

                        {/* Bar Chart */}
                        <div style={styles.chartCard}>
                            <h3 style={styles.cardTitle}>Monthly Spending</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value}`} />
                                    <Bar dataKey="amount" fill="#4361ee" radius={[5, 5, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Expense List */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>All Expenses</h3>
                    {expenses.length === 0 ? (
                        <p style={styles.noExpenses}>No expenses yet! Add your first expense above.</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.tableHeader}>
                                    <th style={styles.th}>Title</th>
                                    <th style={styles.th}>Amount</th>
                                    <th style={styles.th}>Category</th>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((exp) => (
                                    <tr key={exp.id} style={styles.tableRow}>
                                        <td style={styles.td}>{exp.title}</td>
                                        <td style={styles.td}>₹{exp.amount}</td>
                                        <td style={styles.td}>
                                            <span style={styles.badge}>{exp.category}</span>
                                        </td>
                                        <td style={styles.td}>{exp.date}</td>
                                        <td style={styles.td}>
                                            <button
                                                onClick={() => handleDelete(exp.id)}
                                                style={styles.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f0f2f5' },
    navbar: {
        backgroundColor: '#1a1a2e',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navTitle: { color: 'white', fontSize: '22px' },
    navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
    welcome: { color: '#ccc', fontSize: '14px' },
    logoutBtn: {
        backgroundColor: '#f72585',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
    },
    content: { padding: '30px', maxWidth: '1200px', margin: '0 auto' },
    summaryCard: {
        backgroundColor: '#4361ee',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '25px',
    },
    summaryTitle: { fontSize: '16px', opacity: 0.8, marginBottom: '10px' },
    summaryAmount: { fontSize: '48px', fontWeight: 'bold', marginBottom: '5px' },
    summaryCount: { opacity: 0.8 },
    card: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        marginBottom: '25px',
    },
    cardTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#1a1a2e' },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
    },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#555' },
    input: {
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '14px',
        outline: 'none',
    },
    addBtn: {
        padding: '10px',
        backgroundColor: '#4361ee',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        height: '40px',
        marginTop: '2px',
    },
    chartsRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
        marginBottom: '25px',
    },
    chartCard: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { backgroundColor: '#f8f9fa' },
    th: {
        padding: '12px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '700',
        color: '#555',
        borderBottom: '2px solid #eee',
    },
    tableRow: { borderBottom: '1px solid #f0f0f0' },
    td: { padding: '12px', fontSize: '14px', color: '#333' },
    badge: {
        backgroundColor: '#e8edff',
        color: '#4361ee',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    deleteBtn: {
        backgroundColor: '#ffe0e0',
        color: '#d00000',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '12px',
    },
    noExpenses: { textAlign: 'center', color: '#999', padding: '30px' },
    error: {
        backgroundColor: '#ffe0e0',
        color: '#d00000',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
    },
    success: {
        backgroundColor: '#e0ffe0',
        color: '#007700',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
    },
};

export default Dashboard;