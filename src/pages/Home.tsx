import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import nomeDoJogo from '../images/nomeDoJogo.svg';
import logoGoogle from '../images/google-icon.svg';
import { Button } from '../components/Button';
import '../styles/home.css';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';
import { ref, get } from 'firebase/database';

// import { auth } from '../services/firebase';
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
// import { useState } from 'react';


export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [ roomCode, setRoomCode ] = useState('');
  // type User = {
  //   id: string;
  //   name: string;
  //   avatar: string;
  // }
  // const [user, setUser] = useState<User>();

  // async function signInWithGoogle() {
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(auth, provider);
  //     if (result.user) {
  //       const { displayName, photoURL, uid } = result.user
  //       if (!displayName || !photoURL) {
  //         throw new Error('Missing information from Google Account');
  //       }
  //       setUser({
  //         id: uid,
  //         name: displayName,
  //         avatar: photoURL
  //       })
  //     }
  // }


  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === '') {
      return;
    }
    const roomRef = await get(ref(database, `rooms/${roomCode}`))
    if (!(roomRef.exists())) {
      alert("sala não existe");
      return;
    }
    history.push(`rooms/${roomCode}`);
    
  }

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }    
    history.push('/rooms/new');
  }
  return (
      <main>
        <img src={nomeDoJogo} alt="Título do jogo: 2 verdades, 1 mentira" />
        <div className="home-content">
          <h1>Conte 2 verdades e 1 mentira e veja quem acerta!</h1>
          <h2>Crie uma sala e comece o jogo</h2>
          <button id="auth-button" onClick={handleCreateRoom}>
            <img src={logoGoogle} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <span>ou entre em uma sala</span>
          <form onSubmit={handleJoinRoom}>
            <input 
            type="text"
            placeholder="Digite o código da sala" 
            onChange={event => setRoomCode(event.target.value)}
            value={roomCode}
            />
            <Button>Entrar</Button>
          </form>
        </div>
        <details>
          <summary>Como jogar</summary>
          <p>
            Conte duas verdades e uma mentira sobre você e veja se seus amigos conseguem adivinhar qual é a mentira!
          </p>
          <ol type="1">
            <li>
              Para criar uma sala, é necessário entrar com sua conta Google
            </li>
            <li>
              Quem cria a sala se torna administrador, e só essa pessoa conseguirá revelar as mentiras dos participantes
            </li>
            <li>
              Você pode entrar na sala usando o código ou usando diretamente o endereço da página no navegador. Peça para o administrador te enviar ;)
            </li>
            <li>
              Bom jogo!
            </li>
          </ol>
        </details>

      </main>
  )
}