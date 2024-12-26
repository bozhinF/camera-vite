import css from './loader-spinner.module.css';

function LoaderSpinner(): JSX.Element {
  return <div className={css.loader} data-testid="loader"></div>;
}

export default LoaderSpinner;
