import style from "./App.module.css"
import Alert from "./components/Alert/Alert"
import Form from "./components/Form/Form"
import Spinner from "./components/Spinner/Spinner"
import WeatherDetail from "./components/WeatherDetail/WeatherDetail"
import useWeather from "./hooks/useWeather"

function App() {

  const { weather, loading, notFound, fetchWeather, hasWeatherData } = useWeather()


  return (
    <>
      <h1 className={style.title}>Buscador de Climas</h1>

      <div className={style.container}>
        <Form
          fetchWeather={fetchWeather}
        />
        {loading && <Spinner />}
        {hasWeatherData && <WeatherDetail weather={weather} />}
        {notFound && <Alert>Ciudad no Encontrada</Alert>}

      </div>
    </>
  )
}

export default App
