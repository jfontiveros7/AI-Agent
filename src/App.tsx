import { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import './App.css';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful AI assistant. You answer questions clearly and concisely. 
You can help with a wide range of tasks including answering questions, writing, coding, analysis, and more.`;

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = () => {
    const key = apiKeyInput.trim();
    if (!key.startsWith('sk-')) {
      setError('Please enter a valid OpenAI API key (starts with sk-).');
      return;
    }
    setApiKey(key);
    setApiKeyInput('');
    setError('');
  };

  const clearApiKey = () => {
    setApiKey('');
    setMessages([]);
    setError('');
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    if (!apiKey) {
      setError('Please enter your OpenAI API key first.');
      return;
    }

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...updatedMessages],
      });
      const assistantContent = response.choices[0]?.message?.content ?? '';
      setMessages([...updatedMessages, { role: 'assistant', content: assistantContent }]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError('');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <h1>AI Agent</h1>
          </div>
          {apiKey && (
            <div className="header-actions">
              <span className="key-status">🔑 API key set</span>
              <button className="btn btn-ghost" onClick={clearConversation} title="Clear conversation">
                🗑️ Clear chat
              </button>
              <button className="btn btn-ghost btn-danger" onClick={clearApiKey} title="Remove API key">
                Remove key
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        {!apiKey ? (
          <div className="setup-card">
            <div className="setup-icon">��</div>
            <h2>Connect your OpenAI API key</h2>
            <p>
              Your key is stored only in your browser session and never sent anywhere except OpenAI.{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                Get an API key →
              </a>
            </p>
            <div className="api-key-form">
              <input
                type="password"
                className="input"
                placeholder="sk-..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
                aria-label="OpenAI API key"
              />
              <button className="btn btn-primary" onClick={saveApiKey}>
                Connect
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
        ) : (
          <div className="chat-container">
            <div className="messages" role="log" aria-live="polite">
              {messages.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">💬</span>
                  <p>Start a conversation with your AI Agent!</p>
                  <div className="suggestions">
                    {[
                      'Explain quantum computing in simple terms',
                      'Write a Python function to sort a list',
                      'What are the best practices for REST APIs?',
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        className="suggestion-chip"
                        onClick={() => setInput(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`message message-${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-bubble">
                    <pre className="message-content">{msg.content}</pre>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message message-assistant">
                  <div className="message-avatar">🤖</div>
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="error-bar">
                <span>⚠️ {error}</span>
                <button onClick={() => setError('')}>✕</button>
              </div>
            )}

            <div className="input-area">
              <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder="Message AI Agent… (Enter to send, Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
                aria-label="Chat message input"
              />
              <button
                className="btn btn-send"
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                {isLoading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
