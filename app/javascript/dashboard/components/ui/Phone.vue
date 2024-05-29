<template>
  <div> ligar </div>
</template>

<script>
import WebSocketInterface from 'jssip';
export default {
  props: {
    socket: {
      type: WebSocketInterface,
      default: null,
    },
  },
};
</script>
