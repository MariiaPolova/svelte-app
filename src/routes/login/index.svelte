<script>
  import { goto } from '@sapper/app';
  import firebase from 'firebase/app';
  // import {googleProviderWithCustomDomain} from '../../config/firebase_config.js';
  
const { firebaseConfig } = require('../../../shared-config/firebaseConfig')

  let user = { username: '', password: '' };
  let inProgress = false;
  let error = null;

  async function submit () {
    try {
      inProgress = true;
      console.log('send a request to login the user');
      inProgress = false;
      error = null;
      user = { username: '', password: '' };
      // firebase.auth().signInWithPopup(googleProviderWithCustomDomain).then(function(result) {
      // // This gives you a Google Access Token.
      // var token = result.credential.accessToken;
      // // The signed-in user info.
      // var user = result.user;
      // });
      goto('/');
    } catch (err) {
      error = err.response.data.message;
      inProgress = false;
    }
  }
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<form
  class="login-form"
  on:submit|preventDefault="{submit}"
>
  {#if error}
    <span class="error-message">
      {error}
    </span>
  {/if}
  <input
    class="text-input username-input"
    bind:value="{user.username}"
    type="text"
    placeholder="username"
    required
  >
  <input
    class="text-input password-input"
    bind:value="{user.password}"
    type="password"
    placeholder="password"
    required
  >
  <button
    class="login-button primary-button"
    disabled="{inProgress}"
  >
    LOG IN
  </button>
</form>