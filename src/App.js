import './App.css';
import {useState, useEffect} from "react";
import Axios from 'axios'

function App() {

  const [movieName, setMovieName] = useState('');
  const [movieReview, setReview] = useState('');
  const [movieReviewList, setMovieList] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [userId, setUserId] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    console.log(userId)
    Axios.post('https://crud-application89643.herokuapp.com/api/get', {
      userId: userId 
    }).then((response) => {
      // var newMovieList = [];
      // for(var i in response.data)
      //   newMovieList.push({movieName: response.data[]}, json_data [i]]);
      // response.data[0]['movie']['movieName'].forEach(element => console.log(element));
      if(response.data.status === 'fail') {
        alert(response.data.error);
        setMovieList([]);
        setUserName("Invalid User");
        setUserEmail("Invalid Email");
      } else{
        var newlist = []
        const userData = response.data.userData;
        const movieData = response.data.movieData;
        console.log(userData);
        setUserName(userData.name);
        setUserEmail(userData.email);
        for(var i in movieData){
          newlist.push({movieId: movieData[i].movieId, movieName: movieData[i].movieName, movieReview: movieData[i].movieReview});
        }
        setMovieList(newlist)
      }
    });
  }, [userId]);

  const submitReview = () => {
    Axios.post('https://crud-application89643.herokuapp.com/api/insert', {
      userId: userId,
      newName: movieName,
      newReview: movieReview, 
    }).then((response) => {
      if(response.data.status === 'ok') setMovieList([...movieReviewList, {movieName: movieName, movieReview: movieReview}])
      else alert(response.data.error);
    });
    setMovieName('');
    setReview('');
  }

  const deleteReview = (movieName) => {
    console.log(movieName);
    Axios.delete(`https://crud-application89643.herokuapp.com/api/delete`, {
      data: {
        movieName: movieName,
        userId: userId,
      }
    });
    setMovieList(movieReviewList.filter((movie) => {
      return movie.movieName !== movieName;
    }))
  };

  const updateReview = (movieName) => {
    Axios.put("https://crud-application89643.herokuapp.com/api/update", {
      movieName: movieName,
      newReview: newReview,
      userId: userId,
    });
    setMovieList(movieReviewList.map((movie) => {
      return movie.movieName === movieName ? {movieName: movieName, movieReview: newReview} : movie; 
    }))
    setNewReview("");
  }


  return (
    <div className="App">
      <h1>CRUD APPLICATION</h1>
      <div className='form'>
        <label>Id: {userId}</label>
        <div>
          <button onClick={() => setUserId(userId+1)}>+</button>
          <button onClick={() => setUserId(userId-1)}>-</button>
        </div>
        <label>Name: {userName}</label>
        <label>Email: {userEmail}</label>
      </div>
      <div className='form'>
        <label>Movie Name</label>
        <input type="text" name="movieName" value={movieName} onChange={(e) => {
          setMovieName(e.target.value);
        }}></input>
        <label>Movie Review</label>
        <input type="text" name="movieReview" value={movieReview} onChange={(e) => {
          setReview(e.target.value);
        }}></input>
        <button onClick={submitReview}>Submit</button>
        {movieReviewList.map((val) => {
          return( 
            <div className="card" key={val.movieId}>
              <h1>{val.movieName}</h1>
              <p>{val.movieReview}</p>
              <button 
                onClick={() => {
                  deleteReview(val.movieName);
                }}>Delete
              </button>
              <input type="text" id="updateInput" onChange={(e) => {
                setNewReview(e.target.value);
              }}/>
              <button onClick={() => {
                updateReview(val.movieName);
                }}>Update
              </button>
             </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
