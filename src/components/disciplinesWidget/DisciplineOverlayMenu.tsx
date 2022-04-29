import ArrowRight from 'src/resources/icons/arrow-no-size.svg';
import React from 'react';
import getDisciplineIllustration from 'src/services/getDisciplineIllustration';
import { DisciplineWithSubjectOffering } from 'src/hooks/api/disciplinesQuery';
import { Typography } from '@boclips-ui/typography';
import { SubjectLink } from 'src/components/disciplinesWidget/SubjectLink';
import s from './style.module.less';
import { ExtraSubjects } from './ExtraSubjects';

interface Props {
  onClick: (discipline: DisciplineWithSubjectOffering) => void;
  selectedDiscipline: DisciplineWithSubjectOffering;
}

const DisciplineOverlayMenu = ({ onClick, selectedDiscipline }: Props) => {
  return (
    <div className={s.overlay}>
      <div className={s.overlayHeader}>
        <button
          type="button"
          aria-label="Go back to homepage"
          data-qa="overlay-header-back-button"
          className={s.backArrow}
          onClick={() => onClick(selectedDiscipline)}
        >
          <ArrowRight />
        </button>
        <div>Select subject</div>
      </div>
      <div data-qa="discipline-title" className={s.selectedDiscipline}>
        {getDisciplineIllustration(selectedDiscipline.name)}
        <Typography.Body weight="medium" className="flex items-center w-full">
          {selectedDiscipline?.name}
        </Typography.Body>
      </div>
      <div className={s.subjects}>
        {selectedDiscipline?.subjects?.map((subject) => {
          return (
            <SubjectLink subject={subject} className={s.link}>
              <Typography.Body>{subject.name}</Typography.Body>
              <span>
                <ArrowRight />
              </span>
            </SubjectLink>
          );
        })}
      </div>
      {selectedDiscipline.subjectsWeAlsoOffer &&
        selectedDiscipline.subjectsWeAlsoOffer.length > 0 && (
          <ExtraSubjects
            subjectsWeAlsoOffer={selectedDiscipline.subjectsWeAlsoOffer}
          />
        )}
    </div>
  );
};

export default DisciplineOverlayMenu;
