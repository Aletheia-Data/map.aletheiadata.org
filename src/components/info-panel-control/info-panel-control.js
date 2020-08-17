import React from 'react';
import styled from 'styled-components';
import {Icons} from 'kepler.gl/components';
import { Tooltip, Whisper } from 'rsuite';

import { getProfileImg } from '../../utils/profile-imgs';

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
  }

  .info-member-img img{
    width: 40px;
    height: 40px;
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

  .info-bars-totals div:last-child{
    text-align: center;
    width: 50%;
    font-size: 10px;
    background: #71a0a3;
    padding: 5px 10px;
    border-radius: 15px 0px;
    color: #000;
    font-weight: 800;
  }

  .rect-progress-bar-percent{
    margin: 0em 1rem !important;
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
    data = data._source;
    //console.log(data);
    let img = getProfileImg(data ? data.NOMBRE_COMPLETO : null);
    //console.log(img);
    if (type == 'more'){
        return (
            <Whisper
                trigger="hover"
                placement={'top'}
                speaker={
                <Tooltip>
                    VER MAS
                </Tooltip>
                }
            >
                <div className={'info-member-img'} key={`info_member_more`} onClick={()=>func(section == 'presidencial' ? 2 : 1 )}>
                    <img src={'/assets/img/more.svg'} style={{ width: '41px' }} alt="more"></img>
                </div>
            </Whisper>
        )
    } else if (type == 'items'){
        return (
            <Whisper
                trigger="hover"
                placement={'top'}
                speaker={
                <Tooltip>
                    { data.NOMBRE_COMPLETO }
                </Tooltip>
                }
            >
                <div className={'info-member-img'} key={`info_member_items_${data.NOMBRE_COMPLETO}`}>
                    <img src={img} alt={data.NOMBRE_COMPLETO}></img>    
                </div>
            </Whisper>
        )
    }
})

const _progressBar = ((data, type)=>{
    if (type == 'bar'){
        return (
            <div key={`progress_bar_${data.name}`}>
                <span>{ data.name }</span>
                <ProgressBar
                    width="250px"
                    height="10px"
                    rect
                    fontColor="gray"
                    percentage={ data.value }
                    rectPadding="1px"
                    rectBorderRadius="20px"
                    trackPathColor="#DAD7FE"
                    bgColor="#9B51E0"
                    trackBorderColor="transparent"
                    defColor={{
                        fair: '#b78778',
                        good: '#adbebf',
                        excellent: '#71a0a3',
                        poor: '#b3796a',
                    }}
                />
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
  totalValidVotes,
  totalIssuedVotes,
  totalRegisteredVotes,
  _toogleSlide
}) => {
    
    let perc = parseInt((totalValidVotes * 100) / totalRegisteredVotes);
    let bars = [
        {
            value: perc,
            name: 'Votos Validos',
        }
    ];

    //console.log(totalRegisteredVotes, totalValidVotes);
    //console.log(perc);
    return(
        <StyledInfoPanel
            className="info-panel"
            bgColor={bgColor}
            fontColor={fontColor}
            height={height}
        >
            <div className={'content-container'}>
                <div className={'info-container'}>
                    { _bodyText(data.ADM2_ES, `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus nisi aliquet malesuada ultricies.`) }
                </div>
                
                <div className={'info-member-container'}>
                    { _bodyText('Presidencia', `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus nisi aliquet malesuada ultricies.`) }
                    <div className={'info-member-imgs'}>
                        {
                            cabinet.map((member, i) => {
                                //console.log(i);
                                if(i < 2){
                                    return _members(member,'items',null,null);
                                } else if(i == 2){
                                    return _members(member,'more',_toogleSlide,'presidencial');
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                </div>
                
                <div className={'info-member-container'}>
                    { _bodyText('Congreso', `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus nisi aliquet malesuada ultricies.`) }
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
                        <div>
                            <Whisper
                                trigger="hover"
                                placement={'top'}
                                speaker={
                                <Tooltip>
                                    { `Emitidos: ${new Intl.NumberFormat('es-ES').format(totalIssuedVotes)}` }
                                </Tooltip>
                                }
                            >
                                <span>{ `${new Intl.NumberFormat('es-ES').format(totalIssuedVotes)} /` }</span>
                            </Whisper>
                            <Whisper
                                trigger="hover"
                                placement={'top'}
                                speaker={
                                <Tooltip>
                                    { `Registrados: ${new Intl.NumberFormat('es-ES').format(totalRegisteredVotes)}` }
                                </Tooltip>
                                }
                            >
                                <span>{ `${new Intl.NumberFormat('es-ES').format(totalRegisteredVotes)}` }</span>
                            </Whisper>
                        </div>
                    </div>
                    <div className={'info-bars'}>
                        {
                            bars.map((bar, i) => {
                                //console.log(i);
                                if(i < 3){
                                    return _progressBar(bar,'bar');
                                } else if(i == 3){
                                    return _progressBar(bar,'more');
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </StyledInfoPanel>
    )
};

export default InfoPanel;
