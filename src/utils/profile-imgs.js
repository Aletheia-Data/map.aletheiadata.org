let getProfileImg = (name) => {
    console.log(name);
    let img = 'test';
    switch (name) {
        case "ANTONIO MANUEL TAVERAS GUZMAN":
            img = 'https://upload.wikimedia.org/wikipedia/commons/7/73/Antonio_Taveras_Guzm%C3%A1n%2C_presidente_de_la_AEIH.jpg';
            break;
        case "JUAN CARLOS ECHAVARRIA MILANE":
            img = 'https://diariodigital.com.do/wp-content/uploads/2019/10/E9207BA3-2301-493F-912D-FF84B1B27A1F.jpeg';
            break;
        case "LUIS MANUEL HENRIQUEZ BEATO":
            img = 'http://pld.org.do/website/wp-content/uploads/2016/10/LUIS-MANUEL-HENRIQUEZ-BEATO.jpg';
            break;
        case "ANA ADALGIZA DEL CARMEN ABREU POLANCO":
            img = 'data:image/jpeg;base64,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';
            break;
        default:
            img = '/assets/img/user.svg';
            break;
    }
  
    return img;
}

export { getProfileImg };