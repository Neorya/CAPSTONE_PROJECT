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
| **Create Match Settings** | Design new coding problems with test cases and solutions |
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
   
   **You can also:**
   * **Filter** using the "Ready" / "Draft" / "All" buttons
   * **Search** for a settings by name using the search bar
   * **Sort** the list by clicking on the "Name" or "Status" column headers

### Step 3.2: Create a new Match Setting

> Match settings define the algorithmic problem that students must solve, including the reference solution and test cases.

**From the home page:**

1. Click **"Create Match Settings"**
2. You will be taken to the match settings creation form

**Configure the match setting:**

#### Match Details
1. **Title**: Give the problem a clear name
2. **Description**: Write the complete problem statement that students will see
3. **Reference Solution**: Provide the correct code solution in C++
4. **Student Code Template**: Optional starting code template for students
5. **Language**: Select the programming language (currently C++)

#### Test Cases
1. Add **Public Test Cases**: These are visible to students and help them understand the expected output
   * Input: Test input data
   * Output: Expected output
2. Add **Private Test Cases**: These are hidden from students and used for final evaluation
   * Input: Test input data
   * Output: Expected output

#### Professor Configuration
1. Define the **Function Signature**:
   * **Function Name**: The function students must implement (e.g. "fibonacci")
   * **Return Type**: Data type returned by the function (e.g., "int", "string")
   * **Function Inputs**: Define input parameters and their types
2. **Test the Match Setting**:
   * Click **"Try"** to compile and run your reference solution against the test cases
   * Verify all tests pass before publishing

#### Publishing
1. **Save as Draft**: Saves the match setting in draft status (can be edited later)
2. **Publish**: Makes the match setting "Ready" and available for creating matches
   * Once published, the status will show as "Ready"
   * Only ready match settings can be used in matches

**After creation:**

* Your new match setting will appear in the Match Settings list
* You can edit, clone, or delete draft settings
* Published settings can be viewed or cloned to create variations

---

## 4. Creating a Match

### Step 4.1: Access match creation

1. From the home page, click **"Create New Match"**

### Step 4.2: Configure the match

1. **Select a Match Setting**: Choose from the list of available match settings (only those with status "Ready"). You can use the search bar to find a specific setting by name, or use the sort button to reorder the list.
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

1. In the table of available matches, select one or more matches by checking the checkboxes. You can **search** for matches by name using the search input above the table or **sort** the table by clicking the "Name" header.
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
