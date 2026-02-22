-- sql file containing mock data for our project

INSERT INTO students (name) VALUES
('Jill Muraguri'),
('Peter Waweru'),
('Lydia Wanjiku'),
('James Mwangi'),
('Natasha Wangai');

INSERT INTO grades(student_id, subject, score)
SELECT id, 'Mathematics', 85 FROM students WHERE name = 'Jill Muraguri'
UNION ALL
SELECT id, 'Physics', 92 FROM students WHERE name = 'Jill Muraguri'
UNION ALL
SELECT id, 'Chemistry', 68 FROM students WHERE name = 'Jill Muraguri'
UNION ALL
SELECT id, 'Literature', 70 FROM students WHERE name = 'Jill Muraguri';

/*
-Breaking down what the above block of code does.

-It adds grades to the first student, breaking down the SQL commands used:
-The first line adds values to the grades table, the columns are the student_id, subject and score.
-Each SELECT statement creates one row of data and UNION ALL combines them into a result of set of 4 rows
-The SELECT statements are used to add values, they generate data that gets inserted.

SELECT statements are more of a data shaping toll, it can fetch, transform, combine and generate data.
-UNION ALL - combines all select data.

*/

INSERT INTO grades(student_id, subject, score)
SELECT id, 'Mathematics', 98 FROM students WHERE name = 'Peter Waweru'
UNION ALL
SELECT id, 'Biology', 70 FROM students WHERE name = 'Peter Waweru'
UNION ALL
SELECT id, 'Geography', 87 FROM students WHERE name = 'Peter Waweru'
UNION ALL
SELECT id, 'Literature', 56 FROM students WHERE name = 'Peter Waweru';

INSERT INTO grades(student_id, subject, score)
SELECT id, 'Mathematics', 84 FROM students WHERE name = "Lydia Wanjiku"
UNION ALL
SELECT id, 'History', 74 FROM students WHERE name = "Lydia Wanjiku"
UNION ALL
SELECT id, 'CRE', 84 FROM students WHERE name = "Lydia Wanjiku"
UNION ALL
SELECT id, 'Literature', 94 FROM students WHERE name = "Lydia Wanjiku"

INSERT INTO grades(student_id, subject, score)
SELECT id, 'Mathematics', 84 FROM students WHERE name = "James Mwangi"
UNION ALL
SELECT id, 'History', 74 FROM students WHERE name = "James Mwangi"
UNION ALL
SELECT id, 'CRE', 84 FROM students WHERE name = "James Mwangi"
UNION ALL
SELECT id, 'Literature', 94 FROM students WHERE name = "James Mwangi"

INSERT INTO grades(student_id, subject, score)
SELECT id, 'Mathematics', 84 FROM students WHERE name = "Natasha Wangai"
UNION ALL
SELECT id, 'History', 74 FROM students WHERE name = "Natasha Wangai"
UNION ALL
SELECT id, 'CRE', 84 FROM students WHERE name = "Natasha Wangai"
UNION ALL
SELECT id, 'Literature', 94 FROM students WHERE name = "Natasha Wangai"

