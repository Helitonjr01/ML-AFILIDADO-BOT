import { useEffect, useState } from "react";
import axios from "axios";

interface Produto {
  id: string;
  titulo: string;
  preco: number;
  precoAntigo: number;
  desconto: number;
  imagem: string;
  link: string;
}

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  async function carregarProdutos() {
    try {
      setLoading(true);

      const { data } = await axios.get<Produto[]>(
        "http://localhost:3000/produtos?q=kemei",
      );

      setProdutos(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ativo = true;

    async function buscar() {
      try {
        const { data } = await axios.get<Produto[]>(
          "http://localhost:3000/produtos?q=kemei",
        );

        if (ativo) {
          setProdutos(data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    buscar();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "40px auto",
        fontFamily: "Arial",
        padding: 20,
      }}
    >
      <h1>ML Afiliado Bot</h1>

      <button onClick={carregarProdutos} disabled={loading}>
        {loading ? "Carregando..." : "Atualizar produtos"}
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))",
          gap: 20,
          marginTop: 30,
        }}
      >
        {produtos.map((produto) => (
          <div
            key={produto.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <img
              src={produto.imagem}
              alt={produto.titulo}
              style={{
                width: "100%",
                height: 180,
                objectFit: "contain",
              }}
            />

            <h3
              style={{
                fontSize: 16,
              }}
            >
              {produto.titulo}
            </h3>

            {produto.precoAntigo > produto.preco && (
              <p
                style={{
                  textDecoration: "line-through",
                  color: "#888",
                }}
              >
                R$ {produto.precoAntigo.toFixed(2)}
              </p>
            )}

            <p
              style={{
                color: "green",
                fontSize: 22,
                fontWeight: "bold",
              }}
            >
              R$ {produto.preco.toFixed(2)}
            </p>

            <p
              style={{
                color: "red",
              }}
            >
              {produto.desconto}% OFF
            </p>

            <a href={produto.link} target="_blank" rel="noreferrer">
              <button>Ver no Mercado Livre</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
