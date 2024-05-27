import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import cloudIcon from "../assets/cloud.png";
import fogIcon from "../assets/fog.png";
import hazeIcon from "../assets/haze.png";
import rainIcon from "../assets/rain.png";
import sunIcon from "../assets/sun.png";

const Weather = () => {
  const [cityName, setCityName] = useState("");
  const [searchWDAta, setSearchWData] = useState(false);
  const [displayWeather, setDisplayWeather] = useState("none");
  const [WData, setWData] = useState(null);
  const [WDate, setWdate] = useState();
  const [wIcon, setWIcon] = useState();
  const [foreCastData, setForeCastData] = useState([]);

  const handleSearch = (e) => {
    setCityName(e.target.value);
  };

  const handleSubmit = () => {
    if (cityName !== "") {
      setSearchWData(true);
      setDisplayWeather("block");
    }
  };

  // Calling Weather API function
  useEffect(() => {
    if (searchWDAta === true) {
      getWeatherData();
      getForeCastData();
    }
    setSearchWData(false);
  }, [searchWDAta]);

  // Applying different weather conditions icon
  useEffect(() => {
    if (WData) {
      let Wcondition = WData.weather[0].main.toLowerCase();

      if (Wcondition === "clouds") {
        setWIcon(cloudIcon);
      } else if (Wcondition === "clear") {
        setWIcon(sunIcon);
      } else if (Wcondition === "rain") {
        setWIcon(rainIcon);
      } else if (Wcondition === "haze") {
        setWIcon(hazeIcon);
      } else if (Wcondition === "fog") {
        setWIcon(fogIcon);
      }
    }

    const date = new Date();

    const option = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    setWdate(date.toLocaleDateString("en-Us", option));
  }, [WData]);

  // Fetching Weather Api
  const getWeatherData = async () => {
    try {
      let res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${
          import.meta.env.VITE_API_KEY
        }`
      );
      setWData(res.data);
      setCityName("");
    } catch (err) {
      console.log("weather data is not fetched", err);
      alert("City not Found");
    }
  };

  //FEtching FoerCast Api
  const getForeCastData = async () => {
    try {
      let res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${
          import.meta.env.VITE_API_KEY
        }`
      );
      setForeCastData(res.data.list.filter((item, index) => index % 8 === 0));
      console.log(res.data.list.filter((item, index) => index % 8 === 0));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="min-h-[100vh] bg-gray-700">
        {/* Heading */}
        <h2 className="text-center text-4xl p-4 text-white">Weather App</h2>

        {/* Search bar */}
        <div className="w-3/4 mx-auto flex gap-3">
          <input
            type="search"
            className=" w-full px-6 py-1 text-lg rounded-full font-medium italic"
            placeholder="Search City..."
            title="Enter City Name"
            value={cityName}
            onChange={(e) => handleSearch(e)}
          />
          <button
            className="p-4 bg-gray-500 rounded-full"
            title="Search"
            onClick={handleSubmit}
          >
            <IoSearch size={25} />
          </button>
        </div>

        <div style={{ display: `${displayWeather}` }}>
          {/* Weather chart */}

          {WData && (
            <div className="flex mt-6 justify-center">
              <div className="flex flex-col bg-white rounded-xl p-4 w-full max-w-xs">
                <div className="font-bold text-xl">{WData.name}</div>
                <div className="text-sm ">{WDate}</div>
                <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-24">
                  <img src={wIcon} />
                </div>
                <div className="flex flex-row items-center justify-center mt-6">
                  <div className="font-medium text-6xl">
                    {(WData.main.temp - 273.15).toFixed(1)}°C
                  </div>
                  <div className="flex flex-col items-center ml-6">
                    <div>{WData.weather[0].main}</div>
                    <div className="mt-1">
                      <span className="text-sm">
                        <i className="far fa-long-arrow-up" />
                      </span>
                      <span className="text-sm font-light text-gray-500">
                        {(WData.main.temp_max - 273.15).toFixed(1)}°C
                      </span>
                    </div>
                    <div>
                      <span className="text-sm">
                        <i className="far fa-long-arrow-down" />
                      </span>
                      <span className="text-sm font-light text-gray-500">
                        {(WData.main.temp_min - 273.15).toFixed(1)}°C
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between mt-6">
                  <div className="flex flex-col items-center">
                    <div className="font-medium text-sm">Wind</div>
                    <div className="text-sm text-gray-500">
                      {WData.wind.speed}Km/h
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-medium text-sm">Humidity</div>
                    <div className="text-sm text-gray-500">
                      {WData.main.humidity}%
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="font-medium text-sm">Pressure</div>
                    <div className="text-sm text-gray-500">
                      {WData.main.pressure}hPa
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Forecast section */}
          <div className="text-center flex flex-col gap-5 mt-5 mx-auto w-3/4 rounded-xl">
            <h2 className="font-medium italic text-3xl text-white text-left">
              Forecast
            </h2>
            <div className="flex flex-wrap gap-5 mb-5 ml-5 justify-center">
              {foreCastData &&
                foreCastData.map((data, index) => {
                  let foreCastIcon;
                  let FCondition = data.weather[0].main.toLowerCase();
                  if (FCondition === "clouds") {
                    foreCastIcon = cloudIcon;
                  }
                  if (FCondition === "clear") {
                    foreCastIcon = sunIcon;
                  }
                  if (FCondition === "rain") {
                    foreCastIcon = rainIcon;
                  }
                  if (FCondition === "haze") {
                    foreCastIcon = hazeIcon;
                  }
                  const date = new Date(data.dt_txt);
                  const ForecastDate = date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  return (
                    <div
                      className="bg-blue-900 rounded text-white p-2 text-xl gap-3 flex flex-col items-center"
                      key={index}
                    >
                      <p>{ForecastDate}</p>
                      <img className="h-[40px]" src={foreCastIcon} />
                      <p>{(data.main.temp - 273.15).toFixed(1)}°C</p>
                      <p>{data.pop * 100}%</p>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default Weather;
