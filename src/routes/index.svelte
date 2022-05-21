<script>
  import { Col, Container, Row } from 'sveltestrap/src';
  import RadiostationsTile from '../routes/_components/tiles/_RadiostationsTile.svelte';
  import SubscriptionsTile from '../routes/_components/tiles/_SubscriptionsTile.svelte';
  import UsersTile from '../routes/_components/tiles/_UsersTile.svelte';
  import InvoicesTile from '../routes/_components/tiles/_InvoicesTile.svelte';
</script>

<div>
  <Container class="mt-3">
    <Row>
      <Col xs="6">
        <RadiostationsTile/>
      </Col>
      <Col xs="6">
        <SubscriptionsTile/>
      </Col>
    </Row>
    <Row>
      <Col xs="6">
        <UsersTile/>
      </Col>
      <Col xs="6">
        <InvoicesTile/>
        </Col>
    </Row>
  </Container>
</div>
