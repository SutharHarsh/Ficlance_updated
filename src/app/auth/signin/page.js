// src/app/auth/signin/page.jsx
"use client";

import { useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";

export default function SignInPage() {
  const [providers, setProviders] = useState(null);
  const [loadingProvider, setLoadingProvider] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getProviders();
        if (mounted) setProviders(res);
      } catch (err) {
        console.error("getProviders error:", err);
        if (mounted) setProviders({});
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!providers) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading providers...</p>
      </div>
    );
  }

  const providerList = Object.values(providers);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>

        {providerList.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            No auth providers configured.
          </p>
        )}

        {providerList.map((provider) => (
          <div key={provider.id} className="mb-4">
            <button
              onClick={() => {
                setLoadingProvider(provider.id);
                // specify where to go after successful sign in
                signIn(provider.id, { callbackUrl: "/dashboard" });
              }}
              disabled={!!loadingProvider}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition shadow-sm disabled:opacity-60"
            >
              <img
                src={
                  provider.id === "google"
                    ? "https://www.svgrepo.com/show/475656/google-color.svg"
                    : provider.id === "github"
                    ? "https://www.svgrepo.com/show/475654/github-color.svg"
                    : ""
                }
                alt={provider.name}
                className="w-6 h-6"
                style={{ display: provider.id ? "inline-block" : "none" }}
              />
              <span className="text-gray-700 font-medium">
                {loadingProvider === provider.id
                  ? `Signing in with ${provider.name}...`
                  : `Continue with ${provider.name}`}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
