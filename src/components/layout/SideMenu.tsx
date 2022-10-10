import s from 'src/components/layout/navbar.module.less';
import { FeatureGate } from 'src/components/common/FeatureGate';
import { Link } from 'src/components/common/Link';
import ExternalLinkIcon from 'src/resources/icons/external-link-icon.svg';
import { Typography } from '@boclips-ui/typography';
import React from 'react';
import { User } from 'boclips-api-client/dist/sub-clients/organisations/model/User';

interface Props {
  user: User;
  logOut: () => void;
}

const SideMenu = ({ user, logOut }: Props) => {
  return (
    <div className={s.slideMenu}>
      <div className={s.userInfo}>
        <span>
          {user.firstName} {user.lastName}
        </span>
        <span>{user.email}</span>
      </div>
      <div className={s.buttons}>
        <FeatureGate feature="BO_WEB_APP_OPENSTAX">
          <Link to="/explore/openstax">Explore</Link>
        </FeatureGate>
        <Link to="/library">Your library</Link>
        <Link to="/orders">Your orders</Link>
        <FeatureGate linkName="cart">
          <Link to="/cart">Cart</Link>
        </FeatureGate>
        <a
          target="_blank"
          href="https://www.boclips.com/boclips-platform-guide"
          className={s.platformGuide}
          rel="noreferrer"
        >
          <p>Platform guide</p>
          <span className="pl-1">
            <ExternalLinkIcon />
          </span>
        </a>

        <button type="button" onClick={logOut}>
          <Typography.Link>Log out</Typography.Link>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;