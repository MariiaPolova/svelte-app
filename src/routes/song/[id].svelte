<script>
    import * as api from '../../_api';
    import { Table, Input, Spinner, Card, CardTitle, CardText } from 'sveltestrap/src';
    import { onMount } from 'svelte';
    import * as blobUtil from 'blob-util'
    import { saveAs } from 'file-saver';
    import dayjs from 'dayjs';
    import durationFormat from 'dayjs/plugin/duration'
    import {getSongReport} from "../../_api/songs"; // load on demand

    import { stores } from "@sapper/app";

    const { page } = stores();
    const { id } = $page.params;

    dayjs.extend(durationFormat) // use plugin

    let songSubcriptions;
    let form = {startDate: '', endDate: '', type: 'pdf'};
    let inProgress = false;
    const dateFormat = "HH:mm MM/DD/YYYY [UTC]";

    onMount(async () => {
        console.log(id, $page.params);
        const ServiceSongSubcriptions = await api.songs.getSubscriptionsBySongID(id);
        const emails = await getEmailsByAccountCode(ServiceSongSubcriptions.currentPagesEntities);
        songSubcriptions = ServiceSongSubcriptions.currentPagesEntities.length ?
            ServiceSongSubcriptions.currentPagesEntities.map(subscription => {
            if(emails) {
                const entry = emails.find(entryWithCode => entryWithCode.id === subscription.customer.id );
                subscription.customer.accountCode = entry.login || null;
            }
            return subscription;
        }) : null ;
    });

    function setToClipboard (text) {
        navigator.clipboard.writeText(text);
    }

    function getEmailsByAccountCode (subscriptions) {
        const emailsPromises = subscriptions.map(sub => api.users.getAccountCodeById(sub.customer.id));
        return Promise.all(emailsPromises)
    }

    function downloadFile (base64data, type, fileName) {
        const file = window.btoa(base64data);
        const url = `data:${type};base64,` + file;
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    }

    async function submit () {
        try {
            inProgress = true;
            if (form.startDate && form.endDate && id) {
                const report = await api.songs.getSongReport(id, form.startDate, form.endDate, 'pdf');
                const blob = new Blob([report], {type: "application/pdf"});
                saveAs(blob, "hello world.pdf")
                inProgress = false;
            } else {
                inProgress = false;
            }
        } catch (e) {
            console.log(e);
            inProgress = false;
        }
    }
</script>

<div style="height: 100%" class="text-center w-100">
  {#if songSubcriptions}
    <Card body color="light" class="mx-5 my-5">
        <CardTitle class="d-flex align-items-center">
            <h4 class="display-4">{songSubcriptions[0].song.artist} - {songSubcriptions[0].song.name}</h4>
        </CardTitle>
        <CardText>
            <div class="row">
                <div class="col">
                    <div>ISRC: {songSubcriptions[0].song.isrc || 'No isrc'}</div>
                </div>
                <div class="col">
                    <div>Duration: {dayjs.duration(songSubcriptions[0].song.durationInMilliSec).minutes()}:
                    {dayjs.duration(songSubcriptions[0].song.durationInMilliSec).seconds() < 10 ? '0' : ''}
                        {dayjs.duration(songSubcriptions[0].song.durationInMilliSec).seconds()}</div>
                </div>
            </div>
        </CardText>
    </Card>
    <div style="height: 100%"  class="h-100 p-3">
        <Table hover>
        <thead>
            <tr>
            <th>#</th>
            <th>Subscription ID</th>
            <th>Order ID</th>
            <th>User account code</th>
            <th>Creation Date</th>
            <th>End Date</th>
            </tr>
        </thead>
        <tbody>
            {#each songSubcriptions as { customer, ...subscription }, i}
            <tr>
                <th scope="row">{i + 1}</th>
                <td>{subscription.id}</td>
                <td>{subscription.orderId}</td>
                <td>{customer.email || customer.accountCode}
                    <button type="button" class="btn px-1 py-1" on:click={() => setToClipboard(customer.name)}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-stickies" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M0 1.5A1.5 1.5 0 0 1 1.5 0H13a1 1 0 0 1 1 1H1.5a.5.5 0 0 0-.5.5V14a1 1 0 0 1-1-1V1.5z"/><path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 0 1 3.5 2h11A1.5 1.5 0 0 1 16 3.5v6.086a1.5 1.5 0 0 1-.44 1.06l-4.914 4.915a1.5 1.5 0 0 1-1.06.439H3.5A1.5 1.5 0 0 1 2 14.5v-11zM3.5 3a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h6.086a.5.5 0 0 0 .353-.146l4.915-4.915A.5.5 0 0 0 15 9.586V3.5a.5.5 0 0 0-.5-.5h-11z"/><path fill-rule="evenodd" d="M10.5 10a.5.5 0 0 0-.5.5v5H9v-5A1.5 1.5 0 0 1 10.5 9h5v1h-5z"/></svg>
                    </button>
                </td>
                <td>{dayjs(subscription.creationDate).format(dateFormat)}</td>
                <td>{dayjs(subscription.orderContractEndDate).format(dateFormat)}</td>
            </tr>
            {/each}
        </tbody>
        </Table>
    </div>
    {:else}
    <div>No subscriptions found</div>
    {/if}

    <div>
        <h4>Report</h4>

            <form
                    on:submit|preventDefault="{submit}"
            >
                <div class="container">
                    <div class="row justify-content-around align-items-center">
                        <span>Start Date</span>
                        <input
                                class="text-input"
                                bind:value="{form.startDate}"
                                type="text"
                                placeholder="YYYY-MM-DD"
                                required
                        >
                        <span>End Date</span>
                        <input
                                class="text-input"
                                bind:value="{form.endDate}"
                                type="text"
                                placeholder="YYYY-MM-DD"
                                required
                        >
                        <Input style="width: inherit" type="select" name="select" id="typeSelect" bind:value="{form.type}">
                            <option>pdf</option>
                            <option>xls</option>
                        </Input>
                    {#if !inProgress}
                        <button
                                class="primary-button submit-button"
                                disabled="{inProgress}"
                        >  Load report  </button>
                    {:else if inProgress}
                        <Spinner color="secondary" type="grow" style="width: 3rem; height: 3rem;" role="status"/>
                    {/if}
                    </div>
                </div>
            </form>
        </div>
</div>
