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
  teacher_test_id INTEGER REFERENCES capstone_app.tests(test_id) NOT NULL,
  student_test_id INTEGER REFERENCES capstone_app.student_tests(test_id) NOT NULL,
  solution_id INTEGER REFERENCES capstone_app.student_solutions(solution_id) NOT NULL,
  test_output TEXT NOT NULL,
  PRIMARY KEY (teacher_test_id, student_test_id, solution_id),
  CONSTRAINT uc_solution_id_test_id UNIQUE (solution_id, student_test_id, teacher_test_id)
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



DROP TABLE IF EXISTS capstone_app.student_assigned_review;

CREATE TABLE capstone_app.student_assigned_review (
    student_assigned_review_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES capstone_app.student(student_id) NOT NULL,
    assigned_solution_id INTEGER REFERENCES capstone_app.student_solutions(solution_id) NOT NULL
);

CREATE TYPE vote AS ENUM ('correct', 'incorrect', 'skip');

DROP TABLE IF EXISTS capstone_app.student_review_vote;

CREATE TABLE capstone_app.student_review_vote (
    review_vote_id SERIAL PRIMARY KEY,
    student_assigned_review_id INTEGER REFERENCES capstone_app.student_assigned_review(student_assigned_review_id) NOT NULL,
    vote vote NOT NULL,
    proof_test_in VARCHAR(500) DEFAULT NULL,
    proof_test_out VARCHAR(500) DEFAULT NULL,
    valid BOOLEAN DEFAULT NULL,
    note TEXT DEFAULT NULL
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
('Standard Mode 1', 'Quick match, 5 rounds.', TRUE, 'int square(int n) { return n * n; }', 9),
('Advanced Algebra', '15-round math challenge.', TRUE, 'int add(int x, int y) { return x + y; }', 9);

-- Match Settings created by Teacher 2 (ID 2)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('History Facts', 'Review of Roman Empire history.', FALSE, '#include <map>\n#include <string>\n\nstd::map<std::string, std::string> history = { {"Julius Caesar", "44 BC"}, {"Augustus", "27 BC"} };', 10),
('Geography Quiz', 'Quiz on European capitals.', TRUE, '#include <map>\n#include <string>\n\nstd::map<std::string, std::string> capitals = { {"France", "Paris"}, {"Germany", "Berlin"} };', 10);

-- Match Settings created by Teacher 3 (ID 19)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Science Fundamentals', 'Basics of Physics.', TRUE, 'double calculate_force(double mass, double acceleration) { return mass * acceleration; }', 19),
('Chemistry Equations', 'Balancing basic equations.', FALSE, '#include <string>\n\nstd::string balance_equation(std::string reactants) { return (reactants.find("H2+O2") != std::string::npos) ? "2H2O" : "CO2"; }', 19);

-- Match Settings created by Teacher 4 (ID 20)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Literature Review 1', '19th Century English novels.', TRUE, '#include <map>\n#include <string>\n\nstd::map<std::string, std::string> authors = { {"Pride and Prejudice", "Jane Austen"}, {"Wuthering Heights", "Emily Brontë"} };', 20),
('Grammar Practice', 'Advanced Italian grammar.', TRUE, '#include <string>\n\nstd::string get_tense(std::string verb) { return (verb.find("mangio") != std::string::npos) ? "presente indicativo" : "passato prossimo"; }', 20);

-- Match Settings created by Teacher 5 (ID 31)
INSERT INTO capstone_app.match_setting (title, description, is_ready, reference_solution, creator_id)
VALUES 
('Coding Basics', 'Introduction to Python syntax.', TRUE, '#include <vector>\n#include <numeric>\n\nint sum_numbers(std::vector<int> args) { return std::accumulate(args.begin(), args.end(), 0); }', 31),
('Data Structures Review', 'Review of linked lists and trees.', FALSE, 'struct Node { int data; Node* next; Node(int d) : data(d), next(nullptr) {} };', 31);



-- ######################################
-- INSERT DATA INTO MATCH TABLE (10 RECORDS)
-- ######################################

INSERT INTO capstone_app.match (title, match_set_id, creator_id, difficulty_level, review_number)
VALUES
('Standard Match - Class 5A', 1, 9, 1, 5),
('Standard Match - Class 5B', 1, 9, 1, 5),
('Functions Lab - Group 1', 4, 10, 4, 3),
('Functions Lab - Group 2', 4, 10, 4, 3),
('Variable Declarations - Section A', 5, 19, 3, 4),
('Variable Declarations - Section B', 5, 19, 3, 4),
('If Statement - Group 1', 8, 20, 5, 3),
('If Statement - Group 2', 8, 20, 5, 3),
('Pointers Basics - Section A', 9, 31, 8, 3),
('Pointers Basics - Section B', 9, 31, 8, 3);


