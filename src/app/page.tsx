'use client'
import { useMemo, useState, useEffect, useRef } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import { MatchType, MatchData } from '@/types/types'
import Modal from '@/components/Modal/Modal'

const Scoreboard: React.FC = () => {
  const { matches, teams } = useAdminData()
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

  const matchesTable = useMemo(() => {
    const table: { [key: string]: { [key: string]: MatchData } } = {}
    
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
      
      if (!table[homeId][awayId]) {
        table[homeId][awayId] = { score: '-', date: '', completed: false }
      }
      
      table[homeId][awayId] = { score, date, completed: match.completed }
      
      if (!table[awayId]) {
        table[awayId] = {}
      }
      if (!table[awayId][homeId]) {
        table[awayId][homeId] = { score: '-', date: '', completed: false }
      }
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
      setModalContent({
        homeTeam: updatedMatch.homeTeam.name,
        awayTeam: updatedMatch.awayTeam.name,
        homeScore: updatedMatch.homeScore,
        awayScore: updatedMatch.awayScore,
        scoringTeam: updatedMatch.homeScore > updatedMatch.awayScore ? updatedMatch.homeTeam.name : updatedMatch.awayTeam.name,
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
  }, [matches])

  return (
    <section className='grid space frontpage'>
      <h1>Scoreboard</h1>
      <div className="tableWrapper">
        <table className='scoreboardTable'>
          <thead>
            <tr>
              <th></th>
              {teams.map(team => (
                <th key={team.id}>{team.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map(rowTeam => (
              <tr key={rowTeam.id}>
                <th>{rowTeam.name}</th>
                {teams.map(colTeam => {
                  if (rowTeam.id === colTeam.id) {
                    return <td key={colTeam.id} className='diagonalCell'></td>
                  }
                  const match = matchesTable[rowTeam.id][colTeam.id]
                  return (
                    <td key={colTeam.id} className={match.completed ? 'completedMatch' : 'activeMatch'}>
                      <div>{match.score}</div>
                      <div>{match.date}</div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
