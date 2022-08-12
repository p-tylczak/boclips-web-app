import {
  Book,
  Chapter,
  Section,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import {
  OpenstaxBook,
  OpenstaxChapter,
  OpenstaxSection,
} from 'src/types/OpenstaxBook';

export const convertApiBookToOpenstaxBook = (apiBook: Book): OpenstaxBook => {
  const openstaxBook = {
    id: apiBook.id,
    videoCount: 0,
    subject: apiBook.subject,
    title: apiBook.title,
    chapters: apiBook.chapters
      .map(convertApiChapterToOpenstaxChapter)
      .sort((a, b) => a.number - b.number),
  };

  let videoCount = 0;
  openstaxBook.chapters.forEach((chapter) => {
    videoCount += chapter.videoCount;
  });

  return {
    ...openstaxBook,
    videoCount,
  };
};

export const convertApiBookSectionToOpenstaxSection = (
  chapterNumber: number,
  apiSection: Section,
): OpenstaxSection => {
  return {
    displayLabel: `${chapterNumber}.${apiSection.number} ${apiSection.title}`,
    number: apiSection.number,
    title: apiSection.title,
    videoCount: apiSection.videoIds.length,
    videoIds: apiSection.videoIds,
    videos: apiSection.videos,
  };
};

export const convertApiChapterToOpenstaxChapter = (
  apiChapter: Chapter,
): OpenstaxChapter => {
  const videoCountInChapter = apiChapter.videoIds?.length || 0;
  let videoCountInSections = 0;
  apiChapter.sections.forEach((section) => {
    videoCountInSections += section.videoIds?.length || 0;
  });

  return {
    displayLabel: `Chapter ${apiChapter.number}: ${apiChapter.title}`,
    number: apiChapter.number,
    sections: apiChapter.sections
      .map((section) =>
        convertApiBookSectionToOpenstaxSection(apiChapter.number, section),
      )
      .sort((a, b) => a.number - b.number),
    title: apiChapter.title,
    videoCount: videoCountInChapter + videoCountInSections,
    videoIds: apiChapter.videoIds,
    videos: apiChapter.videos,
  };
};