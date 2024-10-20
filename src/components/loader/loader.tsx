import css from './loader.module.css';

function Loader(): JSX.Element {
  return (
    <div className={css.wrapper}>
      <div className={css.loader}></div>
      <div className={css.text}>Loading...</div>
    </div>
  );
}

export default Loader;
