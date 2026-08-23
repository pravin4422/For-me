import { Target } from 'lucide-react';
import ModulePage from '../../components/common/ModulePage';
export const NewMockTest = () => <ModulePage title="Start New Mock Test" icon={<Target size={32} />} description="Select an exam, subject, and topic to begin." />;
export const MockResults = () => <ModulePage title="Results" icon={<Target size={32} />} description="No mock test results yet." />;
export const MockAnalysis = () => <ModulePage title="Performance Analysis" icon={<Target size={32} />} description="Complete mock tests to see your performance analysis." />;
