// Mock data for Match Settings
export const mockMatchSettings = [
  {
    id: 1,
    name: 'Java Basics Quiz',
    status: 'Ready',
    description: 'Basic Java programming concepts',
    createdBy: 'Prof. Smith',
    createdAt: '2025-01-15',
  },
  {
    id: 2,
    name: 'Advanced OOP Concepts',
    status: 'Ready',
    description: 'Object-oriented programming advanced topics',
    createdBy: 'Prof. Johnson',
    createdAt: '2025-01-20',
  },
  {
    id: 3,
    name: 'Data Structures Practice',
    status: 'Draft',
    description: 'Arrays, LinkedLists, Trees, and Graphs',
    createdBy: 'Prof. Smith',
    createdAt: '2025-02-01',
  },
  {
    id: 4,
    name: 'Database Design Fundamentals',
    status: 'Ready',
    description: 'SQL and database normalization',
    createdBy: 'Prof. Williams',
    createdAt: '2025-01-25',
  },
  {
    id: 5,
    name: 'Web Development Basics',
    status: 'Draft',
    description: 'HTML, CSS, and JavaScript fundamentals',
    createdBy: 'Prof. Johnson',
    createdAt: '2025-02-05',
  },
  {
    id: 6,
    name: 'Algorithm Design Patterns',
    status: 'Ready',
    description: 'Common algorithm patterns and techniques',
    createdBy: 'Prof. Smith',
    createdAt: '2025-01-30',
  },
];

// Mock data for Matches
export const mockMatches = [
  {
    id: 101,
    matchSettingId: 1,
    matchSettingName: 'Java Basics Quiz',
    difficultyLevel: 'Easy',
    reviewNumber: 4,
    durationFirstPhase: 15,
    durationSecondPhase: 10,
    status: 'Pending',
    createdAt: '2025-02-08',
  },
  {
    id: 102,
    matchSettingId: 2,
    matchSettingName: 'Advanced OOP Concepts',
    difficultyLevel: 'Hard',
    reviewNumber: 5,
    durationFirstPhase: 20,
    durationSecondPhase: 15,
    status: 'Completed',
    createdAt: '2025-02-07',
  },
  {
    id: 103,
    matchSettingId: 4,
    matchSettingName: 'Database Design Fundamentals',
    difficultyLevel: 'Medium',
    reviewNumber: 4,
    durationFirstPhase: 18,
    durationSecondPhase: 12,
    status: 'In Progress',
    createdAt: '2025-02-09',
  },
];

// Mock API functions
export const fetchReadyMatchSettings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const readySettings = mockMatchSettings.filter(
        setting => setting.status === 'Ready'
      );
      resolve({
        status: 200,
        data: readySettings,
      });
    }, 300);
  });
};

export const createMatch = (matchData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!matchData.matchSettingId) {
        reject({
          status: 400,
          message: 'Match setting is required',
        });
      } else {
        const newMatch = {
          id: Math.floor(Math.random() * 10000) + 1000,
          ...matchData,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };
        resolve({
          status: 201,
          data: newMatch,
        });
      }
    }, 500);
  });
};

