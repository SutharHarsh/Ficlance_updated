"use client";

import React, { useState } from "react";
import { Shield, LogOut, Trash2, AlertTriangle, Lock, Key } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SecuritySettings({ profile }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const getAuthProviderInfo = () => {
    // Determine which auth provider(s) the user has
    const providers = [];
    
    // This is simplified - in production, you'd fetch this from the session or account data
    if (profile.email?.includes("gmail")) {
      providers.push({ name: "Google", icon: "🔍" });
    }
    // Check for GitHub or other providers based on your auth setup
    
    return providers.length > 0 ? providers : [{ name: "Email", icon: "📧" }];
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE_MY_ACCOUNT") {
      setDeleteError("Please type the exact confirmation phrase");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmation: "DELETE_MY_ACCOUNT"
        })
      });

      const data = await response.json();

      if (data.success) {
        // Account deleted successfully, log out and redirect
        await signOut({ callbackUrl: "/" });
      } else {
        setDeleteError(data.error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Delete account failed:", error);
      setDeleteError("Network error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Shield size={24} />
            Account & Security
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your authentication and account security
          </p>
        </div>

        {/* Authentication Provider */}
        <div className="space-y-6">
          <div className="pb-6 border-b border-border">
            <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
              <Key size={16} />
              Authentication Method
            </h3>
            <div className="space-y-3">
              {getAuthProviderInfo().map((provider, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{provider.name}</p>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Connected
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Session Info */}
          <div className="pb-6 border-b border-border">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Lock size={16} />
              Session Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{profile.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Email Verified</span>
                <span className={`font-medium ${profile.emailVerified ? "text-green-600" : "text-orange-600"}`}>
                  {profile.emailVerified ? "Yes" : "Not verified"}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Account Created</span>
                <span className="font-medium text-foreground">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-xs text-muted-foreground">{profile.id?.slice(0, 16)}...</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <LogOut size={18} />
              Log Out
            </button>

            {/* Delete Account Button */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
            >
              <Trash2 size={18} />
              Delete Account
            </button>

            <p className="text-xs text-gray-500 text-center">
              Deleting your account is permanent and cannot be undone. All your data will be lost.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <AlertTriangle size={32} />
              <h3 className="text-xl font-bold">Delete Account</h3>
            </div>

            <div className="mb-6 space-y-3">
              <p className="text-gray-700">
                This action <strong>cannot be undone</strong>. This will permanently delete your account and remove all associated data:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                <li>Your profile information</li>
                <li>All projects and simulations</li>
                <li>Chat history and messages</li>
                <li>Activity stats and progress</li>
              </ul>
              <p className="text-gray-700 font-medium mt-4">
                Type <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono text-sm">DELETE_MY_ACCOUNT</code> to confirm:
              </p>
            </div>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              disabled={isDeleting}
            />

            {deleteError && (
              <p className="text-red-600 text-sm mb-4 flex items-center gap-2">
                <AlertTriangle size={16} />
                {deleteError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                  setDeleteError("");
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== "DELETE_MY_ACCOUNT"}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isDeleting ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
