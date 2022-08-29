import React from 'react';
import PageHeader from 'src/components/pageTitle/PageHeader';
import Button from '@boclips-ui/button';
import OpenBookIcon from 'src/resources/icons/open-book.svg';
import { useMediaBreakPoint } from '@boclips-ui/use-media-breakpoints';
import { useOpenstaxMobileMenu } from 'src/components/common/providers/OpenstaxMobileMenuProvider';
import { TextButton } from 'src/components/common/textButton/TextButton';
import BackArrow from 'src/resources/icons/back-arrow.svg';
import { useHistory } from 'react-router-dom';
import s from './style.module.less';

interface Props {
  bookTitle: string;
}

export const Header = ({ bookTitle }: Props) => {
  const breakpoint = useMediaBreakPoint();
  const isNotDesktop = breakpoint.type !== 'desktop';
  const { setIsOpen } = useOpenstaxMobileMenu();
  const history = useHistory();

  const goToExplorePage = () => {
    history.push('/explore/openstax');
  };

  return (
    <div className={s.bookHeader}>
      {isNotDesktop && (
        <TextButton
          onClick={goToExplorePage}
          text="Back"
          icon={<BackArrow />}
        />
      )}
      <PageHeader
        title={bookTitle}
        button={
          isNotDesktop && (
            <Button
              icon={<OpenBookIcon />}
              text="Course content"
              type="outline"
              onClick={() => setIsOpen(true)}
              width="190px"
              height="48px"
            />
          )
        }
      />
    </div>
  );
};