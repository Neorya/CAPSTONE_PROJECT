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
    email VARCHAR(150) UNIQUE NOT NULL,
    user_id INTEGER NOT NULl REFERENCES capstone_app.users(id) ON DELETE CASCADE ON UPDATE CASCADE
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
    reference_solution TEXT NOT NULL, 
    student_code TEXT, 
    function_name VARCHAR(100), 
    function_type VARCHAR(50) DEFAULT 'output', 
    function_inputs TEXT, 
    language VARCHAR(20) NOT NULL DEFAULT 'cpp',
    total_points INTEGER NOT NULL DEFAULT 100, 
    
    creator_id INTEGER REFERENCES capstone_app.teacher(teacher_id)
);



CREATE TYPE capstone_app.test_scope AS ENUM ('private', 'public');

DROP TABLE IF EXISTS capstone_app.tests;

CREATE TABLE capstone_app.tests (
    test_id SERIAL PRIMARY KEY,
    test_in VARCHAR(500),
    test_out VARCHAR(500),
    scope capstone_app.test_scope NOT NULL,
  
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
    review_number INTEGER NOT NULL,
    duration_phase1 INTEGER NOT NULL DEFAULT 0,  -- in minutes
    duration_phase2 INTEGER NOT NULL DEFAULT 0   -- in minutes
    
);



-- Creation of the game session table: (User story 3)

DROP TABLE IF EXISTS capstone_app.game_session;

CREATE TABLE capstone_app.game_session (
    game_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    actual_start_date TIMESTAMPTZ,
    duration_phase1 INTEGER NOT NULL,-- in minutes
    duration_phase2 INTEGER NOT NULL, -- in minutes
    creator_id INTEGER REFERENCES capstone_app.teacher(teacher_id) NOT NULL
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
  score       INTEGER NOT NULL DEFAULT 0,  -- login_fk    INTEGER REFERENCES capstone_app.login(login_id) NOT NULL,
  user_id     INTEGER NOT NULl REFERENCES capstone_app.users(id) ON DELETE CASCADE ON UPDATE CASCADE,
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
    passed_test INTEGER DEFAULT 0,
    match_for_game_id INTEGER REFERENCES capstone_app.matches_for_game(match_for_game_id) NOT NULL,
    student_id INTEGER REFERENCES capstone_app.student(student_id) NOT NULL
);

DROP TABLE IF EXISTS capstone_app.student_solution_tests;

CREATE TABLE capstone_app.student_solution_tests (
  student_solution_test_id SERIAL PRIMARY KEY,
  solution_id INTEGER REFERENCES capstone_app.student_solutions(solution_id) NOT NULL,
  teacher_test_id INTEGER REFERENCES capstone_app.tests(test_id),
  student_test_id INTEGER REFERENCES capstone_app.student_tests(test_id),
  test_output TEXT NOT NULL
);

--- The creation of table for relationship between students and game session: (User Story 5)

DROP TABLE IF EXISTS capstone_app.student_join_game;

CREATE TABLE capstone_app.student_join_game (
  student_join_game_id SERIAL PRIMARY KEY, 
  student_id INTEGER REFERENCES capstone_app.student(student_id) ON DELETE CASCADE NOT NULL,
  game_id    INTEGER REFERENCES capstone_app.game_session(game_id) ON DELETE CASCADE NOT NULL,
  assigned_match_id INTEGER REFERENCES capstone_app.match(match_id),
  session_score NUMERIC(10, 2) DEFAULT NULL,
  CONSTRAINT uc_student_game UNIQUE (student_id, game_id)
);



DROP TABLE IF EXISTS capstone_app.student_assigned_review;

CREATE TABLE capstone_app.student_assigned_review (
    student_assigned_review_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES capstone_app.student(student_id) NOT NULL,
    assigned_solution_id INTEGER REFERENCES capstone_app.student_solutions(solution_id) NOT NULL,
    CONSTRAINT uq_student_assigned_review_pair UNIQUE (student_id, assigned_solution_id)
);


CREATE TYPE capstone_app.vote AS ENUM ('correct', 'incorrect', 'skip');

DROP TABLE IF EXISTS capstone_app.student_review_vote;

CREATE TABLE capstone_app.student_review_vote (
    review_vote_id SERIAL PRIMARY KEY,
    student_assigned_review_id INTEGER REFERENCES capstone_app.student_assigned_review(student_assigned_review_id) NOT NULL,
    vote capstone_app.vote NOT NULL,
    proof_test_in VARCHAR(500) DEFAULT NULL,
    proof_test_out VARCHAR(500) DEFAULT NULL,
    valid BOOLEAN DEFAULT NULL,
    note TEXT DEFAULT NULL,
    CONSTRAINT uq_student_review_vote_assignment UNIQUE (student_assigned_review_id)
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
capstone_app.tests,
capstone_app.match,
capstone_app.game_session, 
capstone_app.matches_for_game,
capstone_app.student,
capstone_app.student_tests,
capstone_app.student_join_game,
capstone_app.student_solutions,
capstone_app.student_solution_tests,
capstone_app.student_assigned_review,
capstone_app.student_review_vote
TO api_user;


CREATE OR REPLACE FUNCTION capstone_app.distribute_user_by_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'student' THEN
        -- Messaggio di log per lo studente
        RAISE NOTICE 'Path preso: STUDENT. Inserimento di % % nel database studenti.', NEW.first_name, NEW.last_name;
        
        INSERT INTO capstone_app.student (student_id, email, first_name, last_name, user_id)
        VALUES (NEW.id, NEW.email, NEW.first_name, NEW.last_name, NEW.id);
        
    ELSIF NEW.role = 'teacher' THEN
        -- Messaggio di log per l'insegnante
        RAISE NOTICE 'Path preso: TEACHER. Inserimento di % % nel database insegnanti.', NEW.first_name, NEW.last_name;
        
        INSERT INTO capstone_app.teacher (teacher_id, email, first_name, last_name, user_id)
        VALUES (NEW.id, NEW.email, NEW.first_name, NEW.last_name, NEW.id);
        
    ELSE
        -- Opzionale: log per ruoli che non finiscono in nessuna delle due tabelle (es. admin)
        RAISE NOTICE 'Path preso: NESSUNO. Il ruolo % non richiede inserimenti extra.', NEW.role;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_distribute_user
AFTER INSERT ON capstone_app.users
FOR EACH ROW
EXECUTE FUNCTION capstone_app.distribute_user_by_role();

-- Creation of some DB population script for populate the Teacher Table and the Match Settings Table (User story 1)



-- ######################################
-- INSERT DATA INTO USERS TABLE (18 RECORDS)
-- ######################################

INSERT INTO capstone_app.users (google_sub, email, first_name, last_name, role, score)
VALUES 
('100000000000000000001', 'student13@test.com', 'Sam', 'Smith', 'student', 180),
('100000000000000000002', 'student14@test.com', 'Tina', 'Taylor', 'student', 280),
('100000000000000000003', 'student15@test.com', 'Uma', 'Underwood', 'student', 380),
('100000000000000000004', 'student16@test.com', 'Victor', 'Vance', 'student', 480),
('100000000000000000005', 'student17@test.com', 'Wendy', 'White', 'student', 580),
('100000000000000000006', 'student18@test.com', 'Xavier', 'Xylos', 'student', 110),
('100000000000000000007', 'student19@test.com', 'Yara', 'Young', 'student', 210),
('100000000000000000008', 'student20@test.com', 'Zane', 'Zeller', 'student', 310),
('100000000000000000009', 'teacher5@test.com', 'Amy', 'Adams', 'teacher', 0),
('100000000000000000010', 'teacher6@test.com', 'Brian', 'Baker', 'teacher', 0),
('100000000000000000011', 'admin3@test.com', 'Cathy', 'Carter', 'admin', 0),
('100000000000000000012', 'student21@test.com', 'Derek', 'Dixon', 'student', 410),
('100000000000000000013', 'student22@test.com', 'Elena', 'Ellis', 'student', 510),
('100000000000000000014', 'student23@test.com', 'Felix', 'Fisher', 'student', 130),
('100000000000000000015', 'student24@test.com', 'Gina', 'Gomez', 'student', 230),
('100000000000000000016', 'student25@test.com', 'Harry', 'Holt', 'student', 330),
('100000000000000000017', 'student26@test.com', 'Isabel', 'Ingram', 'student', 430),
('100000000000000000018', 'student27@test.com', 'Justin', 'James', 'student', 530),
('100000000000000000019', 'teacher7@test.com', 'Kaitlyn', 'Kelly', 'teacher', 0),
('100000000000000000020', 'teacher8@test.com', 'Leo', 'Lopez', 'teacher', 0),
('100000000000000000021', 'admin4@test.com', 'Mona', 'Mason', 'admin', 0),
('100000000000000000022', 'student28@test.com', 'Noah', 'Nash', 'student', 140),
('100000000000000000023', 'student29@test.com', 'Olivia', 'Olsen', 'student', 240),
('100000000000000000024', 'student30@test.com', 'Peter', 'Pratt', 'student', 340),
('100000000000000000025', 'student31@test.com', 'Quinn', 'Quail', 'student', 440),
('100000000000000000026', 'student32@test.com', 'Riley', 'Reed', 'student', 540),
('100000000000000000027', 'student33@test.com', 'Sarah', 'Stone', 'student', 160),
('100000000000000000028', 'student34@test.com', 'Toby', 'Tritt', 'student', 260),
('100000000000000000029', 'student35@test.com', 'Ursula', 'Upton', 'student', 360),
('100000000000000000030', 'student36@test.com', 'Vince', 'Vaughn', 'student', 460),
('100000000000000000031', 'teacher9@test.com', 'Walter', 'White', 'teacher', 0),
('100000000000000000032', 'teacher10@test.com', 'Xena', 'Warrior', 'teacher', 0),
('100000000000000000033', 'teacher11@test.com', 'Yoda', 'Master', 'teacher', 0),
('100000000000000000034', 'teacher12@test.com', 'Zoe', 'Zimmerman', 'teacher', 0),
('100000000000000000035', 'teacher13@test.com', 'Arthur', 'Abbott', 'teacher', 0),
('100000000000000000036', 'teacher14@test.com', 'Beatrice', 'Bell', 'teacher', 0),
('100000000000000000037', 'teacher15@test.com', 'Charles', 'Choi', 'teacher', 0),
('100000000000000000038', 'teacher16@test.com', 'Diana', 'Daly', 'teacher', 0),
('100000000000000000039', 'teacher17@test.com', 'Edward', 'Egan', 'teacher', 0),
('100000000000000000040', 'teacher18@test.com', 'Fiona', 'Flynn', 'teacher', 0);

SELECT * FROM capstone_app.student;
SELECT * FROM capstone_app.teacher;
-- ######################################
-- INSERT DATA INTO TEACHER TABLE (5 RECORDS)
-- ######################################



-- ######################################
-- INSERT DATA INTO MATCH_SETTING TABLE (10 RECORDS)
-- ######################################

-- Match Settings created by Teacher 1 (ID 1)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Square Integer', 'Write a program that takes an integer as input and returns the squared value of the given integer. The program should read an integer from standard input and output its square value.', TRUE, '#include <iostream>
using namespace std;

int main() {
    int n;
    if (cin >> n) {
        cout << n * n;
    }
    return 0;
}', 9),
('Add Two Numbers', 'Write a function that takes two integers as parameters and returns their sum. The function should accept two integer values and return a single integer representing their addition.', TRUE, 'int add(int x, int y) { return x + y; }', 9);

-- Match Settings created by Teacher 2 (ID 2)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Historical Dates Lookup', 'Create a data structure that stores historical dates for Roman Empire leaders. The solution should use a map to associate leader names with their corresponding dates in history, allowing for efficient lookup of when specific leaders ruled.', FALSE, '#include <map>\n#include <string>\n\nstd::map<std::string, std::string> history = { {"Julius Caesar", "44 BC"}, {"Augustus", "27 BC"} };', 10),
('Capital City Mapping', 'Create a data structure that maps European countries to their capital cities. The solution should use a map container to store country-capital pairs and provide efficient lookup capabilities for retrieving the capital of any given country.', TRUE, '#include <map>\n#include <string>\n\nstd::map<std::string, std::string> capitals = { {"France", "Paris"}, {"Germany", "Berlin"} };', 10);

-- Match Settings created by Teacher 3 (ID 19)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Calculate Force from Mass and Acceleration', 'Write a function that calculates the force applied to an object using Newton''s second law of motion (F = ma). The function should accept two double parameters: mass and acceleration, then return the resulting force as a double value.', TRUE, 'double calculate_force(double mass, double acceleration) { return mass * acceleration; }', 19),
('Chemical Equation Balancer', 'Create a function that determines the balanced product of simple chemical reactions. The function should accept a string representing reactants and return the appropriate balanced product based on the input chemical equation.', FALSE, '#include <string>\n\nstd::string balance_equation(std::string reactants) { return (reactants.find("H2+O2") != std::string::npos) ? "2H2O" : "CO2"; }', 19);

-- Match Settings created by Teacher 4 (ID 20)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Book Author Mapping', 'Create a data structure that maps classic 19th century English novels to their respective authors. The solution should use a map container to store book-author pairs and provide efficient lookup capabilities for finding the author of any given novel.', TRUE, '#include <map>\n#include <string>\n\nstd::map<std::string, std::string> authors = { {"Pride and Prejudice", "Jane Austen"}, {"Wuthering Heights", "Emily Brontë"} };', 20),
('Italian Verb Tense Identifier', 'Write a function that identifies the grammatical tense of Italian verbs. The function should accept a string containing an Italian verb and return the corresponding tense name in Italian grammar terminology (e.g., presente indicativo, passato prossimo).', TRUE, '#include <string>\n\nstd::string get_tense(std::string verb) { return (verb.find("mangio") != std::string::npos) ? "presente indicativo" : "passato prossimo"; }', 20);

-- Match Settings created by Teacher 5 (ID 31)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Sum Vector Elements', 'Write a function that calculates the sum of all integers in a vector. The function should accept a vector of integers as a parameter and return a single integer representing the total sum of all elements using standard library algorithms.', TRUE, '#include <vector>\n#include <numeric>\n\nint sum_numbers(std::vector<int> args) { return std::accumulate(args.begin(), args.end(), 0); }', 31),
('Implement Singly Linked List Node', 'Create a basic node structure for a singly linked list data structure. The structure should contain an integer data field and a pointer to the next node, with a constructor that initializes the data and sets the next pointer to null.', FALSE, 'struct Node { int data; Node* next; Node(int d) : data(d), next(nullptr) {} };', 31);



-- ######################################
-- INSERT DATA INTO MATCH TABLE (10 RECORDS)
-- ######################################

INSERT INTO capstone_app.match (title, match_set_id, creator_id, difficulty_level, review_number, duration_phase1, duration_phase2)
VALUES
('Standard Match - Class 5A', 1, 9, 1, 5, 30, 30),
('Standard Match - Class 5B', 1, 9, 1, 5, 30, 30),
('Functions Lab - Group 1', 4, 10, 4, 3, 30, 30),
('Functions Lab - Group 2', 4, 10, 4, 3, 30, 30),
('Variable Declarations - Section A', 5, 19, 3, 4, 30, 30),
('Variable Declarations - Section B', 5, 19, 3, 4, 30, 30),
('If Statement - Group 1', 8, 20, 5, 3, 30, 30),
('If Statement - Group 2', 8, 20, 5, 3, 30, 30),
('Pointers Basics - Section A', 9, 31, 8, 3, 30, 30),
('Pointers Basics - Section B', 9, 31, 8, 3, 30, 30);


-- INSERT DEV TEST USERS (For Testing Mode)
-- These users are required for the "Dev Login" functionality in the authentication service
-- They are automatically distributed to student/teacher tables by the 'trigger_distribute_user' trigger

INSERT INTO capstone_app.users (google_sub, email, first_name, last_name, role, score, profile_url)
VALUES 
('dev_student_sub_123', 'dev.student@test.com', 'Dev', 'Student', 'student', 0, NULL),
('dev_teacher_sub_456', 'dev.teacher@test.com', 'Dev', 'Teacher', 'teacher', 0, NULL),
('dev_admin_sub_789', 'dev.admin@test.com', 'Dev', 'Admin', 'admin', 0, NULL);

-- ######################################
-- INSERT DATA INTO TESTS TABLE (50+ RECORDS)
-- ######################################

-- Match Setting 1: Square Integer
-- Tests for squaring integers
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id)
VALUES
('5', '25', 'public', 1),
('0', '0', 'private', 1),
('2', '4', 'private', 1),
('-3', '9', 'private', 1),
('10', '100', 'private', 1),
('1', '1', 'public', 1),
('-5', '25', 'private', 1),
('100', '10000', 'private', 1);

-- Match Setting 2: Add Two Numbers
-- Tests for adding two integers
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id)
VALUES
('2 3', '5', 'public', 2),
('0 0', '0', 'private', 2),
('10 5', '15', 'private', 2),
('-5 3', '-2', 'private', 2),
('100 200', '300', 'public', 2),
('-10 -5', '-15', 'private', 2),
('7 8', '15', 'private', 2);

-- Match Setting 3: Historical Dates Lookup
-- Tests for map lookups (key-value pairs)
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id)
VALUES
('Julius Caesar', '44 BC', 'public', 3),
('Augustus', '27 BC', 'private', 3),
('Nero', 'Not Found', 'private', 3),
('Caligula', 'Not Found', 'public', 3),
('Trajan', 'Not Found', 'private', 3);

-- Match Setting 4: Capital City Mapping
-- Tests for country-capital lookups
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id)
VALUES
('France', 'Paris', 'public', 4),
('Germany', 'Berlin', 'private', 4),
('Italy', 'Rome', 'public', 4),
('Spain', 'Madrid', 'private', 4),
('Greece', 'Athens', 'private', 4),
('Poland', 'Warsaw', 'public', 4),
('Portugal', 'Lisbon', 'private', 4);

-- Match Setting 5: Calculate Force from Mass and Acceleration
-- Tests for F = ma formula
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id)
VALUES
('2 3', '6', 'public', 5),
('5 2', '10', 'private', 5),
('10 10', '100', 'private', 5),
('0 5', '0', 'public', 5),
('1.5 2', '3', 'private', 5),
('100 0.5', '50', 'private', 5);

-- Match Setting 6: Chemical Equation Balancer
-- Tests for chemical reactions
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id)
VALUES
('H2+O2', '2H2O', 'public', 6),
('C+O2', 'CO2', 'private', 6),
('H2+Cl2', '2HCl', 'private', 6),
('N2+H2', 'NH3', 'public', 6),
('Fe+O2', 'Fe2O3', 'private', 6);

-- Match Setting 7: Book Author Mapping
-- Tests for book-author lookups
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id)
VALUES
('Pride and Prejudice', 'Jane Austen', 'public', 7),
('Wuthering Heights', 'Emily Brontë', 'private', 7),
('Jane Eyre', 'Charlotte Brontë', 'public', 7),
('The Tenant of Wildfell Hall', 'Anne Brontë', 'private', 7),
('Emma', 'Jane Austen', 'private', 7),
('Persuasion', 'Jane Austen', 'public', 7);

-- Match Setting 8: Italian Verb Tense Identifier
-- Tests for Italian verb conjugations
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id)
VALUES
('mangio', 'presente indicativo', 'public', 8),
('ho mangiato', 'passato prossimo', 'private', 8),
('mangiavo', 'imperfetto', 'private', 8),
('avrò mangiato', 'futuro anteriore', 'public', 8),
('mangerei', 'condizionale semplice', 'private', 8),
('mangiassi', 'congiuntivo imperfetto', 'private', 8);

-- Match Setting 9: Sum Vector Elements
-- Tests for summing vector elements
INSERT INTO capstone_app.tests (test_in, test_out, scope, match_set_id)
VALUES
('1 2 3', '6', 'public', 9),
('0 0 0', '0', 'private', 9),
('10 20 30', '60', 'private', 9),
('5', '5', 'public', 9),
('-1 -2 -3', '-6', 'private', 9),
('100 200 300', '600', 'private', 9),
('1 2 3 4 5', '15', 'public', 9);


-- ######################################
-- BADGES SYSTEM
-- ######################################

DROP TABLE IF EXISTS capstone_app.badge CASCADE;

CREATE TABLE capstone_app.badge (
    badge_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon_path VARCHAR(255) DEFAULT NULL, -- Path to frontend resource or identifier
    criteria_type VARCHAR(50) NOT NULL -- e.g., 'top_n', 'bug_hunter', 'clean_run', 'review_master'
);

DROP TABLE IF EXISTS capstone_app.student_badge CASCADE;

CREATE TABLE capstone_app.student_badge (
    student_badge_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES capstone_app.student(student_id) ON DELETE CASCADE NOT NULL,
    badge_id INTEGER REFERENCES capstone_app.badge(badge_id) ON DELETE CASCADE NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    game_session_id INTEGER REFERENCES capstone_app.game_session(game_id), -- Optional context where it was earned
    CONSTRAINT uq_student_badge_unique UNIQUE (student_id, badge_id) -- A student can't earn the same badge twice
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE capstone_app.badge TO api_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE capstone_app.student_badge TO api_user;

-- Insert Badges
INSERT INTO capstone_app.badge (name, description, icon_path, criteria_type) VALUES
-- Hall of Fame Top-N
('Rising Star', 'Reached Top-10 in a game session.', 'rising_star.png', 'top_10'),
('Elite Performer', 'Reached Top-5 in a game session.', 'elite_performer.png', 'top_5'),
('Podium Master', 'Reached Top-3 in a game session.', 'podium_master.png', 'top_3'),
('Champion', 'Finished First in a game session.', 'champion.png', 'top_1'),

-- Bug Hunter (Finding n tests that show codes fail)
('Bug Hunter', 'Found 5 failing tests in reviews.', 'bug_hunter.png', 'bug_hunter_5'),
('Bug Tracker', 'Found 10 failing tests in reviews.', 'bug_tracker.png', 'bug_hunter_10'),
('Bug Slayer', 'Found 20 failing tests in reviews.', 'bug_slayer.png', 'bug_hunter_20'),
('Bug Exterminator', 'Found 50 failing tests in reviews.', 'bug_exterminator.png', 'bug_hunter_50'),
('Bug Whisperer', 'Found 100 failing tests in reviews.', 'bug_whisperer.png', 'bug_hunter_100'),

-- Review Master (Up-voting correct answers n times)
('Sharp Eye', 'Up-voted correct answers 5 times.', 'sharp_eye.png', 'review_master_5'),
('Quality Checker', 'Up-voted correct answers 10 times.', 'quality_checker.png', 'review_master_10'),
('Insightful Reviewer', 'Up-voted correct answers 20 times.', 'insightful_reviewer.png', 'review_master_20'),
('Truth Seeker', 'Up-voted correct answers 50 times.', 'truth_seeker.png', 'review_master_50'),
('Peer Review Master', 'Up-voted correct answers 100 times.', 'peer_review_master.png', 'review_master_100'),

-- Teacher's Tests (Passing all teacher's tests)
('First Pass', 'Passed all teacher tests in 1 session.', 'first_pass.png', 'teacher_tests_1'),
('Consistent Performer', 'Passed all teacher tests in 5 sessions.', 'consistent_performer.png', 'teacher_tests_5'),
('Reliable Solver', 'Passed all teacher tests in 10 sessions.', 'reliable_solver.png', 'teacher_tests_10'),
('Test Master', 'Passed all teacher tests in 15 sessions.', 'test_master.png', 'teacher_tests_15'),
('Teachers Champion', 'Passed all teacher tests in 20 sessions.', 'teachers_champion.png', 'teacher_tests_20'),

-- Flawless Finish (No mistakes)
('Flawless Start', 'Finished a session perfectly 1 time.', 'flawless_start.png', 'flawless_1'),
('Clean Run', 'Finished a session perfectly 5 times.', 'clean_run.png', 'flawless_5'),
('Precision Player', 'Finished a session perfectly 10 times.', 'precision_player.png', 'flawless_10'),
('Perfectionist', 'Finished a session perfectly 15 times.', 'perfectionist.png', 'flawless_15'),
('Untouchable', 'Finished a session perfectly 20 times.', 'untouchable.png', 'flawless_20');
