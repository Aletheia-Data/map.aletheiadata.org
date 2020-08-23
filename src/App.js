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

import React, {Component} from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled, {ThemeProvider} from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import {theme} from 'kepler.gl/styles';
import Banner from './components/banner';
import Announcement, {FormLink} from './components/announcement';
import {replaceLoadDataModal} from './factories/load-data-modal';
import {replaceMapControl} from './factories/map-control';
import {replacePanelHeader} from './factories/panel-header';
import {AUTH_TOKENS} from './constants/default-settings';
import {
  loadRemoteMap,
  loadSampleConfigurations,
  onExportFileSuccess,
  onLoadCloudMapSuccess
} from './actions';

import {loadCloudMap} from 'kepler.gl/actions';
import {CLOUD_PROVIDERS} from './cloud-providers';

const KeplerGl = require('kepler.gl/components').injectComponents([
  replaceLoadDataModal(),
  replaceMapControl(),
  replacePanelHeader()
]);

// Sample data
/* eslint-disable no-unused-vars */
//import sampleTripData, {testCsvData, sampleTripDataConfig} from './data/sample-trip-data';
//import sampleGeojson from './data/sample-small-geojson';
//import sampleGeojsonPoints from './data/sample-geojson-points';
//import sampleGeojsonConfig from './data/sample-geojson-config';
//
// config
import provinciaConfig from './data/AdminLevel4-config';
import municipalitiesConfig from './data/municipalities-config';
import {addDataToMap, addNotification, onMapClick} from 'kepler.gl/actions';
import {processCsvData, processGeojson} from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

const BannerHeight = 48;
const BannerKey = `banner-${FormLink}`;
const keplerGlGetState = state => state.demo.keplerGl;

const GlobalStyle = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.labelColor};
  }

  .map-control{
    display: none
  }

  .settings-panel{
    border-radius: 10px;
    z-index: 1;
    background: #fff;
    width: 100px;
    position: absolute;
    bottom: 0;
    padding: 10px;
    margin: 15px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 8px 20px, rgba(0, 0, 0, 0.1) 0px 2px 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .settings-panel-logo{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
  }

  .settings-panel-logo img{
    width: 60px;
    z-index: 1;
  }

  .settings-panel-content{}
  
  .settings-panel-footer{
    align-items: center;
    justify-content: center;
    flex-direction: column;
    display: flex;
    margin-bottom: 15px;
  }

  .settings-panel-footer img{
    width: 30px;
    height: auto;
    opacity: 0.7;
    cursor: pointer;
    transition: opacity 0.3s ease;
  }

  .settings-panel-footer img:hover{
    opacity: 1;
  }

  .settings-scale, .settings-home{
    border-radius: 10px;
    z-index: 1;
    background: #fff;
    position: absolute;
    bottom: 0;
    padding: 10px;
    margin: 15px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 8px 20px, rgba(0, 0, 0, 0.1) 0px 2px 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-direction: column;
    left: 120px;
    height: auto;
    width: 200px;
    text-align: center;
  }

  .settings-scale .settings-panel-scale-container{
    display: flex;
    border-radius: 6px;
    overflow: hidden;
  }

  .settings-scale span{
    font-size: 10px;
    color: #277479;
    font-weight: bold;
    padding-bottom: 5px;
  }

  .settings-scale .settings-panel-scale{
    width: 15%;
    height: 20px;
  }

  .settings-panel-scale-container span{
    padding: 0px 5px;
    font-size: 23px;
    line-height: 19px;
  }

  .settings-panel-scale-container span:first-child{
    font-size: 38px;
    padding: 0 4px;
  }

  .settings-home{
    width: 60px;
    height: 62px;
    left: 340px;
  }

  .settings-home img{
    height: 100%;
    width: 40px;
  }

  .loader {
    width: 250px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
    font-family: helvetica, arial, sans-serif;
    text-transform: uppercase;
    font-weight: 900;
    color: #397f85;
    letter-spacing: 0.2em;
  }
  .loader::before, .loader::after {
    content: "";
    display: block;
    width: 15px;
    height: 15px;
    background: #397f85;
    position: absolute;
    -webkit-animation: load .7s infinite alternate ease-in-out;
            animation: load .7s infinite alternate ease-in-out;
  }
  .loader::before {
    top: 0;
  }
  .loader::after {
    bottom: 0;
  }
  
  @-webkit-keyframes load {
    0% {
      left: 0;
      height: 30px;
      width: 15px;
    }
    50% {
      height: 8px;
      width: 40px;
    }
    100% {
      left: 235px;
      height: 30px;
      width: 15px;
    }
  }
  
  @keyframes load {
    0% {
      left: 0;
      height: 30px;
      width: 15px;
    }
    50% {
      height: 8px;
      width: 40px;
    }
    100% {
      left: 235px;
      height: 30px;
      width: 15px;
    }
  }
  

`;

class App extends Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentDidMount() {
    // if we pass an id as part of the url
    // we ry to fetch along map configurations
    const {params: {id, provider} = {}, location: {query = {}} = {}} = this.props;

    const cloudProvider = CLOUD_PROVIDERS.find(c => c.name === provider);
    if (cloudProvider) {
      this.props.dispatch(
        loadCloudMap({
          loadParams: query,
          provider: cloudProvider,
          onSuccess: onLoadCloudMapSuccess
        })
      );
      return;
    }

    // Load sample using its id
    if (id) {
      this.props.dispatch(loadSampleConfigurations(id));
    }

    // Load map using a custom
    if (query.mapUrl) {
      // TODO?: validate map url
      this.props.dispatch(loadRemoteMap({dataUrl: query.mapUrl}));
    }

    // delay zs to show the banner
    if (!window.localStorage.getItem(BannerKey)) {
      //window.setTimeout(this._showBanner, 3000);
    }
    // load sample data
    this._loadSampleData();

    // Notifications
    // this._loadMockNotifications();
  }

  _showBanner = () => {
    // disable banner
    this.setState({showBanner: true});
  };

  _hideBanner = () => {
    this.setState({showBanner: false});
  };

  _disableBanner = () => {
    this._hideBanner();
    window.localStorage.setItem(BannerKey, 'true');
  };

  _loadMockNotifications = () => {
    const notifications = [
      [{message: 'Welcome to Kepler.gl'}, 3000],
      [{message: 'Something is wrong', type: 'error'}, 1000],
      [{message: 'I am getting better', type: 'warning'}, 1000],
      [{message: 'Everything is fine', type: 'success'}, 1000]
    ];

    this._addNotifications(notifications);
  };

  _addNotifications(notifications) {
    if (notifications && notifications.length) {
      const [notification, timeout] = notifications[0];

      window.setTimeout(() => {
        this.props.dispatch(addNotification(notification));
        this._addNotifications(notifications.slice(1));
      }, timeout);
    }
  }

  _loadSampleData() {
    //this._loadPointData();
    //this._loadGeojsonData();
    this._loadDRData();
    //this._loadTripGeoJson();
    // this._loadIconData();
    //this._loadH3HexagonData();
    // this._loadS2Data();
    // this._loadScenegraphLayer();
  }

  /*
  _loadPointData() {
    this.props.dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: 'Sample Taxi Trips in New York City',
            id: 'test_trip_data'
          },
          data: sampleTripData
        },
        options: {
          centerMap: true,
          readOnly: false
        },
        config: sampleTripDataConfig
      })
    );
  }
  */

  /*
  _loadScenegraphLayer() {
    this.props.dispatch(
      addDataToMap({
        datasets: {
          info: {
            label: 'Sample Scenegraph Ducks',
            id: 'test_trip_data'
          },
          data: processCsvData(testCsvData)
        },
        config: {
          version: 'v1',
          config: {
            visState: {
              layers: [
                {
                  type: '3D',
                  config: {
                    dataId: 'test_trip_data',
                    columns: {
                      lat: 'gps_data.lat',
                      lng: 'gps_data.lng'
                    },
                    isVisible: true
                  }
                }
              ]
            }
          }
        }
      })
    );
  }
  */

  /*
  _loadIconData() {
    // load icon data and config and process csv file
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Icon Data',
              id: 'test_icon_data'
            },
            data: processCsvData(sampleIconCsv)
          }
        ]
      })
    );
  }
  */


  /*
  _loadTripGeoJson() {
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {label: 'Trip animation'},
            data: processGeojson(sampleAnimateTrip)
          }
        ]
      })
    );
  }
  */

  /*
  _loadGeojsonData() {
    // load geojson
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {label: 'Bart Stops Geo', id: 'bart-stops-geo'},
            data: processGeojson(sampleGeojsonPoints)
          },
          {
            info: {label: 'SF Zip Geo', id: 'sf-zip-geo'},
            data: processGeojson(sampleGeojson)
          }
        ],
        options: {
          keepExistingConfig: true
        },
        config: sampleGeojsonConfig
      })
    );
  }
  */

  _loadDRData() {
    // load geojson
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {label: 'Provincias', id: 'provinces'},
            data: processGeojson(Provincies)
          }
          /*{
            info: {label: 'Area 1', id: 'area-1'},
            data: processGeojson(Cities1)
          },
          {
            info: {label: 'Area 2', id: 'area-2'},
            data: processGeojson(Cities2)
          },
          {
            info: {label: 'Area 3', id: 'area-3'},
            data: processGeojson(Cities3)
          },
          {
            info: {label: 'Area 4', id: 'area-4'},
            data: processGeojson(Cities4)
          },
          {
            info: {label: 'Area 5', id: 'area-5'},
            data: processGeojson(Cities5)
          },
          {
            info: {label: 'Area 6', id: 'area-6'},
            data: processGeojson(Cities6)
          },
          {
            info: {label: 'Area 7', id: 'area-7'},
            data: processGeojson(Cities7)
          }*/
        ],
        options: {
          keepExistingConfig: false
        },
        config: AdminLevel4Config
      })
    );
  }

  async _municipalities(prov) {
    console.log(prov);
    /*
    let search = `https://s3.amazonaws.com/map.aletheiadata.org/maps/provinces/${prov}.json`;
    await fetch(search, {
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Access-Control-Allow-Origin':'*',
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json() )
    .then(async data =>{
      console.log(data);
      // load geojson
      this.props.dispatch(
        addDataToMap({
          datasets: [
            {
              info: {label: 'Municipalities', id: 'municipalities'},
              data: await processGeojson(data)
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
            isLoading: false
          });  
        }, 1500);

        setTimeout(() => {
          this.setState({
            stepsEnabled: true
          });  
        }, 2000);
      });

    });
    */
  }

  _toggleCloudModal = () => {
    // TODO: this lives only in the demo hence we use the state for now
    // REFCOTOR using redux
    this.setState({
      cloudModalOpen: !this.state.cloudModalOpen
    });
  };

  _getMapboxRef = (mapbox, index) => {
    
    if (!mapbox) {
      // The ref has been unset.
      // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
      // console.log(`Map ${index} has closed`);
      mapbox = document.getElementById('map');
      console.log(mapbox);
      const map = mapbox.getMap();
      map.on('zoomend', e => {
        console.log(`Map ${index} zoom level: ${e.target.style.z}`);
      });
    } else {
      // We expect an InteractiveMap created by KeplerGl's MapContainer.
      // https://uber.github.io/react-map-gl/#/Documentation/api-reference/interactive-map
      const map = mapbox.getMap();
      map.on('zoomend', e => {
        // console.log(`Map ${index} zoom level: ${e.target.style.z}`);
      });
    }
  };

  render() {
    //this._getMapboxRef();
    
    const customTheme = {
      sidePanelBg: '#fff',
      titleTextColor: '#000000',
      sidePanelHeaderBg: '#f7f7F7',
      subtextColorActive: '#2473bd'
    };

    const {
      stepsEnabled,
      steps,
      initialStep,
      hintsEnabled,
      hints,
      showSidepanel
    } = this.state;

    const mapStyles = [
      {
        id: 'my_dark_map',
        label: 'Dark Streets 9',
        url: 'mapbox://styles/mapbox/dark-v9',
        //icon: `${apiHost}/styles/v1/mapbox/dark-v9/static/-122.3391,37.7922,9.19,0,0/400x300?access_token=${accessToken}&logo=false&attribution=false`,
        layerGroups: [
          {
            slug: 'label',
            filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
            defaultVisibility: true
          },
          {
            // adding this will keep the 3d building option
            slug: '3d building',
            filter: () => false,
            defaultVisibility: false
          }
        ]
      }
    ];
    //console.log(this.props);
    if (!this.state.isLoading){
      setTimeout(() => {
        this.setState({
          destroyLoader: true
        })
      }, 1500);
    }

    let colorsScale = [
      "#C22E00",
      "#D0532B",
      "#DD7755",
      "#EB9C80",
      "#F8C0AA",
      "#BAE1E2",
      "#8CCED1",
      "#5DBABF",
      "#2FA7AE",
      "#00939C"
    ]

    //this.props.layerHoverProp.data[0].properties;
    let distritoNational = {
      data: [
        {
          properties: {
            ADM0_EN: "Dominican Republic",
            ADM0_ES: "República Dominicana",
            ADM0_PCODE: "DO",
            ADM1_ES: "Región Cibao Sur",
            ADM1_PCODE: "DO04",
            ADM1_REF: "Region Cibao Sur",
            ADM2_ES: "Provincia Monseñor Nouel",
            ADM2_PCODE: "DO0402",
            ADM2_REF: "Provincia Monsenor Nouel",
            FID: 13,
            Name: "Dominican Republic",
            TOT_VOTANTES: 151796,
            altitudeMode: "clampToGround",
            begin: null,
            description: "Provincia Monsenor Nouel",
            drawOrder: null,
            end: null,
            extrude: 0,
            icon: null,
            index: 12,
            snippet: "",
            tessellate: -1,
            timestamp: null,
            visibility: -1,
          }
        }
      ]
    }

    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle
          // this is to apply the same modal style as kepler.gl core
          // because styled-components doesn't always return a node
          // https://github.com/styled-components/styled-components/issues/617
          ref={node => {
            node ? (this.root = node) : null;
          }}
        >
          <Banner
            show={this.state.showBanner}
            height={BannerHeight}
            bgColor="#2E7CF6"
            onClose={this._hideBanner}
          >
            <Announcement onDisable={this._disableBanner} />
          </Banner>

          <div className="map-prov" style={{ width: '100%', height: '100%', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <img className="map-prov-img" style={{ width: 137, position: 'relative', left: '-87px', top: '-86px'}} src={'/assets/img/mapPreview.png'}></img>
          </div>
          <div className="layer-prov" style={{ backgroundImage: `url('/assets/img/previewSide.png')`, backgroundSize: 'cover', zIndex: 0, height: '80%', position: 'absolute', right: '10px', top: '10px', width: '290px' }}></div>
          {
            showSidepanel &&
            <CustomTooltipControl layerHoverProp={distritoNational} frozen={showSidepanel}/> 
          }
          
          <Steps
            enabled={stepsEnabled}
            steps={steps}
            initialStep={initialStep}
            onComplete={(e)=>{
              console.log(e);
              this.setState({
                showSidepanel: false,
                hintsEnabled: true
              })
            }}
            onExit={(e)=>{
              console.log(e);
              this.setState({
                showSidepanel: false,
                hintsEnabled: true
              })
            }}
          />

          <div className={'settings-panel'}>
            <div className={'settings-panel-logo'}>
              <a href={'https://aletheiadata.org'} target="_blank">
                <img src={'/assets/img/aletheiadata.svg'} /> 
              </a>
            </div>
            <div className={'settings-panel-content'}></div>
            <div className={'settings-panel-footer'}>
              <Divider style={{width: '100%'}} />
              <img src={'/assets/img/mail.svg'} onClick={this._toggleSettings} /> 
            </div>
             <Modal 
              show={this.state.showSettings} 
              size={'xs'}
              style={{ textAlign: 'center' }} 
              onHide={this._toggleSettings}>
              <Modal.Header>
                <Modal.Title><img style={{ marginTop: '10px' }} src={'/assets/img/aletheiadata.svg'} /></Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ height: '100%', padding: 0 }} >
                {/* <b>Contact Info:</b> <a href='mailto:aletheiadata@gmail.com'>aletheiadata@gmail.com</a> */}
                <ContactForm />
              </Modal.Body>
              <Modal.Footer>
                <span>v0.0.2</span>
              </Modal.Footer>
            </Modal>
          </div>
          <div className={'settings-scale'}>
            <span>Densidad de Votos Emitidos</span>
            <div className={'settings-panel-scale-container'}>
              <span>-</span>
              {
                colorsScale.map(color => {
                  return (
                    <div key={`color_${color}`} style={{ backgroundColor: color }} className={'settings-panel-scale'}></div>
                  )
                })
              }
              <span>+</span>
            </div>
          </div>
          <div className={'settings-home'}>
            <img src={'/assets/img/magnification.svg'} style={{ cursor: 'pointer' }} onClick={()=>{ /* window.location.href = '/' */ this._loadSampleData() }} />   
          </div>
          <div style={{
            transition: 'opacity 1s ease-in-out',
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            zIndex: 9999,
            backgroundColor: '#fff',
            display: this.state.destroyLoader ? 'none' : 'flex',
            opacity: this.state.isLoading ? 1 : 0,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className="loader">Loading...</div>
          </div>
          <div
              style={{
                transition: 'margin 1s, height 1s',
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0
              }}
            >
              <AutoSizer>
                {({height, width}) => {
                  return(
                    <KeplerGl
                      mapboxApiAccessToken={AUTH_TOKENS.MAPBOX_TOKEN}
                      id="map"
                      /*
                      * Specify path to keplerGl state, because it is not mount at the root
                      */
                      //onViewStateChange={(e) => console.log(e) }
                      mapStyles={mapStyles}
                      theme={customTheme}
                      getState={keplerGlGetState}
                      width={width}
                      height={height}
                      cloudProviders={CLOUD_PROVIDERS}
                      onExportToCloudSuccess={onExportFileSuccess}
                      onLoadCloudMapSuccess={onLoadCloudMapSuccess}
                    />
                  )
                }}
              </AutoSizer>
            </div>
        </GlobalStyle>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
