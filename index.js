import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit", async (req, res) => {
  const cityname = req.body.city;
  let lat;
  let long;
  let city;
  try {
    const response = await axios.get(
      "https://trueway-geocoding.p.rapidapi.com/Geocode",
      {
        params: {
          address: cityname,
          language: "en",
        },
        headers: {
          "X-RapidAPI-Key":
            "08b4a1636amshdd4d4406349f85dp117a81jsn3cde24985df0",
          "X-RapidAPI-Host": "trueway-geocoding.p.rapidapi.com",
        },
      }
    );
    lat = response.data.results[0].location.lat;
    long = response.data.results[0].location.lng;
    city = response.data.results[0].address;
    console.log(lat);
    console.log(long);
  } catch (err) {
    console.log(err);
  }
  try {
    const response = await axios.get(
      `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${long}`,
      {
        headers: {
          "x-access-token": "openuv-1t3lrlv7vj19e-io",
        },
      }
    );
    console.log(response.data.result.uv);
    res.render("index.ejs", { activity: response.data, presentcity: city });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log("Verified");
});
