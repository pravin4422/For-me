import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import './aptitude.css';

const CONCEPTS = [
  {
    topic: 'Percentage',
    theory: 'Percentage means "per hundred". It is a ratio expressed as a fraction of 100.',
    keyPoints: [
      'To convert fraction to %: multiply by 100',
      'x% of y = (x/100) × y',
      'Percentage increase = (increase/original) × 100',
      'Percentage decrease = (decrease/original) × 100',
    ],
    traps: 'Percentage increase and decrease are NOT symmetric. A 20% increase followed by 20% decrease gives a net −4%, not 0%.',
  },
  {
    topic: 'Profit & Loss',
    theory: 'Profit or Loss is always calculated on Cost Price (CP). Selling Price (SP) is what the buyer pays.',
    keyPoints: [
      'Profit = SP − CP; Loss = CP − SP',
      'Profit% = (Profit/CP) × 100',
      'SP = CP × (100 + P%) / 100',
      'CP = SP × 100 / (100 + P%)',
    ],
    traps: 'Marked Price (MP) ≠ SP. Discount is on MP, profit/loss is on CP. Don\'t confuse them.',
  },
  {
    topic: 'Time & Work',
    theory: 'If a person completes work in n days, their 1-day work = 1/n. Combine rates for multiple workers.',
    keyPoints: [
      '1-day work of A = 1/a, B = 1/b',
      'Together: 1/a + 1/b per day',
      'Total days together = ab/(a+b)',
      'Use LCM method for complex problems',
    ],
    traps: 'When a person leaves midway, calculate work done separately for each phase.',
  },
  {
    topic: 'Ratio & Proportion',
    theory: 'A ratio a:b compares two quantities. Proportion states two ratios are equal: a:b = c:d.',
    keyPoints: [
      'a:b = ka:kb for any k ≠ 0',
      'Componendo: (a+b)/b = (c+d)/d',
      'Dividendo: (a−b)/b = (c−d)/d',
      'Cross multiplication: ad = bc',
    ],
    traps: 'Ratio is dimensionless — always compare same units before forming a ratio.',
  },
  {
    topic: 'Speed & Distance',
    theory: 'Speed = Distance / Time. All three are interrelated. Consistent units are critical.',
    keyPoints: [
      '1 km/h = 5/18 m/s',
      'Average speed = Total distance / Total time (NOT average of speeds)',
      'Relative speed (opposite) = S1 + S2',
      'Relative speed (same direction) = |S1 − S2|',
    ],
    traps: 'Average speed formula 2ab/(a+b) applies ONLY when equal distances are covered at two speeds.',
  },
  {
    topic: 'Algebra',
    theory: 'Algebraic identities and linear/quadratic equations form the backbone of aptitude algebra.',
    keyPoints: [
      '(a+b)² = a² + 2ab + b²',
      '(a−b)² = a² − 2ab + b²',
      'a² − b² = (a+b)(a−b)',
      '(a+b)³ = a³ + 3a²b + 3ab² + b³',
    ],
    traps: 'In age problems, "n years ago" means subtract n from current age, not add.',
  },
];

export default function ConceptsPage() {
  const [active, setActive] = useState(CONCEPTS[0].topic);
  const concept = CONCEPTS.find(c => c.topic === active);

  return (
    <div className="apt-page">
      <div className="apt-header">
        <div className="apt-header__left">
          <div className="apt-header__icon"><BookOpen size={18} /></div>
          <h1 className="apt-header__title">Important Concepts</h1>
        </div>
      </div>

      <div className="apt-concepts-layout">
        <div className="apt-concepts-sidebar">
          {CONCEPTS.map(c => (
            <button
              key={c.topic}
              className={`apt-concepts-sidebar__btn ${active === c.topic ? 'active' : ''}`}
              onClick={() => setActive(c.topic)}
            >
              {c.topic}
            </button>
          ))}
        </div>

        {concept && (
          <div className="apt-concepts-content">
            <div className="apt-concept-section">
              <h3>{concept.topic}</h3>
              <p>{concept.theory}</p>
              <strong style={{ fontSize: 13 }}>Key Points</strong>
              <ul>
                {concept.keyPoints.map((kp, i) => <li key={i}>{kp}</li>)}
              </ul>
              <strong style={{ fontSize: 13 }}>Common Trap</strong>
              <div className="apt-concept-trap">{concept.traps}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
