/**
 * Copyright 2019 Atelier Disko. All rights reserved. This source
 * code is distributed under the terms of the BSD 3-Clause License.
 */

import React from 'react';
import { transform } from '@atelierdisko/dsk';
import { withRoute } from 'react-router5';

import './Doc.css';

import Heading from '../Heading';
import Image from '../Image';
import Link from '../Link';

import AnnotatedImage from '../AnnotatedImage';
import Banner from '../Banner'
import CodeBlock from '../CodeBlock';
import ColorSpecimen from '../ColorSpecimen';
import ComponentDemo from '../ComponentDemo';
import DoDont, { Do, Dont } from '../DoDont';
import FigmaEmbed from '../FigmaEmbed';
import TypographySpecimen from '../TypographySpecimen';

function Doc(props) {
  if (props.htmlContent === "") {
    return <div className="doc">{props.children}</div>;
  }

  let docTitle = props.title;

  const transforms = {
    AnnotatedImage: props => <AnnotatedImage {...props} />,
    Banner: props => { return <Banner {...props} />},
    CodeBlock: props => <CodeBlock {...props} />,
    ColorSpecimen: props => <ColorSpecimen {...props} />,
    ComponentDemo: props => <ComponentDemo {...props} />,
    Do: props => <Do {...props} />,
    DoDont: props => <DoDont {...props} />,
    Dont: props => <Dont {...props} />,
    FigmaEmbed: props => <FigmaEmbed {...props} />,
    TypographySpecimen: props => <TypographySpecimen {...props} />,
    Warning: props => <Banner type="warning" {...props} />,
    img: props => <Image {...props} />,
    a: props => <Link {...props} />,
    pre: props => <CodeBlock {...props} />,
    h1: props => <Heading level="alpha" {...props} docTitle={docTitle} />,
    h2: props => <Heading level="beta"  {...props} docTitle={docTitle} />,
    h3: props => <Heading level="gamma" {...props} docTitle={docTitle} />,
    h4: props => <Heading level="delta" {...props} docTitle={docTitle} />,
  };

  const orphans = [
    "p > img",
    "p > video"
  ];

  let transformedContent = transform(props.htmlContent, transforms, orphans, {
    noTransform: (type, props) => {
      // This gets called on HTML elements that do not need
      // to be transformed to special React components.
      // There are differences between the attributes of
      // HTML elements and React that we have to take care
      // of: https://reactjs.org/docs/dom-elements.html#differences-in-attributes
      props.className = props.class;
      delete(props.class);

      return React.createElement(type, props, props.children);
    }
  });
  return <div className="doc">{transformedContent}</div>
}

export default withRoute(Doc);
