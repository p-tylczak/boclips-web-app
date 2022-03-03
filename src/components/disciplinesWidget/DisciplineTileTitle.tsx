import React from 'react';
import { Typography } from '@boclips-ui/typography';
import s from './style.module.less';

interface Props {
  title: string;
}

export const DisciplineTileTitle: React.FC<Props> = ({ title }: Props) => {
  return <Typography.H5 className={s.disciplineTitle}>{title}</Typography.H5>;
};
