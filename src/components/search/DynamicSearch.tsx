import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Searchbar, Text} from 'react-native-paper';
import {getFocusedRouteNameFromRoute, NavigationProp, useNavigation, useRoute} from '@react-navigation/native';
import styles from './DynamicSearch.style.ts';
import {MovieItem} from '../../types/MovieItem.ts';
import {TvSeriesItem} from '../../types/TvSeriesItem.ts';
import {useSearchMovieTvSeriesQuery} from '../../redux/query/RTKQuery.ts';
import {FooterLoading} from '../loading/Loading.tsx';
import {Constants} from '../../constant/AppConstants.ts';
import {RootStackParam} from "../../types/navigation/NavigationTypes.ts";

export type SearchData = MovieItem & TvSeriesItem;

export interface SearchParams {
  query: string;
  isMovie: boolean;
}
type SearchNavigationProp = NavigationProp<RootStackParam, 'SearchNavigation'>;

const DynamicSearch = ({isVisible}: {isVisible: boolean}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<SearchNavigationProp>();
  const route = useRoute();
  const tabName = getFocusedRouteNameFromRoute(route) || 'movie';
  const isMovie = tabName === 'movie';
  const {data = [], isFetching} = useSearchMovieTvSeriesQuery({
    query: searchQuery,
    isMovie: isMovie,
  });

  const searchItem = ({item}: {item: SearchData}) => {
    return (
      <TouchableOpacity style={styles.itemListContainer} onPress={()=>{
        if (isMovie){
            navigation.navigate('MovieDetail', {movieId: item.id})
        }else {
            navigation.navigate('TvSeriesDetail', {tvSeriesId: item.id})
        }
      }}>
        <ImageBackground
          style={styles.imageView}
          imageStyle={styles.backgroundImage}
          source={{uri: `${Constants.IMAGE_URL}${item.poster_path}`}}>
          <Image
            style={styles.imageView}
            source={{
              uri: `${Constants.IMAGE_URL}${item.poster_path}`,
            }}
          />
        </ImageBackground>
        <View style={styles.titleContainer}>
            <Text style={styles.titleStyle}>{isMovie ? item.title : item.name}</Text>
            <Text>{isMovie ? item.release_date : item.release_date}</Text>
            <Text>Rating: {isMovie ? item.vote_average : item.vote_average}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return isVisible ? (
    <View style={styles.rootView}>
      <Searchbar
        style={styles.searchBarContainer}
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <FlatList
        style={styles.flatListContainer}
        ListHeaderComponent={isFetching ? <FooterLoading /> : null}
        data={data}
        renderItem={searchItem}
      />
    </View>
  ) : null;
};

export default DynamicSearch;