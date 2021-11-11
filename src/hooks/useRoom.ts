import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";
import { ref, onValue, off } from 'firebase/database';

type TriviaType = {
	id: string;
	author: string;
	avatar: string;
	triviaA: string;
	triviaB: string;
	triviaC: string;
	lie: string;
	rightAnswer: boolean;
	wrongAnswer: boolean;
	voteACount: number;
	voteAId: string | undefined;
	voteBCount: number;
	voteBId: string | undefined;
	voteCCount: number;
	voteCId: string | undefined;
}

type FirebaseTrivias = Record<string, {
	author: string;
	avatar: string;
	triviaA: string;
	itemA: number;
	triviaB: string;
	triviaC: string;
	lie: string;
	rightAnswer: boolean;
	wrongAnswer: boolean;
	votesA: Record<string, { authorId: string }>;
	votesB: Record<string, { authorId: string }>;
	votesC: Record<string, { authorId: string }>;
}>

export function useRoom(roomId: string) {
	const { user } = useAuth();
	const [ title, setTitle]  = useState('');
	const [ admin, setAdmin ] = useState('');
	const [ trivias, setTrivias ] = useState<TriviaType[]>([]);

	useEffect(() => {
		const roomRef = ref(database, `rooms/${roomId}`);
		onValue(roomRef, (room) => {
			const databaseRoom = room.val();
			const firebaseTrivias: FirebaseTrivias = databaseRoom.trivias ?? {};
			const parsedTrivias = Object.entries(firebaseTrivias).map(([key, value]) => {
				return {
					id: key,
					author: value.author,
					avatar: value.avatar,
					triviaA: value.triviaA,
					triviaB: value.triviaB,
					triviaC: value.triviaC,
					lie: value.lie,
					rightAnswer: value.rightAnswer,
					wrongAnswer: value.wrongAnswer,
					voteACount: Object.values(value.votesA ?? {}).length,
					voteAId: Object.entries(value.votesA ?? {}).find(([key, vote]) => vote.authorId === user?.id)?.[0],
					voteBCount: Object.values(value.votesB ?? {}).length,
					voteBId: Object.entries(value.votesB ?? {}).find(([key, vote]) => vote.authorId === user?.id)?.[0],
					voteCCount: Object.values(value.votesC ?? {}).length,
					voteCId: Object.entries(value.votesC ?? {}).find(([key, vote]) => vote.authorId === user?.id)?.[0],
				}
			});
			setTitle(databaseRoom.title);
			setAdmin(databaseRoom.authorId);
			setTrivias(parsedTrivias);
		})

		return () => {
			off(roomRef);
		}
	}, [roomId, user?.id]);
	return { trivias, title, admin }
}