--Create a schema : (User story 1)

CREATE SCHEMA capstone_app;





CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');

-- The creation of combined users table with OAuth support: (User Story 5 / Authentication)

DROP TABLE IF EXISTS capstone_app.users CASCADE;

CREATE TABLE capstone_app.users (
  id SERIAL PRIMARY KEY,
  google_sub VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  score INTEGER NOT NULL DEFAULT 0,
  profile_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT check_max_score CHECK (score <= 2000000)
);

-- The creation of refresh tokens table: (Authentication)

DROP TABLE IF EXISTS capstone_app.refresh_tokens CASCADE;

CREATE TABLE capstone_app.refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES capstone_app.users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for refresh_tokens for efficient lookups
CREATE INDEX idx_refresh_tokens_user_id ON capstone_app.refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON capstone_app.refresh_tokens(expires_at);


-- Creation of Teacher Table :  (User story 1)

DROP TABLE IF EXISTS capstone_app.teacher;

CREATE TABLE capstone_app.teacher (
    teacher_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
    -- login_fk    INTEGER REFERENCES capstone_app.login(login_id) NOT NULL
--    login_id   INTEGER REFERENCES capstone_app.login(login_id) NOT NULL  --- user story 5 for modification
);



-- Creation of Match Setting Table & fk match teacher: (User story 1)

DROP TABLE IF EXISTS capstone_app.match_setting;

CREATE TABLE capstone_app.match_setting (
    match_set_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    is_ready BOOLEAN NOT NULL DEFAULT FALSE,
    reference_solution VARCHAR(1000), -- this is the code solution
    
    creator_id INTEGER REFERENCES capstone_app.teacher(teacher_id)
);



CREATE TYPE test_scope AS ENUM ('private', 'public');

DROP TABLE IF EXISTS capstone_app.tests;

CREATE TABLE capstone_app.tests (
    test_id SERIAL PRIMARY KEY,
    test_in VARCHAR(500),
    test_out VARCHAR(500),
    scope test_scope NOT NULL,
  
    match_set_id INTEGER REFERENCES capstone_app.match_setting(match_set_id) NOT NULL
);



-- Creation of Match Table & fk match teacher and match setting:  (User story 2)

DROP TABLE IF EXISTS capstone_app.match;

CREATE TABLE capstone_app.match (
    match_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    match_set_id INTEGER REFERENCES capstone_app.match_setting(match_set_id),
    creator_id INTEGER REFERENCES capstone_app.teacher(teacher_id),
    difficulty_level INTEGER NOT NULL,
    review_number INTEGER NOT NULL
    
);



-- Creation of the game session table: (User story 3)

DROP TABLE IF EXISTS capstone_app.game_session;

CREATE TABLE capstone_app.game_session (
    game_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    duration_phase1 INTEGER NOT NULL,-- in minutes
    duration_phase2 INTEGER NOT NULL, -- in minutes
    creator_id INTEGER REFERENCES capstone_app.teacher(teacher_id) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);



-- The creation of relationship between match and game session (User story 3)

DROP TABLE IF EXISTS capstone_app.matches_for_game;

CREATE TABLE capstone_app.matches_for_game (
    match_for_game_id SERIAL PRIMARY KEY,

    match_id INTEGER REFERENCES capstone_app.match(match_id) NOT NULL,
    game_id  INTEGER REFERENCES capstone_app.game_session(game_id) NOT NULL,
    CONSTRAINT uc_matches_for_game UNIQUE (match_id, game_id)
);


-- The creation of students table: (User Story 5)

DROP TABLE IF EXISTS capstone_app.student;

CREATE TABLE capstone_app.student (
  student_id  SERIAL PRIMARY KEY,
  email       VARCHAR(150) UNIQUE NOT NULL,
  first_name  VARCHAR(100) NOT NULL,
  last_name   VARCHAR(100) NOT NULL,
  score       INTEGER NOT NULL DEFAULT 0,
  -- login_fk    INTEGER REFERENCES capstone_app.login(login_id) NOT NULL,
  CONSTRAINT check_max_score CHECK (score <= 2000000)
-- login_id INTEGER REFERENCES capstone_app.login(login_id)
);

DROP TABLE IF EXISTS capstone_app.student_tests;

CREATE TABLE capstone_app.student_tests (
    test_id SERIAL PRIMARY KEY,
    test_in VARCHAR(500),
    test_out VARCHAR(500),

    match_for_game_id INTEGER REFERENCES capstone_app.matches_for_game(match_for_game_id) NOT NULL,
    student_id INTEGER REFERENCES capstone_app.student(student_id) NOT NULL

);

DROP TABLE IF EXISTS capstone_app.student_solutions;

CREATE TABLE capstone_app.student_solutions (
    solution_id SERIAL PRIMARY KEY,
    code TEXT NOT NULL,
    has_passed BOOLEAN NOT NULL DEFAULT FALSE,

    match_for_game_id INTEGER REFERENCES capstone_app.matches_for_game(match_for_game_id) NOT NULL,
    student_id INTEGER REFERENCES capstone_app.student(student_id) NOT NULL

);



--- The creation of table for relationship between students and game session: (User Story 5)

DROP TABLE IF EXISTS capstone_app.student_join_game;

CREATE TABLE capstone_app.student_join_game (
  student_join_game_id SERIAL PRIMARY KEY, 
  student_id INTEGER REFERENCES capstone_app.student(student_id) ON DELETE CASCADE NOT NULL,
  game_id    INTEGER REFERENCES capstone_app.game_session(game_id) ON DELETE CASCADE NOT NULL,
  assigned_match_id INTEGER REFERENCES capstone_app.match(match_id),
  CONSTRAINT uc_student_game UNIQUE (student_id, game_id)
);
--Create a user for that schema: (User story 1)

-- 2. Create the API user (Replace 'changeme' with a strong password)
CREATE USER api_user WITH PASSWORD 'changeme';

-- 3. Grant connection rights to the database
GRANT CONNECT ON DATABASE changeme TO api_user;
GRANT USAGE ON SCHEMA capstone_app TO api_user;

-- 4. Grant SELECT, INSERT, UPDATE, DELETE permissions on tables for API user
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE  
capstone_app.users,
capstone_app.refresh_tokens,
capstone_app.teacher,
capstone_app.match_setting,
capstone_app.match,
capstone_app.game_session, 
capstone_app.matches_for_game
TO api_user;



-- Creation of some DB population script for populate the Teacher Table and the Match Settings Table (User story 1)



-- ######################################
-- INSERT DATA INTO USERS TABLE (18 RECORDS)
-- ######################################

INSERT INTO capstone_app.users (google_sub, email, first_name, last_name, role, score)
VALUES 
('100123456789012345678', 'student1@test.com', 'Alice', 'Anderson', 'student', 100),
('100987654321098765433', 'student2@test.com', 'Bob', 'Brown', 'student', 200),
('100987654321098765432', 'student3@test.com', 'Charlie', 'Clark', 'student', 300),
('100987654321098765434', 'student4@test.com', 'David', 'Davis', 'student', 400),
('100555444333222111000', 'student5@test.com', 'Eve', 'Evans', 'student', 500),
('100111222333444555666', 'teacher1@test.com', 'Frank', 'Foster', 'teacher', 0),
('100111222333444666666', 'teacher2@test.com', 'Grace', 'Green', 'teacher', 0),
('100777888999000111222', 'admin1@test.com', 'Hank', 'Harris', 'admin', 0),
('100777888999000155555', 'student6@test.com', 'Ivy', 'Irwin', 'student', 150),
('100333222111000999888', 'student7@test.com', 'Jack', 'Jones', 'student', 250),
('144443222111888899888', 'student8@test.com', 'Kevin', 'King', 'student', 350),
('144443266661000999899', 'student9@test.com', 'Laura', 'Lee', 'student', 450),
('100666777888999000111', 'student10@test.com', 'Mike', 'Miller', 'student', 550),
('133333222111000999888', 'teacher3@test.com', 'Nina', 'Nelson', 'teacher', 0),
('100222333444555666777', 'teacher4@test.com', 'Oscar', 'Owens', 'teacher', 0),
('100888999000111222333', 'admin2@test.com', 'Paul', 'Parker', 'admin', 0),
('100444555666777888999', 'student11@test.com', 'Quinn', 'Quick', 'student', 120),
('100101202303404505606', 'student12@test.com', 'Rachel', 'Ross', 'student', 220);

-- ######################################
-- INSERT DATA INTO TEACHER TABLE (5 RECORDS)
-- ######################################

-- Teacher 1
INSERT INTO capstone_app.teacher (first_name, last_name, email)
VALUES ('Marco', 'Rossi', 'm.rossi@capstone.it');

-- Teacher 2
INSERT INTO capstone_app.teacher (first_name, last_name, email)
VALUES ('Giulia', 'Verdi', 'g.verdi@capstone.it');

-- Teacher 3
INSERT INTO capstone_app.teacher (first_name, last_name, email)
VALUES ('Luca', 'Bianchi', 'l.bianchi@capstone.it');

-- Teacher 4
INSERT INTO capstone_app.teacher (first_name, last_name, email)
VALUES ('Anna', 'Neri', 'a.neri@capstone.it');

-- Teacher 5
INSERT INTO capstone_app.teacher (first_name, last_name, email)
VALUES ('Paolo', 'Gialli', 'p.gialli@capstone.it');



-- ######################################
-- INSERT DATA INTO MATCH_SETTING TABLE (10 RECORDS)
-- ######################################

-- Match Settings created by Teacher 1 (ID 1)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Standard Mode 1', 'Quick match, 5 rounds.', TRUE, 'def square(n): return n * n', 1),
('Advanced Algebra', '15-round math challenge.', TRUE, 'def add(x, y): return x + y', 1);

-- Match Settings created by Teacher 2 (ID 2)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('History Facts', 'Review of Roman Empire history.', FALSE, 'history = {"Julius Caesar": "44 BC", "Augustus": "27 BC"}', 2),
('Geography Quiz', 'Quiz on European capitals.', TRUE, 'capitals = {"France": "Paris", "Germany": "Berlin"}', 2);

-- Match Settings created by Teacher 3 (ID 3)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Science Fundamentals', 'Basics of Physics.', TRUE, 'def calculate_force(mass, acceleration): return mass * acceleration', 3),
('Chemistry Equations', 'Balancing basic equations.', FALSE, 'def balance_equation(reactants): return "2H2O" if "H2+O2" in reactants else "CO2"', 3);

-- Match Settings created by Teacher 4 (ID 4)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Literature Review 1', '19th Century English novels.', TRUE, 'authors = {"Pride and Prejudice": "Jane Austen", "Wuthering Heights": "Emily Brontë"}', 4),
('Grammar Practice', 'Advanced Italian grammar.', TRUE, 'def get_tense(verb): return "presente indicativo" if "mangio" in verb else "passato prossimo"', 4);

-- Match Settings created by Teacher 5 (ID 5)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Coding Basics', 'Introduction to Python syntax.', TRUE, 'def sum_numbers(*args): return sum(args)', 5),
('Data Structures Review', 'Review of linked lists and trees.', FALSE, 'class Node: def __init__(self, data): self.data = data; self.next = None', 5);

-- ######################################
-- INSERT DATA INTO TESTS TABLE (Derived from old match_setting fields)
-- ######################################

-- Match Setting 1
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('5', '25', 'public', 1),
('10', '100', 'private', 1);

-- Match Setting 2
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('x=3 y=4', '7', 'public', 2),
('x=7 y=9', '16', 'private', 2);

-- Match Setting 3
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('Julius Caesar', '44 BC', 'public', 3),
('Augustus', '27 BC', 'private', 3);

-- Match Setting 4
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('France', 'Paris', 'public', 4),
('Germany', 'Berlin', 'private', 4);

-- Match Setting 5
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('mass=10kg acceleration=2m/s²', 'Force=20N', 'public', 5),
('mass=5kg acceleration=9.8m/s²', 'Force=49N', 'private', 5);

-- Match Setting 6
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('H2+O2', '2H2O', 'public', 6),
('C+O2', 'CO2', 'private', 6);

-- Match Setting 7
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('Pride and Prejudice', 'Jane Austen', 'public', 7),
('Wuthering Heights', 'Emily Brontë', 'private', 7);

-- Match Setting 8
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('io mangio', 'presente indicativo', 'public', 8),
('io ho mangiato', 'passato prossimo', 'private', 8);

-- Match Setting 9
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('1 2 3', '6', 'public', 9),
('5 10 15', '30', 'private', 9);

-- Match Setting 10
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id) VALUES
('1 2 3', 'Linked List', 'public', 10),
('4 5 6', 'Binary Tree', 'private', 10);


-- The Creation of Populate script for the Match table (User story 2)

-- ######################################
-- INSERT DATA INTO MATCH TABLE (10 RECORDS)
-- ######################################

INSERT INTO capstone_app.match (title, match_set_id, creator_id, difficulty_level, review_number)
VALUES
('Standard Match - Class 5A', 1, 1, 1, 5),
('Standard Match - Class 5B', 1, 1, 1, 5),
('Functions Lab - Group 1', 4, 2, 4, 3),
('Functions Lab - Group 2', 4, 2, 4, 3),
('Variable Declarations - Section A', 5, 3, 3, 4),
('Variable Declarations - Section B', 5, 3, 3, 4),
('If Statement - Group 1', 8, 4, 5, 3),
('If Statement - Group 2', 8, 4, 5, 3),
('Pointers Basics - Section A', 9, 5, 8, 3),
('Pointers Basics - Section B', 9, 5, 8, 3);



-- Populate script (user story 3)

-- ######################################
-- INSERT DATA INTO GAME_SESSION TABLE (5 RECORDS)
-- ######################################

INSERT INTO capstone_app.game_session (name, start_date, duration_phase1, duration_phase2, creator_id, is_active)
VALUES
('Spring Semester Game Session', '2025-12-19 19:00:00.000', 45, 30, 1, TRUE),
('Summer Workshop Session', '2028-01-16 10:30:00', 60, 60, 2, FALSE),
('Fall Competition Session', '2028-01-17 14:00:00', 20, 15, 3, TRUE),
('Winter Training Session', '2028-01-18 11:00:00', 30, 30, 4, FALSE),
('Annual Championship Session', '2028-01-19 15:30:00', 90, 45, 5, FALSE);


-- ######################################
-- INSERT DATA INTO MATCHES_FOR_GAME TABLE (10 RECORDS)
-- ######################################

INSERT INTO capstone_app.matches_for_game (match_id, game_id)
VALUES
-- Game Session 1 - Teacher 1
(1, 1),
(2, 1),

-- Game Session 2 - Teacher 2
(3, 2),
(4, 2),

-- Game Session 3 - Teacher 3
(5, 3),
(6, 3),

-- Game Session 4 - Teacher 4
(7, 4),
(8, 4),

-- Game Session 5 - Teacher 5
(9, 5),
(10, 5);



-- Populate script (user story 5)

-- ######################################
-- INSERT DATA INTO STUDENT TABLE (5 RECORDS)
-- ######################################


-- student 1: Mario Rossi

INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('mario.rossi@studenti.it', 'Mario', 'Rossi', 95);

-- student 2: Sara Bianchi
INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('sara.bianchi@studenti.it', 'Sara', 'Bianchi', 78);

-- student 3: Andrea Verdi 
INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('andrea.verdi@studenti.it', 'Andrea', 'Verdi', 55);

-- student 4: Chiara Neri 
INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('chiara.neri@studenti.it', 'Chiara', 'Neri', 88);

-- student 5: Luca Gialli
INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('luca.gialli@studenti.it', 'Luca', 'Gialli', 62);

-- student 6: Elena Ferri
INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('elena.ferri@studenti.it', 'Elena', 'Ferri', 72);

-- student 7: Marco Conti
INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('marco.conti@studenti.it', 'Marco', 'Conti', 81);

-- student 8: Giulia Romano
INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('giulia.romano@studenti.it', 'Giulia', 'Romano', 90);

-- student 9: Francesco Marino
INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('francesco.marino@studenti.it', 'Francesco', 'Marino', 67);

-- student 10: Alessia Costa
INSERT INTO capstone_app.student (email, first_name, last_name, score)
VALUES ('alessia.costa@studenti.it', 'Alessia', 'Costa', 85);



-- ######################################
-- INSERT DATA INTO STUDENT_JOIN_GAME TABLE (User Story 3/5)
-- ######################################

-- Students joining Game Session 1 (Spring Semester - has 2 matches)
INSERT INTO capstone_app.student_join_game (student_id, game_id, assigned_match_id)
VALUES 
(1, 1, NULL),
(2, 1, NULL),
(3, 1, NULL),
(4, 1, NULL),
(5, 1, NULL);

-- Students joining Game Session 2 (Summer Workshop - has 2 matches)
INSERT INTO capstone_app.student_join_game (student_id, game_id, assigned_match_id)
VALUES 
(1, 2, NULL),
(3, 2, NULL),
(5, 2, NULL),
(6, 2, NULL),
(7, 2, NULL),
(8, 2, NULL);

-- Students joining Game Session 3 (Fall Competition - ACTIVE, has 2 matches, students already assigned)
INSERT INTO capstone_app.student_join_game (student_id, game_id, assigned_match_id)
VALUES 
(2, 3, 5),
(4, 3, 6),
(6, 3, 5),
(8, 3, 6),
(9, 3, 5),
(10, 3, 6);

-- Students joining Game Session 4 (Winter Training - has 2 matches)
INSERT INTO capstone_app.student_join_game (student_id, game_id, assigned_match_id)
VALUES 
(1, 4, NULL),
(2, 4, NULL),
(7, 4, NULL),
(9, 4, NULL);

-- Students joining Game Session 5 (Annual Championship - has 2 matches)
INSERT INTO capstone_app.student_join_game (student_id, game_id, assigned_match_id)
VALUES 
(3, 5, NULL),
(4, 5, NULL),
(5, 5, NULL),
(6, 5, NULL),
(7, 5, NULL),
(8, 5, NULL),
(9, 5, NULL),
(10, 5, NULL);


-- ######################################
-- INSERT DATA INTO STUDENT_TESTS TABLE (Example Data)
-- ######################################

-- Student 1 (Alice) tests for Match_For_Game 1 (Match 1 in Game 1)
INSERT INTO capstone_app.student_tests (test_in, test_out, match_for_game_id, student_id) VALUES
('square(2)', '4', 1, 1),
('square(3)', '9', 1, 1);

-- Student 2 (Bob) tests for Match_For_Game 1
INSERT INTO capstone_app.student_tests (test_in, test_out, match_for_game_id, student_id) VALUES
('square(-1)', '1', 1, 2);

-- Student 3 (Charlie) tests for Match_For_Game 5 (Match 5 in Game 3)
INSERT INTO capstone_app.student_tests (test_in, test_out, match_for_game_id, student_id) VALUES
('mass=1, acc=1', '1', 5, 3);


-- ######################################
-- INSERT DATA INTO STUDENT_SOLUTIONS TABLE (Example Data)
-- ######################################

-- Student 1 (Alice) submits a correct solution for Match_For_Game 1
INSERT INTO capstone_app.student_solutions (code, has_passed, match_for_game_id, student_id) VALUES
('def square(n): return n * n', TRUE, 1, 1);

-- Student 2 (Bob) submits an incorrect solution for Match_For_Game 1
INSERT INTO capstone_app.student_solutions (code, has_passed, match_for_game_id, student_id) VALUES
('def square(n): return n + n', FALSE, 1, 2);

-- Student 3 (Charlie) submits a correct solution for Match_For_Game 5
INSERT INTO capstone_app.student_solutions (code, has_passed, match_for_game_id, student_id) VALUES
('def calculate_force(m, a): return m * a', TRUE, 5, 3);

