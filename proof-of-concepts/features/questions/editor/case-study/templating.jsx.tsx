import React from 'react';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
// Components
import { Paragraph, H1, H2, H3, H4, H5, H6 } from '../typography';
import { Image, ColorBlock } from '../models';
import LinkResolver from '../utilities/linkResolver';
import useContentfulImage from '../../hooks/useContentfulImage';
const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <Paragraph as="strong">{text}</Paragraph>,
    [MARKS.ITALIC]: (text) => <Paragraph as="em">{text}</Paragraph>,
    [MARKS.UNDERLINE]: (text) => <Paragraph as="u">{text}</Paragraph>
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Paragraph>{children}</Paragraph>,
    [BLOCKS.HEADING_1]: (node, children) => <H1>{children}</H1>,
    [BLOCKS.HEADING_2]: (node, children) => <H2>{children}</H2>,
    [BLOCKS.HEADING_3]: (node, children) => <H3>{children}</H3>,
    [BLOCKS.HEADING_4]: (node, children) => <H4>{children}</H4>,
    [BLOCKS.HEADING_5]: (node, children) => <H5>{children}</H5>,
    [BLOCKS.HEADING_6]: (node, children) => <H6>{children}</H6>,
    [BLOCKS.UL_LIST]: (node, children) => <Paragraph as="ul"></Paragraph>,
    [BLOCKS.OL_LIST]: (node, children) => <Paragraph as="ol"></Paragraph>,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const fluid = useContentfulImage(node.data.target.fields.file.url);
      return (
        <Image
          fluid={fluid}
          alt={node.data.target.fields.title}
          caption={node.data.target.fields.description}
        />
      );
    },
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      return <LinkResolver input={node.data.target}>{children}</LinkResolver>;
    },
    [INLINES.HYPERLINK]: (node, children) => {
      return (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    [BLOCKS.EMBEDDED_ENTRY]: (node) => {
      const fields = node.data.target.fields;
      const contentType = node.data.target.sys.contentType.sys.id;
      switch (contentType) {
        case 'colorBlock':
          return <ColorBlock input={fields} />;
        default:
          return null;
      }
    }
  }
};
const RichText = ({ input }) => {
  return <>{documentToReactComponents(input.json, options)}</>;
};
export default RichText;
