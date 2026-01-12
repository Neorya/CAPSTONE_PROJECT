import { API_BASE_URL, API_ENDPOINTS } from "./config";

const BASE_URL = `${API_BASE_URL}${API_ENDPOINTS.PHASE_ONE}`;
const token = localStorage.getItem('token');
const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem('token')}`
});

export async function getTests(student_id, game_id) {
    const response = await fetch(`${BASE_URL}/tests?student_id=${student_id}&game_id=${game_id}`, {
        headers: getHeaders(token)
    });
    return response.json();
}

export async function postStudentTest(studentId, gameId, testIn, testOut) {
    const response = await fetch(`${BASE_URL}/student_test`, {
        method: "POST",
        headers: getHeaders(localStorage.getItem('token')),
        body: JSON.stringify({
            student_id: 1,
            game_id: 1,
            test_in: testIn,
            test_out: testOut
        }),
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error data:", errorData);
        throw new Error(errorData.detail || "Errore salvataggio test");
    }
    
    return response.json();
}

export async function getStudentTests(studentId, game_id) {
    const response = await fetch(`${BASE_URL}/student_tests?game_id=${game_id}&student_id=${studentId}`, {
        headers: getHeaders(token)
    });
    return response.json();
}

export async function postSolution(studentId, game_id, code) {
    const response = await fetch(`${BASE_URL}/solution`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ student_id: studentId, game_id: game_id, code }),
    });
    return response.json();
}

export async function postCustomTest(studentId, game_id, code) {
    const response = await fetch(`${BASE_URL}/custom_test`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify({ 
            student_id: studentId, 
            game_id: game_id,
            code 
        }),
    });
    return response.json();
}

export async function getMatchDetails(gameId) {
    const response = await fetch(`${BASE_URL}/match_details?game_id=${gameId}`, { 
        headers: getHeaders(token)
    });
    console.log(response);
    return response.json();
}