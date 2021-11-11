import { FormEvent, FormHTMLAttributes, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { database } from '../services/firebase';
import { ref, get, push } from 'firebase/database';
import '../styles/form.css';
import { Button } from './Button';

type AddTriviaProps = FormHTMLAttributes<HTMLFormElement> & {
  hide: string,
  onClose: VoidFunction
}
type RoomParams = {
	id: string;
}

export function AddTrivia({hide, onClose, ...props}: AddTriviaProps){
  const params = useParams<RoomParams>();
	const roomId = params.id;
  const history = useHistory();
  const [author, setAuthor] = useState("");
  const [avatar, setAvatar] = useState("");
  const [triviaA, setTriviaA] = useState("");
  const [triviaB, setTriviaB] = useState("");
  const [triviaC, setTriviaC] = useState("");
  const [lie, setLie] = useState("");

  useEffect(() => {
		const roomRef = ref(database, `rooms/${roomId}`);
		get(roomRef);
	},[roomId, history])

	async function handleSendTrivia(event: FormEvent) {
		event.preventDefault();
			const trivia = {
				triviaA: triviaA,
				author: author,
        triviaB: triviaB,
        triviaC: triviaC,
        avatar: avatar,
        lie: lie,
				isAnswered: false,
			};
      await push(ref(database, `rooms/${roomId}/trivias/`), trivia);
      setAuthor("");
      setAvatar("");
      setTriviaA("");
      setTriviaB("");
      setTriviaC("");
      setLie("");
      onClose();
	}

  if (hide==="true") {
    return null;
  }
    return (
      <div className="form-container">
      <div className="form-content">
        <button className="close" title="Fechar"
        onClick={onClose}
        >x</button>
        <form
            onSubmit={handleSendTrivia}
            className="add-trivia"
            {...props }
            >
              <label htmlFor="name">
                Nome
                </label>
              <input required type="text" id="name" 
              placeholder="Nome, apelido, etc..."
              onChange={event => setAuthor(event.target.value)}
              value={author}
              />

              <p>Escolha sua imagem</p>
              <div className="options" >
                <input required type="radio" id="dog" name="avatar-api"
                onChange={event => setAvatar("https://place-puppy.com/300x300")}
                value={avatar}
                />
                <label htmlFor="dog">Cachorro</label>
              </div>
              <div className="options" >
                <input type="radio" id="cat" name="avatar-api"
                onChange={event => setAvatar("http://placekitten.com/g/300/300")}
                value={avatar}
                />
                <label htmlFor="cat">
                  Gato
                </label>
              </div>
              <div className="options" >
                <input type="radio" id="cage" name="avatar-api"
                onChange={event => setAvatar("https://www.placecage.com/g/300/300")}
                value={avatar}
                />
                <label htmlFor="cage">
                  Nicholas Cage
                </label>
              </div>
              <p>
                Conta aí duas verdades e uma mentira.
              </p>
              <div className="itemsABC">
              <label htmlFor="triviaA">
                a)
                </label>
              <textarea required id="triviaA" 
              placeholder="Ex.: Gosto de chocolate"
              onChange={event => setTriviaA(event.target.value)}
              value={triviaA}
              />
              </div>
              <div className="itemsABC">
              <label htmlFor="triviaB">
                b)
                </label>
              <textarea  required id="triviaB" 
              placeholder="Ex.: Tenho um cachorro"
              onChange={event => setTriviaB(event.target.value)}
              value={triviaB}
              />
              </div>
              <div className="itemsABC">
              <label htmlFor="triviaC">
                c)
                </label>
              <textarea required id="triviaC" 
                placeholder="Ex.: Sou ryca!!!"
                onChange={event => setTriviaC(event.target.value)}
                value={triviaC}
              />
              </div>

              <p>Qual é a mentira?</p>
              <div className="options">
                <input required type="radio" id="A" name="set-lie"
                  onChange={event => setLie("A")}
                  value={lie}
                />
                <label htmlFor="A">
                  a
                </label>
              </div>
              <div className="options" >
                <input type="radio" id="B" name="set-lie"
                  onChange={event => setLie("B")}
                  value={lie}
                />
                <label htmlFor="B">
                  b
                </label>
              </div>
              <div className="options" >
                <input type="radio" id="C" name="set-lie"
                  onChange={event => setLie("C")}
                  value={lie}
                />
                <label htmlFor="C">
                  c
                </label>
              </div>
              <Button type="submit">
                Enviar
              </Button>
          </form>
      </div>
      </div>
    )
}