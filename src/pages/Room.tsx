import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { Button } from '../components/Button';
import { AddTrivia } from '../components/AddTrivia';
import imgVoid from '../images/void.png';
import { ref, push, onValue, off } from 'firebase/database';
import '../styles/room.css';
import logo from '../images/logo.svg';
import a from '../images/a.png';
import b from '../images/b.png';
import c from '../images/c.png';
import { Trivia } from '../components/Trivia';
import { RoomCode } from '../components/RoomCode';

type RoomParams = {
	id: string;
}

export function Room() {
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const { trivias, title } = useRoom(roomId);
	const history = useHistory();
	const [hideModal, setHideModal] = useState("true");

	useEffect(() => {
		const roomRef = ref(database, `rooms/${roomId}`);
		onValue(roomRef, (room) => {
			const thisRoom = room.val();
			if (thisRoom.closed) {
				alert("Esta sala foi encerrada.");
					history.push('/');
			}
			else {
				return () => {
					off(roomRef);
				}
			}
		})
	},[roomId, history])

	async function handleLeaveRoom() {
		if (window.confirm('Tem certeza que você deseja sair da sala?')) {
			history.push('/');
			}
	}

	async function handleAddVote(triviaId: string, voted: string) {
		if (voted === "itemA") {
			await push(ref(database, `rooms/${roomId}/trivias/${triviaId}/votesA`), voted);
		}
		if (voted === "itemB") {
			await push(ref(database, `rooms/${roomId}/trivias/${triviaId}/votesB`), voted);
		}
		if (voted === "itemC") {
			await push(ref(database, `rooms/${roomId}/trivias/${triviaId}/votesC`), voted);
		}
	}

	return (
		<>
		<div id="page-room">
		<header>
				<div className="room-header">
        <img src={logo} alt="Logo do jogo" className="logo"/>
				<div className="room-title">
        <h1>
				  {title}
				</h1>
				</div>
					<div className="header-buttons">
						<RoomCode code={roomId}/>
						<Button 
            fitContent 
            onClick={handleLeaveRoom}
            title="Sair da sala"
            >
              Sair da sala
              </Button>
					</div>
					</div>
			</header>
			<main className="main-room">
				<div className="room-content">
					{trivias.length === 0 && <img src={imgVoid} alt="Ilustração de um balão com a inscrição: 'Nenhuma verdade ou mentira por aqui ainda!'" /> }
					<div className="trivia-list">
					{trivias.map(trivia => {
						return (
							<Trivia
							key={trivia.id}
							avatar={trivia.avatar}
							author={trivia.author}
							triviaA={trivia.triviaA}
							triviaB={trivia.triviaB}
							triviaC={trivia.triviaC}
							lie={trivia.lie}
							rightAnswer={trivia.rightAnswer}
							wrongAnswer={trivia.wrongAnswer}
							>
								<>
								<div className="vote">
									<p>Qual é a mentira?</p>
									<button className="voting-button"
										disabled={trivia.rightAnswer || trivia.wrongAnswer}
										onClick={() => handleAddVote(trivia.id, "itemA")}
									>
										<img src={a} alt="A" title={trivia.triviaA} />
										{trivia.voteACount}
									</button>
									<button className="voting-button"
										disabled={trivia.rightAnswer || trivia.wrongAnswer}
										onClick={() => handleAddVote(trivia.id, "itemB")}
									>
										<img src={b} alt="B" title={trivia.triviaB}/>
										{trivia.voteBCount}
									</button>
									<button className="voting-button"
										disabled={trivia.rightAnswer || trivia.wrongAnswer}
										onClick={() => handleAddVote(trivia.id, "itemC")}
									>
										<img src={c} alt="C" title={trivia.triviaC}/>
										{trivia.voteCCount}
									</button>
								</div>
								</>
							</Trivia>
							);
						})}
					</div>
				</div>
        <Button
					title="Adicione suas confissões ;)" 
					onClick={() => setHideModal("false")}>
          + adicionar
        </Button>
				<AddTrivia
				 hide={hideModal}
				 onClose={()=>setHideModal("true")}
				  />
			</main>
		</div>
		</>
	);
}
