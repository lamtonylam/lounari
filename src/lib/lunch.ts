import Decimal from "decimal.js";

type LunchPaymentResult = {
  cardPayments: number[];
  cashPayments: number;
};

// Official lunch benefit limits
const LUNCH_MIN = new Decimal("11.73");
const LUNCH_MAX = new Decimal("14.00");

export const calculateOptimalLunchDistribution = (sum: number): LunchPaymentResult => {
  // 1. Handle invalid or empty amounts
  if (!Number.isFinite(sum) || sum <= 0) {
    return { cardPayments: [], cashPayments: 0 };
  }

  const total = new Decimal(sum);

  if (total.lessThan(LUNCH_MIN)) {
    return { cardPayments: [], cashPayments: total.toDecimalPlaces(2).toNumber() };
  }

  const maxPossibleCardPayments = total.div(LUNCH_MIN).floor().toNumber();
  const minRequiredCardPayments = total.div(LUNCH_MAX).ceil().toNumber();

  const canPayEntirelyWithCards = minRequiredCardPayments <= maxPossibleCardPayments;

  let cardCount = 0;
  let amountCoveredByCards = new Decimal(0);

  if (canPayEntirelyWithCards) {
    cardCount = minRequiredCardPayments;
    amountCoveredByCards = total;
  } else {
    cardCount = maxPossibleCardPayments;
    amountCoveredByCards = LUNCH_MAX.mul(cardCount);
  }

  const cardPayments = Array(cardCount).fill(LUNCH_MIN);

  let remainingAmountToDistribute = amountCoveredByCards.minus(LUNCH_MIN.mul(cardCount));

  for (let i = 0; i < cardCount && remainingAmountToDistribute.greaterThan(0); i++) {
    const spaceLeftOnCard = LUNCH_MAX.minus(LUNCH_MIN);
    const amountToAdd = Decimal.min(spaceLeftOnCard, remainingAmountToDistribute);

    cardPayments[i] = cardPayments[i].plus(amountToAdd);
    remainingAmountToDistribute = remainingAmountToDistribute.minus(amountToAdd);
  }

  const cashPayments = total.minus(amountCoveredByCards);

  return {
    cardPayments: cardPayments.map((val) => val.toDecimalPlaces(2).toNumber()),
    cashPayments: cashPayments.toDecimalPlaces(2).toNumber(),
  };
};
