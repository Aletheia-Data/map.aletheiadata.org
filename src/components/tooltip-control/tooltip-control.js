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

import InfoPanel from '../info-panel-control/info-panel-control';

import { slide as SidePanel } from 'react-burger-menu';
import ContentLoader from "react-content-loader";

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
    height: '34px',
    width: '34px',
    right: '5px',
    top: '3px',
    color: '#000', 
    background: '#71a0a3',
    borderRadius: '50%',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 20px, rgba(0, 0, 0, 0.1) 0px 2px 5px',
    border: '2px solid #578e92'
  },
  bmCross: {
    background: '#000'
  },
  bmMenuWrap: {
    position: 'fixed',
    height: '100%'
  },
  bmMenu: {
    height: '80%',
    marginLeft: '10px',
    top: '10px',
    position: 'relative',
    right: '10px',
    background: '#fff',
    padding: '2em 1.5em 0',
    fontSize: '1.15em',
    borderRadius: '10px',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 20px, rgba(0, 0, 0, 0.1) 0px 2px 5px'
  },
  bmMorphShape: {
    fill: '#373a47'
  },
  bmItemList: {
    color: '#b8b7ad'
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
        currentSelection: {},
        profiles: [],
        loading: true
      }
    }

    handleStateChange = (sta) => {
      console.log(sta);
      this.setState({
        isOpen: false
      })
    }

    getData = async (prov) => {
      console.log(prov);

      const revProv = prov.ADM2_ES.split('Provincia ');
      let name;
      if (revProv[1]){
        name = revProv[1];
      } else {
        name = revProv[0];
      }
      console.log(name);
      console.log(revProv);
      switch (name) {
        case 'Sánchez Ramírez':
          name = "SANCHEZ RAMIREZ"
          break;
        case 'San José de Ocoa':
          name = "SAN JOSE DE OCOA"
          break;
        case 'Santiago Rodríguez':
          name = "SANTIAGO RODRIGUEZ"
          break;
        case 'Baoruco':
          name = "BAHORUCO"
          break;
        case 'Elías Piña':
          name = "ELIAS PIÑA"
          break;
        case 'Dajabón':
          name = "DAJABON"
          break;
        case 'María Trinidad Sánchez':
          name = "MARIA TRINIDAD SANCHEZ"
          break;
        case 'Samaná':
          name = "SAMANA"
          break;
        case 'San Pedro de Macorís':
          name = "SAN PEDRO DE MACORIS"
          break;
        case 'San Cristóbal':
          name = "SAN CRISTOBAL"
          break;
      
        default:
          break;
      }
      let search = `https://cors-anywhere.herokuapp.com/https://api.aletheiadata.org/v1/jce/elecciones/2020/congresuales/?query=PROVINCIA&value=${name}`;

      console.log(search);

      await fetch(search, {
        mode: 'cors'
      })
      .then(res => {
        //console.log(res.status); // Will show you the status
        if (!res.ok) {
            throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then(data =>{
        
        console.log(data);
        this.setState({
          profiles: data,
          loading: false
        })
        
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: true
        })
      });

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
          //console.log(dataLayer);
          this.getData(dataLayer);
        }
      }
      
      return (
        <StyledMapControlOverlay>
          <SidePanel 
              customBurgerIcon={ false }
              onClose={(state) => this.handleStateChange(state)}
              left
              styles={ styles }
              isOpen={!this.state.isOpen}
            >
              {
                !this.state.loading &&
                this.state.currentSelection.ADM2_PCODE &&
                <InfoPanel data={this.state.currentSelection} profiles={this.state.profiles} />
              }
              {
                this.state.loading &&
                <div>
                  <ContentLoader 
                    speed={2}
                    width={'100%'}
                    height={160}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <rect x="0" y="0" rx="5" ry="5" width="80%" height="20" />
                    <rect x="0" y="40" rx="3" ry="3" width="90%" height="6" /> 
                    <rect x="0" y="60" rx="3" ry="3" width="85%" height="6" /> 
                    <rect x="0" y="80" rx="3" ry="3" width="56%" height="6" /> 
                    <rect x="0" y="100" rx="3" ry="3" width="87%" height="6" /> 
                    <rect x="0" y="120" rx="3" ry="3" width="45%" height="6" /> 
                  </ContentLoader>
                  <ContentLoader 
                    speed={2}
                    width={'100%'}
                    height={100}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <rect x="0" y="0" rx="5" ry="5" width="60%" height="20" />
                    <rect x="0" y="40" rx="3" ry="3" width="95%" height="6" /> 
                    <rect x="0" y="60" rx="3" ry="3" width="75%" height="6" /> 
                    <rect x="0" y="80" rx="3" ry="3" width="10%" height="6" /> 
                  </ContentLoader>
                  <ContentLoader
                    height={100}
                    width={'100%'}
                    speed={2}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <circle cx="30" cy="50" r="25" />
                    <circle cx="60" cy="50" r="25" />
                    <circle cx="90" cy="50" r="25" />
                  </ContentLoader>
                  <ContentLoader 
                    speed={2}
                    width={'100%'}
                    style={{ marginTop: '10px' }}
                    height={150}
                    backgroundColor="#f3f3f3"
                    foregroundColor="#ecebeb"
                  >
                    <rect x="0" y="0" rx="5" ry="5" width="30%" height="15" />
                    <rect x="0" y="30" rx="3" ry="3" width="100%" height="6" /> 
                    <rect x="0" y="60" rx="5" ry="5" width="30%" height="15" /> 
                    <rect x="0" y="90" rx="3" ry="3" width="100%" height="6" /> 
                  </ContentLoader>
                </div>
              }
            </SidePanel>
        </StyledMapControlOverlay>
      )
    }
};

export default CustomTooltipControl;
