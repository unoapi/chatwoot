<template>
  <div>
    <woot-button
      variant="link"
      class="items-center flex rounded-full"
      @click="toogleExtensions"
    >
      <fluent-icon icon="call" />
    </woot-button>


    <transition name="menu-slide">
      <div
        v-if="show"
        class="left-3 rtl:left-auto rtl:right-3 bottom-16 w-64 absolute z-30 rounded-md shadow-xl bg-white dark:bg-slate-800 py-2 px-2 border border-slate-25 dark:border-slate-700"
        :class="{ 'block visible': show }"
        @click="toogleExtensions"
      >
        {{ extensions }}
        <ul>
          <li v-for="extension in extensions">
            {{ extension.name }}
          </li>
        </ul>
      </div>
    </transition>
    <!-- <woot-modal
      v-if="show"
      :on-close="toogleExtensions"
      size="medium"
      >
      aqui
    </woot-modal> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      extensions: 'extension/get',
    }),
  },
  mounted() {
    this.$store.dispatch('extension/connect');
  },
  methods: {
    toogleExtensions() {
      this.$emit('toggle-extensions');
    },
  },
};
</script>