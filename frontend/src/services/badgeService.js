
const API_URL = 'http://localhost:8000/api';

export const getStudentBadges = async (studentId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/badges/student/${studentId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch badges');
    }
    return response.json();
};

export const evaluateBadges = async (gameSessionId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/badges/evaluate/${gameSessionId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to evaluate badges');
    }
    return response.json();
};
