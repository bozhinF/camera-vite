import LoaderSpinner from '../loader-spinner/loader-spinner';
import css from './loader.module.css';

function Loader(): JSX.Element {
  return (
    <div className={css.wrapper}>
      <LoaderSpinner />
      <div className={css.text}>Loading...</div>
    </div>
  );
}

export default Loader;
