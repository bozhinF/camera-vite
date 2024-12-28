import { Helmet } from 'react-helmet-async';

function FailedToLoad(): JSX.Element {
  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Helmet>
        <title>Каталог - Фотошоп</title>
      </Helmet>
      <div className="page-content">
        <div>
          <h1 className="title title--h2">Ошибка загрузки информации</h1>
        </div>
      </div>
    </main>
  );
}

export default FailedToLoad;
