// src/components/AiHeader.jsx

import { Bot, X } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const AiHeader = () => {
  const {setSelectedUser}=useContext(AppContext);
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {/* Jima Bot Avatar */}
              <Bot className="size-9 text-primary"/>
          {/* Jima AI info */}
          <div>
            <h3 className="font-medium">Jima AI</h3>
            <p className="text-sm text-emerald-500">Always Active</p>
          </div>
        </div>

        {/* Close button - adjusted for mobile with no excessive right margin */}
        <button onClick={()=>setSelectedUser(null)} className="text-amber-500 p-1 rounded-full hover:bg-base-200">
          <X className="size-5 font-extrabold" />
        </button>
      </div>
    </div>
  );
};

export default AiHeader;