import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import "./Row.css";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en=US`
      // console.log(request.data.results);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  //   console.log(movies);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  function fetchVideoLink(videoId) {
    const url = `https://api.themoviedb.org/3/movie/${videoId}/videos?api_key=8789b2e1805f257e5339cb972533b290`;
    axios
      .get(url)
      .then((res) => {
        if (res.data.results.length !== 0)
          console.log(res.data.results[0]?.key);
        setTrailerUrl(res.data.results[0]?.key);
      })
      .then((movieKey) => movieKey);
  }

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      fetchVideoLink(movie.id);
    }
  };

  //   const handleClick = (movie) => {
  //     if (trailerUrl) {
  //       setTrailerUrl("");
  //     } else {
  //       movieTrailer(movie?.name || "")
  //         .then((url) => {
  //           const urlParams = new URLSearchParams(new URL(url).search);
  //           setTrailerUrl(urlParams.get("v"));
  //         })
  //         .catch((error) => console.log(error));
  //     }
  //   };

  return (
    <div className="row">
      <h2> {title} </h2>

      <div className="row__posters">
        {/* several poster will be there */}

        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row__poster ${isLargeRow && "row__posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt=""
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
