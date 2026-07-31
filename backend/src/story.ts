import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function gerarStory() {
  const width = 1080;
  const height = 1920;

  const output = path.join(process.cwd(), "stories", `story-${Date.now()}.jpg`);

  fs.mkdirSync(path.dirname(output), { recursive: true });

const imagemProduto = await fetch(produto.imagem)
  .then(r => r.arrayBuffer());

const bufferProduto = Buffer.from(imagemProduto);

  const svg = `
  <svg width="1080" height="1920">
    <rect width="1080" height="1920" fill="#111827"/>

    <rect x="60" y="60" width="260" height="70" rx="20" fill="#DC2626"/>
    <text x="95" y="108" font-size="34" fill="white" font-family="Arial">
      OFERTA DO DIA
    </text>

    <text x="60" y="1180" font-size="58" fill="white" font-family="Arial">
      Notebook Gamer Dell G15
    </text>

    <text x="60" y="1280" font-size="42" fill="#9CA3AF" font-family="Arial">
      De R$ 5.299,00
    </text>

    <text x="60" y="1390" font-size="92" fill="#22C55E" font-family="Arial">
      R$ 4.299,00
    </text>

    <rect x="60" y="1450" width="220" height="70" rx="20" fill="#16A34A"/>
    <text x="105" y="1498" font-size="34" fill="white" font-family="Arial">
      19% OFF
    </text>

    <rect x="60" y="1620" width="960" height="110" rx="30" fill="#22C55E"/>
    <text x="230" y="1690" font-size="46" fill="white" font-family="Arial">
      COMPRAR COM DESCONTO
    </text>

    <text x="60" y="1820" font-size="34" fill="#D1D5DB" font-family="Arial">
      Link de afiliado na bio
    </text>
  </svg>
  `;

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#111827",
    },
  })
    .composite([
      {
        input: produto,
        top: 220,
        left: 140,
      },
      {
        input: Buffer.from(svg),
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 95 })
    .toFile(output);

  return output;
}
