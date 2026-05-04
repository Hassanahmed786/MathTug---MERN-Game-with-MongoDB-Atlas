/**
 * Question Generator Utility
 * Generates arithmetic questions based on difficulty level.
 */

const OPERATIONS = {
  easy: ['+', '-'],
  medium: ['+', '-', '*', '/'],
  hard: ['+', '-', '*', '/'],
};

const RANGES = {
  easy: { min: 1, max: 9 },
  medium: { min: 1, max: 49 },
  hard: { min: 1, max: 99 },
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion(difficulty = 'medium') {
  const ops = OPERATIONS[difficulty] || OPERATIONS.medium;
  const range = RANGES[difficulty] || RANGES.medium;
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a, b, answer, equation, type;

  switch (op) {
    case '+':
      a = randomInt(range.min, range.max);
      b = randomInt(range.min, range.max);
      answer = a + b;
      equation = `${a} + ${b} = ?`;
      type = 'addition';
      break;

    case '-':
      a = randomInt(range.min, range.max);
      b = randomInt(range.min, range.max);
      // For easy/medium ensure non-negative; hard allows negative
      if (difficulty !== 'hard' && b > a) [a, b] = [b, a];
      answer = a - b;
      equation = `${a} - ${b} = ?`;
      type = 'subtraction';
      break;

    case '*':
      // Keep multiplication manageable
      a = randomInt(range.min, Math.min(range.max, 12));
      b = randomInt(range.min, Math.min(range.max, 12));
      answer = a * b;
      equation = `${a} × ${b} = ?`;
      type = 'multiplication';
      break;

    case '/': {
      // Ensure integer answer: pick answer and b, derive a
      const maxAns = difficulty === 'hard' ? 20 : difficulty === 'medium' ? 15 : 9;
      b = randomInt(2, Math.min(range.max, 12));
      const quotient = randomInt(1, maxAns);
      a = b * quotient;
      answer = quotient;
      equation = `${a} ÷ ${b} = ?`;
      type = 'division';
      break;
    }

    default:
      a = randomInt(1, 9);
      b = randomInt(1, 9);
      answer = a + b;
      equation = `${a} + ${b} = ?`;
      type = 'addition';
  }

  return { equation, answer, type };
}

function generateQuestions(count = 10, difficulty = 'medium') {
  return Array.from({ length: count }, () => generateQuestion(difficulty));
}

module.exports = { generateQuestion, generateQuestions };
