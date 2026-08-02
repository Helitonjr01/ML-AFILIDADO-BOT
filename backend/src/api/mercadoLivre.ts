import axios from "axios";
import * as cheerio from "cheerio";

const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

export interface MLProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  thumbnail: string;
  permalink: string;
  affiliateLink: string;
  soldQuantity: number | null;
  freeShipping: boolean;
}

export async function extractProductFromUrl(url: string): Promise<MLProduct> {
  const { data: html } = await axios.get(url, { headers: DEFAULT_HEADERS });
  const $ = cheerio.load(html);

  const title =
    $('meta[property="og:title"]').attr("content") ??
    $("h1").first().text().trim();

  const thumbnail = $('meta[property="og:image"]').attr("content") ?? "";

  const priceText =
    $('meta[itemprop="price"]').attr("content") ??
    $(".andes-money-amount__fraction").first().text().replace(/\D/g, "");

  const price = Number(priceText);

  const originalPriceText = $(
    ".andes-money-amount--previous .andes-money-amount__fraction",
  )
    .first()
    .text()
    .replace(/\D/g, "");
  const originalPrice = originalPriceText ? Number(originalPriceText) : null;

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  if (!title || !price) {
    throw new Error(
      "Não consegui extrair os dados dessa página. Cole os dados manualmente.",
    );
  }

  return {
    id: String(Date.now()),
    title,
    price,
    originalPrice,
    discountPercent,
    thumbnail,
    permalink: url,
    affiliateLink: url,
    soldQuantity: null,
    freeShipping: false,
  };
}
