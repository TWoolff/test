import Link from 'next/link'
import css from './Header.module.css'

const Header: React.FC = () => {
  return (
    <header className={`${css.header} space`}>
      <h1><Link href="/">Foosball Tournament</Link></h1>
      <nav>
        <ul>
          <li><Link href="/">Scoreboard</Link></li>
          <li><Link href="/leaderboard">Leaderboard</Link></li>
          <li><Link href="/admin">Admin</Link></li>
        </ul>
      </nav>
    </header>
	)
}

export default Header