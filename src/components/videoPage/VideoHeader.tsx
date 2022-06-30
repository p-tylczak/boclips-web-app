import { createPriceDisplayValue } from 'src/services/createPriceDisplayValue';
import { AppcuesEvent } from 'src/types/AppcuesEvent';
import AddToCartButton from 'src/components/addToCartButton/AddToCartButton';
import React from 'react';
import { Video } from 'boclips-api-client/dist/sub-clients/videos/model/Video';
import { getBrowserLocale } from 'src/services/getBrowserLocale';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { AddToPlaylistButton } from 'src/components/addToPlaylistButton/AddToPlaylistButton';
import { Typography } from '@boclips-ui/typography';
import { VideoInfo } from 'src/components/common/videoInfo/VideoInfo';
import AnalyticsFactory from 'src/services/analytics/AnalyticsFactory';
import { CopyVideoLinkButton } from '../videoCard/buttons/CopyVideoLinkButton';
import s from './style.module.less';

interface Props {
  video: Video;
}

export const VideoHeader = ({ video }: Props) => {
  const mixpanel = AnalyticsFactory.mixpanel();
  const trackVideoCopy = () => {
    AnalyticsFactory.appcues().sendEvent(
      AppcuesEvent.COPY_LINK_FROM_VIDEO_PAGE,
    );
    mixpanel.track('video_details_url_copied');
  };
  return (
    <>
      <Typography.H1 size="md" className="text-gray-900 lg:mb-2">
        {video?.title}
      </Typography.H1>
      <VideoInfo video={video} />
      <Typography.H2 size="sm" className="text-gray-900">
        {createPriceDisplayValue(
          video?.price?.amount,
          video?.price?.currency,
          getBrowserLocale(),
        )}
      </Typography.H2>
      <FeatureGate feature="BO_WEB_APP_PRICES">
        <div className="mb-4">
          <Typography.Body size="small" className="text-gray-700">
            This is an agreed price for your organization
          </Typography.Body>
        </div>
      </FeatureGate>

      <div className={s.buttons}>
        <div className={s.iconButtons}>
          <AddToPlaylistButton
            videoId={video.id}
            onClick={() => {
              mixpanel.track('video_details_playlist_add');
            }}
          />

          <CopyVideoLinkButton video={video} onClick={trackVideoCopy} />
        </div>

        <FeatureGate linkName="cart">
          <AddToCartButton
            video={video}
            width="200px"
            onClick={() => {
              AnalyticsFactory.appcues().sendEvent(
                AppcuesEvent.ADD_TO_CART_FROM_VIDEO_PAGE,
              );
              mixpanel.track('video_details_cart_add');
            }}
          />
        </FeatureGate>
      </div>
    </>
  );
};
