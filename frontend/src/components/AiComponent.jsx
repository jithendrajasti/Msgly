// src/components/AiComponent.jsx

import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../context/AppContext";
import AiHeader from "./AiHeader";
import AiMessageInput from "./AiMessageInput";
import { Bot } from "lucide-react";
import MarkDown from 'react-markdown'

const AiComponent = ({ onClose }) => {
  const { authUser, ai, getAi } = useContext(AppContext); // isAiLoading is no longer needed here for rendering
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getAi();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [ai]);

  return (
    <div className="flex flex-1 overflow-y-auto flex-col h-full bg-base-100 rounded-lg shadow-xl">
      <AiHeader onClose={onClose} />

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {Array.isArray(ai) && ai.map((chat) => (
          <div key={chat._id} className="flex flex-col gap-2">
            {/* User's Prompt (always visible) */}
            <div className="chat chat-end">
              <div className="chat-image avatar">
                <div className="w-8 h-8 rounded-full">
                  <img alt="User Avatar" src={authUser?.profilePic || "/avatar.png"} className="w-full h-full object-cover"/>
                </div>
              </div>
              <div className="chat-bubble bg-amber-500 text-white text-sm md:text-base break-words">
                {chat.prompt}
              </div>
              <div className="chat-footer opacity-50 text-xs">You</div>
            </div>

            {/* AI's Response or Loading Indicator */}
            <div className="chat chat-start">
              <div className="chat-image">
                <Bot className="size-9" />
              </div>
              <div className="chat-bubble text-sm md:text-base break-words">
                {chat.response ? (
                  <MarkDown>{chat.response }</MarkDown>
                ) : (
                  <span className="loading loading-dots loading-md" /> // Otherwise, show the typing loader
                )}
              </div>
              <div className="chat-footer opacity-50 text-xs">
                {chat.response ? "Jima AI" : "Jima AI is thinking..."}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="pt-4" />
      </div>

      <AiMessageInput />
    </div>
  );
};

export default AiComponent;