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
    <CardTitle>Invoices</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      Section gives info on users invoices:
      <ul>
      <li>All invoices list</li>
      <li>Subscriptions match</li>
      </ul>
    </CardText>
    <Button outline  color="info" on:click={() => goto('/invoice')}>Go to invoices</Button>
  </CardBody>
</Card>
