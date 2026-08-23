import axiosInstance from '../axios/axiosInstance';

// ── Static mock data (used when backend is not connected) ──────────────────
const MOCK_EXAMS = [
  { _id: 'rrb-ntpc',    name: 'RRB NTPC',    markingScheme: { positive: 1, negative: 0.33 }, totalQuestions: 100, durationMinutes: 90 },
  { _id: 'ssc-cgl',     name: 'SSC CGL',     markingScheme: { positive: 2, negative: 0.5  }, totalQuestions: 100, durationMinutes: 60 },
  { _id: 'ibps-po',     name: 'IBPS PO',     markingScheme: { positive: 1, negative: 0.25 }, totalQuestions: 100, durationMinutes: 60 },
  { _id: 'tnpsc-grp2',  name: 'TNPSC Group 2', markingScheme: { positive: 1, negative: 0 }, totalQuestions: 200, durationMinutes: 180 },
];

const MOCK_SUBJECTS = {
  'rrb-ntpc':   [{ _id: 'math', name: 'Mathematics' }, { _id: 'reasoning', name: 'Reasoning' }, { _id: 'gk', name: 'General Knowledge' }],
  'ssc-cgl':    [{ _id: 'quant', name: 'Quantitative Aptitude' }, { _id: 'english', name: 'English' }, { _id: 'reasoning', name: 'Reasoning' }, { _id: 'gk', name: 'General Awareness' }],
  'ibps-po':    [{ _id: 'reasoning', name: 'Reasoning' }, { _id: 'quant', name: 'Quantitative Aptitude' }, { _id: 'english', name: 'English' }],
  'tnpsc-grp2': [{ _id: 'gk', name: 'General Studies' }, { _id: 'aptitude', name: 'Aptitude & Mental Ability' }],
};

const MOCK_TOPICS = {
  math:      [{ _id: 'percentage', name: 'Percentage' }, { _id: 'time-work', name: 'Time & Work' }, { _id: 'profit-loss', name: 'Profit & Loss' }, { _id: 'si-ci', name: 'Simple & Compound Interest' }],
  reasoning: [{ _id: 'series', name: 'Number Series' }, { _id: 'analogy', name: 'Analogy' }, { _id: 'coding', name: 'Coding-Decoding' }, { _id: 'syllogism', name: 'Syllogism' }],
  gk:        [{ _id: 'history', name: 'History' }, { _id: 'geography', name: 'Geography' }, { _id: 'polity', name: 'Polity' }, { _id: 'science', name: 'Science' }],
  quant:     [{ _id: 'percentage', name: 'Percentage' }, { _id: 'time-work', name: 'Time & Work' }, { _id: 'algebra', name: 'Algebra' }],
  english:   [{ _id: 'grammar', name: 'Grammar' }, { _id: 'vocab', name: 'Vocabulary' }, { _id: 'rc', name: 'Reading Comprehension' }],
  aptitude:  [{ _id: 'series', name: 'Number Series' }, { _id: 'analogy', name: 'Analogy' }],
};

const MOCK_EXAM_CONFIGS = {
  'rrb-ntpc':   { _id: 'rrb-ntpc', name: 'RRB NTPC', totalQuestions: 100, durationMinutes: 90, durationSeconds: 5400, markingScheme: { positive: 1, negative: 0.33 }, sections: [{ id: 'math', name: 'Mathematics', questionCount: 30 }, { id: 'reasoning', name: 'Reasoning', questionCount: 30 }, { id: 'gk', name: 'General Knowledge', questionCount: 40 }], instructions: ['Do not refresh the page during the test.', 'Ensure stable internet connection.'] },
  'ssc-cgl':    { _id: 'ssc-cgl',  name: 'SSC CGL',  totalQuestions: 100, durationMinutes: 60, durationSeconds: 3600, markingScheme: { positive: 2, negative: 0.5  }, sections: [{ id: 'quant', name: 'Quantitative Aptitude', questionCount: 25 }, { id: 'english', name: 'English', questionCount: 25 }, { id: 'reasoning', name: 'Reasoning', questionCount: 25 }, { id: 'gk', name: 'General Awareness', questionCount: 25 }], instructions: [] },
  'ibps-po':    { _id: 'ibps-po',  name: 'IBPS PO',  totalQuestions: 100, durationMinutes: 60, durationSeconds: 3600, markingScheme: { positive: 1, negative: 0.25 }, sections: [{ id: 'reasoning', name: 'Reasoning', questionCount: 35 }, { id: 'quant', name: 'Quantitative Aptitude', questionCount: 35 }, { id: 'english', name: 'English', questionCount: 30 }], instructions: [] },
  'tnpsc-grp2': { _id: 'tnpsc-grp2', name: 'TNPSC Group 2', totalQuestions: 200, durationMinutes: 180, durationSeconds: 10800, markingScheme: { positive: 1, negative: 0 }, sections: [], instructions: [] },
};

// Generate sample questions for a section/topic
function generateQuestions(examId, count = 10, sectionId = 'math') {
  return Array.from({ length: count }, (_, i) => ({
    _id:           `${examId}-${sectionId}-q${i + 1}`,
    text:          `Sample Question ${i + 1}: If a train travels ${(i + 1) * 60} km in ${i + 1} hours, what is its speed?`,
    options:       [`${(i + 1) * 60} km/h`, `${(i + 1) * 30} km/h`, `${(i + 1) * 45} km/h`, `${(i + 1) * 90} km/h`],
    correctOption: 0,
    section:       sectionId,
    sectionId:     sectionId,
    topic:         'Speed & Distance',
    explanation:   `Speed = Distance / Time = ${(i + 1) * 60} / ${i + 1} = ${60} km/h.`,
  }));
}

// ── Helper to wrap mock data in axios-like response ────────────────────────
const mock = (data, delay = 200) =>
  new Promise(resolve => setTimeout(() => resolve({ data }), delay));

// ── API functions with mock fallback ──────────────────────────────────────
export const fetchExams = () =>
  axiosInstance.get('/mock-test/exams').catch(() => mock(MOCK_EXAMS));

export const fetchSubjects = (examId) =>
  axiosInstance.get(`/mock-test/exams/${examId}/subjects`).catch(() => mock(MOCK_SUBJECTS[examId] || []));

export const fetchTopics = (examId, subjectId) =>
  axiosInstance.get(`/mock-test/exams/${examId}/subjects/${subjectId}/topics`).catch(() => mock(MOCK_TOPICS[subjectId] || []));

export const fetchExamConfig = (examId) =>
  axiosInstance.get(`/mock-test/exams/${examId}/config`).catch(() => mock(MOCK_EXAM_CONFIGS[examId] || MOCK_EXAM_CONFIGS['rrb-ntpc']));

export const startAttempt = (payload) =>
  axiosInstance.post('/mock-test/attempts', payload).catch(() => {
    const config = MOCK_EXAM_CONFIGS[payload.examId] || MOCK_EXAM_CONFIGS['rrb-ntpc'];
    const attemptId = `attempt-${Date.now()}`;
    // Store meta in sessionStorage for the exam screen
    sessionStorage.setItem(`attempt_${attemptId}`, JSON.stringify(config));
    return mock({ attemptId });
  });

export const fetchQuestions = (attemptId) =>
  axiosInstance.get(`/mock-test/attempts/${attemptId}/questions`).catch(() => {
    const meta = JSON.parse(sessionStorage.getItem(`attempt_${attemptId}`) || '{}');
    const sections = meta.sections?.length ? meta.sections : [{ id: 'math', questionCount: 10 }];
    const questions = sections.flatMap(s => generateQuestions(meta._id || 'rrb-ntpc', s.questionCount, s.id));
    return mock(questions);
  });

export const submitAttempt = (attemptId, answers) =>
  axiosInstance.post(`/mock-test/attempts/${attemptId}/submit`, { answers }).catch(() => mock({ success: true }));

export const fetchResult = (attemptId) =>
  axiosInstance.get(`/mock-test/attempts/${attemptId}/result`).catch(() => {
    const stored = JSON.parse(sessionStorage.getItem(`result_${attemptId}`) || 'null');
    if (stored) return mock(stored);
    return mock({
      totalQuestions: 10, correct: 7, wrong: 2, unanswered: 1,
      score: 6.34, accuracy: '70.0', timeTaken: '00:12:34',
      sectionBreakdown: [
        { name: 'Mathematics', score: 14, maxScore: 20 },
        { name: 'Reasoning',   score: 18, maxScore: 20 },
        { name: 'General Knowledge', score: 22, maxScore: 30 },
      ],
    });
  });

export const fetchAnalysis = (attemptId) =>
  axiosInstance.get(`/mock-test/attempts/${attemptId}/analysis`).catch(() => {
    const meta = JSON.parse(sessionStorage.getItem(`attempt_${attemptId}`) || '{}');
    const sections = meta.sections?.length ? meta.sections : [{ id: 'math', questionCount: 10 }];
    const questions = sections.flatMap(s => generateQuestions(meta._id || 'rrb-ntpc', s.questionCount, s.id))
      .map((q, i) => ({ ...q, yourAnswer: i % 3 === 0 ? 1 : 0 }));
    return mock({
      examId: meta._id || 'rrb-ntpc',
      questions,
      weakTopics: [
        { topicId: 'percentage', topicName: 'Percentage',        attempted: 10, correct: 4, accuracy: 40 },
        { topicId: 'time-work',  topicName: 'Time & Work',       attempted: 8,  correct: 6, accuracy: 75 },
        { topicId: 'si-ci',      topicName: 'Simple & Compound Interest', attempted: 6, correct: 2, accuracy: 33 },
        { topicId: 'series',     topicName: 'Number Series',     attempted: 10, correct: 8, accuracy: 80 },
      ],
    });
  });
