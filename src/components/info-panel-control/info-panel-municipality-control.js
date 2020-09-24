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

const _members = ((data, total)=>{
    //console.log(img);
    let perc = parseInt((data.votos * 100) / total);
    //console.log(data);
    let img = getProfileImg(data ? data.nombre : null);

    return (
        <div key={`progress_bar_${data.nombre}`}>
            <Whisper
                trigger="hover"
                placement={'top'}
                speaker={
                <Tooltip>
                    { `Votos: ${new Intl.NumberFormat('es-ES').format(data.votos)}` }
                </Tooltip>
                }
            >
                <span>{ data.nombre }</span>
            </Whisper>
            <Progress.Line style={{ padding: '8px 0' }} percent={ perc } showInfo={true}></Progress.Line>
        </div>
    )
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

const InfoPanelMunicipality = ({
  bgColor = '#fff',
  fontColor = '#999',
  height = '100%',
  data,
  profiles,
  municipality_candidates,
  _toogleSlide
}) => {
    
    let candidates = [];
    let total_votes = 0;
    municipality_candidates[0].municipal.map((candidate)=>{
        if (candidate.id){
            total_votes += candidate.votos;
            candidates.push(candidate);
        }
    });

    municipality_candidates[0].municipal_vice.map((candidate)=>{
        if (candidate.id){
            total_votes += candidate.votos;
            candidates.push(candidate);
        }
    });

    let municipality_name = candidates[0].distrito_municipal;

    console.log(total_votes);

    /*
    cargo: "DIRECTOR(A)"
    cedula: 2147483647
    circ: 0
    distrito_municipal: "CAMBITA EL PUEBLECITO (DM)"
    dm: 315
    edad: 47
    hont: 0
    id: 279
    mun: 104
    municipio: "CAMBITA GARABITOS"
    nombre: "EDWARD ANTONIO GARABITO SANTIAGO"
    nombre_boleta: "EDWARD GARABITO "
    partido_del_candidato: "PARTIDO DE LA LIBERACION DOMINICANA"
    partido_encabeza: "PLD Y ALIADOS"
    posicion_boleta: 0
    sexo: "M"
    votos: 2400
    _created_at: "2020-07-11T12:55:08.000Z"
    _del: 0
    _edited_at: "2020-07-11T12:55:08.000Z"
    _source: "https://jce.gob.do/portaltransparencia"
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
                    { _bodyText(municipality_name, `La ${municipality_name} obtuvo un total de ${new Intl.NumberFormat('es-ES').format(total_votes)} votos.`) }
                </div>
                
                <div className={'info-bars-container'}>
                    {
                        candidates &&
                        <div className={'info-bars senadors'}>
                            <br></br><h3>Gabinete</h3>
                            {
                                candidates.map((member, i) => {
                                    console.log(member);
                                    if (member.id){
                                        return _members(member,total_votes);
                                    }
                                })
                            }
                        </div>
                    }
                </div>

            </div>
        </StyledInfoPanel>
    )
};

export default InfoPanelMunicipality;
