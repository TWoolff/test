'use client';
import { useEffect } from 'react';
import { useAppContext } from '@/services/context';
import Loader from '@/components/Loader/Loader';

const Scoreboard: React.FC = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    dispatch({ type: 'SET_STATE', payload: { hasLoaded: true } });
  }, []);

  return ( 
    <section className='grid space'>
			{state.hasLoaded ? <h1>Scoreboard</h1> : <Loader />}
		</section>
	);
};

export default Scoreboard;
