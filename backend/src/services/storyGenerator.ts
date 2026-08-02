import { createCanvas, loadImage } from "@napi-rs/canvas";
import fs from "fs";
import path from "path";
import { MLProduct } from "../api/mercadoLivre";
const WIDTH = 1080;
const HEIGHT = 1920;
const STORIES_DIR = path.join(__dirname, "..", "..", "public", "stories");

if (!fs.existsSync(STORIES_DIR)) {
  fs.mkdirSync(STORIES_DIR, { recursive: true });
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY + lineHeight;
}

export async function generateStoryImage(product: MLProduct): Promise<{
  filePath: string;
  fileName: string;
}> {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;

  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "#fff159");
  gradient.addColorStop(1, "#ffffff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const cardX = 80;
  const cardY = 260;
  const cardW = WIDTH - 160;
  const cardH = 900;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cardX, cardY, cardW, cardH, 32);
  ctx.fill();

  try {
    const img = await loadImage(product.thumbnail);
    const imgSize = 700;
    const imgX = cardX + (cardW - imgSize) / 2;
    const imgY = cardY + (cardH - imgSize) / 2;
    ctx.drawImage(img as any, imgX, imgY, imgSize, imgSize);
  } catch {
    // segue sem a imagem se falhar o download
  }

  if (product.discountPercent) {
    ctx.fillStyle = "#e60023";
    roundRect(ctx, WIDTH - 320, 180, 240, 100, 20);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`-${product.discountPercent}%`, WIDTH - 200, 248);
  }

  ctx.fillStyle = "#333333";
  ctx.font = "bold 44px Arial";
  ctx.textAlign = "left";
  wrapText(ctx, product.title, cardX + 40, cardY + cardH + 90, cardW - 80, 54);

  ctx.fillStyle = "#00a650";
  ctx.font = "bold 90px Arial";
  ctx.fillText(formatBRL(product.price), cardX + 40, cardY + cardH + 260);

  if (product.originalPrice) {
    ctx.fillStyle = "#999999";
    ctx.font = "40px Arial";
    const oldPriceText = formatBRL(product.originalPrice);
    ctx.fillText(oldPriceText, cardX + 40, cardY + cardH + 320);
    const { width } = ctx.measureText(oldPriceText);
    ctx.beginPath();
    ctx.moveTo(cardX + 40, cardY + cardH + 305);
    ctx.lineTo(cardX + 40 + width, cardY + cardH + 305);
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  ctx.fillStyle = "#2d2d2d";
  ctx.font = "bold 46px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Arrasta pra cima e garante o seu 👆", WIDTH / 2, HEIGHT - 120);

  const fileName = `story-${product.id}-${Date.now()}.png`;
  const filePath = path.join(STORIES_DIR, fileName);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filePath, buffer);

  return { filePath, fileName };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
