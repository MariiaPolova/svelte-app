<script>
    import {goto} from '@sapper/app';   
    import * as api from '../../_api';
    import { Table, ButtonGroup, Button, Spinner } from 'sveltestrap/src';
    import dayjs from 'dayjs';
    import durationFormat from 'dayjs/plugin/duration' // load on demand

    dayjs.extend(durationFormat) // use plugin

    let includeExpired = false;
    let form = {accountId: '', expiredSubscriptions: includeExpired};
    let inProgress = false;
    let subscriptions;
    let paymentSubscriptions;
    const dateFormat = 'HH:mm MM/DD/YYYY [UTC]'

    async function submit () {
      try {
        inProgress = true;
        if (form.accountId) {
          subscriptions = await api.subscriptions.getsubscriptionsById(form.accountId, form.expiredSubscriptions);
          paymentSubscriptions = form.expiredSubscriptions ? await getMappedPaymentRecordsWithExpired() : await getMappedPaymentRecords();
          inProgress = false;
        } else {
          inProgress = false;
        }
      } catch (e) {
        console.log(e);
        inProgress = false;
      }
  }

  async function getMappedPaymentRecords (state = 'live') {
    const paymentSubs = await api.subscriptions.getPaymentSubscriptionsById(form.accountId, state);
    const [databaseSubs, bundleDatabaseSubs] = await Promise.all([api.subscriptions.getDbRecordsById(form.accountId), api.subscriptions.getBundleDbRecordsById(form.accountId)]);
    databaseSubs.push(...bundleDatabaseSubs);
    return  paymentSubs.map(sub => {
      const foundSub = databaseSubs.find(dbSub => {
        return (dbSub.subscriptionUuid === sub.uuid && dbSub.status === 5)
        });

        return ({...sub, 
          orderId: foundSub ? (foundSub.orderId || foundSub.dnaOrders.map(order => order.orderId)) : null})
    });
  }

  async function getMappedPaymentRecordsWithExpired () {
      const liveSubs = await getMappedPaymentRecords();
      const expiredSubs = await getMappedPaymentRecords('expired');
      return [...liveSubs, ...expiredSubs];
  }

  function getSubscriptionsWithParam (expiredSubscriptions) {
    if(includeExpired === expiredSubscriptions)
      return;
    
    includeExpired = expiredSubscriptions;
    form.expiredSubscriptions = expiredSubscriptions;
    submit();

  }

  function isSubscriptionExpired (expirationDate, state = 'live') {
    const today = dayjs(new Date());
    return dayjs(expirationDate).isBefore(today) || state === 'expired';
  }

  function getRowColor(orderContractEndDate, orderId, cancelationDate) {
    let color = '';
    if(isSubscriptionExpired(orderContractEndDate))
      color = "table-danger";
    else if (paymentSubscriptions.find(sub => sub.orderId === orderId
            && !isSubscriptionExpired(sub.currentPeriodEndsAt, sub.state) )) {
      if(cancelationDate)
        color = 'table-warning'
      else
      color = 'table-success'
    }

    return color;
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
<h2>Subscriptions</h2>
<div style="height: 100%" class="text-center w-100 h-100 p-3">
  {#if subscriptions && !inProgress}
    <div class="p-3 w-100">
      <ButtonGroup>
        <Button active = {!includeExpired} on:click="{() => getSubscriptionsWithParam(false)}"color="secondary">Active</Button>
        <Button active = {includeExpired} on:click="{() => getSubscriptionsWithParam(true)}" color="danger">Include Expired</Button>
      </ButtonGroup>
    </div>
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Song ID</th>
          <th>Song Name</th>
          <th>Song Duration</th>
          <th>Creation Date</th>
          <th>Switch Date</th>
          <th>Contract End Date</th>
          <th>Diff</th>
          <th>Order ID</th>
        </tr>
      </thead>
      <tbody>
        {#each subscriptions as { song, orderId, creationDate, orderContractEndDate, cancelationDate }, i}
          <tr class={getRowColor(orderContractEndDate, orderId, cancelationDate)}>
            <th scope="row">{i + 1}</th>
            <td>{song.id}</td>
            <td>{song.artist} - {song.name}</td>
            <td>{dayjs.duration(song.durationInMilliSec).minutes()}:{dayjs.duration(song.durationInMilliSec).seconds()}</td>
            <td>{dayjs(creationDate).format(dateFormat)}</td>
            <td>{cancelationDate ? dayjs(cancelationDate).format(dateFormat) : 'Not switched'}</td>
            <td>{dayjs(orderContractEndDate).format(dateFormat)}</td>
            <td>{dayjs(orderContractEndDate).diff(dayjs(creationDate), 'month')}</td>
            <td>{orderId}</td>
          </tr>
        {/each}
      </tbody>
    </Table>
  {:else if inProgress}
  <Spinner color="secondary" type="grow" style="width: 3rem; height: 3rem;" role="status"/>
  {/if}
</div>

<!-- Payment gateway table -->
<h2>Payment Subscriptions</h2>
<div style="height: 100%" class="text-center w-100 h-100 p-3">
  {#if paymentSubscriptions && !inProgress}
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>UUID</th>
          <th>State</th>
          <th>Plan name</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Renewal</th>
          <th>Order ID</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {#each paymentSubscriptions as { plan, ...paymentSubscription }, i}
          <tr class={(isSubscriptionExpired(paymentSubscription.currentPeriodEndsAt, paymentSubscription.state) ||
          (!paymentSubscription.orderId && !paymentSubscription.dnaOrders))
          ? "table-danger" : ''}>
            <th scope="row">{i + 1}</th>
            <td>{paymentSubscription.uuid}</td>
            <td>{paymentSubscription.state}</td>
            <td>{plan.name}</td>
            <td>{paymentSubscription.createdAt}</td>
            <td>{paymentSubscription.currentTermEndsAt}</td>
            <td>{paymentSubscription.state === 'active' ? 'ON' : 'OFF'}</td>
            <td>{paymentSubscription.orderId || 'NO ORDER ID'}</td>
            <td>{paymentSubscription.unitAmount} {paymentSubscription.currency}</td>
          </tr>
        {/each}
      </tbody>
    </Table>
  {:else if inProgress}
  <Spinner color="secondary" type="grow" style="width: 3rem; height: 3rem;" role="status"/>
  {/if}
</div>

