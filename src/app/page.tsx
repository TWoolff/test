'use client'
import { useMemo, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useAdminData } from '@/hooks/useAdminData'
import { MatchType, MatchesTable } from '@/types/types'
import Modal from '@/components/Modal/Modal'
import Scoreboard from '@/components/Scoreboard/Scoreboard'

const ScoreboardPage: React.FC = () => {
	const { matches, teams } = useAdminData()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalContent, setModalContent] = useState<{
		homeTeam: string
		awayTeam: string
		homeScore: number
		awayScore: number
		scoringTeam: string
		scoringTeamGif?: string
		completed?: boolean
	} | null>(null)

	const prevMatchesRef = useRef<MatchType[]>([])
	const modalTimerRef = useRef<NodeJS.Timeout | null>(null)

	const matchesTable = useMemo<MatchesTable>(() => {
		const table: MatchesTable = {}

		teams.forEach(team => {
			table[team.id] = {}
			teams.forEach(opponent => {
				if (team.id !== opponent.id) {
					table[team.id][opponent.id] = { score: '-', date: '', completed: false }
				}
			})
		})

		matches.forEach(match => {
			const homeId = match.homeTeam.id
			const awayId = match.awayTeam.id
			const score = `${match.homeScore} - ${match.awayScore}`
			const date = new Date(match.date).toLocaleDateString()

			if (!table[homeId]) {
				table[homeId] = {}
			}

			table[homeId][awayId] = { score, date, completed: match.completed }

			if (!table[awayId]) {
				table[awayId] = {}
			}
			table[awayId][homeId] = { score: `${match.awayScore} - ${match.homeScore}`, date, completed: match.completed }
			table[awayId][homeId] = { score: `${match.awayScore} - ${match.homeScore}`, date, completed: match.completed }
		})

		return table
	}, [matches, teams])

	useEffect(() => {
		const updatedMatch = matches.find((match, index) => {
			const prevMatch = prevMatchesRef.current[index]
			return prevMatch && (match.homeScore !== prevMatch.homeScore || match.awayScore !== prevMatch.awayScore || match.completed !== prevMatch.completed)
		})

		if (updatedMatch) {
			const scoringTeam = updatedMatch.homeScore > updatedMatch.awayScore ? updatedMatch.homeTeam : updatedMatch.awayTeam
			const scoringTeamFull = teams.find(team => team.id === scoringTeam.id)
			setModalContent({
				homeTeam: updatedMatch.homeTeam.name,
				awayTeam: updatedMatch.awayTeam.name,
				homeScore: updatedMatch.homeScore,
				awayScore: updatedMatch.awayScore,
				scoringTeam: scoringTeam.name,
				scoringTeamGif: scoringTeamFull?.gifUrl,
				completed: updatedMatch.completed,
			})
			setIsModalOpen(true)

			if (modalTimerRef.current) {
				clearTimeout(modalTimerRef.current)
			}

			modalTimerRef.current = setTimeout(() => {
				setIsModalOpen(false)
			}, 5000)
		}

		prevMatchesRef.current = matches

		return () => {
			if (modalTimerRef.current) {
				clearTimeout(modalTimerRef.current)
			}
		}
	}, [matches, teams])

	return (
		<section className='grid space'>
			<Scoreboard teams={teams} matchesTable={matchesTable} />
			<Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
				{modalContent && (
					<>
						<h1>{modalContent.completed ? 'MATCH WINNER!' : 'SCORE!'}</h1>
						<h2>
							{modalContent.homeTeam} vs {modalContent.awayTeam}
						</h2>
						<p>
							Score: {modalContent.homeScore} - {modalContent.awayScore}
						</p>
						<p>
							{modalContent.scoringTeam} {modalContent.completed ? 'is the winner!' : 'is currently leading!'}
						</p>
						{modalContent.scoringTeamGif && (
							<div className='gifContainer'>
								<Image src={modalContent.scoringTeamGif} alt={`${modalContent.scoringTeam} celebration`} width={200} height={200} unoptimized />
							</div>
						)}
						{modalContent.completed && <p>Match completed!</p>}
					</>
				)}
			</Modal>
		</section>
	)
}

export default ScoreboardPage
