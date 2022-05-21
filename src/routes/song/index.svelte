<script>
    import {goto} from '@sapper/app';   
    import * as api from '../../_api';
    import { Table, ButtonGroup, Button, Spinner } from 'sveltestrap/src';

    import dayjs from 'dayjs';
    import durationFormat from 'dayjs/plugin/duration' // load on demand
 
    dayjs.extend(durationFormat) // use plugin

    let includeExpired = false;
    let form = {songSearchTitle: '', expiredSubscriptions: includeExpired};
    let inProgress = false;
    let songs;

    async function submit () {
      inProgress = true;
      if (form.songSearchTitle) {
        songs = await api.songs.getSongsList(form.songSearchTitle, "SONG_NAME");
        console.log(songs)
        inProgress = false;
      } else {
        inProgress = false;
      }
  }

</script>
<form
  class="story-form"
  on:submit|preventDefault="{submit}"
>
    <input
        class="text-input"
        bind:value="{form.songSearchTitle}"
        type="text"
        placeholder="Search by song artist or title"
        required
    >
    
    <button
        class="primary-button submit-button"
        disabled="{inProgress}"
    >  Search songs  </button>
</form>

<div style="height: 100%" class="text-center w-100 h-100 p-3">
  {#if songs && !inProgress}
    <Table hover>
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>Artist</th>
          <th>Name</th>
          <!-- <th>Name supplement</th> -->
          <th>ISRC</th>
          <th>Duration</th>
          <th>Сreation Date</th>
          <th>Earliest Detection Date</th>
          <th>Go to Subs</th>
        </tr>
      </thead>
      <tbody>
        {#each songs as { artist, ...song }, i}
          <tr>
            <th scope="row">{i + 1}</th>
            <td>{song.id}</td>
            <td>{artist.name}</td>
            <td>{song.name}</td>
            <!-- <td>{song.nameSupplement || ''}</td> -->
            <td>{song.isrc ? song.isrc.toUpperCase() : ''}</td>
            <td>{dayjs.duration(song.durationInMilliSec).minutes()}:
            {dayjs.duration(song.durationInMilliSec).seconds() < 10 ? '0' : ''}{dayjs.duration(song.durationInMilliSec).seconds()}</td>
            <td>{song.creationDate ? dayjs(song.creationDate).format() : ''}</td>
            <td>{song.earliestDetectionDate ? dayjs(song.earliestDetectionDate).format() : ''}</td>
            <td><Button outline  color="info" on:click={() => goto(`/song/${song.id}`)}>Go to subs</Button></td>
          </tr>
        {/each}
      </tbody>
    </Table>
  {:else if inProgress}
  <Spinner color="secondary" type="grow" style="width: 3rem; height: 3rem;" role="status"/>
  {/if}
</div>

