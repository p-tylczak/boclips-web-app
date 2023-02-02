import {
  Book,
  Chapter,
  Section,
} from 'boclips-api-client/dist/sub-clients/openstax/model/Books';
import {
  OpenstaxBook,
  OpenstaxChapter,
  OpenstaxChapterIntro,
  OpenstaxSection,
} from 'src/types/OpenstaxBook';

const CHAPTER_OVERVIEW = 'Chapter Overview';
const DISCUSSION_PROMPT = 'Discussion Prompt';

export const convertApiBookToOpenstaxBook = (apiBook: Book): OpenstaxBook => {
  const openstaxBook = {
    id: apiBook.id,
    videoCount: 0,
    subject: apiBook.subject,
    title: apiBook.title,
    chapters: apiBook.chapters
      .map((chapter, index) =>
        convertApiChapterToOpenstaxChapter(chapter, index),
      )
      .sort((a, b) => a.number - b.number),
    logoUrl: apiBook.logoUrl,
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
  sectionIndex: number,
): OpenstaxSection => {
  return {
    displayLabel: apiSection.title.startsWith(
      `${chapterNumber}.${apiSection.number} `,
    )
      ? apiSection.title
      : `${chapterNumber}.${apiSection.number} ${apiSection.title}`,
    number: apiSection.number,
    title: apiSection.title,
    videoCount: apiSection.videoIds.length,
    videoIds: apiSection.videoIds,
    videos: apiSection.videos,
    index: sectionIndex,
  };
};

export const convertApiChapterToOpenstaxChapter = (
  apiChapter: Chapter,
  index: number,
): OpenstaxChapter => {
  let videoCount = 0;
  apiChapter.sections.forEach((section) => {
    videoCount += section.videoIds?.length || 0;
  });

  return {
    displayLabel: apiChapter.title.startsWith(`Chapter ${apiChapter.number}: `)
      ? apiChapter.title
      : `Chapter ${apiChapter.number}: ${apiChapter.title}`,
    number: apiChapter.number,
    index,
    chapterOverview: getChapterOverview(apiChapter),
    discussionPrompt: getDiscussionPrompt(apiChapter),
    sections: getNumberedSections(apiChapter)
      .map((section, sectionIndex) =>
        convertApiBookSectionToOpenstaxSection(
          apiChapter.number,
          section,
          sectionIndex,
        ),
      )
      .sort((a, b) => a.number - b.number),
    title: apiChapter.title,
    videoCount,
  };
};

function getNumberedSections(apiChapter: Chapter) {
  const chapterIntros = [CHAPTER_OVERVIEW, DISCUSSION_PROMPT];
  return apiChapter.sections.filter(
    (section) => !chapterIntros.includes(section.title),
  );
}

const getChapterOverview = (apiChapter: Chapter) =>
  getChapterIntro(apiChapter, CHAPTER_OVERVIEW);

const getDiscussionPrompt = (apiChapter: Chapter) =>
  getChapterIntro(apiChapter, DISCUSSION_PROMPT);

function getChapterIntro(apiChapter: Chapter, title: string) {
  let chapterIntro: OpenstaxChapterIntro;
  const section = apiChapter.sections.find((it) => it.title === title);
  if (section !== undefined) {
    chapterIntro = {
      displayLabel: title,
      videos: section.videos,
    };
  }
  return chapterIntro;
}
