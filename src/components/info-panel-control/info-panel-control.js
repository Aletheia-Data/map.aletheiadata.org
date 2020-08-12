import React from 'react';
import styled from 'styled-components';
import {Icons} from 'kepler.gl/components';

const StyledInfoPanel = styled.div`
  align-items: center;
  background-color: ${props => props.bgColor};
  color: ${props => props.fontColor};
  display: flex;
  height: ${props => props.height}px;
  justify-content: space-between;
`;

const InfoPanel = ({
  bgColor = '#fff',
  fontColor = '#999',
  height = 'auto',
  data
}) => {
    console.log(data);
    return(
        <StyledInfoPanel
            className="info-panel"
            bgColor={bgColor}
            fontColor={fontColor}
            height={height}
        >
            <div className={'info-container'}>
                <h2 style={{margin:0}}>{data.ADM2_ES}</h2>
                <span>{data.ADM2_PCODE}</span>
                <p>{data.description}</p>
            </div>
        </StyledInfoPanel>
    )
};

export default InfoPanel;
