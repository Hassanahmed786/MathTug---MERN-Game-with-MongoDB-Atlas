/** Client-side question generator (mirrors server-side logic) */

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

export function generateQuestion(difficulty = 'medium') {
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
      if (difficulty !== 'hard' && b > a) [a, b] = [b, a];
      answer = a - b;
      equation = `${a} - ${b} = ?`;
      type = 'subtraction';
      break;
    case '*':
      a = randomInt(range.min, Math.min(range.max, 12));
      b = randomInt(range.min, Math.min(range.max, 12));
      answer = a * b;
      equation = `${a} × ${b} = ?`;
      type = 'multiplication';
      break;
    case '/': {
      const maxAns = difficulty === 'hard' ? 20 : 15;
      b = randomInt(2, Math.min(range.max, 12));
      const quotient = randomInt(1, maxAns);
      a = b * quotient;
      answer = quotient;
      equation = `${a} ÷ ${b} = ?`;
      type = 'division';
      break;
    }
    default:
      a = randomInt(1, 9); b = randomInt(1, 9);
      answer = a + b;
      equation = `${a} + ${b} = ?`;
      type = 'addition';
  }

  return { equation, answer, type };
}
