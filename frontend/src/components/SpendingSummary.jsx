import React, {useEffect,useState, useMemo} from "react";
import '../styles/SpendingSummary.css'
import { getSpendingSummary } from "../services/aiService";


const KNOWN_CATEGORIES = new Set([
  'Food', 'Shopping', 'Education', 'Transport', 'Entertainment', 'Healthcare', 'Other',
])

const CATEGORY_COLORS = {
  Food: '#00e5a0',
  Shopping: '#5b8def',
  Education: '#f5b942',
  Transport: '#c792ea',
  Entertainment: '#ff8a5c',
  Healthcare: '#ff5470',
  Other: '#7c869f',
}

const EMPTY_TOTALS = () => ({
  Food: 0, Shopping: 0, Education: 0,
  Transport: 0, Entertainment: 0, Healthcare: 0, Other: 0,
})

const SpendingSummary = ({ transactions = [] }) => {
 
  // Aggregate spending amounts by backend-supplied category.
  const totals = useMemo(() => {
    const acc = EMPTY_TOTALS()
 
    transactions
      .filter(t => t.type === 'WITHDRAW' || t.type === 'TRANSFER_OUT')
      .forEach(t => {
        // category comes from the DB — normalise to known set or fall back to Other.
        const raw = t.category
        const cat = (raw && KNOWN_CATEGORIES.has(raw)) ? raw : 'Other'
        acc[cat] = acc[cat] + Number(t.amount)
      })
 
    return acc
  }, [transactions])
 
  const entries     = Object.entries(totals)
  const total       = entries.reduce((sum, [, v]) => sum + v, 0)
  const hasSpending = total > 0
 
  // Descending by amount so the biggest category is always on top.
  const sorted = [...entries].sort((a, b) => b[1] - a[1])
 
  return (
    <div className="spending-summary-card">
 
      <div className="spending-summary-header">
        <span className="spending-summary-title">Spending by Category</span>
      </div>
 
      {!hasSpending && (
        <div className="spending-empty-state">
          No spending yet. Make a few withdrawals or transfers to see a breakdown.
        </div>
      )}
 
      {hasSpending && (
        <div className="spending-summary-list">
          {sorted
            .filter(([, amount]) => amount > 0)
            .map(([category, amount]) => {
              const percent = (amount / total) * 100
              return (
                <div className="spending-row" key={category}>
                  <div className="spending-row-top">
                    <span className="spending-category-name">
                      <span
                        className="spending-dot"
                        style={{ background: CATEGORY_COLORS[category] }}
                      />
                      {category}
                    </span>
                    <span className="spending-category-amount">
                      ₹{amount.toFixed(2)}
                    </span>
                  </div>
 
                  <div className="spending-bar-track">
                    <div
                      className="spending-bar-fill"
                      style={{
                        width:      `${percent}%`,
                        background: CATEGORY_COLORS[category],
                      }}
                    />
                  </div>
 
                  <span className="spending-percent">
                    {percent.toFixed(1)}%
                  </span>
                </div>
              )
            })}
        </div>
      )}
 
    </div>
  )
}
 
export default SpendingSummary