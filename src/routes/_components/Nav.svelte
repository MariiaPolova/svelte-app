<script>
  import { userLoggedIn } from '../../stores/writableStore';
  import {goto} from "@sapper/app";

  let isUserLoggedIn;
    userLoggedIn.subscribe(value => {
      isUserLoggedIn = value;
    });

    function logout() {
      userLoggedIn.set(false);
      localStorage.removeItem('token');
      goto('/login', {});
  }
</script>


<nav class="navbar">
  <div class="navbar-left">
    <a
      class="logo"
      href="/"
    >
      Admin App
    </a>
  </div>
  {#if isUserLoggedIn}
    <div class="navbar-right">
      <a
        class="navbar-link"
        on:click|once={logout}
      >
        Logout
      </a>
    </div>
  {:else}
    <div class="navbar-right">
      <a
        class="navbar-link"
        href="/login"
      >
        Log in
      </a>
    </div>
  {/if}
</nav>
