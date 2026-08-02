import { Router } from "express";
import { generateStoryImage } from "../services/storyGenerator";
import { config } from "../config";
import { extractProductFromUrl, MLProduct } from "../api/mercadoLivre";

export const storiesRouter = Router();

// NOVO: POST /api/stories/from-link  body: { url: string }
storiesRouter.post("/from-link", async (req, res) => {
  try {
    const url = String(req.body.url ?? "");
    if (!url) return res.status(400).json({ error: "'url' é obrigatório" });

    const product = await extractProductFromUrl(url);
    const { fileName } = await generateStoryImage(product);
    const imageUrl = `${config.publicBaseUrl}/stories/${fileName}`;

    res.json({ imageUrl, product });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message ?? "Erro ao processar o link" });
  }
});

storiesRouter.post("/generate", async (req, res) => {
  try {
    const product = req.body.product as MLProduct;
    if (!product)
      return res.status(400).json({ error: "'product' é obrigatório" });

    const { fileName } = await generateStoryImage(product);
    const imageUrl = `${config.publicBaseUrl}/stories/${fileName}`;

    res.json({ imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao gerar imagem do story" });
  }
});
