'use client'
import { CldImage } from 'next-cloudinary';

import { PlayerType } from "@/types/types";
import { IconProfile } from "@/components/Icons/Icons";
import css from './Player.module.css';


const Player: React.FC<PlayerType> = ({ name, nickname, profileImage }) => {
  return (
    <div className={css.player}>
      {profileImage ? (
        <CldImage
          src={profileImage}
          width="500"
          height="500"
          crop="fill"
          alt={`Profile of ${name}`}
        />
      ) : (
        <IconProfile />
      )}
      <h3>{name} aka {nickname}</h3>
    </div>
  );
}

export default Player;
