import { ShoppingCart } from 'lucide-react';
import ModulePage from '../../components/common/ModulePage';
export const ShoppingItems = () => <ModulePage title="Items" icon={<ShoppingCart size={32} />} description="No shopping items yet — add items to your list." />;
export const ShoppingWeekly = () => <ModulePage title="Weekly List" icon={<ShoppingCart size={32} />} description="No weekly shopping list yet." />;
export const ShoppingMonthly = () => <ModulePage title="Monthly List" icon={<ShoppingCart size={32} />} description="No monthly shopping list yet." />;
export const ShoppingYearly = () => <ModulePage title="Yearly List" icon={<ShoppingCart size={32} />} description="No yearly shopping list yet." />;
