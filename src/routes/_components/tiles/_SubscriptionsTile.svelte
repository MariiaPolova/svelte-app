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
    <CardTitle>Subscriptions</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      Section utilizes next APIs:
      <ul>
      <li>Account subscriptions</li>
      <li>Payment subscriptions</li>
      <li>Mapping of payments with database</li>
      </ul>
    </CardText>
    <Button outline  color="info" on:click={() => goto('/subscription')}>Go to subscriptions</Button>
  </CardBody>
</Card>
