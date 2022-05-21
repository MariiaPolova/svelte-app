<script>
    import {goto} from '@sapper/app';   
    import * as api from '../../_api';
    import { Card, CardTitle, Spinner, CardText } from 'sveltestrap/src';
    import dayjs from 'dayjs';
    import durationFormat from 'dayjs/plugin/duration' // load on demand
 
    dayjs.extend(durationFormat) // use plugin

    let form = {email: '' };
    let inProgress = false;
    let userInfos;

    async function submit () {
      inProgress = true;
      if (form.email) {
        userInfos = await api.users.getAccountInfoByEmail(form.email);
        console.log(dayjs.duration(3599, 's').hours(), dayjs.duration(3599, 's').minutes(), dayjs.duration(3599, 's').seconds())
        inProgress = false;
      } else {
        inProgress = false;
      }
    }

    function setToClipboard (text) {
        navigator.clipboard.writeText(text);
    }
</script>

<form
  class="story-form"
  on:submit|preventDefault="{submit}"
>
    <input
        class="text-input"
        bind:value="{form.email}"
        type="text"
        placeholder="Email, e.g. test@gmail.com"
        required
    >
    
    <button
        class="primary-button submit-button"
        disabled="{inProgress}"
    >  Load info  </button>
</form>

{#if userInfos && !inProgress}
    {#each userInfos as {identities, ...userInfo}}
        <Card body color="light" class="mx-3">
            <CardTitle class="d-flex align-items-center">
                <img src={userInfo.picture} class="rounded-circle mr-2" alt="" height="80">
                <h2 class="display-4">{userInfo.name}</h2>
            </CardTitle>
            <CardText>
            <div class="row">
                <div class="col">
                    <div>User ID: {userInfo.user_id} 
                        <button type="button" class="btn px-1 py-1" on:click={() => setToClipboard(userInfo.user_id)}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-stickies" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M0 1.5A1.5 1.5 0 0 1 1.5 0H13a1 1 0 0 1 1 1H1.5a.5.5 0 0 0-.5.5V14a1 1 0 0 1-1-1V1.5z"/><path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h11A1.5 1.5 0 0 1 16 3.5v6.086a1.5 1.5 0 0 1-.44 1.06l-4.914 4.915a1.5 1.5 0 0 1-1.06.439H3.5A1.5 1.5 0 0 1 2 14.5v-11zM3.5 3a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h6.086a.5.5 0 0 0 .353-.146l4.915-4.915A.5.5 0 0 0 15 9.586V3.5a.5.5 0 0 0-.5-.5h-11z"/><path fill-rule="evenodd" d="M10.5 10a.5.5 0 0 0-.5.5v5H9v-5A1.5 1.5 0 0 1 10.5 9h5v1h-5z"/></svg>
                        </button>
                    </div>
                    <div>Email verified: {userInfo.email_verified}</div>
                    <div>Created at: {userInfo.created_at}</div>
                    <div>Last Login: {userInfo.last_login}</div>
                    <div>Logins count: {userInfo.logins_count}</div>
                </div>
                <div class="col">
                    {#each identities as identity}
                        <div>Social connection: {identity.isSocial}</div>
                        <div>Provider: {identity.provider}</div>
                        <div>Last IP: {userInfo.last_ip}</div>
                    {/each}
                </div>
            </div>
            </CardText>
        </Card>
    {/each}
{:else if inProgress}
    <Spinner color="secondary" type="grow" style="width: 3rem; height: 3rem;" role="status"/>
{/if}