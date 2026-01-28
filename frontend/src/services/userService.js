import { API_BASE_URL } from "./config";
import { getToken } from "./authService";

/**
 * Fetch current user profile information
 */
export const getUserProfile = async () => {
    const token = getToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user profile");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    const token = getToken(); // Use getToken() for consistency
    if (!token) throw new Error("No authentication token found."); // Handle missing token

    try {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, { // Use API_BASE_URL and /api/user/profile for consistency
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return await response.json(); // Await the json parsing
    } catch (error) {
        console.error("Error updating user profile:", error); // Specific error message
        throw error;
    }
};
