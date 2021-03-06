// models tbc
import query from "../db/index.js";

export async function getStudentName(id) {
  const data = await query(`SELECT name FROM students WHERE id = $1;`, [id])
  return data.rows;
}


export async function getCurrentBooks(id) {
      const data = await query(
            `SELECT DISTINCT ON(allbooks.id) allbooks.id, allbooks.student_id,allbooks.date_created,allbooks.cover,
    allbooks.title,
    allbooks.author,total_pages,bool_or(summaries.iscomplete) AS iscomplete,
    MAX(summaries.current_page) AS current_page, 
    MAX(summaries.current_page)::float/ SUM(DISTINCT allbooks.total_pages)* 100 AS percentageComplete
    from allbooks FULL OUTER JOIN summaries on allbooks.id = summaries.book_id 
    WHERE allbooks.student_id = $1
    GROUP BY allbooks.id, summaries.book_id HAVING bool_or(summaries.iscomplete) is not true 
    `,
            [id]
      );
      return data.rows;
}

export async function getProgress(id) {
      const data = await query(
            `SELECT
    date_part('week', summaries.date_created::date) AS weekly,
    COUNT(DISTINCT summaries.date_created::date),
    SUM(Minutes_read) AS minutes_total,
    students.name
FROM summaries
INNER JOIN students
ON  summaries.student_id=students.id
WHERE student_id = $1
GROUP BY weekly, name
ORDER  BY weekly DESC LIMIT 1`,
            [id]
      );
      return data.rows;
}

export async function newBook(id, studentId, title, author, cover, totalPages) {
      const data = await query(
            `INSERT INTO allbooks (id, student_id, title, author, cover, total_pages) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [id, studentId, title, author, cover, totalPages]
      );
}
export async function deleteBook(id) {
      const data = await query(
            `DELETE FROM summaries WHERE student_id = $1;
            DELETE FROM allbooks WHERE student_id = $1`,
            [id]
      );
}
export async function newSummary(

  bookId,
  studentId,
  currentPage,
  summary,
  isComplete,
  minutesRead,
  pagesRead,
) {
  const data = await query(
    `INSERT INTO summaries (book_id, student_id, current_page,summary,isComplete,minutes_read,number_pages) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;`,
    [bookId, studentId, currentPage, summary, isComplete, minutesRead, pagesRead]
  );

}

export async function deleteSummary(id) {
      const data = await query(`DELETE FROM summaries WHERE student_id = $1;`, [
            id,
      ]);
}

export async function noBook() {}

export async function getCompleteBooks(id) {
      const data = await query(
            `SELECT allbooks.id AS book_id, allbooks.student_id, MAX(summaries.date_created) AS date_completed, allbooks.cover, allbooks.title, allbooks.author, allbooks.total_pages, summaries.iscomplete from allbooks FULL OUTER JOIN summaries on allbooks.id = summaries.book_id WHERE allbooks.student_id = $1 AND summaries.iscomplete = true GROUP BY allbooks.id, summaries.iscomplete `,
            [id]
      );
      return data.rows;
}

export async function getWords(id) {
      const data = await query(
            `SELECT * FROM dictionary WHERE student_id = $1`,
            [id]
      );
      return data.rows;
}

export async function addWord(studentId, word, definition) {
      const data = await query(
            `INSERT INTO dictionary (student_id, word,definition) VALUES ($1,$2,$3) RETURNING *;`,
            [studentId, word, definition]
      );
}

export async function getStudentFeedback(id) {
      const data = await query(
            `SELECT f.student_id,s.name,t.name AS teacher,f.feedback_text,f.date from feedback f 
  LEFT JOIN students s on f.student_id = s.id 
  LEFT JOIN teachers t on s.class = t.class
  WHERE student_id = $1`,
            [id]
      );
      return data.rows;
}

export async function getClassFeedback() {
      const data = await query(
            `SELECT * from classfeedback WHERE class = '5C'`
      );
      return data.rows;
}
