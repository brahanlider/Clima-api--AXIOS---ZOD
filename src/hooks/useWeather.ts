import axios from "axios";
import { z } from "zod";
import { SearchType } from "../types";
import { useMemo, useState } from "react";

// ZOD
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});

export type Weather = z.infer<typeof Weather>;

const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

export default function useWeather() {
  //
  const [weather, setWeather] = useState<Weather>(initialState);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchWeather = async (search: SearchType) => {
    //
    const appId = import.meta.env.VITE_API_KEY;

    setLoading(true); // spinner =esperando respuesta
    setWeather(initialState); //reniciar PARA arreglar spinner

    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;

      const { data } = await axios(geoUrl); //{data} destructuring => entra

      //Comprobar si existe
      if (!data[0]) {
        setNotFound(true);
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

      // ZOD
      const { data: weatherResult } = await axios<Weather>(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      if (result.success) {
        setWeather(result.data);
      }
      // else {
      //   console.log("respuesta mal formada");
      // }

      // //
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // cierra el sniper => ENCONTRO respuesta
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]); // Compueba si weather.name HAY ALGO para MOSTRAR

  //esta variables se van al PADRE=App.tsx
  return {
    weather,
    loading,
    notFound,
    fetchWeather,
    hasWeatherData,
  };

  //
}
