# Tutorial Student – Complete Guide for Students

## Introduction

Welcome to **Codify**, the gamified coding platform! This guide will walk you through all the features to participate in programming competitions and improve your skills.

---

## Prerequisites

Before starting, make sure that:

* You have access to the URL: `http://localhost:3000`
* Your teacher has created an available Game Session

---

## 1. Login as Student

### Step 1.1: Access the login page

1. Open your browser and go to `http://localhost:3000/login`
2. You will see the Codify login screen with the logo and the slogan "Master the Code. Dominate the Leaderboard."

### Step 1.2: Log in

**In development mode:**

1. Scroll down to the "Developer Access (DEV MODE ONLY)" section
2. Click the **" Login as Student (Dev)"** button
3. You will be automatically authenticated as a student and redirected to the Home page

---

## 2. Home Page – Student Dashboard

After logging in, you will see the home page with the following options:

| Card                   | Color | Description                                    |
| ---------------------- | ----- | ---------------------------------------------- |
| **Join Game Sessions** | Pink  | Join available game sessions                   |
| **Lobby**              | Cyan  | View the lobby of the game you are enrolled in |
| **Hall of Fame**       | Gold  | View the global leaderboard                    |

---

## 3. Joining a Game Session

### Step 3.1: Find available sessions

1. From the home page, click **"Join Game Sessions"**
2. The page will show:

   * **Available session**: If there is an open session, you will see its details
   * **No session**: If there are no sessions, you will see "No sessions are currently open. Check back soon!"

### Step 3.2: Join a session

1. If there is an available session, you will see a card with:

   * Session name
   * Start date and time
   * Action button
2. Click **"Join"** to enroll
3. A "Joined successfully!" message will confirm the enrollment
4. You will be automatically redirected to the **Lobby**

### Step 3.3: Already enrolled?

If you have already enrolled, the button will show **"Enter Lobby"**, and clicking it will take you directly into the lobby.

---

## 4. The Lobby – Waiting Room

### What you will see in the Lobby

1. Title: "Lobby"
2. Subtitle: "Waiting for the game to start..."
3. A loading indicator while the system checks whether the game has started

### What happens?

* The page automatically checks every 2 seconds whether the teacher has started the session
* When the game starts, you will see the message **"Game session has started!"**
* You will be automatically redirected to **Phase 1** of the game

### Important note

**Do not close or refresh the page** while you are in the lobby! You would lose the connection and need to rejoin.

---

## 5. Phase 1 – Coding Challenge

### Step 5.1: Phase 1 interface

When the game starts, you will see a screen divided into two panels:

**Left Panel:**

* "Problem Description" tab: Description of the problem to solve
* "Tests (Public & Mine)" tab: List of test cases

**Right Panel:**

* Code editor
* Language selector
* Run buttons
* Output area

**At the top:**

* Countdown timer with remaining time

### Step 5.2: Read the problem

1. In the "Problem Description" tab, carefully read:

   * The problem **title**
   * The full **description** with requirements
   * **Examples** of input/output (if present)

### Step 5.3: Analyze the test cases

1. Switch to the "Tests (Public & Mine)" tab
2. You will see:

   * **Public tests**: Provided by the teacher, use them to verify your solution
   * **Your tests**: Tests you can create yourself

### Step 5.4: Write the solution

1. In the right panel, write your code in the editor
2. Use the selector to choose the language (if multiple options are available)
3. The code is saved automatically

### Step 5.5: Run the tests

1. Click **"Run Public Tests"** to run the teacher’s public tests
2. In the output you will see:

   * Passed tests (green)
   * Failed tests (red) with error details
3. Fix the code and repeat until all tests pass

### Step 5.6: Add custom tests (Optional but recommended!)

1. Click **"Add Test"** in the tests tab
2. Enter:

   * **Input**: The test input data
   * **Expected Output**: The expected output
3. Click **"Add"** to save
4. Use **"Run Custom Tests"** to run your tests

### Step 5.7: Submit the solution

* Your solution is **automatically saved** while you write
* When the timer reaches 00:00, Phase 1 ends automatically
* Your last solution will be the one evaluated

---

## 6. Phase 2 – Peer Review

### Step 6.1: Transition to Phase 2

* When Phase 1 ends, you will be automatically redirected to the review page
* You will see a new screen with a two-column layout

### Step 6.2: Review interface

**Left Panel:**

* List of solutions to review
* Countdown timer for Phase 2
* Icon to expand/collapse the panel

**Right Panel:**

* Code of the selected solution
* Voting options
* Test case form (if needed)
* Additional notes

### Step 6.3: Select a solution

1. In the left panel, click one of the assigned solutions
2. The code will appear in the right panel

### Step 6.4: Evaluate the solution

You have three voting options:

#### Option A: Correct

If you think the solution is correct:

1. Select **"Correct"**
2. (Optional) Add a note
3. Click **"Submit Vote"**

#### Option B: Incorrect

If you find an error in the solution:

1. Select **"Incorrect"**
2. **You must provide a test case** that makes the solution fail:

   * **Input**: The input data that causes the error
   * **Expected Output**: The correct output that the solution does not produce
3. (Optional) Add a note explaining the error found
4. Click **"Submit Vote"**

#### Option C: Skip

If you are unable to evaluate the solution:

1. Select **"Skip"**
2. (Optional) Add a note
3. Click **"Submit Vote"**

### Step 6.5: Continue with other solutions

1. After voting, the solution will be marked as completed
2. Move on to the next solution in the list
3. Continue until all assigned solutions are reviewed or time runs out

### Step 6.6: End of Phase 2

* When the timer reaches 00:00, you will see a **"Phase Ended"** overlay
* You will no longer be able to submit votes
* Scores will be calculated

---

## 7. Hall of Fame – Leaderboard

### Step 7.1: Access the leaderboard

1. From the home page, click **"Hall of Fame"**
2. Or go directly to `/hall-of-fame`

### Step 7.2: What you will see

* **Global leaderboard** of all students
* For each student:

  * Position
  * Full name
  * Total score

### Step 7.3: Find your name

* Use the search function to find yourself or your classmates
* Sort the leaderboard by score

---

## 8. Profile Management

### Step 8.1: Access the profile

1. Click the profile icon in the navbar (top right)
2. Or go directly to `/profile`

### Step 8.2: View your information

* First and last name
* Email
* Role (Student)
* Optional profile picture (from Google)

---

## Final Notes

As a student, your main goals are:

1. **Solve** algorithmic challenges effectively
2. **Collaborate** through peer review
3. **Improve** your skills over time
4. **Compete** for the top positions on the leaderboard

**Master the Code. Dominate the Leaderboard.**
