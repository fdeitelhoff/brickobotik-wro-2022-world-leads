<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { getValidationMessages } from '@formkit/validation';
import { reset } from '@formkit/core';
import { setErrors, clearErrors } from '@formkit/vue';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// const result : string[] = [];
// const year: Ref<string | number> = ref('2020')
const messages: Ref<string[]> = ref([]);
var complete = ref(false);
const eventDayUuid = ref('');
const leadCount = ref(-1);

const supabase = createClient(
  'https://ddyurgzbimitqcmknmho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkeXVyZ3piaW1pdHFjbWtubWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjA1NjQyODQsImV4cCI6MTk3NjE0MDI4NH0.mJDmHJ2cM2J57KEPZHbSif7jiOSRa7L5iANSOqDFX60'
);

function newsletter(node: any) {
  console.log('newsletter is called!', node);
}

function showErrors(node: any) {
  console.log('show errors is called!', node);

  messages.value.length = 0;

  // if (data.newsletter && data.email === undefined) {
  //   console.log('newsletter is set but no email!', data.newsletter, data.email);
  //   node.setErrors(['das geht so nicht'], { email: 'das geht so nicht' });
  // }

  const validations: Map<any, any> = getValidationMessages(node);
  console.log('validations', validations);
  validations.forEach((inputMessages) => {
    messages.value = messages.value.concat(
      inputMessages.map((message: any) => message.value)
    );
  });
}

async function handleSubmit(data: any, node: any) {
  console.log('handle submit is called!', data);

  // node.clearErrors();
  messages.value.length = 0;

  if (data.newsletter && data.email === undefined) {
    console.log('newsletter is set but no email!', data.newsletter, data.email);
    node.setErrors([], { email: 'das geht so nicht' });
    messages.value.push('das geht so nicht');
  } else {
    // await new Promise((r) => setTimeout(r, 2500)); // maybe with a submitting animation...
    // const { error } = await supabase
    //   .from('contacts')
    //   .insert({ id: 1, name: 'Denmark' });

    const contactId = uuidv4();

    const { data: any, error } = await supabase.from('contacts').insert([
      {
        contact_id: contactId,
        first_name: data.firstname,
        last_name: data.lastname,
        email: data.email,
        phonenumber: data.phone,
        affiliation: data.affiliation,
        gdpr_accepted: data.gdpr,
        gdpr_accepted_date: new Date(),
        newsletter_subscription:
          data.newsletter === undefined ? false : data.newsletter,
      },
    ]);

    // console.log(data, error, contactId);

    if (error === null || error === undefined) {
      const { data: any, error } = await supabase.from('leads').insert([
        {
          lead_id: uuidv4(),
          contact_id: contactId,
          event_day_id: eventDayUuid.value,
          brickobotik_known:
            data.already_known === undefined ? false : data.already_known,
          interested_portfolio:
            data.kids_program === undefined ? false : data.kids_program,
          raffle: data.raffle === undefined ? false : data.raffle,
        },
      ]);

      // console.log(data, error, contactId, eventDayUuid.value);
    }

    messages.value.length = 0;
    complete.value = true;
    // reset('leads');
  }
}

onMounted(async () => {
  const { count, error } = await supabase
    .from('leads')
    .select('lead_id', { count: 'exact', head: true });

  console.log('on mounted', supabase, count, error);

  if (count === null || count === undefined) {
    leadCount.value = -1;
  } else {
    leadCount.value = count;
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  eventDayUuid.value = 'dbd73067-33bd-4255-8150-8d178d3d06b2'; // FD: Backup: If something fails, the WRO Event Day 1 is the default.
  if (currentMonth === 11 && currentDay === 17) {
    eventDayUuid.value = 'dbd73067-33bd-4255-8150-8d178d3d06b2';
  } else if (currentMonth === 11 && currentDay === 18) {
    eventDayUuid.value = '83743ad6-0b1f-4398-aa04-cbd2518b8b61';
  } else if (currentMonth === 11 && currentDay === 19) {
    eventDayUuid.value = 'c57d9c2f-9e65-4fc2-9ed9-81ac2f965de5';
  }

  console.log(currentDay, currentMonth, eventDayUuid.value);
});
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
    <div class="lead-count">{{ leadCount }}</div>
    <!-- <h1>Mehr erfahren</h1>
    <p>
      Ich möchte gerne.... Lorem ipsum dolor sit amet, consetetur sadipscing
      elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
      aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
      dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
      est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet
    </p>

    <hr /> -->

    <ul class="validation-errors" v-if="messages.length">
      <li v-for="message in messages">{{ message }}</li>
    </ul>
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
      placeholder="Ihre Telefonnummer"
      help="Geben Sie bitte Ihre Telefonnummer an (optional). Format: Eine vier- oder fünfstellige Vorwahl und mindestes zwei Zahlen nach dem Bindestrich."
      :validation="[['matches', /^\d{4,5}-\d{2,}$/]]"
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
      name="affiliation"
      validation="required"
    />
    <FormKit
      type="checkbox"
      label="Kennen Sie brickobotik bereits?"
      name="already_known"
      help="Haben Sie bereits über andere Wege von uns erfahren?"
    />
    <FormKit
      type="checkbox"
      label="Ich möchte den Newsletter abonnieren"
      name="newsletter"
      help="Dürfen wir Ihnen im Anschluss unseren Newsletter schicken?"
      validation="newsletter"
    />
    <FormKit
      type="checkbox"
      label="Sind Sie an Kursen/Workshops für Kinder/Jugendliche interessiert?"
      name="kids_program"
      help="Sind Sie an Kursen/Workshops für Kinder oder Jugendliche interessiert, zum Beispiel MINT-Ferienprogramme, einen MINT-Verein oder ähnliches?"
    />
    <FormKit
      type="checkbox"
      label="Möchten Sie am Gewinnspiel teilnehmen?"
      name="raffle"
      help="Möchten sie an unserem Gewinnspiel (Verlosung) teilnehmen?"
    />
    <FormKit
      type="checkbox"
      label="Wir dürfen Ihre Daten verarbeiten (DSGVO)"
      name="gdpr"
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

.lead-count {
  margin-bottom: 20px;
  font-size: 12px;
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
