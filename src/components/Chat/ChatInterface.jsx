"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import Header from "./Header";
import GitHubFeedbackModal from "./GitHubFeedbackModal";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
import ChatArea from "./ChatArea";
import { useMessages } from "@/hooks/useMessages";
import { useGitHubFeedback } from "@/hooks/useGitHubFeedback";
import { downloadDocument } from "@/utils/documentGenerator";
import { FaGithub } from "react-icons/fa";

export default function ChatInterface({
  conversationId,
  initialMessages = [],
  clientName = "Client",
  projectName = "Project",
  conversation = null,
}) {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(true);
  const [socket, setSocket] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [dueDate, setDueDate] = useState("N/A");
  const [projectDescription, setProjectDescription] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [deadlineRaw, setDeadlineRaw] = useState(null);

  // Use custom hooks
  const {
    messages,
    setMessages,
    isSending,
    clientTyping,
    sendMessage: sendMessageHook,
  } = useMessages(initialMessages, conversationId, session);

  const {
    showGitHubModal,
    setShowGitHubModal,
    feedbackLoading,
    feedbackStep,
    feedbackSteps,
    handleGithubSubmit,
  } = useGitHubFeedback(conversationId, setMessages, setCompletionPercentage);

  // Initialize project details from conversation
  useEffect(() => {
    if (conversation?.requirements?.message?.completion_percentage) {
      setCompletionPercentage(
        conversation.requirements.message.completion_percentage
      );
    }
    if (conversation?.deadline) {
      const date = new Date(conversation.deadline);
      setDueDate(
        date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      setDeadlineRaw(conversation.deadline);
    }
    if (conversation?.requirements?.message?.description) {
      setProjectDescription(conversation.requirements.message.description);
    }
    if (Array.isArray(conversation?.requirements?.message?.tech_stack)) {
      setTechStack(conversation.requirements.message.tech_stack);
    }
    if (conversation?.requirements?.message?.expertise) {
      const expertiseLevel = conversation.requirements.message.expertise;
      setDifficulty(expertiseLevel === "All" ? "Beginner" : expertiseLevel);
    }
  }, [conversation]);

  // Initialize Socket.io
  useEffect(() => {
    const socketInstance = io({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to socket");
      if (conversationId) {
        socketInstance.emit("join_conversation", conversationId);
      }
    });

    socketInstance.on("new_message", (newMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage].sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          if (timeA !== timeB) return timeA - timeB;
          return String(a._id || "").localeCompare(String(b._id || ""));
        });
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [conversationId, setMessages]);

  // Initialize messages with document on first load
  useEffect(() => {
    if (!conversation || initialMessages.length === 0) return;

    const hasRequirements = conversation?.requirements;

    if (hasRequirements && messages.length > 0) {
      const firstMsg = messages[0];

      if (!firstMsg.hasDocumentAttachment && !firstMsg.metadata?.hasDocument) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[0] = {
            ...updated[0],
            hasDocumentAttachment: true,
            metadata: {
              ...updated[0].metadata,
              hasDocument: true,
              fileName: `${projectName}_Requirements.docx`,
              fileSize: "245 KB • Word Document",
            },
          };
          return updated;
        });
      }
    }
  }, [
    conversation,
    initialMessages,
    conversationId,
    projectName,
    messages,
    setMessages,
  ]);

  const handleConversationClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setShowLeftSidebar(false);
    }
  };

  const handleDownloadDocument = async () => {
    try {
      await downloadDocument({
        projectName,
        clientName,
        requirements: conversation?.requirements,
        deadline: conversation?.deadline,
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document. Please try again.");
    }
  };

  const sendMessage = async () => {
    await sendMessageHook(message, clientName);
    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col bg-[#f9fafb]">
      <Header />

      <main className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR */}
        <LeftSidebar
          showLeftSidebar={showLeftSidebar}
          setShowLeftSidebar={setShowLeftSidebar}
          onConversationClick={handleConversationClick}
        />

        {/* CHAT AREA */}
        <ChatArea
          clientName={clientName}
          projectName={projectName}
          messages={messages}
          clientTyping={clientTyping}
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          isSending={isSending}
          handleDownloadDocument={handleDownloadDocument}
          onInfoClick={() => setShowProjectDetails(!showProjectDetails)}
          isDetailsOpen={showProjectDetails}
          onGitHubClick={() => setShowGitHubModal(true)}
        />

        {/* RIGHT SIDEBAR */}
        <RightSidebar
          showProjectDetails={showProjectDetails}
          setShowProjectDetails={setShowProjectDetails}
          completionPercentage={completionPercentage}
          dueDate={dueDate}
          projectDescription={projectDescription}
          techStack={techStack}
          difficulty={difficulty}
          deadline={deadlineRaw}
        />
      </main>

      {/* GitHub Feedback Modal */}
      {showGitHubModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
            {feedbackLoading ? (
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                    <FaGithub className="text-indigo-600 text-2xl animate-pulse" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-4 text-center">
                    {feedbackSteps[feedbackStep]}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden mb-3">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${
                          ((feedbackStep + 1) / feedbackSteps.length) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Step {feedbackStep + 1} of {feedbackSteps.length}
                  </p>
                </div>
              </div>
            ) : (
              <GitHubFeedbackModal
                isOpen={true}
                onClose={() => setShowGitHubModal(false)}
                onSubmit={handleGithubSubmit}
                isLoading={false}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
