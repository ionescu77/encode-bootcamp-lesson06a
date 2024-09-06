"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Chat() {
  const { messages, isLoading, append } = useChat();
  const [imageIsLoading, setImageIsLoading] = useState(false); // state to keep track of the image loading
  const [image, setImage] = useState<string | null>(null); // state to keep track of the image URL
  const [audioIsLoading, setAudioIsLoading] = useState(false); // state to keep track of the audio loading
  const [audio, setAudio] = useState<string | null>(null); // state to keep track of the audio URL

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // display the loading animation instead of the chat interface while the image is being generated
  if (imageIsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-muted h-10 w-10"></div>
          </div>
        </div>
      </div>
    );
  }

  // display the image instead of the chat interface when the image is ready
  if (image) {
    return (
      <div className="flex flex-col w-full h-screen max-w-md mx-auto p-4 overflow-y-auto">
        <div className="flex-grow overflow-y-auto">
          <div className="mb-4">
            <Image
              src={`data:image/jpeg;base64,${image}`}
              width={500}
              height={500}
              alt="Generated image"
              className="rounded-lg w-full"
            />
          </div>
          <div className="w-full">
            <textarea
              className="w-full bg-muted text-muted-foreground p-3 rounded-lg h-64"
              value={messages[messages.length - 1].content}
              readOnly
            />
          </div>
          <div className="flex flex-col justify-center mb-2 items-center">
            {audio && (
              <>
                <p> Listen to the recipe: </p>
                <audio controls src={audio} className="w-full"></audio>
              </>
            )}
            {audioIsLoading && !audio && <p> Audio is being generated... </p>}
            {!audioIsLoading && !audio && (
              <button
                className="flex justify-center mt-4"
                onClick={async () => {
                  setAudioIsLoading(true); // change state to true
                  const response = await fetch("/api/audio", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      message: messages[messages.length - 1].content,
                    }),
                  });
                  const audioBlob = await response.blob();
                  const audioUrl = URL.createObjectURL(audioBlob);
                  setAudio(audioUrl);
                  setAudioIsLoading(false); // change state to false
                }}
              >
                Generate Audio
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // display the chat interface
  return (
    <div className="flex flex-col w-full h-screen max-w-md py-24 mx-auto stretch overflow-hidden">
      <div className="overflow-auto w-full mb-8" ref={messagesContainerRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-primary text-primary-foreground p-3 m-2 rounded-lg"
                : "bg-muted text-muted-foreground p-3 m-2 rounded-lg"
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
      <div className="flex flex-col justify-center mb-2 items-center">
        {messages.length == 0 && (
          <button
            className="flex justify-center mt-4"
            disabled={isLoading}
            onClick={() =>
              append({ role: "user", content: "Give me a random recipe" })
            }
          >
            Random Recipe
          </button>
        )}
        {messages.length == 2 && !isLoading && (
          <button
            className="flex justify-center mt-4"
            disabled={isLoading}
            onClick={async () => {
              setImageIsLoading(true); // change state to true
              const response = await fetch("api/images", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  message: messages[messages.length - 1].content,
                }),
              });
              const data = await response.json();
              setImage(data); // save the returned image data
              setImageIsLoading(false); // change state to false
            }}
          >
            Generate image
          </button>
        )}
      </div>
    </div>
  );
}
