require("dotenv").config();
const axios = require("axios");

const fetchLocation = async (ip) => {
  const apiKey = process.env.IP_INFO_API_KEY;
  const url = `https://ipinfo.io/${ip}?token=${apiKey}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error while fetching location:", error);
    throw new Error("Location fetch failed");
  }
};

const fetchWeather = async (latitude, longitude) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw new Error("Weather fetch failed");
  }
};

const handleRequest = async (req, res) => {
  try {
    let { visitor_name: name } = req.query;

    if (!name || name == undefined) {
      throw new Error("Visitor name is undefined");
    }

    name = name.replace(/^['"](.*)['"]$/, "$1");

    const ipAddresses =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // const ipAddr = ipAddresses.split(",").map((ip) => ip.trim());
    // const ip = ipAddr[0];
    const ip = `197.210.78.88`;
    console.log(ip);

    const location = await fetchLocation(ip);
    console.log(location);
    if (!location || !location.loc) {
      throw new Error("Unable to fetch location data");
    }

    const [latitude, longitude] = location.loc.split(",");

    const weatherInfo = await fetchWeather(latitude, longitude);
    if (!weatherInfo || !weatherInfo.main || !weatherInfo.main.temp) {
      throw new Error("Unable to fetch weather data");
    }

    const response = {
      client_ip: ip,
      location: location.city,
      greeting: `Hello, ${visitor_name}!, the temperature is ${weather.main.temp} degrees Celcius in ${location.city}`,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
};

module.exports = { handleRequest };
