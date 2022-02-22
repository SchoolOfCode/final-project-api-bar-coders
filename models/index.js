// models tbc
import query from "../db/index.js";

export async function getCurrentBooks(id) {
  const data = await query(
    `SELECT allbooks.id, allbooks.student_id, allbooks.date_created, allbooks.cover, allbooks.title, allbooks.author, allbooks.cover, allbooks.total_pages, summaries.iscomplete, MAX(summaries.current_page) AS current_page, MAX(summaries.current_page)::float/ SUM(DISTINCT allbooks.total_pages)* 100  AS percentageComplete from allbooks FULL OUTER JOIN summaries on allbooks.id = summaries.book_id WHERE allbooks.student_id = $1 AND (summaries.iscomplete is NULL or summaries.iscomplete = false ) GROUP BY allbooks.id, summaries.iscomplete`,
    [id]
  );
  return data.rows;
}

export async function newBook(
  bookId,
  studentId,
  title,
  author,
  cover,
  totalPages
) {
  const data = await query(
    `INSERT INTO allbooks (book_id, student_id, title, author, cover, total_pages) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [bookId, studentId, title, author, cover, totalPages]
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
  minutesRead
) {
  const data = await query(
    `INSERT INTO summaries (book_id, student_id, current_page,summary,isComplete,minutes_read) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;`,
    [bookId, studentId, currentPage, summary, isComplete, minutesRead]
  );
}

export async function deleteSummary(id) {
  const data = await query(`DELETE FROM summaries WHERE student_id = $1;`, [
    id,
  ]);
}

export async function noBook() {}
export async function completeBooks() {}

export async function getWords(id) {
  const data = await query(`SELECT * FROM dictionary WHERE student_id = $1`, [
    id,
  ]);
  return data.rows;
}

export async function addWord(studentId, word, definition) {
  const data = await query(
    `INSERT INTO summaries (student_id, word,definition) VALUES ($1,$2,$3) RETURNING *;`,
    [studentId, word, definition]
  );
}

export async function messages() {}
export async function getAllStudentsAndTeacher() {}
export async function getWholeClassSevenStat() {}
export async function getWholeClassPages() {}
export async function getWholeClassMinutes() {}
export async function getWholeClassBooksFinished() {}
export async function individualSevenStat() {}
export async function individualPages() {}
export async function individualMinutes() {}
export async function individualBooksFinished() {}
export async function classMessageLog() {}
export async function newStudentFeedback() {}
export async function studentMessageLog() {}
export async function studentSummaries() {}
export async function newClassFeedback() {}