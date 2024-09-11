import { BlockNoteEditor } from '@blocknote/core';
import { useEffect, useState } from 'react';

import { BoxButton, Text } from '@/components';
import { useCunninghamTheme } from '@/cunningham';

// if(id out of the viewport)
//   highlight
// Highlight only the one before the yes
// If you see totally the block of the last one highlight the last

const sizeMap: { [key: number]: string } = {
  1: 'm',
  2: 's',
  3: 't',
};

interface HeadingProps {
  editor: BlockNoteEditor;
  level: number;
  text: string;
  headingId: string;
}

export const Heading = ({ headingId, editor, level, text }: HeadingProps) => {
  const [isHover, setIsHover] = useState(false);
  const { colorsTokens } = useCunninghamTheme();
  const [isVisible, setIsVisible] = useState(false);

  console.log('ge', headingId);

  useEffect(() => {
    const handleScroll = () => {
      const elHeading = document.querySelector(
        `.bn-block-outer[data-id=${headingId}]`,
      );
      if (!elHeading) {
        return;
      }
      const rect = elHeading.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      setIsHover(isVisible);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check on component mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headingId]);

  // Check if the id of the element is in the viewport
  useEffect(() => {}, [headingId]);

  // const isActive =
  //   pathname === href ||
  //   alias?.includes(pathname) ||
  //   pathname.startsWith(`${href}/`) ||
  //   alias?.some((a) => pathname.startsWith(`${a}/`));

  const { color, background, colorTooltip, backgroundTooltip } = isHover
    ? {
        color: colorsTokens()['primary-600'],
        background: colorsTokens()['primary-300'],
        backgroundTooltip: 'white',
        colorTooltip: 'black',
      }
    : {
        color: '#ffffff55',
        background: undefined,
        backgroundTooltip: '#161616',
        colorTooltip: 'white',
      };

  return (
    <BoxButton
      key={headingId}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => {
        editor.focus();
        editor.setTextCursorPosition(headingId, 'end');
        document.querySelector(`[data-id="${headingId}"]`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }}
      style={{ textAlign: 'left' }}
    >
      <Text
        $theme="primary"
        $padding={{ vertical: 'xtiny', left: 'tiny' }}
        $size={sizeMap[level]}
        $hasTransition
        $css={
          isHover
            ? `box-shadow: -2px 0px 0px ${colorsTokens()['primary-500']};`
            : ''
        }
      >
        {text}
      </Text>
    </BoxButton>
  );
};
