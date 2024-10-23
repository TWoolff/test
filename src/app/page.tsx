'use client'
import { useMemo, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useAdminData } from '@/hooks/useAdminData'
import { MatchType, MatchesTable } from '@/types/types'
import Scoreboard from '@/components/Scoreboard/Scoreboard'
import Modal from '@/components/Modal/Modal'

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

	// Ref to store previous matches for comparison
	const prevMatchesRef = useRef<MatchType[]>([])

	// Ref to store timer for auto-closing modal
	const modalTimerRef = useRef<NodeJS.Timeout | null>(null)

	// Memoized computation of matches table
	const matchesTable = useMemo<MatchesTable>(() => {
		const table: MatchesTable = {}

		// Initialize table with empty scores for all team combinations
		teams.forEach(team => {
			table[team.id] = {}
			teams.forEach(opponent => {
				if (team.id !== opponent.id) {
					table[team.id][opponent.id] = { score: '-', date: '', completed: false }
				}
			})
		})

		// Populate table with actual match data
		matches.forEach(match => {
			const homeId = match.homeTeam.id
			const awayId = match.awayTeam.id
			const score = `${match.homeScore} - ${match.awayScore}`
			const date = new Date(match.date).toLocaleDateString()

			if (!table[homeId]) {
				table[homeId] = {}
				table[homeId][awayId] = { score, date, completed: match.completed }
			}

			if (!table[awayId]) {
				table[awayId] = {}
				table[awayId][homeId] = { score: `${match.awayScore} - ${match.homeScore}`, date, completed: match.completed }
			}
		})

		return table
	}, [matches, teams])

	useEffect(() => {
		// Find updated match by comparing with previous matches
		const updatedMatch = matches.find((match, index) => {
			const prevMatch = prevMatchesRef.current[index]
			return prevMatch && (match.homeScore !== prevMatch.homeScore || match.awayScore !== prevMatch.awayScore || match.completed !== prevMatch.completed)
		})

		if (updatedMatch) {
			// Determine scoring team
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

			// Set new timer to close modal after 5 seconds
			modalTimerRef.current = setTimeout(() => {
				setIsModalOpen(false)
			}, 5000)
		}

		// Update previous matches ref
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
