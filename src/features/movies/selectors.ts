import { RootState } from '../../app/store';
import { Movie } from './types';

export const selectMovies = (state: RootState): Movie[] => {
 
  return state.movies.movies;
};
