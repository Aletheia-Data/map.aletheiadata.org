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
  }

  .info-member-img img{
    width: 40px;
    height: 40px;
  }

  .info-member-img:last-child{
    margin-right: 0px;
    margin-left: 30px;
  }

  .info-member-img.back{
    cursor: pointer;
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
    let img = getProfileImg(data ? data.NOMBRE_COMPLETO : null);
    //console.log(img);
    if (type == 'more'){
        return (
            <Whisper
                trigger="hover"
                placement={'top'}
                speaker={
                <Tooltip>
                    VER MAS ...
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
                speaker={
                <Tooltip>
                    {data.NOMBRE_COMPLETO}
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

const _progressBar = ((data)=>{
    // order by CARGO
    //console.log(data._source);
    const profile = data._source;

    return (
        <div key={`progress_bar_${profile.NOMBRE_COMPLETO}`}>
            <span>{ profile.NOMBRE_COMPLETO }</span>
            <ProgressBar
                width="250px"
                height="10px"
                rect
                fontColor="gray"
                percentage={ parseInt(profile.VOTOS) }
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
})

const InfoPanelPresidencial = ({
  bgColor = '#fff',
  fontColor = '#999',
  height = '100%',
  profiles,
  _toogleSlide
}) => {
    //console.log(data);

    let bars = [
        {
            name: 'Total Votos',
            value: 80,
        },
        {
            name: 'Total Astencion',
            value: 50,
        }
    ]

    let SEARCH_TERM = 'SENADOR';
    const senadors = profiles.filter(function (str) { if (str._source && str._source.CARGO == SEARCH_TERM ) return str });
    
    SEARCH_TERM = 'DIPUTADO';
    const deputies = profiles.filter(function (str) { if (str._source && str._source.CARGO == SEARCH_TERM ) return str });
    
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
                                    return _progressBar(profile);
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
                                    return _progressBar(profile);
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        </StyledInfoPanel>
    )
};

export default InfoPanelPresidencial;
