import { useState, useEffect } from 'react';

// Mock data for development - will be replaced with API calls
const MOCK_SOLUTIONS = [
    {
        id: 'sol-1',
        participantId: 'User 2',
        code: `#include <iostream>
#include <vector>
#include <string>

// Student fills in this function
int solveInt N, const std::vector<int>& A) {
  // TODO: Implement your solution here
  int result = 0;
  return result;
}

int main() {
  // Automatic Input Handling
  int N;
  std::cin >> N;
  std::vector<int> A(N);
  for (int i = 0; i < N; ++i) {
    std::cin >> A[i];
  }

  // Call solve function
  int result = solve(N, A);

  // Automatic Output Handling
  std::cout << result << std::endl;
  return 0;
}`,
        timestamp: '2026-01-10T14:30:00Z'
    },
    {
        id: 'sol-2',
        participantId: 'User 3',
        code: `#include <iostream>
#include <vector>

int solve(int N, const std::vector<int>& A) {
  int sum = 0;
  for (int i = 0; i < N; i++) {
    sum += A[i];
  }
  return sum;
}

int main() {
  int N;
  std::cin >> N;
  std::vector<int> A(N);
  for (int i = 0; i < N; ++i) {
    std::cin >> A[i];
  }
  int result = solve(N, A);
  std::cout << result << std::endl;
  return 0;
}`,
        timestamp: '2026-01-10T14:28:00Z'
    },
    {
        id: 'sol-3',
        participantId: 'User 4',
        code: `#include <iostream>
#include <vector>

int solve(int N, const std::vector<int>& A) {
  return N * 2;
}

int main() {
  int N;
  std::cin >> N;
  std::vector<int> A(N);
  for (int i = 0; i < N; ++i) {
    std::cin >> A[i];
  }
  int result = solve(N, A);
  std::cout << result << std::endl;
  return 0;
}`,
        timestamp: '2026-01-10T14:25:00Z'
    },
    {
        id: 'sol-4',
        participantId: 'User 5',
        code: `#include <iostream>
#include <vector>

int solve(int N, const std::vector<int>& A) {
  int product = 1;
  for (int val : A) {
    product *= val;
  }
  return product;
}

int main() {
  int N;
  std::cin >> N;
  std::vector<int> A(N);
  for (int i = 0; i < N; ++i) {
    std::cin >> A[i];
  }
  int result = solve(N, A);
  std::cout << result << std::endl;
  return 0;
}`,
        timestamp: '2026-01-10T14:22:00Z'
    }
];

export const useSolutionReview = () => {
    const [solutions, setSolutions] = useState(MOCK_SOLUTIONS);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [votes, setVotes] = useState({});
    const [remainingTime, setRemainingTime] = useState('45:00');
    const [isPhaseEnded, setIsPhaseEnded] = useState(false);

    // Timer countdown
    useEffect(() => {
        // Mock: Phase 2 ends in 45 minutes from now
        const endTime = Date.now() + (45 * 60 * 1000);

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.max(0, endTime - now);

            if (diff === 0) {
                setIsPhaseEnded(true);
                clearInterval(interval);
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setRemainingTime(
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const selectSolution = (solutionId) => {
        const solution = solutions.find(s => s.id === solutionId);
        setSelectedSolution(solution);
    };

    const submitVote = (solutionId, voteType, testCase = null) => {
        // Update votes map
        setVotes(prev => ({
            ...prev,
            [solutionId]: { type: voteType, testCase }
        }));

        // Remove from solutions list (can't re-review)
        setSolutions(prev => prev.filter(s => s.id !== solutionId));

        // Clear selection
        setSelectedSolution(null);

        return true;
    };

    const getVoteStatus = (solutionId) => {
        return votes[solutionId]?.type || null;
    };

    return {
        solutions,
        selectedSolution,
        votes,
        remainingTime,
        isPhaseEnded,
        selectSolution,
        submitVote,
        getVoteStatus
    };
};
