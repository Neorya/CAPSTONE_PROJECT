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
