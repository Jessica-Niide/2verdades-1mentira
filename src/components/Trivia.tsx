import { ReactNode, useState } from 'react';
import '../styles/trivia.css';


type TriviaProps = {
	author: string;
	avatar: string;
	triviaA: string;
	triviaB: string;
	triviaC: string;
	lie: string;
	rightAnswer: boolean;
	wrongAnswer: boolean;
	children?: ReactNode;
}

export function Trivia({
	author,
	avatar,
	triviaA,
	triviaB,
	triviaC,
	lie,
	rightAnswer = false,
	wrongAnswer = false,
	children
}: TriviaProps) {
	
	const [showTrivia, setShowTrivia] = useState(true);

	function handleShowTrivia() {
		setShowTrivia(!showTrivia);
	}

	return (
		<div className={
			`trivia-container ${rightAnswer ? 'right' : ''} ${wrongAnswer ? 'wrong' : ''}`}>
				<div className={`closed-trivia ${showTrivia ? '' : 'show'}`}>
					<button className="show-trivia" onClick={handleShowTrivia} >{author}</button>
				</div>
				<div className={`open-trivia ${showTrivia ? 'show' : ''}`} >
					<button 
						className="hide-trivia"
						title="Fechar"
					 	onClick={handleShowTrivia}>
						x
					</button>
					<div className="content">
						<div className="avatar">
							<img src={avatar} alt={author}/>
						</div>
						<div className="item-list">
							<span>{author} disse que:</span>
							<ol type="a">
								<li className={`item ${lie === "A" ? 'lie' : 'truth'}`} >{triviaA}</li>
								<li className={`item ${lie === "B" ? 'lie' : 'truth'}`}>{triviaB}</li>
								<li className={`item ${lie === "C" ? 'lie' : 'truth'}`}>{triviaC}</li>
							</ol>
							<div>
								{children}
							</div>
					</div>
				</div>
				</div>
		</div>
	);
}