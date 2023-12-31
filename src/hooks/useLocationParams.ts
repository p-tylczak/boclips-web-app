import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FilterKey } from '../types/search/FilterKey';

export const useLocationParams = () => {
  const location = useLocation();
  return new URLSearchParams(location.search);
};

export type SearchFilters = { [key in FilterKey]: string[] };

export interface SearchQueryLocationParams {
  pathName?: string;
  query: string;
  page: number;
  content_package?: string;
  filters: SearchFilters;
}

export const useSearchQueryLocationParams = (): [
  SearchQueryLocationParams,
  (search: SearchQueryLocationParams) => void,
] => {
  const locationParams = useLocationParams();
  const searchQueryLocationParams: SearchQueryLocationParams = {
    query: locationParams.get('q') || '',
    page: Number(locationParams.get('page')) || 1,
    content_package: locationParams.get('content_package'),
    filters: {
      video_type: locationParams.getAll('video_type'),
      best_for: locationParams.getAll('best_for'),
      subject: locationParams.getAll('subject'),
      channel: locationParams.getAll('channel'),
      education_level: locationParams.getAll('education_level'),
      duration: locationParams.getAll('duration'),
      release_date_from: locationParams.getAll('release_date_from'),
      release_date_to: locationParams.getAll('release_date_to'),
      topics: locationParams.getAll('topics'),
      language: locationParams.getAll('language'),
      cefr_level: locationParams.getAll('cefr_level'),
      subtype: locationParams.getAll('subtype'),
    },
  };

  const navigate = useNavigate();

  const setSearchQueryLocationParams = useCallback(
    (search: SearchQueryLocationParams) => {
      const params = convertToURLSearchParams(search);

      navigate({
        pathname: search.pathName,
        search: `?${params.toString()}`,
      });
    },
    [navigate],
  );

  return [searchQueryLocationParams, setSearchQueryLocationParams];
};

export const convertToURLSearchParams = (
  search: SearchQueryLocationParams,
): URLSearchParams => {
  const params = new URLSearchParams();
  params.append('q', search.query);
  params.append('page', `${search.page}`);

  if (search?.content_package) {
    params.append('content_package', `${search.content_package}`);
  }

  Object.entries(search.filters).forEach(([key, values]) =>
    // We need to loop through filters as you can't append an array for URLSearchParams
    values.forEach((value) => params.append(key, value)),
  );
  return params;
};

export const useGetIdFromLocation = (path: string) => {
  const location = useLocation();
  return location.pathname.split(`/${path}/`)[1];
};
