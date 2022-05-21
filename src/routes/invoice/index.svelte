<script>
    import {goto} from '@sapper/app';   
    import * as api from '../../_api';
    import { Table, ButtonGroup, Button, Spinner } from 'sveltestrap/src';
    import dayjs from 'dayjs';
    import durationFormat from 'dayjs/plugin/duration' // load on demand
 
    dayjs.extend(durationFormat) // use plugin

    let form = {accountId: ''};
    let inProgress = false;
    let invoices;
    let subscriptions;
    let paymentSubscriptions;

    async function submit () {
      inProgress = true;
      if (form.accountId) {
        invoices = await api.invoices.getInvoicesById(form.accountId);
        subscriptions = await api.subscriptions.getsubscriptionsById(form.accountId, true);
        paymentSubscriptions = await getMappedPaymentRecords();
        invoices = invoices.map(invoice => {
            const subs = invoice.subscriptionIds.map(sub => {
                const matchedSub = paymentSubscriptions.find(paymentSub => paymentSub.id === sub);
                const matchedSongSub = matchedSub ? subscriptions.find(sub => sub.orderId === matchedSub.orderId) : null;
                return {...matchedSongSub, id: sub}
            });
            return {...invoice, subscriptions: subs};
        })
        inProgress = false;
      } else {
        inProgress = false;
      }
  }

    async function getMappedPaymentRecords () {
      const paymentSubs = await api.subscriptions.getPaymentSubscriptionsById(form.accountId, '');
      const databaseSubs = await api.subscriptions.getDbRecordsById(form.accountId);
      return paymentSubs.map(sub => {
        const foundSub = databaseSubs.find(dbSub => {
          return (dbSub.subscriptionUuid === sub.uuid && dbSub.status === 5)
          });

          return ({...sub,
            orderId: foundSub ? foundSub.orderId : null})
      });
    }
</script>
<form
  class="story-form"
  on:submit|preventDefault="{submit}"
>
    <input
        class="text-input"
        bind:value="{form.accountId}"
        type="text"
        placeholder="User Code, e.g. auth|1234567890"
        required
    >
    
    <button
        class="primary-button submit-button"
        disabled="{inProgress}"
    >  Load info  </button>
</form>

<div style="height: 100%" class="text-center w-100 h-100 p-3">
  {#if invoices && !inProgress}
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Number</th>
          <th>Date</th>
          <th>Total, EUR</th>
          <th>Subscriptions</th>
        </tr>
      </thead>
      <tbody>
        {#each invoices as { number, createdAt, total, subscriptions }, i}
          <tr>
            <th scope="row">{i + 1}</th>
            <td>{number}</td>
            <td>{dayjs(createdAt).format()}</td>
            <td>{total}</td>
            <td>
            {#each subscriptions as subscription}
            {#if subscription.song}
                <div>{subscription.song.artist} - {subscription.song.name}
                {#if subscription.song.nameSupplement}
                <span>({subscription.song.nameSupplement})</span>
                {/if}
                </div>
            {:else}
                -
            {/if}
            {/each}
            </td>
          </tr>
        {/each}
      </tbody>
    </Table>
  {:else if inProgress}
  <Spinner color="secondary" type="grow" style="width: 3rem; height: 3rem;" role="status"/>
  {/if}
</div>
