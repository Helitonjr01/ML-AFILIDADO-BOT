import express from "express";
import cors from "cors";
import axios from "axios";
import { gerarStory } from "./story.js";

const app = express();

app.use(cors());
app.use(express.json());

// Buscar 5 produtos
app.get("/produtos", async (req, res) => {
  try {
    const termo = (req.query.q as string) || "kemei";

    const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        Accept: "application/json",
        Referer: "https://www.mercadolivre.com.br/",
      },
    });

    const produtos = data.results.slice(0, 5).map((item: any) => {
      const preco = item.price;
      const precoAntigo = item.original_price || item.price;

      const desconto =
        precoAntigo > preco
          ? Math.round(((precoAntigo - preco) / precoAntigo) * 100)
          : 0;

      return {
        id: item.id,
        titulo: item.title,
        preco,
        precoAntigo,
        desconto,
        imagem: item.thumbnail,
        link: item.permalink,
      };
    });

    res.json(produtos);
  } catch (error: any) {
    console.error("Erro Mercado Livre:", error.response?.status);
    console.error(error.response?.data);

    res.status(error.response?.status || 500).json({
      erro: "Erro ao buscar produtos",
      detalhes: error.response?.data || error.message,
    });
  }
});

// Gerar um story usando o primeiro produto
app.post("/gerar-story", async (req, res) => {
  try {
    const url = "https://api.mercadolibre.com/sites/MLB/search?q=kemei";

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        Accept: "application/json",
        Referer: "https://www.mercadolivre.com.br/",
      },
    });

    const item = data.results[0];

    if (!item) {
      return res.status(404).json({ erro: "Nenhum produto encontrado" });
    }

    const produto = {
      id: item.id,
      titulo: item.title,
      preco: item.price,
      precoAntigo: item.original_price || item.price,
      desconto: item.original_price
        ? Math.round(
            ((item.original_price - item.price) / item.original_price) * 100,
          )
        : 0,
      imagem: item.thumbnail,
      link: item.permalink,
    };

    const imagem = await gerarStory(produto);

    res.json({
      sucesso: true,
      imagem,
      produto,
    });
  } catch (error: any) {
    console.error("Erro Mercado Livre:", error.response?.status);
    console.error(error.response?.data);

    res.status(error.response?.status || 500).json({
      erro: "Erro ao gerar story",
      detalhes: error.response?.data || error.message,
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
