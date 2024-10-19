'use client'
import React, { useMemo } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import { MatchType } from '@/types/types'

const Scoreboard: React.FC = () => {
  const { matches } = useAdminData()

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      if (a.completed === b.completed) {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return a.completed ? 1 : -1
    })
  }, [matches])

  return (
    <section className='grid space frontpage'>
      <h1>Scoreboard</h1>
      {sortedMatches.map((match: MatchType) => (
        <div key={match.id} className="match">
          <h2>{match.homeTeam.name} vs {match.awayTeam.name}</h2>
          <p>Date: {new Date(match.date).toLocaleDateString()}</p>
          {match.completed ? (
            <p>Final Score: {match.homeScore} - {match.awayScore}</p>
          ) : (
            <p>Current Score: {match.homeScore} - {match.awayScore}</p>
          )}
        </div>
      ))}
    </section>
  )
}

export default Scoreboard
