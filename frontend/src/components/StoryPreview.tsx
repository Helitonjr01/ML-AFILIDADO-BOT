interface Props {
  imageUrl: string | null;
  onClose: () => void;
}

export function StoryPreview({ imageUrl, onClose }: Props) {
  if (!imageUrl) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Preview do story" style={styles.image} />
        <div style={styles.actions}>
          <button style={styles.secondaryButton} onClick={onClose}>
            Fechar
          </button>
          <a href={imageUrl} download style={styles.primaryButton}>
            Baixar story
          </a>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  panel: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
  },
  image: { width: 270, height: 480, objectFit: "cover", borderRadius: 12 },
  actions: { display: "flex", gap: 12 },
  secondaryButton: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
  },
  primaryButton: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#3897f0",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
  },
};
