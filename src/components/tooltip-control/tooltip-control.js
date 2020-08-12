// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {useState} from 'react';
import styled from 'styled-components';
import {LayerHoverInfoFactory} from 'kepler.gl/components';

import { slide as Menu } from 'react-burger-menu';

const TooltipControl = LayerHoverInfoFactory();

const StyledMapControlOverlay = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;
`;

let state = {
  ADM2_PCODE: null
}

let currentProv = {}

var styles = {
  bmBurgerButton: {
    display: 'none'
  },
  bmCrossButton: {
    height: '24px',
    width: '24px'
  },
  bmCross: {
    background: '#bdc3c7'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    background: '#373a47',
    padding: '2.5em 1.5em 0',
    fontSize: '1.15em'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad',
    padding: '0.8em'
  },
  bmItem: {
    display: 'inline-block'
  },
  bmOverlay: {
    background: 'rgba(0, 0, 0, 0.3)'
  }
}

class CustomTooltipControl extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        isOpen: false,
        currentSelection: []
      }
    }

    handleStateChange = (sta) => {
      console.log(sta);
      this.setState({
        isOpen: false
      })
    }

    render() {
      if (this.props.frozen && this.props.layerHoverProp){
        //console.log('clicked');
        const dataLayer = this.props.layerHoverProp.data[0].properties;
        // if clicked
        if (
          this.state.currentSelection.ADM2_PCODE != dataLayer.ADM2_PCODE
        ){
          this.state.currentSelection = dataLayer,
          this.state.isOpen = true;
          //console.log('here----->>>>>',dataLayer);
        }
      }
      
      return (
        <StyledMapControlOverlay>
          <Menu 
              onClose={(state) => this.handleStateChange(state)}
              left
              styles={ styles }
              isOpen={!this.state.isOpen}
            >
              <a onClick={(e) => console.log(e)}>Home</a>
              <a onClick={(e) => console.log(e)}>About</a>
              <a onClick={(e) => console.log(e)}>Contact</a>
              <a onClick={(e) => console.log(e)}>Settings</a>
            </Menu>
        </StyledMapControlOverlay>
      )
    }
};

export default CustomTooltipControl;
