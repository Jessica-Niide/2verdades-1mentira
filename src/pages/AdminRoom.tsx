import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { ref, get, update, push } from 'firebase/database';
import { Button } from '../components/Button';
import { AddTrivia } from '../components/AddTrivia';
import { Trivia } from '../components/Trivia';
import { RoomCode } from '../components/RoomCode';
import imgVoid from '../images/void.png';
import logo from '../images/logo.svg';
import a from '../images/a.png';
import b from '../images/b.png';
import c from '../images/c.png';
import '../styles/room.css';

type RoomParams = {
	id: string;
}

export function AdminRoom() {
	const params = useParams<RoomParams>();
	const { user, signOut } = useAuth();
	const roomId = params.id;
	const { trivias, title, admin } = useRoom(roomId);
	const [ hideModal, setHideModal ] = useState("true");
	const history = useHistory();

	useEffect(() => {
		const roomRef = ref(database, `/rooms/${roomId}`);
		get(roomRef);
	},[roomId, history, user, admin])

	useEffect(() => {
		if(admin){
			console.log(admin)
			if(user?.id !== admin){
				history.push(`/rooms/${roomId}`);
			}
		}
	},[history, admin, user, roomId]);

	if(!admin){
		console.log(admin)
		return <p>Carregando</p>
	}

	async function handleEndRoom() {
		if (window.confirm('Tem certeza que você deseja encerrar a sala?')) {
			await update(ref(database, `rooms/${roomId}`),
				{closed: true}
			)
			history.push('/');
		}
	}

	async function handleSignOut() {
		if (window.confirm('Ao se desconectar a sala será encerrada. Tem certeza que você deseja sair?')) {
			await update(ref(database, `rooms/${roomId}`),
			{closed: true}
			)
			signOut();
			history.push('/');
		}
	}

	async function setAnswer(triviaId: string, right: boolean) {
		if (right) {
			await update(ref(database, `rooms/${roomId}/trivias/${triviaId}`),{
				rightAnswer: true,
			});
		}
		else {
			await update(ref(database, `rooms/${roomId}/trivias/${triviaId}`),{
				wrongAnswer: true,
			});
		}
	}

		async function handleRevealAnswer(triviaId: string, votesA: number, votesB: number, votesC: number, lie: string) {
			if (lie === "A") {
				setAnswer(triviaId, (votesA >= votesB) && (votesA >= votesC))
			}
			if (lie === "B") {
				setAnswer(triviaId, (votesB >= votesA) && (votesB >= votesC))
			}
			if (lie === "C") {
				setAnswer(triviaId, (votesC >= votesA) && (votesC >= votesB))
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
		<div id="admin-room">
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
            onClick={handleEndRoom}
            title="Encerrar sala"
            >
              Encerrar sala
              </Button>
							<button className="logout" 
								title="Deseja sair da sua conta?"
								onClick={handleSignOut}>
								Sair da sua conta?
							</button>
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
								triviaA={trivia.triviaA}
								avatar={trivia.avatar}
								author={trivia.author}
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
										{trivia.voteACount > 0 ? trivia.voteACount : ''}
									</button>
									<button className="voting-button"
										disabled={trivia.rightAnswer || trivia.wrongAnswer}
										onClick={() => handleAddVote(trivia.id, "itemB")}
									>
										<img src={b} alt="B" title={trivia.triviaB}/>
										{trivia.voteBCount > 0 ? trivia.voteBCount : ''}
									</button>
									<button className="voting-button"
										disabled={trivia.rightAnswer || trivia.wrongAnswer}
										onClick={() => handleAddVote(trivia.id, "itemC")}
									>
										<img src={c} alt="C" title={trivia.triviaC}/>
										{trivia.voteCCount > 0 ? trivia.voteCCount : ''}
									</button>
								</div>
								<button
								 onClick={() => handleRevealAnswer(trivia.id, trivia.voteACount, trivia.voteBCount, trivia.voteCCount, trivia.lie)} 
								 disabled={trivia.rightAnswer || trivia.wrongAnswer}
								 className="reveal">Ver resposta</button> 
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
					onClose={()=>setHideModal("true")} />
			</main>
		</div>
		</>
	);
}