<script>
    import {session} from '$app/stores'
</script>

{#if $session.authenticated}
<slot></slot>
{:else}
Not authenticated
<a href='auth/login'>
    Login
</a>
{/if}