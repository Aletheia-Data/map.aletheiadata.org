import React, {Component} from 'react';
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
    <Form fluid 
        id={'contactForm'}
        model={model} 
        action="https://formspree.io/xrgyvqzv"
        method="POST"
        style={{ textAlign: 'left' }}
        onSubmit={sendEmail}
    >
        <FormGroup>
            <ControlLabel>Nombres</ControlLabel>
            <FormControl name="name" />
            <HelpBlock>Required</HelpBlock>
        </FormGroup>
        <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl name="email" type="email" />
            <HelpBlock>Required</HelpBlock>
        </FormGroup>
        <FormGroup>
            <ControlLabel>Mensaje</ControlLabel>
            <FormControl rows={5} name="message" componentClass="textarea" />
        </FormGroup>
        <FormGroup>
            <ButtonToolbar>
                <Button appearance="primary" type="submit">Enviar</Button>
            </ButtonToolbar>
        </FormGroup>
    </Form>
  );
}

export default ContactForm;