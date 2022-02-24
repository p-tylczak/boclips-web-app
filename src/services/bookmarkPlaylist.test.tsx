import { BookmarkPlaylist } from 'src/services/bookmarkPlaylist';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { CollectionFactory } from 'src/testSupport/CollectionFactory';
import { Link } from 'boclips-api-client/dist/sub-clients/common/model/LinkEntity';

describe('bookmark playlist', () => {
  it(`bookmarks unbookmarked collection`, async () => {
    const collectionsClient = new FakeBoclipsClient().collections;
    const bookmarkPlaylist = new BookmarkPlaylist(collectionsClient);

    const unbookmarkedCollection = CollectionFactory.sample({
      id: '123',
      mine: false,
      links: CollectionFactory.sampleLinks({
        bookmark: new Link({
          href: 'https://api.boclips.com/v1/collections/1?bookmarked=true',
        }),
        unbookmark: undefined,
      }),
    });
    collectionsClient.addToFake(unbookmarkedCollection);

    await bookmarkPlaylist.bookmark(unbookmarkedCollection);

    const expected = await collectionsClient.get('123');
    expect(expected.links.bookmark).not.toBeDefined();
    expect(expected.links.unbookmark).toBeDefined();
  });

  it('can gracefully handle an already bookmarked collection', async () => {
    const collectionsClient = new FakeBoclipsClient().collections;
    const bookmarkPlaylist = new BookmarkPlaylist(collectionsClient);

    const bookmarkFn = spyOn(collectionsClient, 'bookmark');

    const bookmarkedCollection = CollectionFactory.sample({
      id: '123',
      mine: false,
      links: CollectionFactory.sampleLinks({
        bookmark: undefined,
        unbookmark: new Link({
          href: 'https://api.boclips.com/v1/collections/1?bookmarked=false',
        }),
      }),
    });
    collectionsClient.addToFake(bookmarkedCollection);

    await bookmarkPlaylist.bookmark(bookmarkedCollection);

    const expected = await collectionsClient.get('123');
    expect(expected.links.bookmark).not.toBeDefined();
    expect(expected.links.unbookmark).toBeDefined();
    expect(bookmarkFn).not.toHaveBeenCalled();
  });

  it(`should not bookmark owned collection`, async () => {
    const collectionsClient = new FakeBoclipsClient().collections;
    const bookmarkPlaylist = new BookmarkPlaylist(collectionsClient);

    const bookmarkFn = spyOn(collectionsClient, 'bookmark');

    const ownedCollection = CollectionFactory.sample({
      id: '123',
      mine: true,
      links: CollectionFactory.sampleLinks({
        bookmark: new Link({
          href: 'https://api.boclips.com/v1/collections/1?bookmarked=true',
        }),
      }),
    });
    collectionsClient.addToFake(ownedCollection);

    await bookmarkPlaylist.bookmark(ownedCollection);

    const expected = await collectionsClient.get('123');
    expect(expected.links.bookmark).toBeDefined();
    expect(expected.links.unbookmark).not.toBeDefined();
    expect(bookmarkFn).not.toHaveBeenCalled();
  });
});
