import { useState } from "react";

const feedbackSteps = [
  "Analyzing repository structure...",
  "Checking UI components...",
  "Gathering requirements...",
  "Generating feedback...",
];

export function useGitHubFeedback(conversationId, setMessages, setCompletionPercentage) {
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackStep, setFeedbackStep] = useState(0);

  const handleGithubSubmit = async (url) => {
    setFeedbackLoading(true);
    setFeedbackStep(0);

    try {
      const stepInterval = setInterval(() => {
        setFeedbackStep((prev) => {
          if (prev < feedbackSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 800);

      const res = await fetch("/api/proxy/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ RepoURL: url }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Feedback API error:", errorData);
        alert(`Failed to get feedback: ${errorData.error || "Unknown error"}`);
        setFeedbackLoading(false);
        setShowGitHubModal(false);
        return;
      }

      const data = await res.json();
      const feedbackData = data.message || data;

      const messages_to_add = [];

      if (feedbackData.feedback_summary && Array.isArray(feedbackData.feedback_summary)) {
        let feedbackContent = "";
        feedbackData.feedback_summary.forEach((item, index) => {
          feedbackContent += `${index + 1}. ${item}\n`;
        });

        const feedbackMsg = {
          _id: `feedback-${Date.now()}`,
          content: feedbackContent,
          sender: { role: "assistant", userId: "ai-assistant" },
          createdAt: new Date().toISOString(),
          type: "text",
        };

        messages_to_add.push(feedbackMsg);

        fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: conversationId,
            content: feedbackContent,
            type: "text",
            userId: "ai-assistant",
            role: "assistant",
            skipAI: true,
          }),
        });
      }

      if (feedbackData.missing_requirements && Array.isArray(feedbackData.missing_requirements)) {
        let missingContent = "**Missing Requirements to Address:**\n\n";
        feedbackData.missing_requirements.forEach((item) => {
          missingContent += `${item}\n`;
        });

        const missingMsg = {
          _id: `missing-${Date.now()}`,
          content: missingContent,
          sender: { role: "assistant", userId: "ai-assistant" },
          createdAt: new Date(Date.now() + 1000).toISOString(),
          type: "text",
        };

        messages_to_add.push(missingMsg);

        fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: conversationId,
            content: missingContent,
            type: "text",
            userId: "ai-assistant",
            role: "assistant",
            skipAI: true,
          }),
        });
      }

      if (feedbackData.completion_percentage) {
        setCompletionPercentage(feedbackData.completion_percentage);

        fetch("/api/conversations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: conversationId,
            completionPercentage: feedbackData.completion_percentage,
          }),
        }).catch((err) =>
          console.error("Error updating completion percentage:", err)
        );
      }

      if (messages_to_add.length > 0) {
        setMessages((prev) => [...prev, ...messages_to_add]);
      }

      setFeedbackLoading(false);
      setShowGitHubModal(false);
      setFeedbackStep(0);
    } catch (e) {
      console.error("Github feedback error", e);
      alert("Failed to submit GitHub feedback. Please try again.");
      setFeedbackLoading(false);
      setShowGitHubModal(false);
      setFeedbackStep(0);
    }
  };

  return {
    showGitHubModal,
    setShowGitHubModal,
    feedbackLoading,
    feedbackStep,
    feedbackSteps,
    handleGithubSubmit,
  };
}
