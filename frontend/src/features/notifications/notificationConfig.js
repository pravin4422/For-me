import {
  CheckSquare, BookOpen, RotateCcw, FileText, Target,
  ShoppingCart, Wallet, Briefcase, Megaphone
} from 'lucide-react';

export const NotificationCategory = {
  Task:             'Task',
  StudyReminder:    'StudyReminder',
  RevisionReminder: 'RevisionReminder',
  ExamReminder:     'ExamReminder',
  MockTestReminder: 'MockTestReminder',
  ShoppingReminder: 'ShoppingReminder',
  BudgetReminder:   'BudgetReminder',
  CareerUpdate:     'CareerUpdate',
  Announcement:     'Announcement',
};

export const CATEGORY_META = {
  [NotificationCategory.Task]:             { label: 'Tasks',              icon: CheckSquare,  color: '#5f59f7', path: '/dashboard/todo' },
  [NotificationCategory.StudyReminder]:    { label: 'Study Reminders',    icon: BookOpen,     color: '#44c2fd', path: '/dashboard/study' },
  [NotificationCategory.RevisionReminder]: { label: 'Revision Reminders', icon: RotateCcw,    color: '#6592fd', path: '/dashboard/study/revision' },
  [NotificationCategory.ExamReminder]:     { label: 'Exam Reminders',     icon: FileText,     color: '#8c61ff', path: '/dashboard/exams' },
  [NotificationCategory.MockTestReminder]: { label: 'Mock Test Reminders',icon: Target,       color: '#f59e0b', path: '/dashboard/mock-test' },
  [NotificationCategory.ShoppingReminder]: { label: 'Shopping Reminders', icon: ShoppingCart, color: '#10b981', path: '/dashboard/shopping' },
  [NotificationCategory.BudgetReminder]:   { label: 'Budget Reminders',   icon: Wallet,       color: '#ef4444', path: '/dashboard/budget' },
  [NotificationCategory.CareerUpdate]:     { label: 'Career / Company',   icon: Briefcase,    color: '#f97316', path: '/dashboard/career' },
  [NotificationCategory.Announcement]:     { label: 'Announcements',      icon: Megaphone,    color: '#343090', path: '/dashboard' },
};
