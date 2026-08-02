import { useState } from "react";
import { generateStoryFromLink } from "../api/api";
import { StoryPreview } from "../components/StoryPreview";

export function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setIsBusy(true);
    setError(null);
    try {
      const imageUrl = await generateStoryFromLink(url);
      setPreviewUrl(imageUrl);
    } catch (err) {
      const message =
        err instanceof Error && "response" in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data
              ?.error
          : undefined;
      setError(message ?? "Erro ao gerar o story a partir do link.");
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h1>ML Afiliado Bot</h1>
      <p style={{ color: "#666" }}>
        Cole o link do produto no Mercado Livre e gere o story.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: 8, margin: "16px 0" }}
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://produto.mercadolivre.com.br/..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          disabled={isBusy}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#3897f0",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isBusy ? "Gerando..." : "Gerar story"}
        </button>
      </form>

      {error && <p style={{ color: "#e60023" }}>{error}</p>}

      <StoryPreview imageUrl={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  );
}
