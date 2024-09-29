<script>
import { mapGetters } from 'vuex';
import { hasPressedCommand } from 'shared/helpers/KeyboardHelpers';
import GalleryView from '../components/GalleryView.vue';
import { timeStampAppendedURL } from 'dashboard/helper/URLHelper';

const ALLOWED_FILE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  IG_REEL: 'ig_reel',
};

export default {
  components: {
    GalleryView,
  },
  props: {
    attachment: {
      type: Object,
      required: true,
    },
    urlType: {
      type: String,
      required: false,
      default: 'data_url',
    },
  },
  data() {
    return {
      show: false,
      isAttachmentError: false,
      countAttachmentRetry: 0,
      maxAttachmentRetry: 5,
      retyAttachmentDelay: 1000,
      isAttachmentLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      currentChatAttachments: 'getSelectedChatAttachments',
    }),
    isImage() {
      return this.attachment.file_type === ALLOWED_FILE_TYPES.IMAGE;
    },
    isVideo() {
      return (
        this.attachment.file_type === ALLOWED_FILE_TYPES.VIDEO ||
        this.attachment.file_type === ALLOWED_FILE_TYPES.IG_REEL
      );
    },
    isAudio() {
      return this.attachment.file_type === ALLOWED_FILE_TYPES.AUDIO;
    },
    timeStampURL() {
      return timeStampAppendedURL(this.dataUrl);
    },
    attachmentTypeClasses() {
      return {
        image: this.isImage,
        video: this.isVideo,
      };
    },
    filteredCurrentChatAttachments() {
      const attachments = this.currentChatAttachments.filter(attachment =>
        ['image', 'video', 'audio'].includes(attachment.file_type)
      );
      return attachments;
    },
    dataUrl() {
      return this.attachment[this.urlType];
    },
    imageWidth() {
      return this.attachment.width ? `${this.attachment.width}px` : 'auto';
    },
    imageHeight() {
      return this.attachment.height ? `${this.attachment.height}px` : 'auto';
    },
  },
  watch: {
    attachment() {
      this.isAttachmentError = false;
    },
  },
  methods: {
    onClose() {
      this.show = false;
    },
    onClick(e) {
      if (hasPressedCommand(e)) {
        window.open(this.attachment.data_url, '_blank');
        return;
      }
      this.show = true;
    },
    onAttachmentError() {
      this.isAttachmentError = true;
      this.$emit('error');
    },
    onAttachmentErrorDelay() {
      if (this.countAttachmentRetry >= this.maxAttachmentRetry) {
        return;
      }
      this.countAttachmentRetry += 1;
      this.isAttachmentLoading = true;
      setTimeout(() => {
        this.isAttachmentLoading = false;
      }, this.retyAttachmentDelay * this.countAttachmentRetry);
    },
  },
};
</script>

<template>
  <div class="message-text__wrap" :class="attachmentTypeClasses">
    <img
      v-if="isImage && !isAttachmentLoading"
      class="bg-woot-200 dark:bg-woot-900"
      :src="dataUrl"
      :width="imageWidth"
      :height="imageHeight"
      @click="onClick"
      @error="onAttachmentError"
    />
    <video
      v-if="isVideo && !isAttachmentLoading"
      :src="dataUrl"
      muted
      playsInline
      @error="onAttachmentError"
      @click="onClick"
    />
    <audio
      v-else-if="isAudio && !isAttachmentLoading"
      controls
      class="skip-context-menu mb-0.5"
      @error="onAttachmentError"
    >
      <source :src="timeStampURL" />
    </audio>
    <GalleryView
      v-if="show"
      :show.sync="show"
      :attachment="attachment"
      :all-attachments="filteredCurrentChatAttachments"
      @error="onAttachmentError"
      @close="onClose"
    />
  </div>
</template>
