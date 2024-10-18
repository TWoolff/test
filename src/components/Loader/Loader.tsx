import css from './Loader.module.css';

const Loader: React.FC = () => {
  return ( 
    <section className={css.loader}>
      <div className={css.spinner} />
    </section>
	);
};

export default Loader;