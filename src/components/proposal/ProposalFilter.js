import React, { useState, useEffect, useContext } from 'react';

import ProposalList from './ProposalList';
import { groupByStatus } from '../../utils/ProposalHelper';
import { DaoServiceContext } from '../../contexts/Store';
import styled from 'styled-components';
import { getAppLight, grid } from '../../variables.styles.js';

export const ProposalFilterDiv = styled.div`
  width: 100%;
  border-top: 2px solid ${(props) => getAppLight(props.theme)};
`;

export const ProposalFiltersDiv = styled.div`
  max-width: 100%;
  overflow: auto;
  white-space: nowrap;
  padding: 10px 0px;
  @media (min-width: ${grid}) {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
`;

export const FilterButton = styled.button`
  appearance: none;
  outline: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: all 0.15s ease-in-out;
  color: ${(props) =>
    props.active ? props.theme.baseFontColor : props.theme.secondary};
  border-radius: 50px;
  padding: 15px 30px;
  max-width: 100%;
  display: block;
  margin: 15px 0px;
  font-size: 16px;
  text-align: center;
  font-weight: 900;
  &:hover {
    color: ${(props) => props.theme.baseFontColor};
  }
`;

const ProposalFilter = ({ proposals, filter, history, unsponsoredView }) => {
  const [groupedProposals, setGroupedProposals] = useState();
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [activeItem, setActiveItem] = useState(false);
  const [daoService] = useContext(DaoServiceContext);

  const handleSelect = (list, listName) => {
    setFilteredProposals(list);
    history.push(`/dao/${daoService.daoAddress}/proposals/${listName}`);
    setActiveItem(activeItem);
  };

  useEffect(() => {
    if (proposals) {
      const groupedProps = groupByStatus(proposals, unsponsoredView);
      const groupedKey = unsponsoredView ? 'Unsponsored' : 'Base';

      if (Object.keys(groupedProps[groupedKey]).includes(filter)) {
        setGroupedProposals(groupedProps[groupedKey]);
        setFilteredProposals(groupedProps[groupedKey][filter]);
      } else {
        if (unsponsoredView) {
          history.push(`/dao/${daoService.daoAddress}/proposals/Unsponsored`);
        } else if (groupedProps[groupedKey].VotingPeriod.length > 0) {
          history.push(`/dao/${daoService.daoAddress}/proposals/VotingPeriod`);
        } else {
          history.push(`/dao/${daoService.daoAddress}/proposals/Completed`);
        }
      }
    }
  }, [daoService.daoAddress, proposals, filter, history, unsponsoredView]);

  if (!groupedProposals) {
    return <></>;
  }

  return (
    <ProposalFilterDiv>
      <ProposalFiltersDiv>
        {!unsponsoredView ? (
          <>
            <FilterButton
              onClick={() =>
                handleSelect(groupedProposals.VotingPeriod, 'VotingPeriod')
              }
              active={filter === 'Voting' ? true : false}
            >
              Voting Period (
              {groupedProposals.VotingPeriod &&
                groupedProposals.VotingPeriod.length}
              )
            </FilterButton>
            <FilterButton
              onClick={() =>
                handleSelect(groupedProposals.GracePeriod, 'GracePeriod')
              }
              className={activeItem ? 'Active' : null}
            >
              Grace Period (
              {groupedProposals.GracePeriod &&
                groupedProposals.GracePeriod.length}
              )
            </FilterButton>
            <FilterButton
              onClick={() =>
                handleSelect(
                  groupedProposals.ReadyForProcessing,
                  'ReadyForProcessing',
                )
              }
              className={activeItem ? 'Active' : null}
            >
              Ready For Processing (
              {groupedProposals.ReadyForProcessing &&
                groupedProposals.ReadyForProcessing.length}
              )
            </FilterButton>
            <FilterButton
              onClick={() =>
                handleSelect(groupedProposals.Completed, 'Completed')
              }
              className={activeItem ? 'Active' : null}
            >
              Completed (
              {groupedProposals.Completed && groupedProposals.Completed.length})
            </FilterButton>
            <FilterButton
              onClick={() => handleSelect(groupedProposals.InQueue, 'InQueue')}
              className={activeItem ? 'Active' : null}
            >
              In Queue (
              {groupedProposals.InQueue && groupedProposals.InQueue.length})
            </FilterButton>
          </>
        ) : (
          <>
            <FilterButton
              onClick={() =>
                handleSelect(groupedProposals.Unsponsored, 'Unsponsored')
              }
              className={activeItem ? 'Active' : null}
            >
              Open (
              {groupedProposals.Unsponsored &&
                groupedProposals.Unsponsored.length}
              )
            </FilterButton>

            <FilterButton
              onClick={() =>
                handleSelect(groupedProposals.Cancelled, 'Cancelled')
              }
              className={activeItem ? 'Active' : null}
            >
              Cancelled (
              {groupedProposals.Cancelled && groupedProposals.Cancelled.length})
            </FilterButton>
          </>
        )}
      </ProposalFiltersDiv>
      <ProposalList proposals={filteredProposals} />
    </ProposalFilterDiv>
  );
};

export default ProposalFilter;
