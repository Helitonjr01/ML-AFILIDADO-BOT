import { useState } from "react";
import { MLProduct } from "../api/api";

interface Props {
  onSubmit: (product: MLProduct) => void;
  isBusy?: boolean;
}

export function ProductForm({ onSubmit, isBusy }: Props) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [permalink, setPermalink] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const priceNum = Number(price.replace(",", "."));
    const originalPriceNum = originalPrice
      ? Number(originalPrice.replace(",", "."))
      : null;

    const discountPercent =
      originalPriceNum && originalPriceNum > priceNum
        ? Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100)
        : null;

    const product: MLProduct = {
      id: String(Date.now()),
      title,
      price: priceNum,
      originalPrice: originalPriceNum,
      discountPercent,
      thumbnail,
      permalink,
      affiliateLink: affiliateLink || permalink,
      soldQuantity: null,
      freeShipping: false,
    };

    onSubmit(product);
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>
        Título do produto
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Fone de ouvido Bluetooth JBL"
          required
        />
      </label>

      <label style={styles.label}>
        Preço atual (R$)
        <input
          style={styles.input}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ex: 129,90"
          required
        />
      </label>

      <label style={styles.label}>
        Preço original (opcional, pra mostrar desconto)
        <input
          style={styles.input}
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          placeholder="Ex: 199,90"
        />
      </label>

      <label style={styles.label}>
        Link da imagem do produto
        <input
          style={styles.input}
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          placeholder="Cole aqui o link da foto (clique com botão direito na foto no ML > Copiar endereço da imagem)"
          required
        />
      </label>

      <label style={styles.label}>
        Link do produto no Mercado Livre
        <input
          style={styles.input}
          value={permalink}
          onChange={(e) => setPermalink(e.target.value)}
          placeholder="https://produto.mercadolivre.com.br/..."
          required
        />
      </label>

      <label style={styles.label}>
        Link de afiliado (opcional — se vazio, usa o link normal)
        <input
          style={styles.input}
          value={affiliateLink}
          onChange={(e) => setAffiliateLink(e.target.value)}
          placeholder="Seu link de afiliado gerado no painel do ML"
        />
      </label>

      <button type="submit" disabled={isBusy} style={styles.button}>
        {isBusy ? "Gerando..." : "Gerar story"}
      </button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxWidth: 480,
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: 20,
    background: "#fff",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 13,
    color: "#444",
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#3897f0",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};
