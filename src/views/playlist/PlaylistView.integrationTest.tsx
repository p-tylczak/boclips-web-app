import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import {
  CollectionFactory,
  FakeBoclipsClient,
} from 'boclips-api-client/dist/test-support';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { VideoFactory } from 'boclips-api-client/dist/test-support/VideosFactory';
import { PlaybackFactory } from 'boclips-api-client/dist/test-support/PlaybackFactory';
import { Link } from 'boclips-api-client/dist/types';
import { createBrowserHistory } from 'history';
import PlaylistView from 'src/views/playlist/PlaylistView';
import { BookmarkPlaylist } from 'src/services/bookmarkPlaylist';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';

const createVideoWithThumbnail = (id: string, videoTitle: string) => {
  return VideoFactory.sample({
    id,
    title: `${videoTitle} ${id}`,
    playback: PlaybackFactory.sample({
      links: {
        thumbnail: new Link({ href: 'http://thumbnail.jpg' }),
        createPlayerInteractedWithEvent: new Link({ href: 'todo' }),
      },
    }),
  });
};

describe('Playlist view', () => {
  const client = new FakeBoclipsClient();

  const videos = [
    createVideoWithThumbnail('111', 'Video One'),
    createVideoWithThumbnail('222', 'Video Two'),
    createVideoWithThumbnail('333', 'Video Three'),
    createVideoWithThumbnail('444', 'Video Four'),
    createVideoWithThumbnail('555', 'Video Five'),
  ];

  const playlist = CollectionFactory.sample({
    id: '123',
    title: 'Hello there',
    description: 'Very nice description',
    videos,
    owner: 'myuserid',
    mine: true,
  });

  beforeEach(() => {
    client.collections.clear();
    client.carts.clear();
    client.videos.clear();

    videos.forEach((it) => client.videos.insertVideo(it));
    client.collections.setCurrentUser('myuserid');
    client.users.insertCurrentUser(
      UserFactory.sample({
        id: 'myuserid',
        features: { BO_WEB_APP_ENABLE_PLAYLISTS: true },
      }),
    );
    client.collections.addToFake(playlist);
  });

  it("shows Playlist's title and description if user can access", async () => {
    render(
      <MemoryRouter initialEntries={['/playlists/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Hello there')).toBeVisible();
    expect(await screen.findByText('Very nice description')).toBeVisible();
  });

  it('displays video title for all videos in the playlist', async () => {
    render(
      <MemoryRouter initialEntries={['/playlists/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Video One 111')).toBeVisible();
    expect(screen.getByText('Video Two 222')).toBeVisible();
    expect(screen.getByText('Video Three 333')).toBeVisible();
    expect(screen.getByText('Video Four 444')).toBeVisible();
    expect(screen.getByText('Video Five 555')).toBeVisible();
  });

  it('displays thumbnails for all videos in the playlist', async () => {
    render(
      <MemoryRouter initialEntries={['/playlists/123']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(await screen.findByTestId(videos[0].id)).toBeVisible();
    expect(await screen.findByTestId(videos[1].id)).toBeVisible();
    expect(await screen.findByTestId(videos[2].id)).toBeVisible();
    expect(await screen.findByTestId(videos[3].id)).toBeVisible();
    expect(await screen.findByTestId(videos[4].id)).toBeVisible();
  });

  it('navigates to the video page when clicked on video', async () => {
    const history = createBrowserHistory();
    history.push({ pathname: '/playlists/123' });

    render(
      <Router history={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    const tile = await screen.findByText('Video One 111');
    expect(tile).toBeVisible();
    fireEvent.click(tile);

    expect(history.location.pathname).toEqual('/videos/111');
  });

  it('video can be added to cart by clicking the button', async () => {
    client.carts.clear();
    client.collections.clear();
    const video = createVideoWithThumbnail('111', 'Video One');
    client.videos.insertVideo(video);
    client.collections.addToFake({ ...playlist, videos: [video] });

    const history = createBrowserHistory();
    history.push({ pathname: '/playlists/123' });

    render(
      <Router history={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    fireEvent.click(await screen.findByText('Add'));

    await waitFor(async () => {
      expect((await client.carts.getCart()).items[0].videoId).toEqual('111');
    });
  });

  it('video can be removed from cart by clicking the button', async () => {
    client.videos.clear();
    client.videos.insertVideo(createVideoWithThumbnail('111', 'Video One'));
    await client.carts.addItemToCart(await client.carts.getCart(), '111');
    const history = createBrowserHistory();
    history.push({ pathname: '/playlists/123' });

    render(
      <Router history={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    fireEvent.click(await screen.findByText('Remove'));

    await waitFor(async () => {
      expect((await client.carts.getCart()).items).toHaveLength(0);
    });
  });

  it('video can be removed from the playlist', async () => {
    const history = createBrowserHistory();
    history.push({ pathname: '/playlists/123' });

    render(
      <Router history={history}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </Router>,
    );

    await screen.findByText('Video One 111');

    const videoToRemove = screen.getByTestId('grid-card-for-Video One 111');
    const videoToRemoveButton = within(videoToRemove).getByRole('button', {
      name: 'Add to playlist',
    });

    fireEvent.click(videoToRemoveButton);

    const playlistCheckbox = screen.getByRole('checkbox', {
      name: 'Hello there',
    });

    fireEvent.click(playlistCheckbox);

    await waitForElementToBeRemoved(screen.queryByText('Video One 111'));
    const remainingVideos = screen.getAllByLabelText('Add to playlist');
    expect(remainingVideos).toHaveLength(4);
  });

  it(`invokes bookmark command when playlist is opened`, async () => {
    const bookmarkService = new BookmarkPlaylist(client.collections);
    const bookmarkFunction = jest.spyOn(bookmarkService, 'bookmark');

    const history = createBrowserHistory();
    history.push({ pathname: '/playlists/123' });

    render(
      <Router history={history}>
        <Route path="/playlists/:id">
          <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
            <BoclipsClientProvider client={client}>
              <QueryClientProvider client={new QueryClient()}>
                <PlaylistView bookmarkPlaylist={bookmarkService} />
              </QueryClientProvider>
            </BoclipsClientProvider>
          </BoclipsSecurityProvider>
        </Route>
      </Router>,
    );

    await waitFor(() => {
      expect(bookmarkFunction).toHaveBeenCalledWith(playlist);
    });
  });
});
