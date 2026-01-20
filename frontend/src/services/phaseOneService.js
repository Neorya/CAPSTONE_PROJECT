import { API_BASE_URL, API_ENDPOINTS } from "./config";

const BASE_URL = `${API_BASE_URL}${API_ENDPOINTS.PHASE_ONE}`;

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('token')}`
});

export async function getTests(student_id, game_id) {
    const response = await fetch(`${BASE_URL}/tests?student_id=${student_id}&game_id=${game_id}`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = new Error("Failed to fetch tests");
        error.status = response.status;
        throw error;
    }
    return response.json();
}

export async function postStudentTest(studentId, gameId, testIn, testOut) {
    const response = await fetch(`${BASE_URL}/student_test`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            student_id: studentId,
            game_id: gameId,
            test_in: testIn,
            test_out: testOut
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error data:", errorData);
        const error = new Error(errorData.detail || "Errore salvataggio test");
        error.status = response.status;
        throw error;
    }

    return response.json();
}

export async function getStudentTests(studentId, game_id) {
    const response = await fetch(`${BASE_URL}/student_tests?game_id=${game_id}&student_id=${studentId}`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = new Error("Failed to fetch student tests");
        error.status = response.status;
        throw error;
    }
    return response.json();
}

export async function deleteStudentTest(testId) {
    const response = await fetch(`${BASE_URL}/student_test/${testId}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.detail || "Error deleting test");
        error.status = response.status;
        throw error;
    }

    return response.json();
}

export async function postSolution(studentId, game_id, code) {
    const response = await fetch(`${BASE_URL}/solution`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ student_id: studentId, game_id: game_id, code }),
    });
    if (!response.ok) {
        const error = new Error("Failed to post solution");
        error.status = response.status;
        throw error;
    }
    return response.json();
}

export async function postCustomTest(studentId, game_id, code) {
    const response = await fetch(`${BASE_URL}/custom_test`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
            student_id: studentId,
            game_id: game_id,
            code
        }),
    });
    if (!response.ok) {
        const error = new Error("Failed to post custom test");
        error.status = response.status;
        throw error;
    }
    return response.json();
}

export async function getMatchDetails(gameId) {
    const response = await fetch(`${BASE_URL}/match_details?game_id=${gameId}`, {
        headers: getHeaders()
    });
    console.log(response);
    if (!response.ok) {
        const error = new Error("Failed to fetch match details");
        error.status = response.status;
        throw error;
    }
    return response.json();
}

export async function getStudentGameStatus() {
    const response = await fetch(`${BASE_URL}/student-game-status`, {
        headers: getHeaders()
    });
    if (!response.ok) {
        const error = new Error("Failed to fetch student game status");
        error.status = response.status;
        throw error;
    }
    return response.json();
}