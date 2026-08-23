import { useState, useCallback } from 'react';

function generateQuestions(topic, count = 10) {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generators = {
    formulas: () => {
      const items = [
        { q: 'SI formula?',                    a: 'P×R×T/100' },
        { q: 'Percentage formula?',            a: '(Part/Whole)×100' },
        { q: 'Speed formula?',                 a: 'Distance/Time' },
        { q: 'Profit% formula?',               a: '(Profit/CP)×100' },
        { q: 'Area of circle?',                a: 'πr²' },
        { q: 'Pythagoras theorem?',            a: 'a²+b²=c²' },
        { q: 'Average formula?',               a: 'Sum/Count' },
        { q: 'CI formula?',                    a: 'P(1+R/100)^T−P' },
        { q: 'Quadratic formula?',             a: '(−b±√(b²−4ac))/2a' },
        { q: 'Ratio proportion cross rule?',   a: 'ad=bc' },
      ];
      return items.slice(0, count).map((x, i) => ({ id: i + 1, question: x.q, answer: x.a, type: 'text' }));
    },
    tables: () =>
      Array.from({ length: count }, (_, i) => {
        const a = rand(2, 20), b = rand(2, 12);
        return { id: i + 1, question: `${a} × ${b} = ?`, answer: String(a * b), type: 'number' };
      }),
    'squares-cubes': () =>
      Array.from({ length: count }, (_, i) => {
        const n = rand(1, 25);
        const isCube = Math.random() > 0.5;
        return {
          id: i + 1,
          question: isCube ? `${n}³ = ?` : `${n}² = ?`,
          answer: String(isCube ? n ** 3 : n ** 2),
          type: 'number',
        };
      }),
    'mul-div': () =>
      Array.from({ length: count }, (_, i) => {
        const a = rand(2, 99), b = rand(2, 12);
        const isDivision = Math.random() > 0.5 && a % b === 0;
        return {
          id: i + 1,
          question: isDivision ? `${a} ÷ ${b} = ?` : `${a} × ${b} = ?`,
          answer: String(isDivision ? a / b : a * b),
          type: 'number',
        };
      }),
    fractions: () => {
      const fracs = [
        { q: '1/2 as decimal?', a: '0.5' },
        { q: '1/4 as decimal?', a: '0.25' },
        { q: '3/4 as percent?', a: '75%' },
        { q: '1/3 as percent?', a: '33.33%' },
        { q: '2/3 as percent?', a: '66.67%' },
        { q: '1/5 as decimal?', a: '0.2' },
        { q: '1/8 as decimal?', a: '0.125' },
        { q: '3/8 as percent?', a: '37.5%' },
        { q: '1/6 as percent?', a: '16.67%' },
        { q: '1/7 as decimal?', a: '0.1428' },
      ];
      return fracs.slice(0, count).map((x, i) => ({ id: i + 1, question: x.q, answer: x.a, type: 'text' }));
    },
    basic: () =>
      Array.from({ length: count }, (_, i) => {
        const a = rand(10, 999), b = rand(10, 999);
        const ops = ['+', '-', '×'];
        const op = ops[rand(0, 1)];
        const result = op === '+' ? a + b : op === '-' ? Math.abs(a - b) : a * b;
        const q = op === '-' ? `${Math.max(a, b)} − ${Math.min(a, b)} = ?` : `${a} ${op} ${b} = ?`;
        return { id: i + 1, question: q, answer: String(result), type: 'number' };
      }),
  };

  return (generators[topic] ?? generators.basic)();
}

export function useSpeedMathPractice(topic) {
  const [questions, setQuestions]   = useState([]);
  const [answers, setAnswers]       = useState({});
  const [submitted, setSubmitted]   = useState(false);
  const [score, setScore]           = useState(null);

  const start = useCallback(() => {
    const qs = generateQuestions(topic);
    setQuestions(qs);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  }, [topic]);

  const setAnswer = useCallback((id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  }, []);

  const submit = useCallback(() => {
    let correct = 0;
    const results = questions.map(q => {
      const userAns = (answers[q.id] ?? '').toString().trim().toLowerCase();
      const correctAns = q.answer.toString().trim().toLowerCase();
      const isCorrect = userAns === correctAns;
      if (isCorrect) correct++;
      return { ...q, userAnswer: answers[q.id] ?? '', isCorrect };
    });
    setQuestions(results);
    setScore({ correct, total: questions.length, percent: Math.round((correct / questions.length) * 100) });
    setSubmitted(true);
  }, [questions, answers]);

  const reset = useCallback(() => {
    setQuestions([]);
    setAnswers({});
    setSubmitted(false);
    setScore(null);
  }, []);

  return { questions, answers, submitted, score, start, setAnswer, submit, reset };
}
