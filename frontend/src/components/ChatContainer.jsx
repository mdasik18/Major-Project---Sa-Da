import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { Trash2, Pencil } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const bubbleColors = [
  "chat-bubble-primary",
  "chat-bubble-secondary",
  "chat-bubble-accent",
  "chat-bubble-neutral",
  "chat-bubble-info",
  "chat-bubble-success",
  "chat-bubble-warning",
  "chat-bubble-error",
];

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    deleteMessage,
    editMessage,
    markMessagesAsSeen,
    typingUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    markMessagesAsSeen(selectedUser._id);
    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    markMessagesAsSeen,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const isOtherUserTyping =
    selectedUser && typingUsers && typingUsers.includes(selectedUser._id);

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 space-y-4">
        {messages.map((message, idx) => {
          const isOwn = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`group flex ${
                isOwn ? "justify-end" : "justify-start"
              } w-full`}
              ref={idx === messages.length - 1 ? messageEndRef : null}
              onClick={() =>
                setSelectedMessageId(
                  selectedMessageId === message._id ? null : message._id
                )
              }
              style={{ cursor: "pointer" }}
            >
              {!isOwn && (
                <div className="mr-2 flex-shrink-0">
                  <img
                    src={selectedUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                    className="size-8 rounded-full border shadow"
                  />
                </div>
              )}
              <div
                className={`relative max-w-[75%] rounded-2xl px-4 py-2 shadow transition-all
                  ${
                    isOwn
                      ? "bg-primary text-primary-content rounded-br-none"
                      : "bg-base-200 text-base-content rounded-bl-none"
                  }
                  ${
                    selectedMessageId === message._id
                      ? "ring-2 ring-accent"
                      : ""
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs opacity-60">
                    {formatMessageTime(message.createdAt)}
                  </span>
                  {isOwn && selectedMessageId === message._id && (
                    <span className="flex gap-1 ml-2">
                      <button
                        className="p-1 rounded hover:bg-base-300 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingMessageId(message._id);
                          setEditValue(message.text || "");
                        }}
                        title="Edit message"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-1 rounded hover:bg-base-300 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(message._id);
                          setSelectedMessageId(null);
                        }}
                        title="Delete message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </span>
                  )}
                </div>
                {editingMessageId === message._id ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await editMessage(message._id, { text: editValue });
                      setEditingMessageId(null);
                    }}
                    className="flex flex-col gap-2"
                  >
                    <input
                      className="border rounded px-2 py-1"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="text-green-700 font-semibold px-3 py-1 rounded hover:bg-slate-300 transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="text-gray-700 font-semibold px-3 py-1 rounded hover:bg-slate-300 transition"
                        onClick={() => setEditingMessageId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && (
                      <p className="break-words">{message.text}</p>
                    )}
                  </>
                )}
                {isOwn && (
                  <div className="text-sm mt-1 flex items-center gap-1 font-medium">
                    {message.seen ? (
                      <span className="text-green-700 dark:text-green-400">
                        ✓✓ Seen
                      </span>
                    ) : message.delivered ? (
                      <span className="text-yellow-600 dark:text-yellow-400">
                        ✓✓ Delivered
                      </span>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-300">
                        ✓ Sent
                      </span>
                    )}
                  </div>
                )}
              </div>
              {isOwn && (
                <div className="ml-2 flex-shrink-0">
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="profile pic"
                    className="size-8 rounded-full border shadow"
                  />
                </div>
              )}
            </div>
          );
        })}

        {isOtherUserTyping && (
          <div className="flex items-center gap-2 pl-10">
            <div className="relative flex items-center">
              <span className="block w-2 h-2 bg-base-content/40 rounded-full animate-bounce mr-1"></span>
              <span
                className="block w-2 h-2 bg-base-content/60 rounded-full animate-bounce mr-1"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="block w-2 h-2 bg-base-content/80 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </div>
            <span className="text-xs text-base-content/60">Typing...</span>
          </div>
        )}
      </div>

      <div className="border-t bg-base-100 px-2 sm:px-6 py-3">
        <MessageInput />
      </div>
    </div>
  );
};
export default ChatContainer;
