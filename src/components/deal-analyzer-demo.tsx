"use client";

import { useMemo, useState } from "react";

const initial = { price: "500000", renovation: "30000", acquisition: "10000", rent: "3500", expenses: "1300" };
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="deal-metric"><span>{label}</span><strong>{value}</strong></div>;
}

export function DealAnalyzerDemo() {
  const [values, setValues] = useState(initial);
  const analysis = useMemo(() => {
    const price = Number(values.price) || 0;
    const renovation = Number(values.renovation) || 0;
    const acquisition = Number(values.acquisition) || 0;
    const rent = Number(values.rent) || 0;
    const expenses = Number(values.expenses) || 0;
    const totalBasis = price + renovation + acquisition;
    const monthlyNoi = rent - expenses;
    const annualNoi = monthlyNoi * 12;
    return { totalBasis, monthlyNoi, annualNoi, capRate: totalBasis > 0 ? annualNoi / totalBasis : 0, grossYield: totalBasis > 0 ? (rent * 12) / totalBasis : 0 };
  }, [values]);

  function update(key: keyof typeof initial, value: string) {
    if (value && !/^\d{0,9}$/.test(value)) return;
    setValues((current) => ({ ...current, [key]: value }));
  }

  const fields: { key: keyof typeof initial; label: string; prefix: string; suffix?: string }[] = [
    { key: "price", label: "Purchase price", prefix: "$" },
    { key: "renovation", label: "Renovation budget", prefix: "$" },
    { key: "acquisition", label: "Other acquisition costs", prefix: "$" },
    { key: "rent", label: "Estimated monthly rent", prefix: "$" },
    { key: "expenses", label: "Estimated monthly expenses", prefix: "$" },
  ];

  return <section className="deal-demo" aria-labelledby="deal-demo-title"><div className="deal-demo-heading"><div><div className="section-kicker"><span>PRODUCT PREVIEW / INTERACTIVE</span></div><h2 id="deal-demo-title">Explore the<br /><span>deal assumptions.</span></h2></div><span className="sample-badge"><i /> SAMPLE SCENARIO</span></div><p className="deal-demo-intro">Adjust the example inputs and see how a few basic property assumptions change the illustrative metrics. Values are for demonstration only.</p><div className="deal-demo-grid"><div className="deal-inputs">{fields.map(({ key, label, prefix }) => <label className="deal-field" key={key}>{label}<span className="deal-input-wrap"><span>{prefix}</span><input inputMode="numeric" aria-label={label} value={values[key]} onChange={(event) => update(key, event.target.value)} /></span></label>)}</div><div className="deal-results"><div className="deal-results-top"><span>ILLUSTRATIVE OUTPUT</span><span>USD / ANNUALIZED</span></div><Metric label="Total acquisition basis" value={usd.format(analysis.totalBasis)} /><Metric label="Estimated monthly NOI" value={usd.format(analysis.monthlyNoi)} /><Metric label="Estimated annual NOI" value={usd.format(analysis.annualNoi)} /><div className="deal-highlight"><span>ILLUSTRATIVE CAP RATE</span><strong>{(analysis.capRate * 100).toFixed(1)}%</strong><small>Annual NOI ÷ total acquisition basis</small></div><div className="deal-secondary"><span>Gross rent yield</span><strong>{(analysis.grossYield * 100).toFixed(1)}%</strong></div></div></div><p className="deal-demo-disclaimer">This educational calculator uses simplified assumptions. It excludes financing, taxes, vacancy, maintenance variation, and other factors. It is not investment advice and does not evaluate a real property or predict returns.</p></section>;
}
