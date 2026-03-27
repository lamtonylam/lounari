import { describe, it, expect } from 'vitest';
import { calculateOptimalLunchDistribution } from './lunch';

describe('calculateOptimalLunchDistribution', () => {
  it('handles negative and zero sums correctly', () => {
    expect(calculateOptimalLunchDistribution(0)).toEqual({ cardPayments: [], cashPayments: 0 });
    expect(calculateOptimalLunchDistribution(-5)).toEqual({ cardPayments: [], cashPayments: 0 });
    expect(calculateOptimalLunchDistribution(-14)).toEqual({ cardPayments: [], cashPayments: 0 });
  });

  it('handles invalid or non-finite inputs', () => {
    expect(calculateOptimalLunchDistribution(NaN)).toEqual({ cardPayments: [], cashPayments: 0 });
    expect(calculateOptimalLunchDistribution(Infinity)).toEqual({
      cardPayments: [],
      cashPayments: 0,
    });
    expect(calculateOptimalLunchDistribution(-Infinity)).toEqual({
      cardPayments: [],
      cashPayments: 0,
    });
  });

  it('handles sums less than LUNCH_MIN (11.73)', () => {
    expect(calculateOptimalLunchDistribution(10.5)).toEqual({
      cardPayments: [],
      cashPayments: 10.5,
    });
    expect(calculateOptimalLunchDistribution(11.72)).toEqual({
      cardPayments: [],
      cashPayments: 11.72,
    });
  });

  it('handles exactly LUNCH_MIN (11.73)', () => {
    expect(calculateOptimalLunchDistribution(11.73)).toEqual({
      cardPayments: [11.73],
      cashPayments: 0,
    });
  });

  it('handles exactly LUNCH_MAX (14.00)', () => {
    expect(calculateOptimalLunchDistribution(14.0)).toEqual({
      cardPayments: [14.0],
      cashPayments: 0,
    });
  });

  it('handles sums between LUNCH_MIN and LUNCH_MAX (e.g. 13.00)', () => {
    expect(calculateOptimalLunchDistribution(13.0)).toEqual({
      cardPayments: [13.0],
      cashPayments: 0,
    });
  });

  it('handles exactly above LUNCH_MAX (14.01)', () => {
    expect(calculateOptimalLunchDistribution(14.01)).toEqual({
      cardPayments: [14.0],
      cashPayments: 0.01,
    });
  });

  it('handles sums above LUNCH_MAX but below 2*LUNCH_MIN (e.g., 20.00)', () => {
    expect(calculateOptimalLunchDistribution(20.0)).toEqual({
      cardPayments: [14.0],
      cashPayments: 6.0,
    });
  });

  it('handles exactly 2 * LUNCH_MIN (23.46)', () => {
    expect(calculateOptimalLunchDistribution(23.46)).toEqual({
      cardPayments: [11.73, 11.73],
      cashPayments: 0,
    });
  });

  it('handles sums perfectly fitting multiple cards without cash (e.g., 25.00)', () => {
    expect(calculateOptimalLunchDistribution(25.0)).toEqual({
      cardPayments: [13.27, 11.73],
      cashPayments: 0,
    });
  });

  it('handles exactly 2 * LUNCH_MAX (28.00)', () => {
    expect(calculateOptimalLunchDistribution(28.0)).toEqual({
      cardPayments: [14.0, 14.0],
      cashPayments: 0,
    });
  });

  it('handles extremely large valid sums (e.g. 100.00)', () => {
    expect(calculateOptimalLunchDistribution(100.0)).toEqual({
      cardPayments: [14.0, 14.0, 13.35, 11.73, 11.73, 11.73, 11.73, 11.73],
      cashPayments: 0,
    });
  });

  it('distributes correctly where cash is inevitable for larger sums', () => {
    expect(calculateOptimalLunchDistribution(42.03)).toEqual({
      cardPayments: [14.0, 14.0, 14.0],
      cashPayments: 0.03,
    });
  });

  it('handles floating point parsing edge cases without precision errors', () => {
    const res = calculateOptimalLunchDistribution(25.73);
    expect(res).toEqual({
      cardPayments: [14.0, 11.73],
      cashPayments: 0,
    });
  });
});
