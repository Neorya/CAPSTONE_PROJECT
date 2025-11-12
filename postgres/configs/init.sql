--Create a schema : (User story 1)

CREATE SCHEMA capstone_app;

-- Creation of Teacher Table :  (User story 1)

DROP TABLE IF EXISTS capstone_app.teacher;

CREATE TABLE capstone_app.teacher (
    teacher_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,	
    email VARCHAR(150) UNIQUE NOT NULL
);



-- Creation of Match Setting Table & fk match teacher: (User story 1)

DROP TABLE IF EXISTS capstone_app.match_setting;

CREATE TABLE capstone_app.match_setting (
    match_set_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    is_ready BOOLEAN NOT NULL DEFAULT FALSE,
    
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


DROP TABLE IF EXISTS capstone_app.game_session;

CREATE TABLE capstone_app.game_session (
    game_id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES capstone_app.teacher(teacher_id) NOT NULL
);


DROP TABLE IF EXISTS capstone_app.matches_for_game;

CREATE TABLE capstone_app.matches_for_game (
    match_for_game_id SERIAL PRIMARY KEY,

    match_id INTEGER REFERENCES capstone_app.match(match_id) NOT NULL,
    game_id  INTEGER REFERENCES capstone_app.game_session(game_id) NOT NULL,
    CONSTRAINT uc_matches_for_game UNIQUE (match_id, game_id)
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
INSERT INTO capstone_app.match_setting (title, description, is_ready, creator_id)
VALUES 
('Standard Mode 1', 'Quick match, 5 rounds.', TRUE, 1),
('Advanced Algebra', '15-round math challenge.', TRUE, 1);

-- Match Settings created by Teacher 2 (ID 2)
INSERT INTO capstone_app.match_setting (title, description, is_ready, creator_id)
VALUES 
('History Facts', 'Review of Roman Empire history.', FALSE, 2),
('Geography Quiz', 'Quiz on European capitals.', TRUE, 2);

-- Match Settings created by Teacher 3 (ID 3)
INSERT INTO capstone_app.match_setting (title, description, is_ready, creator_id)
VALUES 
('Science Fundamentals', 'Basics of Physics.', TRUE, 3),
('Chemistry Equations', 'Balancing basic equations.', FALSE, 3);

-- Match Settings created by Teacher 4 (ID 4)
INSERT INTO capstone_app.match_setting (title, description, is_ready, creator_id)
VALUES 
('Literature Review 1', '19th Century English novels.', TRUE, 4),
('Grammar Practice', 'Advanced Italian grammar.', TRUE, 4);

-- Match Settings created by Teacher 5 (ID 5)
INSERT INTO capstone_app.match_setting (title, description, is_ready, creator_id)
VALUES 
('Coding Basics', 'Introduction to Python syntax.', TRUE, 5),
('Data Structures Review', 'Review of linked lists and trees.', FALSE, 5);



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

