'use client'
import { CldImage } from 'next-cloudinary'
import { IconProfile } from '@/components/Icons/Icons'
import { PlayerType } from '@/types/types'
import css from './Player.module.css'

const Player: React.FC<PlayerType> = ({ name, nickname, profileImage }) => {
	return (
		<div className={css.player}>
			{profileImage ? <CldImage src={profileImage} width='60' height='60' crop='fill' alt={`Profile of ${name}`} /> : <IconProfile />}
			<h3>
				{name} {nickname && `aka ${nickname}`}
			</h3>
		</div>
	)
}

export default Player
