import React, {Component} from 'react';
import styled from 'styled-components';
import { Alert, Schema, Form, FormGroup, ControlLabel, FormControl, HelpBlock, ButtonToolbar, Button } from 'rsuite';

const { StringType, NumberType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired('This field is required.'),
  email: StringType()
    .isEmail('Please enter a valid email address.')
    .isRequired('This field is required.'),
  message: StringType()
    .isRequired('This field is required.')
});
function TextField(props) {
  const { name, label, accepter, ...rest } = props;
  return (
    <FormGroup>
      <ControlLabel>{label} </ControlLabel>
      <FormControl name={name} accepter={accepter} {...rest} />
    </FormGroup>
  );
}
const ContactFormStyle = styled.div`

`;
const sendEmail = (isValid) =>{
    console.log(isValid);

    if (isValid){
        const form = document.getElementById('contactForm');
        const data = new FormData(form);
        const xhr = new XMLHttpRequest();
        xhr.open(form.method, form.action);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
            form.reset();
            console.log('ok', xhr);
            Alert.success('Mensaje Enviado.')
        } else {
            console.log('ko', xhr);
            Alert.error('Opps! No pudimos enviar tu mensaje, intente nuevamente.')
        }
        };
        xhr.send(data);
    }
}
function ContactForm() {
  return (
    <ContactFormStyle>
      <Form fluid 
          id={'contactForm'}
          model={model} 
          action="https://formspree.io/xrgyvqzv"
          method="POST"
          style={{ textAlign: 'left' }}
          onSubmit={sendEmail}
      >
          <FormGroup>
              <ControlLabel>Nombre *</ControlLabel>
              <FormControl name="name" />
          </FormGroup>
          <FormGroup>
              <ControlLabel>Email *</ControlLabel>
              <FormControl name="email" type="email" />
          </FormGroup>
          <FormGroup>
              <ControlLabel>Mensaje *</ControlLabel>
              <FormControl rows={5} name="message" componentClass="textarea" />
              <HelpBlock>* necesario</HelpBlock>
          </FormGroup>
          <FormGroup>
              <ButtonToolbar>
                  <Button className="send-button" type="submit">Enviar</Button>
              </ButtonToolbar>
          </FormGroup>
      </Form>
    </ContactFormStyle>
  );
}

export default ContactForm;