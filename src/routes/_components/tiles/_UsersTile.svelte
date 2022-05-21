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
    <CardTitle>Users</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      Section gives info on users account with next data:
      <ul>
      <li>Account Code</li>
      <li>Full name</li>
      <li>Last login</li>
      <li>Login number</li>
      </ul>
    </CardText>
    <Button outline  color="info" on:click={() => goto('/user')}>Go to users</Button>
  </CardBody>
</Card>