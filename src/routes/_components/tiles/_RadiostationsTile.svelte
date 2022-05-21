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
    <CardTitle>Radiostations</CardTitle>
  </CardHeader>
  <CardBody>
    <CardText>
      Section includes search by radiostations with:
      <ul>
      <li>Creation info</li>
      <li>Stability info</li>
      </ul>
    </CardText>
    <Button outline color="info" on:click={() => goto('/radiostation')}>Go to radiostations</Button>
  </CardBody>
</Card>