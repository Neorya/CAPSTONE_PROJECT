import { API_BASE_URL } from "./config";
import { getToken } from "./authService";

/**
 * Fetch all users (admin only)
 */
export const getUsers = async () => {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "GET",
        headers,
    });

    if (!response.ok) {
        if (response.status === 403) {
            throw new Error("You are not authorized to view this page.");
        }
        throw new Error("Failed to fetch users");
    }

    return await response.json();
};

/**
 * Promote a user to teacher
 * @param {number} userId 
 */
export const promoteUserToTeacher = async (userId) => {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/promote/teacher`, {
        method: "POST",
        headers,
        body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
        throw new Error("Promotion failed");
    }

    return true;
};

/**
 * Demote a user to student
 * @param {number} userId 
 */
export const demoteUserToStudent = async (userId) => {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/demote/student`, {
        method: "POST",
        headers,
        body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
        throw new Error("Demotion failed");
    }

    return true;
};
