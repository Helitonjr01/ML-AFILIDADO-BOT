import express from 'express';
import cors from 'cors';
import { gerarStory } from './story.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/gerar-story', async (req, res) => {
  try {
    const imagem = await gerarStory();

    res.json({
      sucesso: true,
      imagem
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      sucesso: false,
      erro: 'Erro ao gerar story'
    });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});