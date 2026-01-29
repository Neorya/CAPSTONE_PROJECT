# Tutorial Teacher – Complete Guide for Teachers

## Introduction

Welcome to **Codify**, the gamified coding platform for teaching programming! This guide will walk you step by step through all the features available for teachers.

---

## Prerequisites

Before starting, make sure that:

* You have access to the URL: `http://localhost:3000`

---

## 1. Login as Teacher

### Step 1.1: Access the login page

1. Open your browser and go to `http://localhost:3000/login`
2. You will see the Codify login screen

### Step 1.2: Log in

**In development mode:**

1. Click the **" Login as Teacher (Dev)"** button in the "Developer Access" section
2. You will be automatically authenticated as a teacher and redirected to the Home page

---

## 2. Home Page – Teacher Dashboard

After logging in, you will see the home page with the following options:

| Card                    | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| **Create New Match**    | Create a new match based on an existing match setting |
| **Match Settings**      | Manage and view all match settings                    |
| **Create Game Session** | Create a new game session for students                |
| **View Game Sessions**  | View, edit, clone, or delete created sessions         |
| **Hall of Fame**        | View the student leaderboard                          |

---

## 3. Match Settings Management

### Step 3.1: View Match Settings

1. From the home page, click **"Match Settings"**
2. You will see the list of all available match settings with:

   * Title
   * Description
   * Status (Ready/Not Ready)
   * Available actions (edit, delete, etc.)

### Step 3.2: Create a new Match Setting (via database for now)

> Match settings define the algorithmic problem that students must solve, including the reference solution and test cases.

Match settings in the database include:

* **Title**: Problem name
* **Description**: Text of the problem to solve
* **Reference solution**: Code used to validate submissions
* **Test cases (public/private)**: Expected input and output

---

## 4. Creating a Match

### Step 4.1: Access match creation

1. From the home page, click **"Create New Match"**

### Step 4.2: Configure the match

1. **Select a Match Setting**: Choose from the list of available match settings (only those with status "Ready")
2. **Enter the Match title**: e.g. "Algorithms – Class 5A"
3. **Select the difficulty level**: From 1 (easy) to 10 (hard)
4. **Set the number of reviews**: How many solutions each student must review in Phase 2

### Step 4.3: Save the match

1. Click **"Create Match"**
2. If everything is correct, you will see a success message
3. The match is now ready to be used in a Game Session

---

## 5. Creating a Game Session

### Step 5.1: Access session creation

1. From the home page, click **"Create Game Session"**

### Step 5.2: Configure the game session

1. **Session name**: e.g. "Programming Competition – January 28, 2026"
2. **Start date and time**: Select when the session will become available
3. **Phase 1 duration** (minutes): Time to solve the algorithmic problem (e.g. 30–60 minutes)
4. **Phase 2 duration** (minutes): Time for the peer-to-peer review phase (e.g. 15–30 minutes)

### Step 5.3: Select the Matches

1. In the table of available matches, select one or more matches by checking the checkboxes
2. The selected matches will be included in the session

### Step 5.4: Create the session

1. Review the entered data
2. Click **"Create Session"**
3. A success message will confirm creation
4. You will be redirected to the session detail page

---

## 6. Game Session Management

### Step 6.1: View sessions

1. From the home page, click **"View Game Sessions"**
2. You will see the list of your sessions with:

   * Name
   * Start date
   * Status (scheduled, in progress, completed)
   * Number of enrolled students
   * Available actions

### Step 6.2: Start a session (Pre-Start)

1. Select a session from the list
2. Click **"View Details"**
3. On this page you can:

   * See the students who have enrolled
   * View the associated matches
   * **Start the session** when all students are ready

### Step 6.3: Monitor an ongoing session

1. Once the session has started, you will be taken to `/start-game-session/{id}`
2. You will see:

   * **Timer countdown**: Remaining time of the current phase
   * **Current phase**: Phase 1 (Coding) or Phase 2 (Review)
   * **Student list**: Who is participating
   * **Status**: Description of the ongoing activity

---

## 7. Hall of Fame (Leaderboard)

### Step 7.1: View the leaderboard

1. From the home page, click **"Hall of Fame"**
2. You will see the global leaderboard with:

   * Position
   * Student name
   * Total score

### Available features:

* Sorting by score
* Student search
* Various filters

---

## 8. Profile Management

1. Click the profile icon in the top right (or go to `/profile`)
2. View your information:

   * First and last name
   * Email
   * Role (Teacher)

---

## Final Notes

As a teacher, your main goals are:

1. **Prepare** educational content (match settings and matches)
2. **Organize** game sessions for your classes
3. **Monitor** the progress of competitions
4. **Evaluate** progress through the leaderboard

Good work with Codify!
