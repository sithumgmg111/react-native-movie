import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {getMovieList} from '../../redux/actions';
import Loading from '../../components/loading/Loading';
import MovieList from '../../components/movielist/MovieList';


const Home = ({navigation}) => {
    //communicate with redux
    const movieListState = useSelector(state => state.movieListReducer);
    const isLoading = useSelector(state => state.movieListReducer.isLoading);
    const dispatch = useDispatch();

    // Api call
    useEffect(() => {
        dispatch(getMovieList({}))
    }, [])

    // main view with loading while api call is going one
    return isLoading ? <Loading/> : <MovieList movies={movieListState.movieList}/>;
}
export default Home