import html2canvas from "html2canvas";

export async function generateLeaderboardImage(
  element: HTMLElement
): Promise<Blob> {
  const canvas = await html2canvas(element, {
    backgroundColor: "#f8fafc", // Tailwind's bg-gray-50
    scale: 2,
    useCORS: true,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to convert canvas to blob"));
    }, "image/png");
  });
}
