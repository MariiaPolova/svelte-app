<script>
    import {goto} from '@sapper/app';  
    import { onMount, beforeUpdate, afterUpdate, tick } from 'svelte'; 
    import dayjs from 'dayjs';
    import * as api from '../../_api';
    import { Table, Button, Spinner, Input, Progress, CustomInput } from 'sveltestrap/src';



    let radiostationForm = {region: 0, country: 0, city: 0, continent: 0};
    let inProgress = false;
    let continents; //TODO think of having radiostations in the store
    let regions;
    let countries;
    let cities;
    let radiostations;
    
    $: if(countries){ 
        getRadiostations(null, countries[0].id);
      }

    //lifecycle hook of the component
    onMount(async() => {
      inProgress = true;
      continents = await api.radiostations.getContinentsList();
      await refreshDropdownData('continent', continents[0].id, 'region', 'country', 'city');
      inProgress = false;
    })

    async function refreshDropdownData (updatedName, updatedValue, ...params) {
      if(radiostationForm[updatedName] === parseInt(updatedValue)){
        return;
      }
      
      // tick waits for the next microtask - is made because on:change event is triggered earlier, than 
      // binded value is updated for radiostationForm
      await tick();

      if(params.includes('region')) {
        regions = await api.radiostations.getRegionsList(radiostationForm.continent || continents[0].id);
      }

      if(params.includes('country')) {
        countries = await api.radiostations.getCountriesList(radiostationForm.region || regions[0].id);
      }

      if(params.includes('city')) {
        cities = await api.radiostations.getCitiesList(radiostationForm.country || countries[0].id);
      }
    }

    async function getRadiostations (city, country) {
        inProgress = true;
        await tick();
        radiostations = await api.radiostations.getradiostationsByFilters(
            Number.isInteger(city) ? city : radiostationForm.city,
            Number.isInteger(country) ? country : radiostationForm.country);
        inProgress = false;
    }
</script>

<div class="container">
  <div class="row justify-content-md-center">
    {#if continents}
      <div class="p-3 col-md-3 col-xs-12">
          <Input type="select" id="continent" name="continents-select"  
            bind:value={radiostationForm.continent}
            on:change={(e) => refreshDropdownData(e.currentTarget.id, e.currentTarget.value, 'region', 'country', 'city')}>
            {#each continents as {id, name}, i}
            <option value={id} selected={radiostationForm.continent === id}>{name}</option>
            {/each}
          </Input>
      </div>
    {/if}

    {#if regions}
      <div class="p-3 col-md-3 col-xs-12">
          <Input type="select" id="region" name="regions-select"  
            bind:value={radiostationForm.region}
            on:change={(e) => refreshDropdownData(e.currentTarget.id, e.currentTarget.value, 'country', 'city')}>
            {#each regions as {id, name}, i}
            <option value={id} selected={radiostationForm.region === id}>{name}</option>
            {/each}
          </Input>
      </div>
    {/if}

    {#if countries}
      <div class="p-3 col-md-3 col-xs-12">
          <Input type="select" id="country" name="countries-select"  
            bind:value={radiostationForm.country}
            on:change={(e) => refreshDropdownData(e.currentTarget.id, e.currentTarget.value, 'city')}>
            {#each countries as {id, name}, i}
            <option value={id} selected={radiostationForm.country === id}>{name}</option>
            {/each}
          </Input>
      </div>
    {/if}

    {#if cities}
      <div class="p-3 col-md-3 col-xs-12">
          <Input type="select" id="city" name="cities-select"  
            bind:value={radiostationForm.city} 
            on:change={getRadiostations}>
            <option value={null} selected={radiostationForm.city === null}>All</option>
            {#each cities as {id, name}, i}
            <option value={id} selected={radiostationForm.city === id}>{name}</option>
            {/each}
          </Input>
      </div>
    {/if} 
  </div>
  <div style="height: 100%" class="text-center w-100 h-100 p-3">
    {#if radiostations && !inProgress}
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Radiostation ID</th>
            <th>Radiostation Name</th>
            <th>Radiostation Creation Date</th>
            <th>Web only</th>
            <th>Radiostation Stability Status</th>
          </tr>
        </thead>
        <tbody>
          {#each radiostations as { id, name, creationDate, stability, webRadioOnly }, i}
            <tr>
              <th scope="row">{i + 1}</th>
              <td>{id}</td>
              <td>{name}</td>
              <td>{dayjs(creationDate).format()}</td>
              <td>
                  {#if webRadioOnly}
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check2-square" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M15.354 2.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L8 9.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                      <path fill-rule="evenodd" d="M1.5 13A1.5 1.5 0 0 0 3 14.5h10a1.5 1.5 0 0 0 1.5-1.5V8a.5.5 0 0 0-1 0v5a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5h8a.5.5 0 0 0 0-1H3A1.5 1.5 0 0 0 1.5 3v10z"/>
                    </svg>
                  {/if}
                  
              </td>
              <td>
                <Progress striped 
                  color={stability < 0.25 ? "danger" : "info"} 
                  value={stability === 0 ? 100 : stability * 100}>{stability * 100}%</Progress>
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
      {:else if inProgress}
      <Spinner color="secondary" type="grow" style="width: 3rem; height: 3rem;" role="status"/>
      {/if}
  </div>
</div>

