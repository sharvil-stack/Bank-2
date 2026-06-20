import React, {useEffect,useState} from "react";
import '../styles/SpendingSummary.css'
import { getSpendingSummary } from "../services/aiService";

const CATEGORY_COLORS = {
  Food: '#00e5a0',
  Shopping: '#5b8def',
  Education: '#f5b942',
  Transport: '#c792ea',
  Entertainment: '#ff8a5c',
  Healthcare: '#ff5470',
  Other: '#7c869f',
}

const SpendingSummary = () => {
  const [categories, setCategories] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getSpendingSummary()
      setCategories(data.categories)
    } catch (err) {
      console.log(err)
      setError("Couldn't load spending summary right now.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const entries = categories ? Object.entries(categories) : []
  const total = entries.reduce((sum, [, amount]) => sum + amount, 0)
  const sortedEntries = [...entries].sort((a, b) => b[1] - a[1])
  const hasSpending = total > 0

  return (
    <div className="spending-summary-card">
      <div className="spending-summary-header">
        <span className="spending-summary-title">Spending by Category</span>
        <button
          className="spending-refresh-btn"
          onClick={fetchSummary}
          disabled={loading}
          title="Refresh"
        >
          {loading ? '⟳' : '↻'}
        </button>
      </div>

      {loading && !categories && (
        <div className="spending-skeleton">
          {[1, 2, 3].map((i) => (
            <div className="spending-skeleton-row" key={i}>
              <div className="spending-skeleton-label" />
              <div className="spending-skeleton-bar" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="spending-summary-error">{error}</p>
      )}

      {!loading && !error && categories && !hasSpending && (
        <div className="spending-empty-state">
          No spending yet. Make a few withdrawals or transfers to see a breakdown.
        </div>
      )}

      {!loading && !error && hasSpending && (
        <div className="spending-summary-list">
          {sortedEntries
            .filter(([, amount]) => amount > 0)
            .map(([category, amount]) => {
              const percent = total > 0 ? (amount / total) * 100 : 0
              return (
                <div className="spending-row" key={category}>
                  <div className="spending-row-top">
                    <span className="spending-category-name">
                      <span
                        className="spending-dot"
                        style={{ background: CATEGORY_COLORS[category] || '#7c869f' }}
                      />
                      {category}
                    </span>
                    <span className="spending-category-amount">₹{amount.toFixed(2)}</span>
                  </div>
                  <div className="spending-bar-track">
                    <div
                      className="spending-bar-fill"
                      style={{
                        width: `${percent}%`,
                        background: CATEGORY_COLORS[category] || '#7c869f',
                      }}
                    />
                  </div>
                  <span className="spending-percent">{percent.toFixed(1)}%</span>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

export default SpendingSummary