import React, { useEffect, useState } from 'react';
import {
  FooterLoading,
  Loading,
} from '../../../components/loading/Loading.tsx';
import MovieItemComponent from '../../../components/movie-item/MovieItemComponent.tsx';
import styles from './UpComingMovie.style.ts';
import { View } from 'react-native';
import { useUpcomingMovieQuery } from '../../../redux/query/RTKQuery.ts';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MovieItem } from '../../../types/MovieItem.ts';
import { RootStackParam } from '../../../types/navigation/NavigationTypes.ts';

type UpComingMovieNavigationProp = NavigationProp<
  RootStackParam,
  'MovieDetail'
>;

const UpComingMovie = () => {
  const navigation = useNavigation<UpComingMovieNavigationProp>();
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Array<MovieItem>>([]);
  const {
    data = [],
    error,
    isFetching,
    isSuccess,
  } = useUpcomingMovieQuery(page);

  useEffect(() => {
    if (data.length) {
      setMovies((prevMovies) => (page === 1 ? data : [...prevMovies, ...data]));
    }
  }, [isSuccess]);

  const loadMoreMovies = () => {
    if (!isFetching && !error) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (isFetching) return <Loading />;
  return (
    <View style={styles.mainView}>
      <MovieItemComponent
        movies={movies}
        onPress={(item) =>
          navigation.navigate('MovieDetail', { movieId: item.id })
        }
        loadMoreData={loadMoreMovies}
        ListFooterComponent={isFetching && page > 1 ? <FooterLoading /> : null}
      />
    </View>
  );
};
export default UpComingMovie;
