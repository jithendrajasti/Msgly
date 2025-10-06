// src/components/AiMessageInput.jsx

import { useContext, useState } from "react";
import { Send } from "lucide-react";
import { AppContext } from "../context/AppContext";

const AiMessageInput = () => {
  const [prompt, setPrompt] = useState("");
  const { askAi, isAiLoading } = useContext(AppContext);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      // The logic for optimistic updates is now handled inside askAi
      await askAi(prompt.trim());
      setPrompt("");
    } catch (error) {
      console.error("Failed to send AI prompt:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <input
          type="text"
          className="w-full input input-bordered rounded-lg input-sm md:input-md font-semibold outline-none"
          placeholder="Ask Jima anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isAiLoading}
        />
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!prompt.trim() || isAiLoading}
        >
          {isAiLoading ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
};

export default AiMessageInput;