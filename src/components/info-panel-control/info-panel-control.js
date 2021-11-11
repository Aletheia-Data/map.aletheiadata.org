import React from 'react';
import styled from 'styled-components';
import {Icons} from 'kepler.gl/components';
import { Tooltip, Whisper } from 'rsuite';

import { getProfileImg } from '../../utils/profile-imgs';

import { Progress } from 'rsuite';

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
      padding: 2em 1.5em 3.5em;
      overflow: auto;
  }

  .info-container{
    font-weight: 400;
    color: #000;
  }

  .info-text-container, .info-bars-container, .info-bars-totals{
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
    margin: 25px 0;
    flex-direction: column;
    align-items: center;
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
    transition: background 0.3s ease;
  }

  .info-member-img:last-child:hover{
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

  .info-bars-totals{
    display: flex;
    align-items: center;      
    justify-content: space-between;
  }

  .info-bars-totals .info-text-container{
    width: 50%;
  }

  .progress_bar_outter{
      margin-top: 10px;
  }

  .progress_bar_item{
    display: flex;
    justify-content: space-between;
    padding-right: 15px;
  }

  .progress_bar_item div:last-child{
    width: 50%;
    text-align: right;
  }

  .progress_bar_item div:last-child span{
    
  }

  .rect-progress-bar-percent{
    margin: 0em 1rem !important;
  }

  .rs-progress-line-bg{
    background-color: #71a0a3;
  }

  .progress_bar_inner{
      margin-left 15px;
  }

  .progress_bar_inner .rs-progress-line-bg{
    background-color: #de7755;
  }
`;

const _bodyText = ((title,desc)=>{
    return (
        <div className={'info-text-container'}>
            <h2 style={{margin:0}}>{title}</h2>
            {
                desc &&
                <p>{desc}</p>
            }
        </div>
    )
})

const _members = ((data, type, func, section)=>{
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
                <div className={'info-member-img'} key={`info_member_more`} onClick={()=>func(section == 'presidencial' ? 2 : 1 )}>
                    <img src={'/assets/img/camera-back.svg'} style={{ width: '41px', transform: 'rotate(-180deg)' }} alt="more"></img>
                </div>
            </Whisper>
        )
    } else if (type == 'items'){
        //data = data._source;
        let img = getProfileImg(data ? data.NOMBRE_COMPLETO : null);

        return (
            <Whisper
                trigger="hover"
                placement={'top'}
                key={`key_${type}_${data.NOMBRE_COMPLETO}`}
                speaker={
                <Tooltip>
                    { data.NOMBRE_COMPLETO }
                </Tooltip>
                }
            >
                <div className={'info-member-img'} style={{ backgroundImage: `url(${img})` }} key={`info_member_items_${data.NOMBRE_COMPLETO}`}></div>
            </Whisper>
        )
    }
})

const _progressBar = ((data, type)=>{
    if (type == 'bar'){
        return (
            <div key={`progress_bar_${data.name}`} className={'progress_bar_outter'}>
                <div className={'progress_bar_item'}>
                    <span>{ data.name }</span>
                    <div>
                        <Whisper
                            trigger="hover"
                            placement={'top'}
                            speaker={
                            <Tooltip>
                                { `Emitidos: ${new Intl.NumberFormat('es-ES').format(data.total)}` }
                            </Tooltip>
                            }
                        >
                            <span>{ `${new Intl.NumberFormat('es-ES').format(data.total)} / ` }</span>
                        </Whisper>
                        <Whisper
                            trigger="hover"
                            placement={'top'}
                            speaker={
                            <Tooltip>
                                { `Inscritos: ${new Intl.NumberFormat('es-ES').format(data.inscritos)}` }
                            </Tooltip>
                            }
                        >
                            <span>{ `${new Intl.NumberFormat('es-ES').format(data.inscritos)}` }</span>
                        </Whisper>
                    </div>
                </div>
                <Progress.Line style={{ padding: '8px 0' }} percent={data.value} showInfo={true}></Progress.Line>
                {
                    data.sub.map(sub_data => {
                        return(
                        <div className={'progress_bar_inner'}>
                            <Whisper
                                trigger="hover"
                                placement={'top'}
                                speaker={
                                    <Tooltip>
                                        { `${new Intl.NumberFormat('es-ES').format(sub_data.total)}` }
                                    </Tooltip>
                                }
                            >
                                <span>{ sub_data.name }</span>
                            </Whisper>
                            <Progress.Line style={{ padding: '8px 0' }} percent={sub_data.value} showInfo={true}></Progress.Line>
                        </div>
                        )    
                    })
                }
            </div>
        )
    } 
})

const InfoPanel = ({
  bgColor = '#fff',
  fontColor = '#999',
  height = '100%',
  data,
  profiles,
  cabinet,
  totalPresidencial,
  totalSenaduria,
  totalDiputacion,
  _toogleSlide
}) => {
    
    let presidencial = parseInt((totalPresidencial._EMITIDOS * 100) / totalPresidencial._INSCRITOS);
    let senaduria = parseInt((totalSenaduria._EMITIDOS * 100) / totalSenaduria._INSCRITOS);
    let diputacion = parseInt((totalDiputacion._EMITIDOS * 100) / totalDiputacion._INSCRITOS);

    /*
    PROVINCES: "MONTE PLATA"
    _ANULADOS: 162
    _CARGO: "DIPUTACION"
    _EMITIDOS: 87840
    _INSCRITOS: 133909
    _NO_BOL_JME: 1560
    _NULOS: 3177
    _OBS: 0
    _VALIDOS: 84663
    */
    let bars = [
        {
            value: presidencial,
            total: totalPresidencial._EMITIDOS,
            inscritos: totalPresidencial._INSCRITOS,
            name: 'Voto Presidencial',
            sub: [
                {
                    value: parseInt((totalPresidencial._EMITIDOS * 100) / totalPresidencial._INSCRITOS),
                    total: totalPresidencial._EMITIDOS,
                    name: 'Votos Emitidos',
                },
                {
                    value: parseInt((totalPresidencial._VALIDOS * 100) / totalPresidencial._EMITIDOS),
                    total: totalPresidencial._VALIDOS,
                    name: 'Votos Validos',
                },
                {
                    value: parseInt((totalPresidencial._ANULADOS * 100) / totalPresidencial._EMITIDOS),
                    total: totalPresidencial._ANULADOS,
                    name: 'Votos Anulados',
                },
                {
                    value: parseInt((totalPresidencial._NULOS * 100) / totalPresidencial._EMITIDOS),
                    total: totalPresidencial._NULOS,
                    name: 'Votos Nulos',
                },
                {
                    value: parseInt((totalPresidencial._OBS * 100) / totalPresidencial._EMITIDOS),
                    total: totalPresidencial._OBS,
                    name: 'Votos Observados',
                }
            ]
        },
        {
            value: senaduria,
            total: totalSenaduria._EMITIDOS,
            inscritos: totalSenaduria._INSCRITOS,
            name: 'Voto Senaduria',
            sub: [
                {
                    value: parseInt((totalSenaduria._EMITIDOS * 100) / totalSenaduria._INSCRITOS),
                    total: totalSenaduria._EMITIDOS,
                    name: 'Votos Emitidos',
                },
                {
                    value: parseInt((totalSenaduria._VALIDOS * 100) / totalSenaduria._EMITIDOS),
                    total: totalSenaduria._VALIDOS,
                    name: 'Votos Validos',
                },
                {
                    value: parseInt((totalSenaduria._ANULADOS * 100) / totalSenaduria._EMITIDOS),
                    total: totalSenaduria._ANULADOS,
                    name: 'Votos Anulados',
                },
                {
                    value: parseInt((totalSenaduria._NULOS * 100) / totalSenaduria._EMITIDOS),
                    total: totalSenaduria._NULOS,
                    name: 'Votos Nulos',
                },
                {
                    value: parseInt((totalSenaduria._OBS * 100) / totalSenaduria._EMITIDOS),
                    total: totalSenaduria._OBS,
                    name: 'Votos Observados',
                }
            ]
        },
        {
            value: diputacion,
            total: totalDiputacion._EMITIDOS,
            inscritos: totalDiputacion._INSCRITOS,
            name: 'Voto Diputación',
            sub: [
                {
                    value: parseInt((totalDiputacion._EMITIDOS * 100) / totalDiputacion._INSCRITOS),
                    total: totalDiputacion._EMITIDOS,
                    name: 'Votos Emitidos',
                },
                {
                    value: parseInt((totalDiputacion._VALIDOS * 100) / totalDiputacion._EMITIDOS),
                    total: totalDiputacion._VALIDOS,
                    name: 'Votos Validos',
                },
                {
                    value: parseInt((totalDiputacion._ANULADOS * 100) / totalDiputacion._EMITIDOS),
                    total: totalDiputacion._ANULADOS,
                    name: 'Votos Anulados',
                },
                {
                    value: parseInt((totalDiputacion._NULOS * 100) / totalDiputacion._EMITIDOS),
                    total: totalDiputacion._NULOS,
                    name: 'Votos Nulos',
                },
                {
                    value: parseInt((totalDiputacion._OBS * 100) / totalDiputacion._EMITIDOS),
                    total: totalDiputacion._OBS,
                    name: 'Votos Observados',
                }
            ]
        }
    ];

    //console.log(totalRegisteredVotes, totalValidVotes);
    //console.log(data);
    /* 
    ADM0_EN: "Dominican Republic"
    ADM0_ES: "República Dominicana"
    ADM0_PCODE: "DO"
    ADM1_ES: "Región Higuamo"
    ADM1_PCODE: "DO07"
    ADM1_REF: "RegionHiguamo"
    ADM2_ES: "Provincia Monte Plata"
    ADM2_PCODE: "DO0702"
    ADM2_REF: "Provincia Monte Plata"
    FID: 22
    Name: "Dominican Republic"
    TOT_VOTANTES: 138524
    altitudeMode: "clampToGround"
    begin: null
    description: "Provincia Monte Plata"
    drawOrder: null
    end: null
    extrude: 0
    icon: null
    index: 21
    snippet: ""
    tessellate: -1
    timestamp: null
    visibility: -1
    */
    return(
        <StyledInfoPanel
            className="info-panel"
            bgColor={bgColor}
            fontColor={fontColor}
            height={height}
        >
            <div className={'content-container'}>
                <div className={'info-container'}>
                    { _bodyText(data.ADM2_ES, `La ${data.ADM2_ES} obtuvo un total de ${new Intl.NumberFormat('es-ES').format(totalPresidencial._INSCRITOS)} inscritos.`) }
                </div>
                
                <div className={'info-member-container'}>
                    { _bodyText('Presidencia', `La Presidencia obtuvo un total de ${new Intl.NumberFormat('es-ES').format(totalPresidencial._VALIDOS)} votos validos en la ${data.ADM2_ES}.`) }
                    <div className={'info-member-imgs'}>
                        {
                            cabinet.map((member, i) => {
                                //console.log(i);
                                if(i < 2){
                                    return _members(member,'items',null,null);
                                } else {
                                    return null
                                }
                            })
                        }
                        { _members(null,'more',_toogleSlide,'presidencial') }
                    </div>
                </div>
                
                <div className={'info-member-container'}>
                    { _bodyText('Congreso', `El Congreso obtuvo un total de ${new Intl.NumberFormat('es-ES').format(totalSenaduria._VALIDOS)} votos validos en la ${data.ADM2_ES}.`) }
                    <div className={'info-member-imgs'}>
                        {
                            profiles.map((member, i) => {
                                //console.log(i);
                                if(i < 3){
                                    return _members(member,'items',null,null);
                                } else if(i == 3){
                                    return _members(member,'more',_toogleSlide,'congreso');
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                </div>

                <div className={'info-bars-container'}>
                    <div className={'info-bars-totals'}>
                        { _bodyText('Estadisticas', ``) }
                    </div>
                    <div className={'info-bars'}>
                        {
                            bars.map((bar, i) => {
                                //console.log(i);
                                return _progressBar(bar,'bar');
                            })
                        }
                    </div>
                </div>
            </div>
        </StyledInfoPanel>
    )
};

export default InfoPanel;
