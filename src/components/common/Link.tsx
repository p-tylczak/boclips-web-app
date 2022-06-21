import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography } from '@boclips-ui/typography';

type TypographyLinkProps = React.ComponentProps<typeof Typography.Link>;

type IsExternalLink = {
  isExternalLink?: boolean;
};

type Props = React.ComponentProps<RouterLink> &
  Pick<TypographyLinkProps, 'type'> &
  IsExternalLink;

export const Link = ({
  children,
  type,
  className,
  to,
  isExternalLink,
  ...rest
}: React.PropsWithChildren<Props>): React.ReactElement => {
  return (
    <RouterLink
      to={to}
      onClick={(e) => {
        if (isExternalLink) {
          window.location.href = to;
          e.preventDefault();
        }
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      <Typography.Link className={className} type={type}>
        {children}
      </Typography.Link>
    </RouterLink>
  );
};
