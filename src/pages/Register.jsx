import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await registerUser({ username, email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('email', response.data.email);
            navigate('/dashboard');
        } catch (err) {
            setError('Registration failed! Email or username already exists.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>💰 Expense Tracker</h2>
                <h4 style={styles.subtitle}>Create your account</h4>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <button
                        onClick={handleRegister}
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>

                    <p style={styles.loginText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f2f5',
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        textAlign: 'center',
        color: '#1a1a2e',
        fontSize: '28px',
        marginBottom: '5px',
    },
    subtitle: {
        textAlign: 'center',
        color: '#666',
        marginBottom: '25px',
        fontWeight: 'normal',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    label: {
        color: '#333',
        fontWeight: '600',
        fontSize: '14px',
    },
    input: {
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '15px',
        outline: 'none',
    },
    button: {
        padding: '12px',
        backgroundColor: '#4361ee',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px',
    },
    error: {
        backgroundColor: '#ffe0e0',
        color: '#d00000',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '10px',
        textAlign: 'center',
    },
    loginText: {
        textAlign: 'center',
        color: '#666',
    },
    link: {
        color: '#4361ee',
        textDecoration: 'none',
        fontWeight: '600',
    },
};

export default Register;