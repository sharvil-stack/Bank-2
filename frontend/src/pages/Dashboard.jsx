import React, { useEffect, useState,useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/Dashboard.css"
import {
  getAccounts,
  createAccount
} from "../services/accountService"
import { depositMoney, withdrawMoney, transferMoney, getRecentTransactions } from '../services/transactionService'
import Navbar from '../components/Navbar';
import AiAssistant from '../components/AiAssistant'

const CATEGORIES = [
  { key: 'food',       label: 'Food & Dining',  color: '#00e5a0', icon: '🍽️' },
  { key: 'shopping',   label: 'Shopping',        color: '#5b8def', icon: '🛍️' },
  { key: 'transport',  label: 'Transport',       color: '#f5a623', icon: '🚗' },
  { key: 'utilities',  label: 'Utilities',       color: '#bd5ef5', icon: '⚡' },
  { key: 'health',     label: 'Health',          color: '#ff5470', icon: '❤️' },
  { key: 'other',      label: 'Other',           color: '#7c869f', icon: '📦' },
];
 
function guessCategory(tx) {
  const desc = (tx.description || tx.type || '').toLowerCase();
  if (/food|eat|restaurant|cafe|coffee|lunch|dinner|swiggy|zomato/.test(desc)) return 'food';
  if (/shop|amazon|flipkart|mall|buy|store|purchase/.test(desc)) return 'shopping';
  if (/uber|ola|auto|metro|bus|fuel|petrol|transport|cab/.test(desc)) return 'transport';
  if (/electric|water|gas|bill|utility|internet|broadband/.test(desc)) return 'utilities';
  if (/medic|pharma|hospital|doctor|health|clinic/.test(desc)) return 'health';
  return 'other';
}
 
function buildSpending(transactions) {
  const all = Object.values(transactions).flat();
  const debits = all.filter(t => t.type === 'DEBIT' || t.type === 'WITHDRAW' || t.type === 'TRANSFER');
  const totals = {};
  CATEGORIES.forEach(c => totals[c.key] = 0);
  debits.forEach(t => {
    totals[guessCategory(t)] += Number(t.amount) || 0;
  });
  return totals;
}
 
// ─── Donut chart (pure SVG, no lib) ──────────────────────────────
function DonutChart({ data }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  if (total === 0) return (
    <div className="donut-empty">No spending data yet</div>
  );
 
  let offset = 0;
  const R = 60, cx = 80, cy = 80;
  const circumference = 2 * Math.PI * R;
 
  const slices = CATEGORIES.map(cat => {
    const pct = data[cat.key] / total;
    const dash = pct * circumference;
    const gap  = circumference - dash;
    const slice = { ...cat, pct, dash, gap, offset };
    offset += dash;
    return slice;
  }).filter(s => s.pct > 0);
 
  return (
    <svg viewBox="0 0 160 160" className="donut-svg">
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={s.color}
          strokeWidth="22"
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset + circumference / 4}
          className="donut-slice"
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" className="donut-label-total">₹{(total/1000).toFixed(1)}k</text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="donut-label-sub">spent</text>
    </svg>
  );
}
 
// ─── Bar chart (pure SVG) ─────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...Object.values(data), 1);
  const barW = 32, gap = 14, h = 100, chartW = CATEGORIES.length * (barW + gap);
 
  return (
    <svg viewBox={`0 0 ${chartW} ${h + 30}`} className="bar-svg">
      {CATEGORIES.map((cat, i) => {
        const val = data[cat.key] || 0;
        const barH = (val / max) * h;
        const x = i * (barW + gap);
        return (
          <g key={cat.key}>
            <rect
              x={x} y={h - barH}
              width={barW} height={barH}
              rx="5" fill={cat.color}
              opacity={val ? 1 : 0.15}
              className="bar-rect"
            />
            <text x={x + barW/2} y={h + 14} textAnchor="middle" className="bar-label">
              {cat.icon}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
 
function AIAssistant({ accounts, transactions }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your Finova AI. Ask me about your spending, accounts, or any money question." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
 
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
 
  const buildContext = () => {
    const totalBal = accounts.reduce((s, a) => s + (Number(a.balance) || 0), 0);
    const allTx = Object.values(transactions).flat();
    const spending = buildSpending(transactions);
    const spendSummary = CATEGORIES.map(c => `${c.label}: ₹${spending[c.key].toFixed(0)}`).join(', ');
    return `User's Finova banking context:
- Accounts: ${accounts.length}, Total balance: ₹${totalBal.toFixed(2)}
- Recent transactions count: ${allTx.length}
- Spending breakdown: ${spendSummary}
Answer in 2-3 sentences, be helpful, concise, and use ₹ for currency.`;
  };
 
  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: buildContext(),
          messages: [
            ...messages.filter(m => m.role !== 'system').map(m => ({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.text
            })),
            { role: 'user', content: input }
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Sorry, I could not get a response.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <span className="ai-icon">✦</span>
        <div>
          <h3 className="ai-title">Finova AI</h3>
          <p className="ai-subtitle">Powered by Finova</p>
        </div>
        <span className="ai-live-dot" />
      </div>
 
      <div className="ai-messages">
        {messages.map((m, i) => (
          <div key={i} className={`ai-msg ai-msg--${m.role}`}>
            {m.role === 'assistant' && <span className="ai-msg-avatar">✦</span>}
            <p className="ai-msg-text">{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="ai-msg ai-msg--assistant">
            <span className="ai-msg-avatar">✦</span>
            <div className="ai-typing"><span/><span/><span/></div>
          </div>
        )}
        <div ref={endRef} />
      </div>
 
      <div className="ai-input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about your finances…"
          className="ai-input"
          disabled={loading}
        />
        <button className="ai-send-btn" onClick={send} disabled={loading || !input.trim()}>
          ↑
        </button>
      </div>
    </div>
  );
}
 
const Dashboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [transferData, setTransferData] = useState({});
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState({});
  const [activeCard, setActiveCard] = useState(null);
 
  const handleDeposit = async (accountNumber) => {
    try {
      setLoading(true);
      await depositMoney(accountNumber, amounts[accountNumber]);
      fetchAccounts();
      alert('Deposit successful');
    } catch { alert('Deposit Failed'); }
    finally { setLoading(false); }
  };
 
  const handleShowTransactions = async (accountNumber) => {
    try {
      setLoading(true);
      const data = await getRecentTransactions(accountNumber);
      setTransactions(prev => ({ ...prev, [accountNumber]: data }));
    } catch { alert('Failed to fetch transactions'); }
    finally { setLoading(false); }
  };
 
  const handleTransfer = async (fromAccount) => {
    try {
      setLoading(true);
      const t = transferData[fromAccount];
      await transferMoney(fromAccount, t.toAccount, t.amount);
      fetchAccounts();
      alert('Transfer Successful');
    } catch (error) {
      alert(error.response?.data?.message || 'Transfer failed');
    } finally { setLoading(false); }
  };
 
  const handleWithdraw = async (accountNumber) => {
    try {
      setLoading(true);
      await withdrawMoney(accountNumber, amounts[accountNumber]);
      fetchAccounts();
      alert('Withdrawal Successful');
    } catch (error) {
      alert(error.response?.data?.message || 'Withdrawal failed');
    } finally { setLoading(false); }
  };
 
  const fetchAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch { alert('Failed to fetch accounts'); }
  };
 
  const handleCreateAccount = async () => {
    try {
      await createAccount();
      fetchAccounts();
      alert('Account created successfully');
    } catch { alert('Failed to create account'); }
  };
 
  useEffect(() => { fetchAccounts(); }, []);
 
  const spending = buildSpending(transactions);
  const totalBalance = accounts.reduce((s, a) => s + (Number(a.balance) || 0), 0);
  const hasTransactions = Object.values(transactions).flat().length > 0;
 
  return (
    <div className="dashboard-container">
      <Navbar />
 
      
      <div className="dashboard-hero">
        <div>
          <p className="hero-label">Total Balance</p>
          <h1 className="hero-balance">₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h1>
        </div>
        <button className="create-account-btn" onClick={handleCreateAccount}>+ New Account</button>
      </div>
 
     
      <div className="dash-grid">
 
        
        <div className="dash-left">
 
          <section>
            <h2 className="section-title">Your Accounts</h2>
            <div className="accounts-container">
              {accounts.length === 0 && (
                <div className="empty-state">No accounts yet. Create one to get started.</div>
              )}
              {accounts.map(account => (
                <div className="account-card" key={account.accountNumber}>
                  <div className="account-card-header">
                    <div>
                      <p className="account-number">Acct · {account.accountNumber}</p>
                      <p className="account-balance">₹{Number(account.balance).toLocaleString('en-IN')}</p>
                    </div>
                    <span className="account-status">{account.status}</span>
                  </div>
 
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amounts[account.accountNumber] || ''}
                    onChange={e => setAmounts({ ...amounts, [account.accountNumber]: e.target.value })}
                  />
 
                  <div className="account-actions">
                    <button className="btn-primary" disabled={loading} onClick={() => handleDeposit(account.accountNumber)}>
                      {loading ? '…' : 'Deposit'}
                    </button>
                    <button className="btn-secondary" disabled={loading} onClick={() => handleWithdraw(account.accountNumber)}>
                      {loading ? '…' : 'Withdraw'}
                    </button>
                  </div>
 
                  <div className="transfer-section">
                    <div className="transfer-row">
                      <input
                        type="text"
                        placeholder="Receiver account no."
                        value={transferData[account.accountNumber]?.toAccount || ''}
                        onChange={e => setTransferData({
                          ...transferData,
                          [account.accountNumber]: { ...transferData[account.accountNumber], toAccount: e.target.value }
                        })}
                      />
                      <input
                        type="number"
                        placeholder="Transfer amount"
                        value={transferData[account.accountNumber]?.amount || ''}
                        onChange={e => setTransferData({
                          ...transferData,
                          [account.accountNumber]: { ...transferData[account.accountNumber], amount: e.target.value }
                        })}
                      />
                    </div>
                    <button className="btn-primary" disabled={loading} onClick={() => handleTransfer(account.accountNumber)}>
                      {loading ? '…' : 'Transfer'}
                    </button>
                  </div>
 
                  <button className="show-tx-btn" onClick={() => handleShowTransactions(account.accountNumber)}>
                    Show Recent Transactions
                  </button>
 
                  <div className="transaction-section">
                    {transactions[account.accountNumber]?.map(tx => (
                      <div className="transaction-item" key={tx.id}>
                        <div className="tx-left">
                          <span className={`tx-type tx-type--${tx.type?.toLowerCase()}`}>{tx.type}</span>
                          <span className="tx-desc">{tx.description}</span>
                        </div>
                        <div className="tx-right">
                          <span className="tx-amount">₹{Number(tx.amount).toLocaleString('en-IN')}</span>
                          <span className="tx-date">{tx.createdAt?.slice(0,10)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
 
          <section className="spending-section">
            <h2 className="section-title">Spending Summary</h2>
            {!hasTransactions ? (
              <div className="spend-empty">
                <p>Load transactions from your accounts above to see spending insights.</p>
              </div>
            ) : (
              <div className="spending-grid">
                <div className="spend-card spend-card--donut">
                  <p className="spend-card-label">By Category</p>
                  <DonutChart data={spending} />
                  <div className="donut-legend">
                    {CATEGORIES.filter(c => spending[c.key] > 0).map(c => (
                      <div key={c.key} className="legend-item">
                        <span className="legend-dot" style={{ background: c.color }} />
                        <span className="legend-label">{c.label}</span>
                        <span className="legend-val">₹{spending[c.key].toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
 
                <div className="spend-card spend-card--bars">
                  <p className="spend-card-label">Breakdown</p>
                  <BarChart data={spending} />
                  <div className="bar-legend">
                    {CATEGORIES.map(c => (
                      <div key={c.key} className="bar-legend-row">
                        <span className="bar-legend-icon">{c.icon}</span>
                        <div className="bar-legend-track">
                          <div
                            className="bar-legend-fill"
                            style={{
                              width: `${Math.max((spending[c.key] / (Math.max(...Object.values(spending), 1))) * 100, 0)}%`,
                              background: c.color
                            }}
                          />
                        </div>
                        <span className="bar-legend-amt">₹{spending[c.key].toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
 
        <div className="dash-right">
          <h2 className="section-title">AI Assistant</h2>
          <AIAssistant accounts={accounts} transactions={transactions} />
        </div>
      </div>
    </div>
  );
};
 
export default Dashboard;