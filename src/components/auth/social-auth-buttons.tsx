"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Provider = "google" | "discord";

interface SocialAuthButtonsProps {
  onProviderClick: (provider: Provider) => Promise<void>;
}

export function SocialAuthButtons({
  onProviderClick,
}: SocialAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  const handleClick = async (provider: Provider) => {
    setLoadingProvider(provider);
    try {
      await onProviderClick(provider);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center"
        loading={loadingProvider === "google"}
        onClick={() => handleClick("google")}
      >
        <GoogleIcon />
        Continuer avec Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center"
        loading={loadingProvider === "discord"}
        onClick={() => handleClick("discord")}
      >
        <DiscordIcon />
        Continuer avec Discord
      </Button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.2c1.9-1.8 3.1-4.4 3.1-7.5Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5- .9 6.7-2.3l-3.2-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.2H2.9v2.7A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.2 13.9A6 6 0 0 1 5.9 12c0-.7.1-1.3.3-1.9V7.4H2.9A10 10 0 0 0 2 12c0 1.6.4 3.1.9 4.6l3.3-2.7Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 2.9 7.4l3.3 2.7c.8-2.4 3.1-4.2 5.8-4.2Z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.3 4.4A16.4 16.4 0 0 0 16.2 3l-.2.4c1.8.5 2.7 1.2 3 1.4a12 12 0 0 0-3.7-1.2 13 13 0 0 0-6.6 0A12 12 0 0 0 5 4.8c.3-.2 1.3-.9 3.1-1.4L8 3a16.4 16.4 0 0 0-4.1 1.4C1.3 8.3.6 12 1 15.7A16.7 16.7 0 0 0 6 18.2l1.1-1.8c-.6-.2-1.2-.5-1.7-.8l.4-.3c3.3 1.6 6.9 1.6 10.2 0l.4.3c-.5.3-1.1.6-1.7.8l1.1 1.8a16.7 16.7 0 0 0 5-2.5c.5-4.2-.8-7.9-2.5-11.3ZM9.7 13.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2c1.1 0 1.9.9 1.8 2 0 1.1-.8 2-1.8 2Zm4.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2c1.1 0 1.9.9 1.8 2 0 1.1-.8 2-1.8 2Z" />
    </svg>
  );
}
