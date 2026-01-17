import { API_BASE_URL, API_ENDPOINTS } from "./config";

const BASE_URL = `${API_BASE_URL}${API_ENDPOINTS.PHASE_TWO}`;

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('token')}`
});

export async function getAssignSolution(gameId) {
    const response = await fetch(`${BASE_URL}/assigned_solutions?game_id=${gameId}`, {
        headers: getHeaders()
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error data:", errorData);
        const error = new Error(errorData.detail || "Error fetching assigned solutions");
        error.status = response.status;
        throw error;
    }

    return response.json();
}


export async function postStudentVote (student_assigned_review_id, vote, proof_test_in = null, proof_test_out = null, note = null) {
    const response = await fetch(`${BASE_URL}/vote`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            student_assigned_review_id: student_assigned_review_id,
            vote: vote,
            proof_test_in: proof_test_in,
            proof_test_out: proof_test_out,
            note: note
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error data:", errorData);
        const error = new Error(errorData.detail || "Error fetching assigned solutions");
        error.status = response.status;
        throw error;
    }

    return response.json();
}
