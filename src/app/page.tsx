'use client'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import { MatchType } from '@/types/types'
import { sortMatches } from '@/utils/sortingUtils'
import Modal from '@/components/Modal/Modal'

const Scoreboard: React.FC = () => {
  const { matches } = useAdminData()
  const sortedMatches = useMemo(() => sortMatches(matches), [matches])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<{
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    scoringTeam: string;
  } | null>(null)

  const prevMatchesRef = useRef<MatchType[]>([])
  const modalTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const updatedMatch = matches.find((match, index) => {
      const prevMatch = prevMatchesRef.current[index]
      return prevMatch && (match.homeScore !== prevMatch.homeScore || match.awayScore !== prevMatch.awayScore || match.completed !== prevMatch.completed)
    })

    if (updatedMatch) {
      setModalContent({
        homeTeam: updatedMatch.homeTeam.name,
        awayTeam: updatedMatch.awayTeam.name,
        homeScore: updatedMatch.homeScore,
        awayScore: updatedMatch.awayScore,
        scoringTeam: updatedMatch.homeScore > updatedMatch.awayScore ? updatedMatch.homeTeam.name : updatedMatch.awayTeam.name,
      })
      setIsModalOpen(true)

      // Clear any existing timer
      if (modalTimerRef.current) {
        clearTimeout(modalTimerRef.current)
      }

      // Set a new timer to close the modal after 10 seconds
      modalTimerRef.current = setTimeout(() => {
        setIsModalOpen(false)
      }, 5000)
    }

    prevMatchesRef.current = matches

    // Cleanup function to clear the timer when component unmounts or re-renders
    return () => {
      if (modalTimerRef.current) {
        clearTimeout(modalTimerRef.current)
      }
    }
  }, [matches])



  return (
    <section className='grid space frontpage'>
      <h1>Scoreboard</h1>
      {sortedMatches.map((match: MatchType) => (
        <div key={match.id} className="match">
          <h2>{match.homeTeam.name} vs {match.awayTeam.name}</h2>
          <p>Date: {new Date(match.date).toLocaleDateString()}</p>
          <p>{match.completed ? 'Final' : 'Current'} Score: {match.homeScore} - {match.awayScore}</p>
        </div>
      ))}
      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
        {modalContent && (
          <div>
            <h1>Score!!!</h1>
            <h2>{modalContent.homeTeam} vs {modalContent.awayTeam}</h2>
            <p>Score: {modalContent.homeScore} - {modalContent.awayScore}</p>
            <p>{modalContent.scoringTeam} is currently leading!</p>
          </div>
        )}
      </Modal>
    </section>
  )
}

export default Scoreboard
