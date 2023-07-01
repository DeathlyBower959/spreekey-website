import { useCallback, useEffect, useState } from 'react';
import { FaVrCardboard } from 'react-icons/fa';
import { MdChecklistRtl } from 'react-icons/md';
// Packages
import styled, { css } from 'styled-components';
import { z } from 'zod';

import { boardSchema, getTrelloData } from '../api/trello';
import Flipper from '../atoms/Flipper';
import MemoAnimated from '../atoms/icons/Animated';
import ReloadIcon from '../atoms/icons/Reload';
import Loader from '../atoms/loaders/Loader';
import { trelloConfig } from '../config';
import useLocalStorage from '../hooks/useLocalStorage';

type ITrelloData = Awaited<ReturnType<typeof getTrelloData>>;

interface ITimetable {
  isLoaded: boolean;
}

function Commissions() {
  const [value, setValue] = useLocalStorage(
    'temp-trello-data',
    z.array(boardSchema),
    null
  );
  const [trelloData, setTrelloData] = useState<ITrelloData | 'ERROR' | null>(
    null
  );

  const fetchData = useCallback(async () => {
    setTrelloData(value);

    try {
      const data = await getTrelloData();
      setTrelloData(data);
      setValue(data);
    } catch (err) {
      setTrelloData('ERROR');
      console.error('Failed to load trello data: ', err);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const getTOSData = useCallback(() => {
    let data: undefined | { name: string; desc: string; id: string }[];

    if (trelloData && trelloData !== 'ERROR') {
      const cards = trelloData.at(-1)?.lists?.[0].cards;
      const index =
        cards?.findIndex(card => card.name === '✦Terms of Service') || 0;

      data = cards
        ?.slice(index + 1, cards.length)
        .map(card => ({ name: card.name, desc: card.desc, id: card.id }));
    }

    return data;
  }, [trelloData]);

  useEffect(() => {
    if (trelloData !== null) return;
    fetchData();
  }, [trelloData, fetchData]);

  return (
    <>
      <Header>Commissions</Header>
      <TimetableWrapper>
        {(trelloData === null || trelloData === 'ERROR') && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
              flexDirection: 'column',
              gap: '0.5em',
            }}
          >
            {trelloData === null ? (
              <Loader />
            ) : (
              <>
                {'Failed to load data'}
                <ReloadIcon onClick={fetchData} />
              </>
            )}
          </div>
        )}
        <Timetable isLoaded={trelloData !== null && trelloData !== 'ERROR'}>
          <thead>
            <TimetableRow>
              <TimetableHeader></TimetableHeader>
              <TimetableHeader>NAME</TimetableHeader>
              <TimetableHeader>TYPE</TimetableHeader>
              <TimetableHeader>ACCEPTED</TimetableHeader>
              <TimetableHeader>STATUS</TimetableHeader>
            </TimetableRow>
          </thead>
          <tbody>
            {trelloData &&
              trelloData !== 'ERROR' &&
              trelloData.map(board => {
                return board.lists?.map(list => {
                  if (
                    list.name === '[0] Important, TOS' ||
                    list.name === '[V] Complete'
                  )
                    return null;

                  if ((list.cards?.length || 0) <= 0) return null;
                  return list.cards?.map(card => {
                    const nameSplit = card.name.split(' ');
                    const name = nameSplit[1];
                    // if (!name) return null;

                    const type = nameSplit[0]
                      .match(/.+/)?.[0]
                      .replace('[', '')
                      .replace(']', '');
                    // if (!type) return null;

                    const acceptedDate = card.desc
                      .match(
                        /Date accepted: ([0-9]{1,2})(.|-)([0-9]{1,2})(.|-)([0-9]{1,2})/
                      )?.[0]
                      .split(': ')[1];
                    // if (!acceptedDate) return null;

                    if (!card.labels) return null;

                    let status;

                    function isLabel(
                      labelFlag: keyof typeof trelloConfig.LABEL_KEYS
                    ) {
                      return !!card.labels?.find(label =>
                        trelloConfig.LABEL_KEYS[labelFlag].includes(
                          label.name.toLowerCase()
                        )
                      );
                    }

                    if (isLabel('COMPLETE')) return null;

                    if (isLabel('UNPAID')) {
                      status = 'Unpaid';
                    } else if (isLabel('NOT_STARTED')) {
                      status = 'Not started';
                    } else if (isLabel('CONCEPT')) {
                      status = 'Concept';
                    } else if (isLabel('IN_PROGRESS')) {
                      status = 'In progress';
                    }
                    if (!status) return null;

                    // TODO: Individual flipper?

                    return (
                      <TimetableRow key={card.id}>
                        <TimetableTagCell>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '0.35em',
                              direction: 'rtl',
                              alignItems: 'center',
                            }}
                          >
                            {isLabel('VR') && <FaVrCardboard title='VR' />}
                            {isLabel('OWED_ART') && (
                              <MdChecklistRtl title='owed art' />
                            )}
                            {isLabel('ANIMATED') && (
                              <MemoAnimated title='animated' />
                            )}
                          </div>
                        </TimetableTagCell>
                        <TimetableCell
                          children={
                            <Flipper current={name || 'N/A'} delay={400} />
                          }
                        />
                        <TimetableCell
                          children={
                            <Flipper current={type || 'N/A'} delay={550} />
                          }
                        />
                        <TimetableCell
                          children={
                            <Flipper
                              current={acceptedDate || 'N/A'}
                              delay={700}
                            />
                          }
                        />
                        <TimetableCell
                          children={
                            <Flipper current={status || 'N/A'} delay={850} />
                          }
                        />
                      </TimetableRow>
                    );
                  });
                });
              })}
          </tbody>
        </Timetable>
      </TimetableWrapper>

      <SubHeader>Terms of Service</SubHeader>

      <TOSWrapper>
        {getTOSData()?.map((section, sectionIdx) => {
          return (
            <TOSSection key={section.id}>
              <TOSTitle>{section.name}</TOSTitle>
              {section.desc
                .replaceAll('-', trelloConfig.TOS.PREFIXED_CHARACTER)
                // .replaceAll(/### (.*):/g, '[$1 ]')
                .split('\n')
                .map((item, itemIdx) => (
                  <TOSItem key={`comm-item-${sectionIdx}-${itemIdx}`}>
                    {item
                      .split(/(\*\*.*?\*\*)|(>>> .*?)|(### .*)|(`.*`)/)
                      .map((group, groupIdx) => {
                        if (!group) return null;

                        if (
                          group.match(/\*\*.*?\*\*/) &&
                          group.match(/### (.*):/)
                        )
                          return (
                            <div
                              key={`comm-item-strong-title-${itemIdx}-${groupIdx}`}
                            >
                              <br />
                              <strong>
                                {group
                                  .replace(/### (.*):/, '$1')
                                  .replace(
                                    /\*\*(.*?)\*\*/,
                                    `${trelloConfig.TOS.TITLE_ENCAPSULATION_CHARACTERS[0]} $1 ${trelloConfig.TOS.TITLE_ENCAPSULATION_CHARACTERS[1]}`
                                  )}
                              </strong>
                            </div>
                          );

                        if (group.match(/`.*`/)) {
                          return (
                            <code key={`comm-item-code-${itemIdx}-${groupIdx}`}>
                              {group.replace(/`(.*)`/, '$1')}
                            </code>
                          );
                        }

                        if (group.match(/### (.*):/)) {
                          return (
                            <div key={`comm-item-title-${itemIdx}-${groupIdx}`}>
                              <br />
                              {group.replace(/### (.*):/, '$1')}
                            </div>
                          );
                        }

                        if (group.match(/(\*\*.*?\*\*)/))
                          return (
                            <strong
                              key={`comm-item-strong-${itemIdx}-${groupIdx}`}
                            >
                              {group.replace(/\*\*(.*?)\*\*/, '$1')}
                            </strong>
                          );

                        if (group.match(/>>>(.*?)/))
                          return (
                            <Divider
                              key={`comm-item-horizontal-rule-${itemIdx}-${groupIdx}`}
                            />
                          );

                        return group + ' ';
                      })}
                  </TOSItem>
                ))}
            </TOSSection>
          );
        })}
      </TOSWrapper>
    </>
  );
}

const Header = styled.h2`
  text-align: center;
  font-size: 4em;

  margin: 0.5em 0.5em 0.5em 0.5em;
`;
const SubHeader = styled.h3`
  font-size: 3em;
  text-align: center;
  margin: 0 0.5em 0.5em;
`;

const TimetableWrapper = styled.div`
  max-width: 100em;
  width: 90vw;
  margin: 0 auto 5em auto;
  overflow-x: auto;
  background-color: var(--secondary-background);

  min-height: 100px;
`;
const Timetable = styled.table<ITimetable>`
  padding: 2em;
  border-radius: 2px;
  width: 100%;
  border-spacing: 0.5em;

  transition: opacity 500ms ease-out 175ms;

  opacity: ${props => (props.isLoaded ? '1' : '0')};

  ${props =>
    !props.isLoaded &&
    css`
      font-size: 0;
      visibility: collapse;
      padding: 0;
    `}
`;

const TimetableHeader = styled.th`
  text-align: left;
  font-size: 1.5em;
  background-color: var(--secondary-background);
`;
const TimetableRow = styled.tr`
  background-color: var(--tertiary-background);
`;

const TimetableCell = styled.td`
  border-radius: 2px;
  padding: 0.1em 1em;
  font-size: 1.5em;

  position: relative;
  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 0.1px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    background-color: var(--secondary-background);
  }
`;

const TimetableTagCell = styled.td`
  background-color: var(--secondary-background);

  font-size: 1.5em;

  > * {
    /* margin-right: 0.35em; */
  }
`;

const TOSWrapper = styled.div`
  display: grid;
  grid-gap: 2em;
  margin: 0 auto;

  max-width: 130rem;
  padding: 0 3em;

  grid-template-columns: 1fr 1fr;
  @media only screen and (max-width: 68rem) {
    grid-template-columns: 1fr;
  }

  margin-bottom: 2em;
`;
const TOSSection = styled.section`
  flex: 1;
  background-color: var(--secondary-background);
  padding: 1em 2em;
  border-radius: 5px;

  /* Hide first line break */
  p:nth-child(2) {
    br {
      display: none;
    }
  }
`;
const TOSTitle = styled.h3`
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 0.75em;
`;
const TOSItem = styled.div`
  margin-bottom: 1em;
`;
const Divider = styled.hr`
  margin: 1em 0;
  width: 100%;
  border: 1px solid var(--tertiary-background);
`;
export default Commissions;
