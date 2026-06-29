import React, {useState,useEffect,useRef} from 'react'
import '../styles/AiAssistant.css'
import { getAiInsight, askAiAssistant } from '../services/aiService'

const AiAssistant = () => {
  const [insight, setInsight] = useState(null)
  const [insightLoading, setInsightLoading] = useState(false)
  const [insightError, setInsightError] = useState(null)

  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])



  const fetchInsight = async () => {
    try {
      setInsightLoading(true)
      setInsightError(null)

      const data = await getAiInsight()

      setInsight(data.insight)
    } catch (error) {
      console.error(error)
      setInsightError(
        'Could not generate insight. Please try again later.'
      )
    } finally {
      setInsightLoading(false)
    }
  }

  const handleAsk = async () => {
    const trimmed = question.trim()

    if (!trimmed || chatLoading) return

    const userMessage = {
      role: 'user',
      content: trimmed,
    }

    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setQuestion('')
    setChatLoading(true)

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const data = await askAiAssistant(
        trimmed,
        history
      )

      setMessages([
        ...updatedMessages,
        {
          role: 'model',
          content: data.answer,
        },
      ])
    } catch (error) {
      console.error(error)

      setMessages([
        ...updatedMessages,
        {
          role: 'model',
          content:
            '⚠️ Something went wrong. Please try again.',
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAsk()
    }
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <div className="ai-assistant-wrapper">
      <div className="ai-section-header">
        <span className="ai-badge">✦ AI</span>
        <h2>Finova Assistant</h2>
      </div>

      {/* Insight Card */}
      <div className="ai-insight-card">
        <div className="ai-insight-label">
          <span className="ai-insight-icon">💡</span>
          Financial Insight
        </div>

        <button
          className="ai-generate-btn"
          onClick={fetchInsight}
          disabled={insightLoading}
        >
          {insightLoading
            ? 'Generating...'
            : 'Generate Insight'}
        </button>

        {insightLoading && (
          <div className="ai-skeleton">
            <div className="ai-skeleton-line" />
            <div className="ai-skeleton-line short" />
          </div>
        )}

        {!insightLoading &&
          !insight &&
          !insightError && (
            <p className="ai-insight-placeholder">
              Click Generate Insight to analyze
              your finances.
            </p>
          )}

        {!insightLoading &&
          insightError && (
            <p className="ai-insight-error">
              {insightError}
            </p>
          )}

        {!insightLoading &&
          insight && (
            <p className="ai-insight-text">
              {insight}
            </p>
          )}
      </div>

      {/* Chat */}
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <span>
            Ask anything about your finances
          </span>

          {messages.length > 0 && (
            <button
              className="ai-clear-btn"
              onClick={handleClearChat}
            >
              Clear
            </button>
          )}
        </div>

        <div className="ai-messages">
          {messages.length === 0 && (
            <div className="ai-empty-chat">
              <p>Try asking:</p>

              <div className="ai-suggestions">
                {[
                  'What did I spend the most on?',
                  'How is my savings looking?',
                  'Any tips to improve my balance?',
                ].map((s) => (
                  <button
                    key={s}
                    className="ai-suggestion-chip"
                    onClick={() =>
                      setQuestion(s)
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`ai-message ${
                msg.role === 'user'
                  ? 'ai-message-user'
                  : 'ai-message-bot'
              }`}
            >
              <span className="ai-message-role">
                {msg.role === 'user'
                  ? 'You'
                  : 'Finova'}
              </span>

              <p className="ai-message-content">
                {msg.content}
              </p>
            </div>
          ))}

          {chatLoading && (
            <div className="ai-message ai-message-bot">
              <span className="ai-message-role">
                Finova
              </span>

              <div className="ai-typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="ai-input-row">
          <textarea
            className="ai-input"
            placeholder="Ask about your spending, savings, or transactions..."
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={chatLoading}
          />

          <button
            className="ai-send-btn"
            onClick={handleAsk}
            disabled={
              chatLoading ||
              !question.trim()
            }
          >
            {chatLoading ? '…' : '↑'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AiAssistant
