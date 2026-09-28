import * as m from '$lib/features/i18n/messages.ts';
import type { VipPlan } from '$lib/sections/vip/models/VipPlan.ts';
import { isTwoYearDealPlan } from '$lib/sections/vip/utils/isTwoYearDealPlan.ts';
import { toVipPriceLabel } from '$lib/sections/vip/utils/toVipPriceLabel.ts';

type PlanCopy = {
  name: string;
  badge: string | null;
  price: string;
  billed: string;
  action: string;
};

const toName = (plan: VipPlan) => {
  switch (plan.type) {
    case 'monthly':
      return m.boxed_vip_plan_monthly();
    case 'yearly':
      return m.boxed_vip_plan_yearly();
    case 'two_years':
      return m.boxed_vip_plan_two_years();
  }
};

const toAction = (plan: VipPlan) => {
  switch (plan.type) {
    case 'monthly':
      return m.button_text_vip_continue_monthly();
    case 'yearly':
      return m.button_text_vip_continue_yearly();
    case 'two_years':
      return m.button_text_vip_claim_deal();
  }
};

const toBadge = (plan: VipPlan) => {
  if (isTwoYearDealPlan(plan)) return m.tag_text_deal_price();
  if (plan.type === 'two_years') return m.tag_text_vip_best_value();
  if (plan.isPopular) return m.tag_text_most_popular();
  return null;
};

const toBilled = (plan: VipPlan) => {
  if (isTwoYearDealPlan(plan)) {
    return m.text_vip_billed_deal_first_term({
      price: toVipPriceLabel(plan.discount.discountedAmount),
      renewalPrice: toVipPriceLabel(plan.totalPrice),
    });
  }

  const price = toVipPriceLabel(
    plan.discount?.discountedAmount ?? plan.totalPrice,
  );
  switch (plan.type) {
    case 'monthly':
      return m.text_vip_plan_billed_monthly({ price });
    case 'yearly':
      return m.text_vip_plan_billed_yearly({ price });
    case 'two_years':
      return m.text_vip_plan_billed_two_years({ price });
  }
};

export function toPlanCopy(plan: VipPlan): PlanCopy {
  return {
    name: toName(plan),
    badge: toBadge(plan),
    price: toVipPriceLabel(
      plan.discount ? plan.discount.discountedAmountMonthly : plan.monthlyPrice,
    ),
    billed: toBilled(plan),
    action: toAction(plan),
  };
}
