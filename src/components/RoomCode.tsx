import copyImg from '../images/copy.svg';
import '../styles/room-code.css';

type RoomCodeProps = {
	code: string;
}

export function RoomCode(props: RoomCodeProps) {

	function copyRoomCodeToClipboard() {
		// toast('Copied');
		navigator.clipboard.writeText(props.code)
	}

	return (
		// <>
		<button className={'room-code'} title="Copiar" onClick={copyRoomCodeToClipboard}>
			<div>
				<img src={copyImg} alt="Copy room code"/>
			</div>
			<span>Sala #{props.code}</span>
		</button>
		// {/* <Toaster/> */}
		// {/* </> */}
	)
}