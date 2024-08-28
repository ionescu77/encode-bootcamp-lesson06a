"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat();
  return (
    <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch overflow-hidden">
      <div className="overflow-auto w-full">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-green-700 p-3 m-2 rounded-lg"
                : "bg-slate-700 p-3 m-2 rounded-lg"
            }`}
          >
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-end pr-4">
            <span className="animate-pulse text-2xl">...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
