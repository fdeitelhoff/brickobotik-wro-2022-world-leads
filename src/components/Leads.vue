<script setup lang="ts">
import { ref } from 'vue';
import { getValidationMessages } from '@formkit/validation';
import { reset } from '@formkit/core';
import { setErrors, clearErrors } from '@formkit/vue';

const messages = ref([]);
var complete = ref(false);

function newsletter(node) {
  console.log('newsletter is called!', node);
}

function showErrors(node) {
  console.log('show errors is called!', node);

  messages.value.length = 0;

  // if (data.newsletter && data.email === undefined) {
  //   console.log('newsletter is set but no email!', data.newsletter, data.email);
  //   node.setErrors(['das geht so nicht'], { email: 'das geht so nicht' });
  // }

  const validations = getValidationMessages(node);
  validations.forEach((inputMessages) => {
    messages.value = messages.value.concat(
      inputMessages.map((message) => message.value)
    );
  });
}

async function handleSubmit(data, node) {
  console.log('handle submit is called!', data);

  // node.clearErrors();
  messages.value.length = 0;

  if (data.newsletter && data.email === undefined) {
    console.log('newsletter is set but no email!', data.newsletter, data.email);
    node.setErrors([], { email: 'das geht so nicht' });
    messages.value.push('das geht so nicht');
  } else {
    await new Promise((r) => setTimeout(r, 2500)); // maybe with a submitting animation...
    messages.value.length = 0;
    complete.value = true;
    reset('leads');
  }
}
</script>

<template>
  <div class="success" v-if="complete">
    <div>Daten erfolgreich übertragen.</div>
    <div><a href=".">Neuer Eintrag</a></div>
  </div>
  <FormKit
    type="form"
    id="leads"
    :form-class="complete ? 'hide' : 'show'"
    submit-label="Abschicken"
    @submit="handleSubmit"
    @submit-invalid="showErrors"
  >
    <h1>Mehr erfahren</h1>
    <p>
      Ich möchte gerne.... Lorem ipsum dolor sit amet, consetetur sadipscing
      elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
      aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
      dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
      est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet
    </p>

    <hr />

    <ul class="validation-errors" v-if="messages.length">
      <li v-for="message in messages">{{ message }}</li>
    </ul>
    <FormKit
      type="select"
      label="Titel"
      name="title"
      placeholder="Ihr Titel"
      help="Geben Sie bitte Ihren Titel an (optional)."
      :options="['', 'Dr.', 'Dr.-Ing', 'Prof.', '...']"
    />
    <FormKit
      type="text"
      prefix-icon="people"
      label="Vorname"
      name="firstname"
      placeholder="Ihr Vorname"
      help="Geben Sie bitte Ihren Vornamen an."
      validation="required|length:2"
    />
    <FormKit
      type="text"
      prefix-icon="people"
      label="Nachname"
      name="lastname"
      placeholder="Ihr Nachname"
      help="Geben Sie bitte Ihren Nachnamen an."
      validation="required|length:2"
    />
    <FormKit
      type="email"
      prefix-icon="email"
      label="E-Mail-Adresse"
      name="email"
      placeholder="Ihre E-Mail-Adresse"
      help="Geben Sie bitte Ihre E-Mail-Adresse an."
      validation="required|email"
    />
    <FormKit
      type="tel"
      prefix-icon="telephone"
      label="Telefon"
      name="phone"
      placeholder="Ihre Telefonnummer im Format xxx-xxx-xxxx"
      help="Geben Sie bitte Ihre Telefonnummer an (optional)."
      :validation="[['matches', /^\d{3}-\d{3}-\d{4}$/]]"
      validation-visibility="live"
      :validation-messages="{
        matches: 'Das Format für eine Telefonnummer lautet: xxx-xxx-xxxx',
      }"
    />
    <FormKit
      type="text"
      prefix-icon="settings"
      label="Schule/Organisation/Unternehmen"
      placeholder="Sind Sie beruflich hier?"
      help="Geben Sie bitte Ihre Schule, Organisation oder das Unternehmen an (optional)."
      name="organization"
    />
    <FormKit
      type="checkbox"
      prefix="settings"
      label="Kennen Sie brickobotik bereits?"
      name="already_known"
      help="Haben Sie bereits über andere Wege von uns erfahren?"
    />
    <FormKit
      type="checkbox"
      label="Haben Sie Interesse an Info-Materialien?"
      name="info"
      help="Dürfen wir Ihnen im Anschluss unsere Info-Materialien per E-Mail zukommen lassen?"
    />
    <FormKit
      type="checkbox"
      label="Ich möchte den Newsletter abonnieren"
      name="newsletter"
      help="Dürfen wir Ihnen im Anschluss unseren Newsletter schicken?"
      validation="newsletter"
      :validation-rules="{ newsletter }"
    />
    <FormKit
      type="checkbox"
      label="Sind Sie an Kursen/Workshops für Kinder/Jugendliche interessiert?"
      name="kids_program"
      help="Sind Sie an Kursen/Workshops für Kinder oder Jugendliche interessiert, zum Beispiel MINT-Ferienprogramme, einen MINT-Verein oder ähnliches?"
    />
    <FormKit
      type="checkbox"
      label="Wir dürfen Ihre Daten verarbeiten (DSGVO)"
      name="dsgvo"
      help="Wir benötigen Ihre Zustimmung, um Ihre Daten zu verarbeiten."
      validation="accepted"
    />
  </FormKit>
</template>

<style>
/* .h1 {
  margin-top: -10px;
} */

.formkit-message svg {
  width: 1.5em;
  fill: currentColor;
  /* padding-top: 0.55em; */
  /* margin-right: 0.25em; */
}

.formkit-form {
  width: 520px;
  padding: 1.5em;
  border: 1px solid #e4e4e4;
  border-radius: 1em;
  margin: 0 auto 1em auto;
}

.hide {
  display: none;
}

.validation-errors {
  color: red;
}

.success {
  text-align: center;
}

/* Das funktioniert noch nicht! */
/* .formkit-input:focus {
  border-color: black;
}

[data-invalid] .formkit-inner {
  border-color: red;
  box-shadow: 0 0 0 1px red;
}

[data-invalid] .formkit-icon {
  color: red;
}

[data-complete] .formkit-inner {
  border-color: green;
  box-shadow: 0 0 0 1px green;
}

[data-complete] .formkit-icon {
  color: green;
}

[data-complete] .formkit-inner::after {
  content: '✔️';
  display: block;
  padding: 0.5em;
} */
</style>
