--User story 1, db task : 

--Create a schema :

-- 1. Create the new schema
CREATE SCHEMA capstone_app;


--Create a user for that schema: 

-- 2. Create the API user (Replace 'changeme' with a strong password)
CREATE USER api_user WITH PASSWORD 'changeme';

-- 3. Grant connection rights to the database
GRANT CONNECT ON DATABASE changeme TO api_user;

-- 4. Grant SELECT, INSERT permissions on ALL FUTURE tables created in this schema
ALTER DEFAULT PRIVILEGES IN SCHEMA capstone_app
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO api_user;

-- 5. Allow the 'api_user' to utilize sequences (needed for SERIAL/BIGSERIAL data types)
ALTER DEFAULT PRIVILEGES IN SCHEMA capstone_app
    GRANT USAGE ON SEQUENCES TO api_user;


-- Creation of Teacher Table :

DROP TABLE IF EXISTS capstone_app.teacher;

CREATE TABLE capstone_app.teacher (
    teacher_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,	
    email VARCHAR(150) UNIQUE NOT NULL
);



-- Creation of Match Setting Table & fk match teacher:

DROP TABLE IF EXISTS capstone_app.match_setting;

CREATE TABLE capstone_app.match_setting (
    match_set_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    is_ready BOOLEAN NOT NULL DEFAULT FALSE,
    
    creator_id INTEGER REFERENCES capstone_app.teacher(teacher_id)
);

-- Creation of some DB population script for populate the Teacher Table and the Match Settings Table

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
