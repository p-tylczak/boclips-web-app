import { VideoCard } from '@boclips-ui/video-card';
import { List } from 'antd';
import { Video } from 'boclips-api-client/dist/types';
import React from 'react';
import { useSearchQuery } from 'src/hooks/api/useSearchQuery';
import { useLocationParams } from 'src/hooks/useLocationParams';
import { useHistory } from 'react-router-dom';
import { convertVideoFromApi } from 'src/services/convertVideoFromApi';
import { Player } from 'boclips-player-react';
import Navbar from 'src/components/layout/Navbar';
import { PageLayout } from 'src/components/layout/PageLayout';
import { SearchResultsSummary } from 'src/components/searchResults/SearchResultsSummary';

const SearchResultsView = () => {
  const history = useHistory();
  const query = useLocationParams().get('q');
  const currentPage = Number(useLocationParams().get('page')) || 1;

  const { resolvedData, isError, error, isFetching } = useSearchQuery({
    query,
    page: currentPage - 1,
    pageSize: 10,
  });

  return (
    <PageLayout navBar={<Navbar showSearchBar />}>
      <div className="py-10">
        {isError ? (
          <div>{error}</div>
        ) : (
          <div>
            <SearchResultsSummary
              count={resolvedData?.pageSpec?.totalElements}
              query={query}
            />
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                total: resolvedData?.pageSpec?.totalElements,
                pageSize: 10,
                showSizeChanger: false,
                onChange: (page) => {
                  history.push({
                    search: `?q=${query}&page=${page}`,
                  });
                  // scrollToTop();
                },
                current: currentPage,
              }}
              dataSource={resolvedData?.page}
              renderItem={(video: Video) => (
                <VideoCard
                  key={video.id}
                  videoPlayer={
                    <Player videoUri={video.links.self.getOriginalLink()} />
                  }
                  video={convertVideoFromApi(video)}
                  loading={isFetching}
                  authenticated
                  hideAttachments
                  hideBestFor
                  theme="lti"
                />
              )}
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default SearchResultsView;
