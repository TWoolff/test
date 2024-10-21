import { IconScore } from '../Icons/Icons'
import css from './Scoreboard.module.css'
import { TeamType, MatchesTable } from '@/types/types'

type ScoreboardProps = {
	teams: TeamType[]
	matchesTable: MatchesTable
}

const Scoreboard: React.FC<ScoreboardProps> = ({ teams, matchesTable }) => {
	return (
		<section className={css.scoreboard}>
			{teams.length === 0 && <p style={{ gridColumn: '1 / -1' }}>Add teams to start</p>}
			<h1>
				<IconScore /> Scoreboard
			</h1>
			<div className={css.tableWrapper}>
				{teams.length > 0 && (
					<table className={css.scoreboardTable}>
						<thead>
							<tr>
								<th></th>
								{teams.map(team => (
									<th key={team.id}>
										{team.name}
										<div className={css.playerList}>
											{team.players.map(player => (
												<div key={player.id} className={css.player}>
													{player.name}
												</div>
											))}
										</div>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{teams.map(rowTeam => (
								<tr key={rowTeam.id}>
									<th>{rowTeam.name}</th>
									{teams.map(colTeam => {
										if (rowTeam.id === colTeam.id) {
											return <td key={colTeam.id} className={css.diagonalCell}></td>
										}
										const match = matchesTable[rowTeam.id][colTeam.id]
										return (
											<td key={colTeam.id} className={match.completed ? css.completedMatch : css.activeMatch}>
												<div>{match.score}</div>
												<div>{match.date}</div>
											</td>
										)
									})}
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</section>
	)
}

export default Scoreboard
