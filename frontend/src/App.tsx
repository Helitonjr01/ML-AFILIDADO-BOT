import { useState } from 'react';
import axios from 'axios';

function App() {
  const [imagem, setImagem] = useState('');

  async function gerar() {
    const { data } = await axios.post('http://localhost:3000/gerar-story');

    setImagem(data.imagem);
  }

  return (
    <div
      style={{
        padding: 40,
        fontFamily: 'Arial'
      }}
    >
      <h1>ML Afiliado Bot</h1>

      <button onClick={gerar}>
        Gerar Story
      </button>

      {imagem && (
        <div style={{ marginTop: 20 }}>
          <p>Story criado:</p>
          <code>{imagem}</code>
        </div>
      )}
    </div>
  );
}

export default App;