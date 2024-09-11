import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, BoxButton, Text } from '@/components';
import { Panel } from '@/components/Panel';

import { useDocStore } from '../../doc-editor';
import { Doc } from '../../doc-management';
import { useDocSummaryStore } from '../stores';

import { Heading } from './Heading';

type Block = {
  id: string;
  type: string;
  text: string;
  content: Block[];
  props: {
    level: number;
  };
};

// function isBlock(block: Block): block is Block {
//   return (
//     block.content &&
//     isArray(block.content) &&
//     block.content.length > 0 &&
//     typeof block.type !== 'undefined'
//   );
// }

// const recursiveContent = (content: Block[], base: string = '') => {
//   let fullContent = base;
//   for (const innerContent of content) {
//     if (innerContent.type === 'text') {
//       fullContent += innerContent.text;
//     } else if (isBlock(innerContent)) {
//       fullContent = recursiveContent(innerContent.content, fullContent);
//     }
//   }

//   return fullContent;
// };

interface SummaryProps {
  doc: Doc;
}

export const Summary = ({ doc }: SummaryProps) => {
  const { docsStore } = useDocStore();
  const { t } = useTranslation();

  const editor = docsStore?.[doc.id]?.editor;
  const headingFiltering = useCallback(
    () =>
      editor?.document.filter(
        (block) => block.type === 'heading',
      ) as unknown as Block[],
    [editor?.document],
  );

  const [headings, setHeadings] = useState<Block[] | undefined>(
    headingFiltering(),
  );
  const { setIsPanelSummaryOpen, isPanelSummaryOpen } = useDocSummaryStore();
  const [hasBeenClose, setHasBeenClose] = useState(false);
  const setClosePanel = () => {
    setHasBeenClose(true);
    setIsPanelSummaryOpen(false);
  };

  console.log('headings', headings);

  // Open the panel if there are more than 1 heading
  useEffect(() => {
    if (headings?.length && headings.length > 1 && !hasBeenClose) {
      setIsPanelSummaryOpen(true);
    }
  }, [setIsPanelSummaryOpen, headings, hasBeenClose]);

  // Close the panel unmount
  useEffect(() => {
    return () => {
      setIsPanelSummaryOpen(false);
    };
  }, [setIsPanelSummaryOpen]);

  if (!editor) {
    return null;
  }

  // Update the headings when the editor content changes
  editor?.onEditorContentChange(() => {
    setHeadings(headingFiltering());
  });

  if (!isPanelSummaryOpen) {
    return null;
  }

  return (
    <Panel setIsPanelOpen={setClosePanel}>
      <Box $overflow="auto" $padding="small">
        {headings?.map((heading) => {
          const content = heading.content?.[0];
          const text = content?.type === 'text' ? content.text : '';

          return (
            <Heading
              editor={editor}
              headingId={heading.id}
              level={heading.props.level}
              text={text}
              key={heading.id}
            />
          );
        })}
        <Box
          $height="1px"
          $width="auto"
          $background="#e5e5e5"
          $margin={{ vertical: 'small' }}
          $css="flex: none;"
        />
        <BoxButton
          onClick={() => {
            editor.focus();
            document.querySelector(`.bn-editor`)?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
        >
          <Text $theme="primary" $padding={{ vertical: 'xtiny' }}>
            {t('Back to top')}
          </Text>
        </BoxButton>
        <BoxButton
          onClick={() => {
            editor.focus();
            document
              .querySelector(
                `.bn-editor > .bn-block-group > .bn-block-outer:last-child`,
              )
              ?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
          }}
        >
          <Text $theme="primary" $padding={{ vertical: 'xtiny' }}>
            {t('Go to bottom')}
          </Text>
        </BoxButton>
      </Box>
    </Panel>
  );
};
