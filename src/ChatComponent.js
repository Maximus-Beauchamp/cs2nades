import React, { useState } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci/completions',
        {
          prompt: userMessage,
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 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`, 
          },
        }
      );
      const botResponse = response.data.choices[0].text.trim();
      setChatHistory([
        ...chatHistory,
        { sender: 'user', message: userMessage },
        { sender: 'bot', message: botResponse },
      ]);
      setUserMessage('');
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };

  const handleChange = (event) => {
    setUserMessage(event.target.value);
  };

  return (
    <div>
      <div style={{ minHeight: '300px', border: '1px solid #ccc', padding: '10px' }}>
        {chatHistory.map((chat, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            {chat.sender === 'user' ? <strong>You:</strong> : <strong>Bot:</strong>} {chat.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={userMessage}
          onChange={handleChange}
          placeholder="Type your message..."
          style={{ marginTop: '10px', marginRight: '5px' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
