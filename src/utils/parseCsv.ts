export type QuizItem = { question: string; answer: string };

/** Parses question,answer CSV rows (handles quoted fields). */
export function parseQuizCsv(text: string): QuizItem[] {
  const lines = text.trim().split(/\r?\n/);
  const items: QuizItem[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;
    const row = parseCsvLine(line);
    if (row.length >= 2) {
      items.push({ question: row[0].trim(), answer: row.slice(1).join(',').trim() });
    }
  }

  return items;
}

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }

  fields.push(current);
  return fields;
}
