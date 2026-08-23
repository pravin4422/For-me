import { CheckSquare } from 'lucide-react';
import ModulePage from '../../components/common/ModulePage';
export const DailyTasks = () => <ModulePage title="Daily Tasks" icon={<CheckSquare size={32} />} description="No daily tasks yet — add your first task." />;
export const WeeklyTasks = () => <ModulePage title="Weekly Tasks" icon={<CheckSquare size={32} />} description="No weekly tasks yet — plan your week." />;
export const MonthlyTasks = () => <ModulePage title="Monthly Tasks" icon={<CheckSquare size={32} />} description="No monthly tasks yet — set your monthly goals." />;
