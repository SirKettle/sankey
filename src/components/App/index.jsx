import * as React from 'react';
import csv from 'csvtojson';
import styled, { createGlobalStyle } from 'styled-components';
import { Heading, Paragraph } from '../typography';
import { Chart } from '../Chart'


const GlobalStyle = createGlobalStyle`
  body {
    background: #2d7373;
    color: #d6bf13;
    line-height: 1.5;
  }
`;

const Columns = styled.div`
  display: flex;
  width: 100%;
`

const Column = styled.div`
  flex: 1 1 auto;
  margin-right: 50px;
  &:last-child {
    flex:3 1 60%;
    margin-right: 0;
  }
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
`;

const DropZone = styled.div`
  height: 300px;
  min-width: 200px;
  border: dotted 10px rgba(255, 255, 255, 0.2);
  margin: 25px 0;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const CsvContents = styled.textarea`
  height: 300px;
  min-width: 200px;
`;

export const App = () => {
  const [csvNodes, setCsvNodes] = React.useState(null);
  const [csvLinks, setCsvLinks] = React.useState(null);
  const [parsedNodes, setParsedNodes] = React.useState([]);
  const [parsedLinks, setParsedLinks] = React.useState([]);

  React.useEffect(() => {
    if (csvNodes === null) {
      setParsedNodes([]);
      return;
    }
    csv()
      .fromString(csvNodes)
      .then(setParsedNodes)

  }, [csvNodes]);

  React.useEffect(() => {
    if (csvLinks === null) {
      setParsedLinks([]);
      return;
    }
    console.log('set the links state')
    csv()
      .fromString(csvLinks)
      .then(setParsedLinks)

  }, [csvLinks]);

  const handleDragEnter = React.useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleDragOver = React.useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleFile = callback => file => {
    console.log('Processing file: ', file.name, file.type, file.size);
    const reader = new FileReader();
    reader.onload = event => {

      try {
        const json = JSON.parse(event.target.result);
        if (json.nodes && json.links) {
          setParsedLinks(json.links);
          setParsedNodes(json.nodes);
          return;
        }
        throw new Error('not json');
      } catch (e) {
        callback(event.target.result);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDrop = callback => e => {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    handleFile(callback)(dt.files[0]);
  };

  const chartVisible = !!parsedNodes.length && !!parsedLinks.length

  return (
    <Page>
      <GlobalStyle />
      <Heading as="h1">
        Sankey Generator
      </Heading>
      <Columns>
        {!chartVisible && (
          <>
            <Column>
              <Paragraph as="h3">Nodes CSV</Paragraph>
              {!csvNodes && !parsedNodes.length && <DropZone onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDrop(setCsvNodes)} />}
              {csvNodes && <CsvContents defaultValue={csvNodes} />}
            </Column>
            <Column>
              <Paragraph as="h3">Links CSV</Paragraph>
              {!csvLinks && !parsedLinks.length && <DropZone onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDrop={handleDrop(setCsvLinks)} />}
              {csvLinks && <CsvContents defaultValue={csvLinks} />}
            </Column>
          </>)}
        <Column>
          <Chart nodes={parsedNodes} links={parsedLinks} />
        </Column>
      </Columns>
    </Page>
  );
};
