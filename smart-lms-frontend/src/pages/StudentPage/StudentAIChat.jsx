import { useState } from "react";
import api from "../../utils/api";

const StudentAIChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "student", text: input };
    setMessages([...messages, userMessage]);

    setInput("");

    try {
      const response = await api.post("/ai_tutor/chat/",{message: input})
      const aiMessage = { sender: "ai", text: response.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI error:", err);
       setMessages(prev => [
      ...prev,
      { sender: "ai", text: "Sorry, something went wrong with AI." },
    ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Ask AI Your Doubts</h2>
      <div className="bg-white p-4 rounded shadow-md max-w-3xl mx-auto">
        <div className="h-96 overflow-y-auto mb-4 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${
                msg.sender === "student" ? "bg-blue-100 text-right" : "bg-green-100 text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentAIChat;
