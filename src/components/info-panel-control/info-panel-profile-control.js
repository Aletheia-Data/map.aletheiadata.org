import React from 'react';
import styled from 'styled-components';
import {Icons} from 'kepler.gl/components';
import { Tooltip, Whisper } from 'rsuite';

import { getProfileImg } from '../../utils/profile-imgs';

import { Progress } from 'rsuite';

import ProgressBar from 'react-animated-progress-bar';

const StyledInfoPanel = styled.div`
  align-items: center;
  background-color: ${props => props.bgColor};
  color: ${props => props.fontColor};
  display: flex;
  height: ${props => props.height};
  justify-content: space-between;
  flex-direction: column;

  .content-container{
      height: 100%;
      padding: 2em 1.5em 5em;
      overflow: auto;
  }

  .info-container{
    font-weight: 400;
    color: #000;
  }

  .info-text-container, .info-bars-container{
    width: 100%;
  }

  .info-text-container p{
    font-size: 0.8rem;
    margin: 0.5rem 0;
    color: #999;
  }

  .info-member-container, .info-bars-container{
    display: flex;
    align-self: end;
    margin: 0;
    flex-direction: column;
    align-items: center;
  }

  .info-bars-container{
    margin: 20px 0;
  }

  .info-member-container h2, .info-bars-container h2{
    font-size: 1.2rem;
    color: #000;
  }

  .info-member-container .info-member-imgs{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-top: 15px;
  }

  .info-member-img{
    border-radius: 50%;
    overflow: hidden;
    width: 40px;
    height: 40px;
    background: antiquewhite;
    transition: background 0.3s ease;
    margin-right: -10px;
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
  }

  .info-member-img img{
    width: auto;
    height: 100%;
  }

  .info-member-img:last-child{
    margin-right: 0px;
    //margin-left: 30px;
  }

  .info-member-img.back:hover{
    background: #fff;
  }

  .info-bars{
      width: 100%;
  }

  .info-bars span{
    font-size: 0.7rem;
    position: relative;
    top: 5px;
  }

  .rect-progress-bar-percent{
    margin: 0em 1rem !important;
  }
  
  .rs-progress-line-bg{
    background-color: #71a0a3;
  }

  .progress_bar_dip{
    display: flex;
    justify-content: space-between;
  }

  .progress_bar_dip.SENADOR{
    flex-direction: column;
  }

  .progress_bar_dip.DIPUTADO{
    margin: 10px 0;
  }
  
`;

const _bodyText = ((title,desc,type,func)=>{
    if (type == 'intro'){
        return (
            <div className={'info-text-container'}>
                <div style={{ display: 'flex', alignItems: 'center'}}>
                    <div className={'info-member-img back'} key={`info_member_more`} onClick={()=>func(0)}>
                        <img src={'/assets/img/camera-back.svg'} style={{ width: '41px' }} alt="more"></img>
                    </div>
                    <h2 style={{marginLeft:20}}>{title}</h2>
                </div>
                <p>{desc}</p>
            </div>
        )
    } else {
        return (
            <div className={'info-text-container'}>
                <h2 style={{margin:0}}>{title}</h2>
                <p>{desc}</p>
            </div>
        )
    }
})

const _members = ((data, type, func)=>{
    data = data._source;
    //console.log(data);
    /**
    CARGO: "DIPUTADO"
    CIRCUNSCRIPCION: 0
    EDAD: 59
    FECHA_NACIMIENTO: "14/12/1960"
    NOMBRE_COMPLETO: "JUAN SUAZO MARTE"
    PARTIDO_CANDIDATO: "PLD"
    PARTIDO_CANDIDATURA: "PARTIDO DE LA LIBERACION DOMINICANA"
    PROVINCIA: "MONTE PLATA"
    SEXO: "M"
    SIGLAS: "PLD"
    VOTOS: "12,595"
    VOTOS_HONDT: "31,069"
     */
    let img = getProfileImg(data ? data.NOMBRE_COMPLETO : null);
    //console.log(img);
    if (type == 'more'){
        return (
            <Whisper
                trigger="hover"
                placement={'top'}
                key={`key_${type}`}
                speaker={
                <Tooltip>
                    VER MAS
                </Tooltip>
                }
            >
                <div style={{ display: 'none' }} className={'info-member-img'} key={`info_member_more`} onClick={()=>func(0)}>
                    <img src={'/assets/img/more.svg'} style={{ width: '41px' }} alt="more"></img>
                </div>
            </Whisper>
        )
    } else if (type == 'items'){
        return (
            <Whisper
                trigger="hover"
                placement={'top'}
                key={`key_${type}_${data.NOMBRE_COMPLETO}`}
                speaker={
                <Tooltip>
                    {data.NOMBRE_COMPLETO}
                </Tooltip>
                }
            >
                <div className={'info-member-img'} style={{ backgroundImage: `url(${img})` }} key={`info_member_items_${data.NOMBRE_COMPLETO}`}></div>
            </Whisper>
        )
    }
})

const _progressBar = ((data, total)=>{
    // order by CARGO
    const profile = data._source;
    
    let cleanString = profile.VOTOS.replace(',','')
    let perc = parseInt((parseInt(cleanString) * 100) / total._EMITIDOS);
    //console.log(cleanString, total._EMITIDOS);
    
    return (
        <div className={`progress_bar_dip ${profile.CARGO}`} key={`progress_bar_${profile.NOMBRE_COMPLETO}`}>
            <span>{ profile.NOMBRE_COMPLETO }</span>
            {
                profile.CARGO == "SENADOR" &&
                <Whisper
                    trigger="hover"
                    placement={'top'}
                    key={`key_progress_${data.NOMBRE_COMPLETO}`}
                    speaker={
                    <Tooltip>
                        { `Validos: ${new Intl.NumberFormat('es-ES').format(cleanString)}` }
                    </Tooltip>
                    }
                >
                    <Progress.Line className={'senator'} style={{ padding: '8px 0' }} percent={ perc } showInfo={true}></Progress.Line>
                </Whisper>
            }
            {
                profile.CARGO == "DIPUTADO" &&
                <Whisper
                    trigger="hover"
                    placement={'top'}
                    key={`key_progress_${data.NOMBRE_COMPLETO}`}
                    speaker={
                    <Tooltip>
                        { `Validos: ${new Intl.NumberFormat('es-ES').format(cleanString)}` }
                    </Tooltip>
                    }
                >
                    <span className={'deputy'} style={{ width: '60px', textAlign: 'right', fontWeight: 'bold', color: '#297479' }}>{new Intl.NumberFormat('es-ES').format(cleanString)}</span>
                </Whisper>
            }
        </div>
    )
})

const InfoPanelProfile = ({
  bgColor = '#fff',
  fontColor = '#999',
  height = '100%',
  profiles,
  totalSenaduria,
  totalDiputacion,
  _toogleSlide
}) => {
    //console.log(totalSenaduria);

    let SEARCH_TERM = 'SENADOR';
    const senadors = profiles.filter(function (str) { if (str._source && str._source.CARGO == SEARCH_TERM ) return str });
    
    SEARCH_TERM = 'DIPUTADO';
    let deputies = profiles.filter(function (str) { if (str._source && str._source.CARGO == SEARCH_TERM ) return str });
    deputies = deputies.sort(function(a, b) {
        //console.log(a);
        return parseInt(b._source.VOTOS) - parseInt(a._source.VOTOS);
    });
    
    return(
        <StyledInfoPanel
            className="info-panel"
            bgColor={bgColor}
            fontColor={fontColor}
            height={height}
        >
            <div className={'content-container'}>
                
                <div className={'info-member-container'}>
                    { _bodyText('Congreso', `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus nisi aliquet malesuada ultricies.`,'intro',_toogleSlide) }
                    <div className={'info-member-imgs'}>
                        {
                            profiles.map((member, i) => {
                                //console.log(i);
                                if(i < 3){
                                    return _members(member,'items',null);
                                } else if(i == 3){
                                    return _members(member,'more',_toogleSlide);
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                </div>

                <div className={'info-bars-container'}>
                    {
                        senadors &&
                        <div className={'info-bars senadors'}>
                            <br></br><h3>Senadores</h3>
                            {
                                senadors.map((profile, i) => {
                                    //console.log(i);
                                    return _progressBar(profile, totalSenaduria);
                                })
                            }
                        </div>
                    }
                    {
                        deputies &&
                        <div className={'info-bars deputies'}>
                            <br></br><h3>Diputados</h3>
                            {
                                deputies.map((profile, i) => {
                                    //console.log(i);
                                    return _progressBar(profile, totalDiputacion);
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        </StyledInfoPanel>
    )
};

export default InfoPanelProfile;
