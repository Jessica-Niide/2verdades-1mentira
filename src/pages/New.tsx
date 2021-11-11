import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { database } from '../services/firebase';
import { ref, set, push, child } from 'firebase/database';
import nomeDoJogo from '../images/nomeDoJogo.svg';
import '../styles/home.css';

export function New() {
  const history = useHistory();
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');

async function handleCreateRoom(event: FormEvent) {
  event.preventDefault();
  if (newRoom.trim() === '') {
    return;
  }
  const roomRef = push(child(ref(database), `rooms/`)).key;
  
  await set(ref(database, 'rooms/' + roomRef),
  {
    title: newRoom,
    authorId: user?.id,
  })
  
  history.push(`/admin/rooms/${roomRef}`)
}

  return (
      <main>
        <img src={nomeDoJogo} alt="Título do jogo: 2 verdades, 1 mentira" />
        <div className="home-content">
          <h2>Crie sua sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
            type="text"
            placeholder="Nome da sala"
            onChange={event => setNewRoom(event.target.value)}
            value={newRoom}
            />
            <Button type="submit">
              Criar
            </Button>
          </form>
            <p>Quer entrar em uma sala já existente? <Link to='/'>Clique aqui</Link></p>
        </div>
      </main>
  )
}