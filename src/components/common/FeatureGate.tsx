import React from 'react';
import { UserFeatureKey } from 'boclips-api-client/dist/sub-clients/organisations/model/User';
import useFeatureFlags from 'src/hooks/useFeatureFlags';
import { useBoclipsClient } from 'src/components/common/providers/BoclipsClientProvider';
import { AdminLinks } from 'boclips-api-client/dist/types';

interface FeatureGateProps {
  children: React.ReactElement | React.ReactElement[];
  fallback?: React.ReactElement;
}

type OptionalProps =
  | { linkName: keyof AdminLinks; feature?: never }
  | { feature: UserFeatureKey; linkName?: never };

export const FeatureGate = ({
  feature,
  children,
  linkName,
  fallback,
}: FeatureGateProps & OptionalProps) => {
  const links = useBoclipsClient().links;
  const flags = useFeatureFlags();
  if (linkName) {
    return <>{(links[linkName] && children) || fallback}</>;
  }
  if (feature) {
    return <>{(flags && flags[feature] && children) || fallback}</>;
  }
  return <>{children}</>;
};
