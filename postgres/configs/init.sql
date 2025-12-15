--Create a schema : (User story 1)

CREATE SCHEMA capstone_app;

-- Creation of Teacher Table :  (User story 1)

DROP TABLE IF EXISTS capstone_app.teacher;

CREATE TABLE capstone_app.teacher (
    teacher_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,	
    email VARCHAR(150) UNIQUE NOT NULL 
--    login_id   INTEGER REFERENCES capstone_app.login(login_id) NOT NULL  --- user story 5 for modification
);



-- Creation of Match Setting Table & fk match teacher: (User story 1)

DROP TABLE IF EXISTS capstone_app.match_setting;

CREATE TABLE capstone_app.match_setting (
    match_set_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    is_ready BOOLEAN NOT NULL DEFAULT FALSE,
    public_test VARCHAR(500),
    private_test VARCHAR(500),
    reference_solution VARCHAR(1000), -- this is the code solution
    
    creator_id INTEGER REFERENCES capstone_app.teacher(teacher_id)
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
    duration_phase1 INTEGER NOT NULL,-- in minutes
    duration_phase2 INTEGER NOT NULL -- in minutes
    
);



-- Creation of the game session table: (User story 3)

DROP TABLE IF EXISTS capstone_app.game_session;

CREATE TABLE capstone_app.game_session (
    game_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    creator_id INTEGER REFERENCES capstone_app.teacher(teacher_id) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE
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
  google_sub  VARCHAR(255) UNIQUE,
  avatar_url  VARCHAR(2048),       
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), 
  updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT check_max_score CHECK (score <= 2000000)
-- login_id INTEGER REFERENCES capstone_app.login(login_id)
);



--- The creation of login table: (User Story 5)

DROP TABLE IF EXISTS capstone_app.login;

CREATE TABLE capstone_app.login (
  login_id SERIAL PRIMARY KEY,
  sub VARCHAR(255) NOT NULL, 
  auth_provider VARCHAR(50) NOT NULL,
  CONSTRAINT uc_sub_auth UNIQUE (sub, auth_provider)
);



--- The creation of table for relationship between students and game session: (User Story 5)

DROP TABLE IF EXISTS capstone_app.student_join_game;

CREATE TABLE capstone_app.student_join_game (
  student_join_game_id SERIAL PRIMARY KEY, 
  student_id INTEGER REFERENCES capstone_app.student(student_id) NOT NULL,
  game_id    INTEGER REFERENCES capstone_app.game_session(game_id) NOT NULL,
  assigned_match_id INTEGER REFERENCES capstone_app.match(match_id),
  CONSTRAINT uc_student_game UNIQUE (student_id, game_id)
);

--Create a user for that schema: (User story 1)

-- 2. Create the API user (Replace 'changeme' with a strong password)
CREATE USER api_user WITH PASSWORD 'changeme';

-- 3. Grant connection rights to the database
GRANT CONNECT ON DATABASE changeme TO api_user;
GRANT USAGE ON SCHEMA capstone_app TO api_user;

-- 4. Grant SELECT, INSERT permissions on ALL FUTURE tables created in this schema
GRANT SELECT, INSERT ON TABLE  
capstone_app.teacher,
capstone_app.match_setting,
capstone_app.match,
capstone_app.game_session, 
capstone_app.matches_for_game
TO api_user;



-- Creation of some DB population script for populate the Teacher Table and the Match Settings Table (User story 1)

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
INSERT INTO capstone_app.match_setting (title, description, is_ready, public_test, private_test, reference_solution, creator_id)
VALUES 
('Standard Mode 1', 'Quick match, 5 rounds.', TRUE, 'Input: 5, Output: 25', 'Input: 10, Output: 100', 'def square(n): return n * n', 1),
('Advanced Algebra', '15-round math challenge.', TRUE, 'Input: x=3 y=4, Output: 7', 'Input: x=7 y=9, Output: 16', 'def add(x, y): return x + y', 1);

-- Match Settings created by Teacher 2 (ID 2)
INSERT INTO capstone_app.match_setting (title, description, is_ready, public_test, private_test, reference_solution, creator_id)
VALUES 
('History Facts', 'Review of Roman Empire history.', FALSE, 'Input: Julius Caesar, Output: 44 BC', 'Input: Augustus, Output: 27 BC', 'history = {"Julius Caesar": "44 BC", "Augustus": "27 BC"}', 2),
('Geography Quiz', 'Quiz on European capitals.', TRUE, 'Input: France, Output: Paris', 'Input: Germany, Output: Berlin', 'capitals = {"France": "Paris", "Germany": "Berlin"}', 2);

-- Match Settings created by Teacher 3 (ID 3)
INSERT INTO capstone_app.match_setting (title, description, is_ready, public_test, private_test, reference_solution, creator_id)
VALUES 
('Science Fundamentals', 'Basics of Physics.', TRUE, 'Input: mass=10kg acceleration=2m/s², Output: Force=20N', 'Input: mass=5kg acceleration=9.8m/s², Output: Force=49N', 'def calculate_force(mass, acceleration): return mass * acceleration', 3),
('Chemistry Equations', 'Balancing basic equations.', FALSE, 'Input: H2+O2, Output: 2H2O', 'Input: C+O2, Output: CO2', 'def balance_equation(reactants): return "2H2O" if "H2+O2" in reactants else "CO2"', 3);

-- Match Settings created by Teacher 4 (ID 4)
INSERT INTO capstone_app.match_setting (title, description, is_ready, public_test, private_test, reference_solution, creator_id)
VALUES 
('Literature Review 1', '19th Century English novels.', TRUE, 'Input: Pride and Prejudice, Output: Jane Austen', 'Input: Wuthering Heights, Output: Emily Brontë', 'authors = {"Pride and Prejudice": "Jane Austen", "Wuthering Heights": "Emily Brontë"}', 4),
('Grammar Practice', 'Advanced Italian grammar.', TRUE, 'Input: io mangio, Output: presente indicativo', 'Input: io ho mangiato, Output: passato prossimo', 'def get_tense(verb): return "presente indicativo" if "mangio" in verb else "passato prossimo"', 4);

-- Match Settings created by Teacher 5 (ID 5)
INSERT INTO capstone_app.match_setting (title, description, is_ready, public_test, private_test, reference_solution, creator_id)
VALUES 
('Coding Basics', 'Introduction to Python syntax.', TRUE, 'Input: 1 2 3, Output: 6', 'Input: 5 10 15, Output: 30', 'def sum_numbers(*args): return sum(args)', 5),
('Data Structures Review', 'Review of linked lists and trees.', FALSE, 'Input: 1 2 3, Output: Linked List', 'Input: 4 5 6, Output: Binary Tree', 'class Node: def __init__(self, data): self.data = data; self.next = None', 5);



-- The Creation of Populate script for the Match table (User story 2)

-- ######################################
-- INSERT DATA INTO MATCH TABLE (10 RECORDS)
-- ######################################

INSERT INTO capstone_app.match 
    (title, match_set_id, creator_id, difficulty_level, review_number, duration_phase1, duration_phase2)
VALUES
-- Matches created by Teacher 1 (ID 1)
('Standard Match - Class 5A', 1, 1, 1, 5, 7, 10),
('Standard Match - Class 5B', 1, 1, 1, 5, 7, 10),
-- Matches created by Teacher 2 (ID 2)
('Functions Lab - Group 1', 4, 2, 4, 3, 10, 5),
('Functions Lab - Group 2', 4, 2, 4, 3, 10, 5),
-- Matches created by Teacher 3 (ID 3)
('Variable Declarations - Section A', 5, 3, 3, 4, 15, 10),
('Variable Declarations - Section B', 5, 3, 3, 4, 15, 10),
-- Matches created by Teacher 4 (ID 4)
('If Statement - Group 1', 8, 4, 5, 3, 10, 5),
('If Statement - Group 2', 8, 4, 5, 3, 10, 5),
-- Matches created by Teacher 5 (ID 5)
('Pointers Basics - Section A', 9, 5, 8, 3, 15, 10),
('Pointers Basics - Section B', 9, 5, 8, 3, 15, 10);



-- Populate script (user story 3)

-- ######################################
-- INSERT DATA INTO GAME_SESSION TABLE (5 RECORDS)
-- ######################################

INSERT INTO capstone_app.game_session (name, start_date, creator_id, is_active)
VALUES 
('Spring Semester Game Session', '2028-01-15 09:00:00', 1, FALSE),
('Summer Workshop Session', '2024-01-16 10:30:00', 2, FALSE),
('Fall Competition Session', '2024-01-17 14:00:00', 3, TRUE),
('Winter Training Session', '2024-01-18 11:00:00', 4, FALSE),
('Annual Championship Session', '2024-01-19 15:30:00', 5, FALSE);



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

