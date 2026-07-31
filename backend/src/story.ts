import sharp from "sharp";
import fs from "fs";
import path from "path";

interface Produto {
  id: string;
  titulo: string;
  preco: number;
  precoAntigo: number;
  desconto: number;
  imagem: string;
  link: string;
}

export async function gerarStory(produto: Produto): Promise<string> {
  const width = 1080;
  const height = 1920;

  const output = path.join(
    process.cwd(),
    "stories",
    `story-${produto.id}-${Date.now()}.jpg`,
  );

  fs.mkdirSync(path.dirname(output), { recursive: true });

  // Baixa a imagem do produto
  const response = await fetch(produto.imagem);
  const arrayBuffer = await response.arrayBuffer();
  const bufferProduto = Buffer.from(arrayBuffer);

  const svg = `
  <svg width="1080" height="1920">
    <rect width="1080" height="1920" fill="#111827"/>

    <rect x="60" y="60" width="260" height="70" rx="20" fill="#DC2626"/>
    <text x="95" y="108" font-size="34" fill="white" font-family="Arial">
      ACHADO DO DIA
    </text>

    <text x="60" y="1180" font-size="54" fill="white" font-family="Arial">
      ${produto.titulo}
    </text>

    <text x="60" y="1280" font-size="40" fill="#9CA3AF" font-family="Arial">
      De R$ ${produto.precoAntigo.toFixed(2)}
    </text>

    <text x="60" y="1390" font-size="92" fill="#22C55E" font-family="Arial">
      R$ ${produto.preco.toFixed(2)}
    </text>

    <rect x="60" y="1450" width="220" height="70" rx="20" fill="#16A34A"/>
    <text x="105" y="1498" font-size="34" fill="white" font-family="Arial">
      ${produto.desconto}% OFF
    </text>

    <rect x="60" y="1620" width="960" height="110" rx="30" fill="#22C55E"/>
    <text x="250" y="1690" font-size="46" fill="white" font-family="Arial">
      COMPRAR AGORA
    </text>

    <text x="60" y="1820" font-size="32" fill="#D1D5DB" font-family="Arial">
      Link na bio
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
        input: bufferProduto,
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
