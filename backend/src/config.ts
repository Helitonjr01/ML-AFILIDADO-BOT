import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback = ""): string {
  const value = process.env[name] ?? fallback;
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3333),
  publicBaseUrl: required("PUBLIC_BASE_URL", "http://localhost:3333"),

  mercadoLivre: {
    siteId: required("ML_SITE_ID", "MLB"),
    accessToken: required("ML_ACCESS_TOKEN"),
    affiliateId: required("ML_AFFILIATE_ID"),
  },

  instagram: {
    accessToken: required("IG_ACCESS_TOKEN"),
    businessAccountId: required("IG_BUSINESS_ACCOUNT_ID"),
    graphApiVersion: required("IG_GRAPH_API_VERSION", "v21.0"),
  },
};
