import { useEffect, useRef, useCallback } from 'react';

/**
 * ReminderScheduler
 *
 * Two reminder modes:
 *  1. One-off  — task.reminder (datetime-local string), fires once.
 *  2. Repeating — task.reminderTime (HH:MM string), fires every cycle
 *     at that time on the task's current dueDate day.
 *
 * Polls every 30 s for accuracy.
 * Swap onToast / onFeedPush for a real push service without touching UI.
 */
export default function useReminderScheduler(tasks, { onToast, onFeedPush, onMarkOverdue }) {
  const firedRef = useRef(new Set());

  const check = useCallback(() => {
    const now = new Date();
    const nowMs = now.getTime();

    tasks.forEach(task => {
      if (task.completed) return;

      // ── repeating reminder: fire at reminderTime (HH:MM) on the due date ──
      if (task.repeat && task.repeat !== 'none' && task.reminderEnabled && task.reminderTime && task.dueDate) {
        const due = new Date(task.dueDate);
        const [hh, mm] = task.reminderTime.split(':').map(Number);
        // build the exact fire datetime: same calendar day as dueDate, at HH:MM
        const fireAt = new Date(due.getFullYear(), due.getMonth(), due.getDate(), hh, mm, 0, 0);
        const fireMs = fireAt.getTime();
        // fire if we're within the current minute window (nowMs >= fireMs and < fireMs + 60s)
        const key = `${task.id}-repeat-${task.dueDate}-${task.reminderTime}`;
        if (nowMs >= fireMs && nowMs < fireMs + 60_000 && !firedRef.current.has(key)) {
          firedRef.current.add(key);
          onToast?.({ task });
          onFeedPush?.({
            id: `todo-reminder-${task.id}-${Date.now()}`,
            type: 'reminder',
            title: `Reminder: ${task.title}`,
            body: `Repeats ${task.repeat} at ${task.reminderTime}`,
            taskId: task.id,
            timestamp: now.toISOString(),
          });
        }
      }

      // ── one-off reminder: task.reminder is a full datetime-local string ──
      if (task.reminderEnabled && task.reminder && !(task.repeat && task.repeat !== 'none')) {
        const fireMs = new Date(task.reminder).getTime();
        if (!fireMs) return;
        const key = `${task.id}-once-${task.reminder}`;
        if (nowMs >= fireMs && nowMs < fireMs + 60_000 && !firedRef.current.has(key)) {
          firedRef.current.add(key);
          onToast?.({ task });
          onFeedPush?.({
            id: `todo-reminder-${task.id}-${Date.now()}`,
            type: 'reminder',
            title: `Reminder: ${task.title}`,
            body: task.dueDate ? `Due: ${task.dueDate}` : 'Task reminder',
            taskId: task.id,
            timestamp: now.toISOString(),
          });
        }
      }

      // ── overdue check ──
      if (task.dueDate) {
        const dueMs = new Date(task.dueDate).getTime();
        if (dueMs < nowMs && !task.overdue) {
          onMarkOverdue?.(task.id);
        }
      }
    });
  }, [tasks, onToast, onFeedPush, onMarkOverdue]);

  useEffect(() => {
    check();
    const id = setInterval(check, 30_000);
    return () => clearInterval(id);
  }, [check]);
}
