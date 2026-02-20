-- 03_mock_data.sql
-- Add realistic mock data for testing

-- First, clear existing data (optional - be careful!)
-- TRUNCATE grades, students RESTART IDENTITY CASCADE;

-- Insert students
INSERT INTO students (name) VALUES 
    ('Alex Johnson'),
    ('Maria Garcia'),
    ('James Smith'),
    ('Sarah Williams'),
    ('David Brown'),
    ('Emily Davis'),
    ('Michael Wilson'),
    ('Jessica Lee'),
    ('Chris Taylor'),
    ('Amanda Martinez');

-- Store their IDs to use for grades

-- Add grades for Alex Johnson (student 1)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'Mathematics', 85 FROM students WHERE name = 'Alex Johnson'
UNION ALL
SELECT id, 'Physics', 92 FROM students WHERE name = 'Alex Johnson'
UNION ALL
SELECT id, 'Chemistry', 78 FROM students WHERE name = 'Alex Johnson'
UNION ALL
SELECT id, 'Literature', 88 FROM students WHERE name = 'Alex Johnson';

-- Add grades for Maria Garcia (student 2)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'Mathematics', 95 FROM students WHERE name = 'Maria Garcia'
UNION ALL
SELECT id, 'Physics', 88 FROM students WHERE name = 'Maria Garcia'
UNION ALL
SELECT id, 'Biology', 91 FROM students WHERE name = 'Maria Garcia'
UNION ALL
SELECT id, 'History', 84 FROM students WHERE name = 'Maria Garcia';

-- Add grades for James Smith (student 3)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'Mathematics', 72 FROM students WHERE name = 'James Smith'
UNION ALL
SELECT id, 'Physics', 68 FROM students WHERE name = 'James Smith'
UNION ALL
SELECT id, 'Chemistry', 75 FROM students WHERE name = 'James Smith';

-- Add grades for Sarah Williams (student 4)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'Literature', 94 FROM students WHERE name = 'Sarah Williams'
UNION ALL
SELECT id, 'History', 89 FROM students WHERE name = 'Sarah Williams'
UNION ALL
SELECT id, 'Art', 96 FROM students WHERE name = 'Sarah Williams'
UNION ALL
SELECT id, 'Music', 91 FROM students WHERE name = 'Sarah Williams';

-- Add grades for David Brown (student 5)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'Mathematics', 63 FROM students WHERE name = 'David Brown'
UNION ALL
SELECT id, 'Physics', 71 FROM students WHERE name = 'David Brown'
UNION ALL
SELECT id, 'Computer Science', 82 FROM students WHERE name = 'David Brown';

-- Add grades for Emily Davis (student 6)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'Biology', 88 FROM students WHERE name = 'Emily Davis'
UNION ALL
SELECT id, 'Chemistry', 84 FROM students WHERE name = 'Emily Davis'
UNION ALL
SELECT id, 'Physics', 79 FROM students WHERE name = 'Emily Davis'
UNION ALL
SELECT id, 'Mathematics', 91 FROM students WHERE name = 'Emily Davis';

-- Add grades for Michael Wilson (student 7)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'History', 77 FROM students WHERE name = 'Michael Wilson'
UNION ALL
SELECT id, 'Literature', 73 FROM students WHERE name = 'Michael Wilson'
UNION ALL
SELECT id, 'Philosophy', 81 FROM students WHERE name = 'Michael Wilson';

-- Add grades for Jessica Lee (student 8)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'Mathematics', 97 FROM students WHERE name = 'Jessica Lee'
UNION ALL
SELECT id, 'Physics', 94 FROM students WHERE name = 'Jessica Lee'
UNION ALL
SELECT id, 'Chemistry', 92 FROM students WHERE name = 'Jessica Lee'
UNION ALL
SELECT id, 'Computer Science', 98 FROM students WHERE name = 'Jessica Lee';

-- Add grades for Chris Taylor (student 9)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'Art', 85 FROM students WHERE name = 'Chris Taylor'
UNION ALL
SELECT id, 'Music', 79 FROM students WHERE name = 'Chris Taylor'
UNION ALL
SELECT id, 'Theater', 88 FROM students WHERE name = 'Chris Taylor';

-- Add grades for Amanda Martinez (student 10)
INSERT INTO grades (student_id, subject, score) 
SELECT id, 'Spanish', 96 FROM students WHERE name = 'Amanda Martinez'
UNION ALL
SELECT id, 'French', 89 FROM students WHERE name = 'Amanda Martinez'
UNION ALL
SELECT id, 'Literature', 93 FROM students WHERE name = 'Amanda Martinez'
UNION ALL
SELECT id, 'History', 87 FROM students WHERE name = 'Amanda Martinez';

-- Show summary of what was added
SELECT 'Students added: ' || COUNT(*) FROM students;
SELECT 'Grades added: ' || COUNT(*) FROM grades;

-- Show each student with their average grade
SELECT 
    s.name,
    COUNT(g.id) as number_of_grades,
    ROUND(AVG(g.score), 2) as average_score
FROM students s
LEFT JOIN grades g ON s.id = g.student_id
GROUP BY s.id, s.name
ORDER BY average_score DESC NULLS LAST;