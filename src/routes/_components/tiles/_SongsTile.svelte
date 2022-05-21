<script>
  import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardText,
    CardTitle
  } from 'sveltestrap/src';
    import { goto } from '@sapper/app';
</script>

<Card class="mb-3">
  <CardHeader color="info">
    <CardTitle>Songs</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      Section gives next options:
      <ul>
      <li>Search by title and artist</li>
      <li>Lookup of subscribed accounts</li>
      </ul>
    </CardText>
    <Button outline  color="info" on:click={() => goto('/song')}>Go to songs</Button>
  </CardBody>
</Card>