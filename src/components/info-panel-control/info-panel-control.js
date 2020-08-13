import React from 'react';
import styled from 'styled-components';
import {Icons} from 'kepler.gl/components';

import ProgressBar from 'react-animated-progress-bar';

const StyledInfoPanel = styled.div`
  align-items: center;
  background-color: ${props => props.bgColor};
  color: ${props => props.fontColor};
  display: flex;
  height: ${props => props.height}px;
  justify-content: space-between;
  flex-direction: column;

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
    margin: 20px 0;
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
    width: 40px;
    height: 40px;
    background: antiquewhite;
    margin-right: -10px;
  }

  .info-member-img:last-child{
    margin-right: 0px;
    margin-left: 30px;
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

  .info-button-container{
    position: absolute;
    bottom: 0;
    right: 0;
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

  .button-container button:hover {
    background-color: #adbdbf;
  }
`;

const _bodyText = ((title,desc)=>{
    return (
        <div className={'info-text-container'}>
            <h2 style={{margin:0}}>{title}</h2>
            <p>{desc}</p>
        </div>
    )
})

const _members = ((data, type)=>{
    if (type == 'more'){
        return (
            <div className={'info-member-img'}>
                <img src={'/assets/img/more.svg'} style={{ width: '41px' }} alt={data.name}></img>
            </div>
        )
    } else if (type == 'items'){
        return (
            <div className={'info-member-img'}>
            {
                data.img &&
                <img src={ data.img } alt={data.name}></img>    
            }
            {
                !data.img &&
                <img src={'/assets/img/user.svg'} alt={data.name}></img>
            }
            </div>
        )
    }
})

const _progressBar = ((data, type)=>{
    if (type == 'bar'){
        return (
            <div>
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

const _button = ((data, type)=>{
    if (type == 'click'){
        return (
            <div className={'button-container'}>
                <button>Ver Provincia</button>
            </div>
        )
    } 
})

const InfoPanel = ({
  bgColor = '#fff',
  fontColor = '#999',
  height = 'auto',
  data
}) => {
    //console.log(data);
    let members = [
        {
            name: 'Philips DeFranco',
            img: '',
        },
        {
            name: 'Philips DeFranco',
            img: '',
        },
        {
            name: 'Philips DeFranco',
            img: '',
        },
        {
            name: 'Philips DeFranco',
            img: '',
        },
        {
            name: 'Philips DeFranco',
            img: '',
        }
    ];

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
    return(
        <StyledInfoPanel
            className="info-panel"
            bgColor={bgColor}
            fontColor={fontColor}
            height={height}
        >
            <div className={'info-container'}>
                { _bodyText(data.ADM2_ES, `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus nisi aliquet malesuada ultricies.`) }
            </div>
            
            <div className={'info-member-container'}>
                { _bodyText('Members', `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus nisi aliquet malesuada ultricies.`) }
                <div className={'info-member-imgs'}>
                    {
                        members.map((member, i) => {
                            //console.log(i);
                            if(i < 3){
                                return _members(member,'items');
                            } else if(i == 3){
                                return _members(member,'more');
                            } else {
                                return null
                            }
                        })
                    }
                </div>
            </div>

            <div className={'info-bars-container'}>
                { _bodyText('Estadisticas', ``) }
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

            <div className={'info-button-container'}>
                { _button('Estadisticas', `click`) }
            </div>
        </StyledInfoPanel>
    )
};

export default InfoPanel;
