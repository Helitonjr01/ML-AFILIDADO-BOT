import axios from "axios";
import { Produto } from "../types/produto";

export async function buscarOfertas(): Promise<Produto[]> {
  const termo = "kemei";

  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(termo)}`;

  const { data } = await axios.get(url);

  const produtos: Produto[] = data.results
    .map((item: any) => {
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
        imagem: item.thumbnail.replace("-I.jpg", "-O.jpg"),
        link: item.permalink,
      };
    })
    .filter((p: Produto) => p.desconto >= 20)
    .sort((a: Produto, b: Produto) => b.desconto - a.desconto);

  return produtos.slice(0, 10);
}
