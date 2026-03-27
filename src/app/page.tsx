'use client';

import { useState } from 'react';
import { calculateOptimalLunchDistribution } from '@/lib/lunch';

export default function Home() {
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<{
    cardPayments: number[];
    cashPayments: number;
  } | null>(null);

  const [checkedCards, setCheckedCards] = useState<boolean[]>([]);
  const [checkedCash, setCheckedCash] = useState<boolean>(false);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num)) return;
    const dist = calculateOptimalLunchDistribution(num);
    setResult(dist);
    setCheckedCards(new Array(dist.cardPayments.length).fill(false));
    setCheckedCash(false);
  };

  const toggleCard = (index: number) => {
    setCheckedCards((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-6 px-4 pb-12">
      <div className="w-full w-full max-w-none">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-6 tracking-tight">
          Lounari-optimoija
        </h1>

        <form onSubmit={calculate} className="space-y-5">
          <div>
            <label htmlFor="amount" className="block text-base font-semibold text-neutral-700 mb-2">
              Loppusumma (€)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-xl border border-neutral-200 px-4 py-3 bg-neutral-50 text-neutral-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              placeholder="0.00"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-lg font-bold text-white bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Laske
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-4 pt-6 border-t border-neutral-100">
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <h3 className="font-semibold text-blue-900 flex items-center justify-between mb-4">
                <span>Korttimaksut 💳</span>
                <span className="bg-blue-100 text-blue-800 text-xs py-1 px-3 rounded-full">
                  {result.cardPayments.length} yhteensä
                </span>
              </h3>
              <ul className="text-base text-blue-900 space-y-3">
                {result.cardPayments.length === 0 ? (
                  <li className="text-blue-600/70 italic">Ei korttimaksuja</li>
                ) : (
                  result.cardPayments.map((payment, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between border-b border-blue-100/50 pb-3 last:border-0 last:pb-0"
                    >
                      <label className="flex items-center flex-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checkedCards[i] || false}
                          onChange={() => toggleCard(i)}
                          className="w-6 h-6 rounded border-blue-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <span
                          className={`transition-opacity ${checkedCards[i] ? 'opacity-40 line-through' : ''}`}
                        >
                          Maksu {i + 1}
                        </span>
                      </label>
                      <span
                        className={`font-semibold text-lg transition-opacity ${checkedCards[i] ? 'opacity-40 line-through' : ''}`}
                      >
                        €{payment.toFixed(2)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-colors ${checkedCash ? 'bg-emerald-50/20 border-emerald-100/50' : 'bg-emerald-50/50 border-emerald-100'}`}
            >
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkedCash}
                  onChange={() => setCheckedCash(!checkedCash)}
                  className="w-6 h-6 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 mr-3"
                />
                <div
                  className={`flex-1 transition-opacity ${checkedCash ? 'opacity-40 line-through' : ''}`}
                >
                  <h3 className="font-semibold text-emerald-900 mb-1">Ylijäävä summa 💶</h3>
                  <p className="text-2xl font-bold text-emerald-700">
                    €{result.cashPayments.toFixed(2)}
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
