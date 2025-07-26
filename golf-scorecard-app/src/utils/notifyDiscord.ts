export async function notifyDiscord(message: string): Promise<void> {
  const webhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Discord webhook URL not configured.");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: message }),
    });
  } catch (error) {
    console.error("Failed to send message to Discord:", error);
  }
}

export async function uploadImageToDiscord(blob: Blob): Promise<void> {
  const webhookUrl = process.env.REACT_APP_DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("Discord webhook URL not configured.");
    return;
  }

  const formData = new FormData();
  formData.append("file", blob, "leaderboard.png");

  try {
    await fetch(webhookUrl, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    console.error("Failed to upload leaderboard image to Discord:", error);
    throw error;
  }
}
