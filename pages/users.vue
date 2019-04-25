<template>
  <v-layout>
    <p> Lorem ipsum dolor, sit amet consectetur
      adipisicing elit. Nobis architecto, vitae voluptas, sit possimus velit
      odit rem qui voluptate perspiciatis totam eum minima. Inventore fugit
      rerum esse optio voluptatum repellendus.</p>
  </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        project: 'default'
      }
    },
    asyncData(context) {
      return {
        project: 'holas desde el servidor'
      }
    }
  }

</script>

<style>

</style>
