import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchResponse = async (userMessage) => {
    setIsLoading(true);  
    try {
      const response = await axios.post('http://localhost:8000/chatbot', {
        message: userMessage
      });

      const botMessage = response.data.response;

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: botMessage },
      ]);
    } catch (error) {
      console.error('Error fetching data from the chatbot API:', error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'system', content: 'Error: Unable to get a response from the chatbot.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      fetchResponse(input);
      setInput('');
    }
  };

  return (
    <div className="flex h-screen" style={{ background: 'linear-gradient(180deg, #0d1b2a, #000)' }}>
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col p-4 space-y-4 hidden md:flex">
        <h1 className="text-2xl font-bold mb-4">WHaKBot</h1>
        <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600">New Chat</button>
        <div className="flex-grow overflow-auto">
          <div className="p-2 hover:bg-gray-700 cursor-pointer rounded-lg">
            <p>Chat 1</p>
          </div>
          <div className="p-2 hover:bg-gray-700 cursor-pointer rounded-lg">
            <p>Chat 2</p>
          </div>
        </div>
        <div>
          <button className="bg-gray-700 text-white py-2 px-4 rounded-lg w-full hover:bg-gray-600">Clear Chats</button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-grow h-screen relative">
        {/* Chat Window */}
        <div className="flex-grow p-4 overflow-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <h2 className="text-gray-400 text-2xl">What can I help with?</h2>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`my-2 flex ${message.role === 'user' ? 'justify-start' : 'justify-end'} w-full`}>
                <div className="max-w-full md:max-w-2xl mx-auto">
                  <span className={`inline-block p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                    {message.content}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && <div className="text-center text-white">Loading...</div>}
        </div>

        {/* Input Box */}
        <div className="absolute inset-x-0 bottom-6 mx-auto w-11/12 md:w-1/2 lg:w-1/3">
          <div className="bg-gray-800 rounded-full p-4 flex items-center shadow-lg">
            <button className="p-3 rounded-full mr-3 shadow-lg hover:scale-105 transition" style={{ background: 'linear-gradient(180deg, #0d1b2a, #000)' }}>
              📂
            </button>

            <input
              className="flex-grow bg-transparent text-white placeholder-gray-400 p-2 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message WHaKBot"
            />

            <button className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-400" onClick={handleSend}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
