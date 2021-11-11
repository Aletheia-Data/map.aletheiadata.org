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
import {connect} from 'react-redux';
// import action and forward dispatcher
import {forwardTo} from 'kepler.gl/actions';
import {
  loadSample
} from '../../actions';

import styled from 'styled-components';
// config
import municipalitiesConfig from '../../data/municipalities-config';
import {addDataToMap } from 'kepler.gl/actions';
import { processGeojson, removeLayerData} from 'kepler.gl/processors';
import {LayerHoverInfoFactory} from 'kepler.gl/components';

import InfoPanel from '../info-panel-control/info-panel-control';
import InfoPanelProfile from '../info-panel-control/info-panel-profile-control';
import InfoPanelPresidencial from '../info-panel-control/info-panel-presidencial-control';

import { slide as SidePanel } from 'react-burger-menu';
import ContentLoader from "react-content-loader";

import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';

import { Tooltip, Whisper } from 'rsuite';

import Prov_totals from '../../data/tot-votes-2020';

import { RAPID_API } from '../../constants/default-settings';

const TooltipControl = LayerHoverInfoFactory();

const axios = require('axios').default;

const StyledMapControlOverlay = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;

  .awssld__content{
    background-color: #fff;
  }

  .awssld__content > div:nth-of-type(1){
    height: 100%;
  }

  .info-button-container{
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 2;
  }
  
  .button-container button {
    background-color: #71a0a3;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 0.8rem;
    color: #000;
    cursor: pointer;
    border-top-left-radius: 15px;
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 600;
    -webkit-transition: background-color 0.3s ease-out;
    -moz-transition: background-color 0.3s ease-out;
    -o-transition: background-color 0.3s ease-out;
    transition: background-color 0.3s ease-out;
  }

  .button-container button.disabled, .button-container button:hover {
    background-color: #adbdbf;
    color: #0000004f;
  }
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
    zIndex: 2,
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
    //padding: '2em 1.5em 0',
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
        seeMoreProfiles: 0,
        loading: true
      }
      
    }

    handleStateChange = (sta) => {
      console.log(sta);
      this.setState({
        loading: true,
        isOpen: false,
      })
    }

    getPresidencial = () =>{
      let cabinet = [
        {
            "_index": "jce-ganadores-elecciones-jul-2020",
            "_type": "_doc",
            "_id": "KXlQ6HMB2YII_lqrmLcy",
            "_score": 4.640537,
            "_source": {
                "EDAD": 53,
                "SIGLAS": "PRM",
                "NOMBRE_COMPLETO": "LUIS RODOLFO ABINADER CORONA",
                "SEXO": "M",
                "CARGO": "PRESIDENTE",
                "@timestamp": "2067-07-12T00:00:00.000+02:00",
                "PROVINCIA": "NACIONAL",
                "PARTIDO_CANDIDATO": "PRM",
                "FECHA_NACIMIENTO": "12/7/67",
                "VOTOS": "2,154,866",
                "PARTIDO_CANDIDATURA": "PARTIDO REVOLUCIONARIO MODERNO"
            }
        },
        {
            "_index": "jce-ganadores-elecciones-jul-2020",
            "_type": "_doc",
            "_id": "KnlQ6HMB2YII_lqrmLcy",
            "_score": 4.640537,
            "_source": {
                "EDAD": 53,
                "SIGLAS": "PRM",
                "NOMBRE_COMPLETO": "RAQUEL PEÑA RODRIGUEZ",
                "SEXO": "F",
                "CARGO": "VICEPRESIDENTE",
                "@timestamp": "2066-09-10T00:00:00.000+02:00",
                "PROVINCIA": "NACIONAL",
                "PARTIDO_CANDIDATO": "PRM",
                "FECHA_NACIMIENTO": "10/9/66",
                "VOTOS": "2,154,866",
                "PARTIDO_CANDIDATURA": "PARTIDO REVOLUCIONARIO MODERNO"
            }
        }
      ];

      return cabinet;
    }

    getCabinet = () =>{
      let cabinet = [
        {
            "Cargo": "Ministro de la Presidencia",
            "Titular": "Lisandro Macarrulla",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Defensa",
            "Titular": "Teniente General Carlos Luciano Díaz Morfa",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Canciller de la República Dominicana",
            "Titular": "Roberto Álvarez",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Procuradora General de la República",
            "Titular": "Miriam Germán Brito",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Interior y Policía",
            "Titular": "Jesús(chú) Vásquez Martínez",
            "Desde": "16 de agosto 2020"
        },
        {
            "Cargo": "Ministro de Hacienda",
            "Titular": "Jochi Vicente",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Industria, Comercio y MiPymes",
            "Titular": "Victor(ito) Bisono​",
            "Imagen": "",
            "Desde": "16 de agosto 2020"
        },
        {
            "Cargo": "Ministro de Economía, Planificación y Desarrollo",
            "Titular": "Miguel Ceara Hatton",
            "Imagen": "",
            "Desde": "16 de agosto 2020"
        },
        {
            "Cargo": "Ministro Administrativo de la Presidencia",
            "Titular": "José Ignacio Paliza",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Educación",
            "Titular": "Roberto Fulcar",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministra de Salud Pública y Asistencia Social",
            "Titular": "Plutarco Arias",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Obras Públicas y Comunicaciones",
            "Titular": "Deligne Ascensión Burgos",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Medio Ambiente y Recursos Naturales",
            "Titular": "Orlando Jorge Mera",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Turismo",
            "Titular": "David Collado",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Educación Superior, Ciencia y Tecnología",
            "Titular": "Franklin García Fermin",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Deportes, Educación Física y Recreación",
            "Titular": "Francisco Camacho",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Trabajo",
            "Titular": "Luis Miguel De Camps",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministra de Cultura",
            "Titular": "Carmen Heredia Vda. Guerrero",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Administración Pública",
            "Titular": "Dario Castillo Lugo",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministra de la Mujer",
            "Titular": "Mayra Jiménez",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministra de la Juventud",
            "Titular": "Kimberly Taveras",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        },
        {
            "Cargo": "Ministro de Energía y Minas",
            "Titular": "Antonio Isa Conde",
            "Imagen": "",
            "Desde": "16 de agosto de 2020"
        }
      ];

      return cabinet;
    }
 
    getData = async (prov) => {
      this.setState({
        loading: true
      })
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

      const totalPresidencial = this._getTotal(name,"PRESIDENCIAL");
      const totalSenaduria = this._getTotal(name,"SENADURIA");
      const totalDiputacion = this._getTotal(name,"DIPUTACION");
      //console.log(totalValidsVotes, totalIssuedVotes);

      // GET CONGRESUAL
      var options = {
        method: 'GET',
        url: `https://${RAPID_API.RAPID_API_HOST}/v2/jce/csv/ipfs/bafkreihnz64hv7sjkvasttihblvnw22zymw54bwy2y6tiz5dzfccv5onnq`,
        params: {
          limit: '10', 
          info: 'false', 
          fields: 'PROVINCIA', 
          value: name
        },
        headers: {
          'x-rapidapi-host': RAPID_API.RAPID_API_HOST,
          'x-rapidapi-key': RAPID_API.RAPID_API_KEY
        }
      };

      const self = this;
      await axios.request(options).then(function (response) {
        console.log('done: ', response.data);
        
        self.state.profiles = response.data.body;
        self.state.loading = false;
        self.state.totalPresidencial = totalPresidencial;
        self.state.totalSenaduria = totalSenaduria;
        self.state.totalDiputacion = totalDiputacion;

      }).catch(function (error) {
        console.log(error);
        self.setState({
          loading: true
        })
      });

    }

    getMunicipality = async (prov) => {
      this.setState({
        loadingMunicipality: true
      })
      console.log(prov);
  
      /*
      const revProv = prov.ADM2_ES.split('Provincia ');
      if (revProv[1]){
        name = revProv[1];
      } else {
        name = revProv[0];
      }
      */
  
      let name = prov.ADM2_ES;
      console.log(name);
      
      switch (name) {
        case 'Provincia Sánchez Ramírez':
          name = "provincia sanchez ramirez"
          break;
        case 'Provincia San José de Ocoa':
          name = "Provincia San Jose de Ocoa"
          break;
        case 'Provincia Santiago Rodríguez':
          name = "Provincia Santiago Rodriguez"
          break;
        case 'Provincia Baoruco':
          name = "Provincia Baoruco"
          break;
        case 'Provincia Elías Piña':
          name = "Provincia Elias Pina"
          break;
        case 'Provincia Dajabón':
          name = "Provincia Dajabon"
          break;
        case 'Provincia María Trinidad Sánchez':
          name = "Provincia Maria Trinidad Sanchez"
          break;
        case 'Provincia Samaná':
          name = "Provincia Samana"
          break;
        case 'Provincia San Pedro de Macorís':
          name = "Provincia San Pedro de Macoris"
          break;
        case 'Provincia San Cristóbal':
          name = "Provincia San Cristobal"
          break;
        case 'Provincia Monseñor Nouel':
          name = "Provincia Monsenor Nouel"
          break;
      
        default:
          break;
      }
  
      name = name.toLowerCase();
      name = name.replace(/\s/g, "-");
      console.log(name);
  
      // GET CONGRESUAL
      // TODO: move to ipfs
      let search = `https://s3.amazonaws.com/map.aletheiadata.org/maps/provinces/${name}.json`;
      
      await fetch(search, {
        mode: 'cors'
      })
      .then(res => {
        if (!res.ok) {
            throw new Error("HTTP status " + res.status);
        }
        return res.json();
      })
      .then(data =>{
        
        console.log('done: ', data);
        this.setState({
          loadingMunicipality: false
        })
        
        this.props.dispatch(
          addDataToMap({
            datasets: [
              {
                info: {
                  label: 'Municipalities', id: 'municipalities'
                },
                data: processGeojson(data)
              }
            ],
            options: {
              keepExistingConfig: false,
              readOnly: true,
              mapControls: {
                toggle3d: { show: false },
                splitMap: { show: false },
                mapLegend: { show: false },
              }
            },
            config: municipalitiesConfig
          })
        )
        .then((e)=>{
          setTimeout(() => {
            this.setState({
              loadingMunicipality: false
            });  
          }, 1500);
        });
        
        
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loadingMunicipality: false
        })
      });

    }

    _getTotal = (searchTerm, type) =>{
      //console.log(searchTerm, type);
      //console.log(Prov_totals, type);
      const tot_prov = Prov_totals.find(prov => prov.PROVINCES == searchTerm.toUpperCase() && prov._CARGO == type); 
      //console.log(tot_prov);
      return tot_prov;
    }

    _toogleSlide = (e) => {
      //console.log(e);
      this.setState({
        seeMoreProfiles: e ? e : 0
      })
    }

    _button = ((text, type)=>{
      if (type == 'click'){
          return (
              <div className={'button-container'} key={`button_${text}`}>
                  <button className={'disabled'} onClick={()=>{ /* this.getMunicipality(this.state.currentSelection) */ }}>{text}</button>
              </div>
          )
      } 
    })

    render() {
      if (this.props.frozen && this.props.layerHoverProp){
        //console.log(this.props.layerHoverProp);
        const dataLayer = this.props.layerHoverProp.data[0].properties;
        // if province clicked
        if (
          this.state.currentSelection.ADM2_PCODE != dataLayer.ADM2_PCODE
        ){
          this.state.currentSelection = dataLayer,
          this.state.seeMoreProfiles = 0,
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
                <div style={{ height: '100%', width: '100%' }}>
                  <AwesomeSlider 
                  bullets={false}
                  mobileTouch={true}
                  buttons={false}
                  selected={this.state.seeMoreProfiles}
                  className={'slider-more-profile'}
                  style={{ backgroundColor: '#fff', height: '100%', width: '100%' }}>
                    <div>
                      <InfoPanel 
                        data={this.state.currentSelection} 
                        cabinet={this.getPresidencial()} 
                        profiles={this.state.profiles} 
                        totalPresidencial={this.state.totalPresidencial} 
                        totalSenaduria={this.state.totalSenaduria} 
                        totalDiputacion={this.state.totalDiputacion} 
                        _toogleSlide={(e)=>this._toogleSlide(e)} />
                    </div>
                    <div>
                      <InfoPanelProfile 
                        data={this.state.currentSelection} 
                        profiles={this.state.profiles} 
                        totalSenaduria={this.state.totalSenaduria} 
                        totalDiputacion={this.state.totalDiputacion} 
                        _toogleSlide={(e)=>this._toogleSlide(e)} />
                    </div>
                    <div>
                      <InfoPanelPresidencial 
                        totalPresidencial={this.state.totalPresidencial} 
                        presidencial={this.getPresidencial()} 
                        cabinet={this.getCabinet()} 
                        _toogleSlide={(e)=>this._toogleSlide(e)} />
                    </div>
                  </AwesomeSlider>
                  <div className={'info-button-container'}>
                    <Whisper
                        trigger="hover"
                        placement={'top'}
                        speaker={
                            <Tooltip>
                                { `próximamente` }
                            </Tooltip>
                        }
                    >
                        { this._button('Ver municipios', `click`) }
                    </Whisper>
                  </div>
                </div>
              }
              {
                this.state.loading &&
                <div style={{ padding: '2em' }}>
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

const mapStateToProps = state => state
const mapDispatchToProps = (dispatch, props) => ({
 dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
 )(CustomTooltipControl);
