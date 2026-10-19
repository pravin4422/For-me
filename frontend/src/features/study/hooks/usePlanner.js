import { useState, useEffect, useCallback } from 'react';
import * as api from '../../../api/study/plannerApi';

export function usePlanner(parentId = null, type = 'planner') {
  const [plans, setPlans]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.getPlans(parentId, type)
      .then(r => { if (!cancelled) setPlans(r.data.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [parentId, type]);

  const addPlan = useCallback(async (name) => {
    const r = await api.createPlan(name, parentId, type);
    setPlans(p => [r.data.data, ...p]);
    return r.data.data;
  }, [parentId, type]);

  const removePlan = useCallback(async (id) => {
    await api.deletePlan(id);
    setPlans(p => p.filter(pl => pl._id !== id));
  }, []);

  return { plans, loading, addPlan, removePlan };
}

export function usePlanItems(planId) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) return;
    let cancelled = false;
    setLoading(true);
    api.getItems(planId)
      .then(r => { if (!cancelled) setItems(r.data.data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [planId]);

  const addItem = useCallback(async (text) => {
    const r = await api.createItem(planId, text);
    setItems(p => [...p, r.data.data]);
  }, [planId]);

  const removeItem = useCallback(async (itemId) => {
    await api.deleteItem(planId, itemId);
    setItems(p => p.filter(i => i._id !== itemId));
  }, [planId]);

  const toggleItem = useCallback(async (itemId) => {
    const r = await api.toggleItem(planId, itemId);
    setItems(p => p.map(i => i._id === itemId ? r.data.data : i));
  }, [planId]);

  const incrementItem = useCallback(async (itemId) => {
    const r = await api.incrementItem(planId, itemId);
    setItems(p => p.map(i => i._id === itemId ? r.data.data : i));
  }, [planId]);

  return { items, loading, addItem, removeItem, toggleItem, incrementItem };
}
