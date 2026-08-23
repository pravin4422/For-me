import { useState, useEffect } from 'react';

const STUDY_DATA = {
  formulas: [
    { id: 1, title: 'Percentage Formula',       content: 'Percentage = (Part / Whole) × 100' },
    { id: 2, title: 'Simple Interest',           content: 'SI = (P × R × T) / 100' },
    { id: 3, title: 'Compound Interest',         content: 'CI = P(1 + R/100)^T − P' },
    { id: 4, title: 'Profit & Loss',             content: 'Profit% = (Profit / CP) × 100' },
    { id: 5, title: 'Speed, Distance & Time',    content: 'Speed = Distance / Time' },
    { id: 6, title: 'Average',                   content: 'Average = Sum of values / Count' },
    { id: 7, title: 'Ratio & Proportion',        content: 'a/b = c/d  →  ad = bc' },
    { id: 8, title: 'Area of Circle',            content: 'A = πr²' },
    { id: 9, title: 'Pythagoras Theorem',        content: 'a² + b² = c²' },
    { id: 10, title: 'Quadratic Formula',        content: 'x = (−b ± √(b²−4ac)) / 2a' },
  ],
  tables: Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    rows: Array.from({ length: 10 }, (_, j) => ({
      multiplier: j + 1,
      result: (i + 1) * (j + 1),
    })),
  })),
  'squares-cubes': Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    n: i + 1,
    square: (i + 1) ** 2,
    cube: (i + 1) ** 3,
  })),
  'mul-div': [
    { id: 1, title: 'Multiply by 11',    content: 'ab × 11 = a(a+b)b  (carry if sum > 9)' },
    { id: 2, title: 'Multiply by 5',     content: 'n × 5 = n / 2 × 10' },
    { id: 3, title: 'Multiply by 25',    content: 'n × 25 = n / 4 × 100' },
    { id: 4, title: 'Divide by 5',       content: 'n ÷ 5 = n × 2 / 10' },
    { id: 5, title: 'Multiply by 9',     content: 'n × 9 = n × 10 − n' },
    { id: 6, title: 'Multiply by 99',    content: 'n × 99 = n × 100 − n' },
    { id: 7, title: 'Squaring ending 5', content: 'a5² = a(a+1) | 25  e.g. 35² = 1225' },
  ],
  fractions: [
    { id: 1, title: '1/2',  decimal: '0.5',    percent: '50%' },
    { id: 2, title: '1/3',  decimal: '0.333…', percent: '33.33%' },
    { id: 3, title: '1/4',  decimal: '0.25',   percent: '25%' },
    { id: 4, title: '1/5',  decimal: '0.2',    percent: '20%' },
    { id: 5, title: '1/6',  decimal: '0.1666…',percent: '16.67%' },
    { id: 6, title: '1/7',  decimal: '0.1428…',percent: '14.28%' },
    { id: 7, title: '1/8',  decimal: '0.125',  percent: '12.5%' },
    { id: 8, title: '2/3',  decimal: '0.666…', percent: '66.67%' },
    { id: 9, title: '3/4',  decimal: '0.75',   percent: '75%' },
    { id: 10, title: '3/8', decimal: '0.375',  percent: '37.5%' },
  ],
  basic: [
    { id: 1, title: 'BODMAS Rule',       content: 'Brackets → Orders → Division → Multiplication → Addition → Subtraction' },
    { id: 2, title: 'Divisibility by 2', content: 'Last digit is even (0,2,4,6,8)' },
    { id: 3, title: 'Divisibility by 3', content: 'Sum of digits divisible by 3' },
    { id: 4, title: 'Divisibility by 9', content: 'Sum of digits divisible by 9' },
    { id: 5, title: 'Divisibility by 11',content: '(Sum of odd-position digits) − (Sum of even-position digits) = 0 or 11' },
    { id: 6, title: 'LCM × HCF',        content: 'LCM × HCF = Product of two numbers' },
  ],
};

export function useSpeedMathData(topic) {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    // Simulate async fetch; replace with real API call
    const timer = setTimeout(() => {
      setData(STUDY_DATA[topic] ?? []);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [topic]);

  return { data, loading };
}
