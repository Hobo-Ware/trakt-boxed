import type { VipDealPlan } from '$lib/sections/vip/models/VipDealPlan.ts';
import type { VipPlan } from '$lib/sections/vip/models/VipPlan.ts';
import { isTwoYearDealPlan } from './isTwoYearDealPlan.ts';

export function findTwoYearDealPlan(
  plans: ReadonlyArray<VipPlan>,
): VipDealPlan | undefined {
  return plans.find(isTwoYearDealPlan);
}
