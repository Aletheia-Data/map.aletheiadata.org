import React from 'react';
import styled from 'styled-components';
import {Icons} from 'kepler.gl/components';

import { WaveTopBottomLoading } from 'react-loadingg';

const StyledBanner = styled.div`
    align-items: center;
    background-color: ${props => props.bgColor};
    color: ${props => props.fontColor};
    opacity: ${props => props.show == true ? 1 : 0};
    display: ${props => props.show == true ? 'flex' : 'none'};
    width: 100%;
    height: 100%;
    justify-content: space-between;
    padding: 0 40px;
    position: absolute;
    transition: 0.3s ease opacity;
    z-index: 9999;
    padding: 10px;
    box-shadow: rgba(0,0,0,0.12) 0px 8px 20px, rgba(0,0,0,0.1) 0px 2px 5px;

    svg:hover {
        cursor: pointer;
    }
`;

const Loading = ({
  bgColor = '#00000057',
  fontColor = '#FFFFFF',
  height = 30,
  children,
  onClose,
  show
}) => (
  <StyledBanner
    className="top-banner"
    bgColor={bgColor}
    fontColor={fontColor}
    height={height}
    show={show}
  >
    <div>
        <WaveTopBottomLoading />
    </div>
  </StyledBanner>
);

export default Loading;
