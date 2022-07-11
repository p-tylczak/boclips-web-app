import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BoclipsClient } from 'boclips-api-client';
import {
  CreateCollectionRequest,
  UpdateCollectionRequest,
} from 'boclips-api-client/dist/sub-clients/collections/model/CollectionRequest';
import Pageable from 'boclips-api-client/dist/sub-clients/common/model/Pageable';
import { Collection } from 'boclips-api-client/dist/sub-clients/collections/model/Collection';
import { displayNotification } from 'src/components/common/notification/displayNotification';
import { CollectionsClient } from 'boclips-api-client/dist/sub-clients/collections/client/CollectionsClient';
import { ListViewCollection } from 'boclips-api-client/dist/sub-clients/collections/model/ListViewCollection';

interface UpdatePlaylistProps {
  playlist: Collection | ListViewCollection;
  videoId: string;
}

interface PlaylistMutationCallbacks {
  onSuccess: (playlistId: string) => void;
  onError: (playlistId: string) => void;
}

export const useOwnAndSharedPlaylistsQuery = () => {
  const client = useBoclipsClient();
  return useQuery('ownAndSharedPlaylists', () =>
    doGetOwnAndSharedPlaylists(client),
  );
};

export const useOwnPlaylistsQuery = () => {
  const client = useBoclipsClient();
  return useQuery('ownPlaylists', () => doGetOwnPlaylists(client));
};

export const usePlaylistQuery = (id: string) => {
  const queryClient = useQueryClient();
  const client = useBoclipsClient();

  const cachedPlaylists =
    queryClient.getQueryData<Pageable<Collection>>('playlists');
  return useQuery(
    ['playlist', id],
    () => client.collections.get(id, 'details'),
    {
      initialData: () => cachedPlaylists?.page?.find((c) => c.id === id),
    },
  );
};

export const doAddToPlaylist = (
  playlist: Collection | ListViewCollection,
  videoId: string,
  client: BoclipsClient,
) => {
  return client.collections.addVideoToCollection(playlist, videoId);
};

export const doRemoveFromPlaylist = (
  playlist: Collection | ListViewCollection,
  videoId: string,
  client: BoclipsClient,
) => {
  return client.collections.removeVideoFromCollection(playlist, videoId);
};

export const doFollowPlaylist = (
  playlist: Collection,
  collectionsClient: CollectionsClient,
) => {
  return collectionsClient.bookmark(playlist);
};

export const useAddToPlaylistMutation = (
  callbacks: PlaylistMutationCallbacks,
) => {
  const client = useBoclipsClient();
  return useMutation(
    async ({ playlist, videoId }: UpdatePlaylistProps) =>
      doAddToPlaylist(playlist, videoId, client),
    {
      onSuccess: (_, { playlist, videoId }) => {
        displayNotification(
          'success',
          `Video added to "${playlist.title}"`,
          '',
          `add-video-${videoId}-to-playlist`,
        );
        callbacks.onSuccess(playlist.id);
      },
      onError: (_, { playlist, videoId }: UpdatePlaylistProps) => {
        displayNotification(
          'error',
          `Error: Failed to add video to ${playlist.title}`,
          'Please refresh the page and try again',
          `add-video-${videoId}-to-playlist`,
        );
        callbacks.onError(playlist.id);
      },
    },
  );
};

export const useRemoveFromPlaylistMutation = (
  callbacks: PlaylistMutationCallbacks,
) => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ playlist, videoId }: UpdatePlaylistProps) =>
      doRemoveFromPlaylist(playlist, videoId, client),
    {
      onSuccess: (_, { playlist, videoId }) => {
        displayNotification(
          'success',
          `Video removed from "${playlist.title}"`,
          '',
          `add-video-${videoId}-to-playlist`,
        );
        callbacks.onSuccess(playlist.id);
      },
      onError: (_, { playlist, videoId }: UpdatePlaylistProps) => {
        displayNotification(
          'error',
          `Error: Failed remove video from ${playlist.title}`,
          'Please refresh the page and try again',
          `add-video-${videoId}-to-playlist`,
        );
        callbacks.onError(playlist.id);
      },
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(['playlist', variables.playlist.id]);
      },
    },
  );
};

const doGetOwnPlaylists = (client: BoclipsClient) =>
  client.collections
    .getMyCollectionsWithoutDetails({ origin: 'BO_WEB_APP' })
    .then((playlists) => playlists.page);

const doGetOwnAndSharedPlaylists = (client: BoclipsClient) =>
  client.collections
    .getMySavedCollectionsWithoutDetails({ origin: 'BO_WEB_APP' })
    .then((playlists) => playlists.page);

export const usePlaylistMutation = () => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    (request: CreateCollectionRequest) => client.collections.create(request),
    {
      onSettled: () => {
        queryClient.invalidateQueries('ownPlaylists');
      },
    },
  );
};

export const useEditPlaylistMutation = (playlist: Collection) => {
  const client = useBoclipsClient();
  const queryClient = useQueryClient();

  return useMutation(
    (request: UpdateCollectionRequest) =>
      client.collections.update(playlist.id, request),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['playlist', playlist.id]);
      },
    },
  );
};
