<template>
  <div class="my-2 mx-8 text-base">
    <!-- Tabs -->
    <woot-tabs
      class="font-medium [&_.tabs]:p-0 mb-4"
      :index="activeTab"
      @change="onTabChange"
    >
      <woot-tabs-item :name="$t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_PARAMS.LABEL')" :show-badge="false" />
      <woot-tabs-item :name="$t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.LABEL')" :show-badge="false" />
    </woot-tabs>

    <!-- Aba de Parâmetros Inicio -->
    <div v-if="activeTab === 0">
      <form class="flex flex-col" @submit.prevent="updateInbox()">
        <div class="w-1/4">
          <label :class="{ error: v$.url.$error }">
            <span>
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.URL.LABEL') }}
            </span>
            <input
              v-model.trim="url"
              type="text"
              :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.URL.PLACEHOLDER')"
              @blur="v$.url.$touch"
            />
            <span v-if="v$.url.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.URL.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-1/4">
          <label :class="{ error: v$.apiKey.$error }">
            <span>
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.LABEL') }}
            </span>
            <input
              v-model.trim="apiKey"
              type="text"
              :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.PLACEHOLDER')"
              @blur="v$.apiKey.$touch"
            />
            <span v-if="v$.apiKey.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.API_KEY.ERROR') }}
            </span>
          </label>
        </div>

        <div class="max-w-[65%] w-full messagingServiceHelptext">
          <label for="useRejectCalls">
            <input
              id="useRejectCalls"
              v-model="useRejectCalls"
              type="checkbox"
              class="checkbox"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.REJECT_CALLS.SERVICE') }}
          </label>
        </div>

        <div v-if="useRejectCalls" class="w-1/4">
          <label :class="{ error: v$.rejectCalls.$error }">
            <span>
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.REJECT_CALLS.LABEL') }}
            </span>
            <input
              v-model.trim="rejectCalls"
              type="text"
              :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.REJECT_CALLS.PLACEHOLDER')"
              @blur="v$.rejectCalls.$touch"
            />
            <span v-if="v$.rejectCalls.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.REJECT_CALLS.ERROR') }}
            </span>
          </label>
        </div>

        <div v-if="useRejectCalls" class="w-1/4">
          <label :class="{ error: v$.messageCallsWebhook.$error }">
            <span>
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.MESSAGE_CALLS_WEBHOOK.LABEL') }}
            </span>
            <input
              v-model.trim="messageCallsWebhook"
              type="text"
              :placeholder="$t('INBOX_MGMT.ADD.WHATSAPP.MESSAGE_CALLS_WEBHOOK.PLACEHOLDER')"
              @blur="v$.messageCallsWebhook.$touch"
            />
            <span v-if="v$.messageCallsWebhook.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.MESSAGE_CALLS_WEBHOOK.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.sendAgentName.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="sendAgentName"
              :value="sendAgentName"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_AGENT_NAME.LABEL') }}
            <span v-if="v$.sendAgentName.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_AGENT_NAME.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.ignoreGroupMessages.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="ignoreGroupMessages"
              :value="ignoreGroupMessages"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_GROUPS.LABEL') }}
            <span v-if="v$.ignoreGroupMessages.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_GROUPS.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.ignoreHistoryMessages.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="ignoreHistoryMessages"
              :value="ignoreHistoryMessages"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_HISTORY.LABEL') }}
            <span v-if="v$.ignoreHistoryMessages.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_HISTORY.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.webhookSendNewMessages.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="webhookSendNewMessages"
              :value="webhookSendNewMessages"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.WEBWOOK_SEND_NEW_MESSAGES.LABEL') }}
            <span v-if="v$.webhookSendNewMessages.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.WEBWOOK_SEND_NEW_MESSAGES.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.ignoreBroadcastStatuses.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="ignoreBroadcastStatuses"
              :value="ignoreBroadcastStatuses"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_BROADCAST_STATUSES.LABEL') }}
            <span v-if="v$.ignoreBroadcastStatuses.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_BROADCAST_STATUSES.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.ignoreBroadcastMessages.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="ignoreBroadcastMessages"
              :value="ignoreBroadcastMessages"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_BROADCAST_MESSAGES.LABEL') }}
            <span v-if="v$.ignoreBroadcastMessages.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_BROADCAST_MESSAGES.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.ignoreOwnMessages.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="ignoreOwnMessages"
              :value="ignoreOwnMessages"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_OWN_MESSAGES.LABEL') }}
            <span v-if="v$.ignoreOwnMessages.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_OWN_MESSAGES.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.ignoreYourselfMessages.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="ignoreYourselfMessages"
              :value="ignoreYourselfMessages"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_YOURSELF_MESSAGES.LABEL') }}
            <span v-if="v$.ignoreYourselfMessages.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.IGNORE_YOURSELF_MESSAGES.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.sendConnectionStatus.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="sendConnectionStatus"
              :value="sendConnectionStatus"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_CONNECTION_STATUS.LABEL') }}
            <span v-if="v$.sendConnectionStatus.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_CONNECTION_STATUS.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.notifyFailedMessages.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="notifyFailedMessages"
              :value="notifyFailedMessages"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.NOTIFY_FAILED_MESSAGES.LABEL') }}
            <span v-if="v$.notifyFailedMessages.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.NOTIFY_FAILED_MESSAGES.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.composingMessage.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="composingMessage"
              :value="composingMessage"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.COMPOSING_MESSAGE.LABEL') }}
            <span v-if="v$.composingMessage.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.COMPOSING_MESSAGE.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.sendReactionAsReply.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="sendReactionAsReply"
              :value="sendReactionAsReply"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_REACTION_AS_REPLY.LABEL') }}
            <span v-if="v$.sendReactionAsReply.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_REACTION_AS_REPLY.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <label :class="{ error: v$.sendProfilePicture.$error }" style="display: flex; align-items: center;">
            <woot-switch
              v-model="sendProfilePicture"
              :value="sendProfilePicture"
              style="flex: 0 0 auto; margin-right: 10px;"
            />
            {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_PROFILE_PICTURE.LABEL') }}
            <span v-if="v$.sendProfilePicture.$error" class="message">
              {{ $t('INBOX_MGMT.ADD.WHATSAPP.SEND_PROFILE_PICTURE.ERROR') }}
            </span>
          </label>
        </div>

        <div class="w-3/4 pb-4 config-helptext">
          <img v-if="qrcode" :src="qrcode" />
          <div v-if="notice">{{ notice }}</div>
        </div>

        <div class="my-4 w-auto">
          <woot-submit-button
            :loading="uiFlags.isUpdating"
            :button-text="`${$t(
            'INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_SECTION_UPDATE_BUTTON'
            )} and ${$t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_CONNECT')}`"
            @click="connect = true"
          />
          <woot-submit-button
            :loading="uiFlags.isUpdating"
            :button-text="$t('INBOX_MGMT.SETTINGS_POPUP.WHATSAPP_DISCONNECT')"
            @click="disconnect = true"
          />
          <woot-submit-button
            :loading="uiFlags.isUpdating"
            :button-text="$t('INBOX_MGMT.ADD.WHATSAPP.GENERATE_API_KEY.LABEL')"
            @click="generateToken"
          />
        </div>
      </form>
    </div>
    <!-- Aba de Parâmetros Fim -->

	<!-- Aba de Webhooks Inicio-->
	<div v-else>
	  <div class="flex justify-between items-center mb-4">
	    <h3>{{ $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.DESCRIPTION') }}</h3>
	    <woot-submit-button
	      :button-text="$t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.ADD')"
	      @click="showAddWebhookModal"
	    />
	  </div>
	  <table class="webhook-table">
	    <thead>
	      <tr>
	        <th>{{ $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.ID') }}</th>
	        <th>{{ $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.URL_ABSOLUT') }}</th>
            <th></th> <!-- <th>{{ $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.BUTTON') }}</th> -->
            <th></th> <!-- <th>{{ $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.ACTIONS') }}</th> -->
	      </tr>
	    </thead>
	    <tbody>
	      <tr v-for="(webhook, index) in webhooks" :key="index">
	        <td>{{ webhook.id }}</td>

	        <!-- URL com truncagem e tooltip -->
	        <td :title="webhook.urlAbsolute">
	          {{ webhook.urlAbsolute.length > 80 ? webhook.urlAbsolute.substring(0, 80) + '...' : webhook.urlAbsolute }}
	        </td>
	        <td>
	          <woot-switch
	            v-model="webhook.sendNewMessages"
	            :value="webhook.sendNewMessages"
	            @change="toggleSendNewMessages(index)"
	          />
	        </td>
	        <td>
	          <woot-submit-button 
	            :button-text="$t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.EDIT')"
	            @click="editWebhook(index)"
	            style="display: inline-block;"
	          />
	        </td>
	        <td>
	          <woot-submit-button 
	            :button-text="$t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.DELETE')"
	            @click="removeWebhook(index)"
	            style="display: inline-block;"
	          />
	        </td>
	      </tr>
	    </tbody>
	  </table>
	
	  <!-- Modal para Adicionar/Editar Webhook -->
	  <modal v-if="showWebhookModal" @close="closeWebhookModal">
	    <h3>{{ editingWebhook ? $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.EDIT') : $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.ADD') }}</h3>
	    <form @submit.prevent="submitWebhook">
	      <label>
	        {{ $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.ID') }}
	        <input v-model="webhookForm.id" type="text" required />
	      </label>
	      <label>
	        {{ $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.URL_ABSOLUT') }}
	        <input v-model="webhookForm.urlAbsolute" type="text" required />
	      </label>
	      <label>
	        {{ $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.TOKEN') }}
	        <input v-model="webhookForm.token" type="text" />
	      </label>
	      <label>
	        {{ $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.HEADER') }}
	        <input v-model="webhookForm.header" type="text" />
	      </label>
	      <woot-submit-button 
	        :button-text="editingWebhook ? $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.SAVE') : $t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.ADD')"
	        @click="submitWebhook"
	      />
	      <woot-submit-button 
	        :button-text="$t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.CANCEL')"
	        @click="closeWebhookModal"
	        style="margin-left: 10px;"
	      />
	    </form>
	  </modal>
	</div>
	<!-- Aba de Webhooks Fim-->

  </div>
</template>

<script type="module">
import { io } from 'socket.io-client';
import { useVuelidate } from '@vuelidate/core';
import { useAlert } from 'dashboard/composables';
import inboxMixin from 'shared/mixins/inboxMixin';
import { required } from '@vuelidate/validators';
import { mapGetters } from 'vuex';
// import { createConsumer } from '@rails/actioncable';

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  mixins: [inboxMixin],
  props: {
    inbox: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      apiKey: '',
      url: 'https://unoapi.cloud',
      ignoreGroupMessages: true,
      ignoreHistoryMessages: true,
      webhookSendNewMessages: true,
      sendAgentName: true,
      ignoreBroadcastStatuses: true,
      ignoreBroadcastMessages: true,
      ignoreOwnMessages: true,
      ignoreYourselfMessages: true,
      sendConnectionStatus: true,
      notifyFailedMessages: true,
      composingMessage: true,
      sendReactionAsReply: true,
      sendProfilePicture: true,
      useRejectCalls: false,
      connect: false,
      disconnect: false,
      qrcode: '',
      notice: '',
      rejectCalls: '',
      messageCallsWebhook: '',
      webhooks: [],
      showWebhookModal: false,
      editingWebhook: false,
      webhookForm: {
        id: '',
        urlAbsolute: '',
        sendNewMessages: true,
        token: '',
        header: 'Authorization',
      },
      activeTab: 0,
    };
  },
  watch: {
    useRejectCalls(newValue) {
      if (!newValue) {
        this.rejectCalls = '';
        this.messageCallsWebhook = '';
      }
    },
    inbox() {
      this.setDefaults();
    },
  },
  computed: {
    ...mapGetters({ uiFlags: 'inboxes/getUIFlags' }),
  },
  validations: {
    apiKey: { required },
    ignoreGroupMessages: { required },
    generateQrcode: { required },
    ignoreHistoryMessages: { required },
    webhookSendNewMessages: { required },
    sendAgentName: { required },
    url: { required },
    ignoreBroadcastStatuses: { required },
    ignoreBroadcastMessages: { required },
    ignoreOwnMessages: { required },
    ignoreYourselfMessages: { required },
    sendConnectionStatus: { required },
    notifyFailedMessages: { required },
    composingMessage: { required },
    sendReactionAsReply: { required },
    sendProfilePicture: { required },
    useRejectCalls: { required },
    rejectCalls: { required },
    messageCallsWebhook: { required },
  },
  mounted() {
    this.setDefaults();
    this.listenerQrCode();
  },
  methods: {
    onTabChange(index) {
      this.activeTab = index;
    },
    setDefaults() {
      this.apiKey = this.inbox.provider_config.api_key;
      this.url = this.inbox.provider_config.url;
      this.ignoreGroupMessages = this.inbox.provider_config.ignore_group_messages;
      this.ignoreHistoryMessages = this.inbox.provider_config.ignore_history_messages;
      this.webhookSendNewMessages = this.inbox.provider_config.webhook_send_new_messages;
      this.sendAgentName = this.inbox.provider_config.send_agent_name;
      this.ignoreBroadcastStatuses = this.inbox.provider_config.ignore_broadcast_statuses;
      this.ignoreBroadcastMessages = this.inbox.provider_config.ignore_broadcast_messages;
      this.ignoreOwnMessages = this.inbox.provider_config.ignore_own_messages;
      this.ignoreYourselfMessages = this.inbox.provider_config.ignore_yourself_messages;
      this.sendConnectionStatus = this.inbox.provider_config.send_connection_status;
      this.notifyFailedMessages = this.inbox.provider_config.notify_failed_messages;
      this.composingMessage = this.inbox.provider_config.composing_message;
      this.sendReactionAsReply = this.inbox.provider_config.send_reaction_as_reply;
      this.sendProfilePicture = this.inbox.provider_config.send_profile_picture;
      this.useRejectCalls = this.inbox.provider_config.use_reject_calls;
      this.rejectCalls = this.inbox.provider_config.reject_calls;
      this.messageCallsWebhook = this.inbox.provider_config.message_calls_webhook;
      this.connect = false;
      this.disconnect = false;
      this.webhooks = this.inbox.provider_config.webhooks || [];
    },
    showAddWebhookModal() {
      this.showWebhookModal = true;
      this.webhookForm = {
        id: '',
        urlAbsolute: '',
        sendNewMessages: true,
        token: '',
        header: 'Authorization',
      };
      this.editingWebhook = false;
    },
    editWebhook(index) {
      this.showWebhookModal = true;
      this.webhookForm = { ...this.webhooks[index] };
      this.editingWebhook = true;
    },
    removeWebhook(index) {
      if (this.webhooks[index].id !== 'default') {
        this.webhooks.splice(index, 1);
      } else {
        useAlert(this.$t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.ERROR_DELETE'));
      }
    },
    closeWebhookModal() {
      this.showWebhookModal = false;
    },
    submitWebhook() {
      const existingWebhook = this.webhooks.find(w => w.urlAbsolute === this.webhookForm.urlAbsolute && w.id !== this.webhookForm.id);
      if (existingWebhook) {
        useAlert(this.$t('INBOX_MGMT.ADD.WHATSAPP.TAB_NAME.TAB_WEBHOOK.DUPLICATE'));
        return;
      }

      if (this.editingWebhook) {
        const index = this.webhooks.findIndex(w => w.id === this.webhookForm.id);
        if (index !== -1) {
          this.webhooks.splice(index, 1, this.webhookForm);
        }
      } else {
        this.webhooks.push(this.webhookForm);
      }
      this.closeWebhookModal();
    },
    toggleSendNewMessages(index) {
      this.webhooks[index].sendNewMessages = !this.webhooks[index].sendNewMessages;
    },
    listenerQrCode() {
      const url = `${this.inbox.provider_config.url}`
        .replace('https', 'wss')
        .replace('http', 'ws');
      const socket = io(url, { path: '/ws' });
      socket.on('broadcast', data => {
        console.log('data', data)
        if (data.phone !== this.inbox.provider_config.phone_number_id) {
          this.notice = `Received message from ${data.phone} but the current number in chatwoot is ${this.inbox.provider_config.phone_number_id}`;
          this.qrcode = '';
          // broadcast phone is other
          return;
        }
        if (data.type === 'status') {
          this.notice = data.content;
          this.qrcode = '';
        } else if (data.type === 'qrcode') {
          this.qrcode = data.content;
          this.notice = '';
        }
      });
      // const url = `${this.inbox.provider_config.url}/ws`;
      // const cable = createConsumer(url);
      // cable.subscriptions.create(
      //   {
      //     channel: 'broadcast',
      //     phone_number: this.inbox.provider_config.phone_number_id,
      //   },
      //   {
      //     broadcast: data => {
      //       console.log('broadcast');
      //       this.qrcode = data;
      //     },
      //     connected: () => {
      //       console.log('connected');
      //       this.qrcode = 'waiting for qrcode';
      //     },
      //   }
      // );
    },
    generateToken() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let token = '';
      for (let i = 0; i < 64; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      if (this.apiKey) {
        if (confirm('A token already exists. Do you want to replace it?')) {
          this.apiKey = token;
        }
      } else {
        this.apiKey = token;
      }
    },
    async updateInbox() {
      const payload = {
        id: this.inbox.id,
        formData: false,
        channel: {
          provider_config: {
            ...this.inbox.provider_config,
            api_key: this.apiKey,
            ignore_history_messages: this.ignoreHistoryMessages,
            ignore_group_messages: this.ignoreGroupMessages,
            send_agent_name: this.sendAgentName,
            webhook_send_new_messages: this.webhookSendNewMessages,
            url: this.url,
            ignore_broadcast_statuses: this.ignoreBroadcastStatuses,
            ignore_broadcast_messages: this.ignoreBroadcastMessages,
            ignore_own_messages: this.ignoreOwnMessages,
            ignore_yourself_messages: this.ignoreYourselfMessages,
            send_connection_status: this.sendConnectionStatus,
            notify_failed_messages: this.notifyFailedMessages,
            composing_message: this.composingMessage,
            send_reaction_as_reply: this.sendReactionAsReply,
            send_profile_picture: this.sendProfilePicture,
            use_reject_calls: this.useRejectCalls,
            reject_calls: this.rejectCalls,
            message_calls_webhook: this.messageCallsWebhook,
            connect: this.connect,
            disconnect: this.disconnect,
            webhooks: this.webhooks,
          },
        },
      };
      try {
        await this.$store.dispatch('inboxes/updateInbox', payload);
        useAlert(this.$t('INBOX_MGMT.EDIT.API.SUCCESS_MESSAGE'));
      } catch (error) {
        useAlert(this.$t('INBOX_MGMT.EDIT.API.ERROR_MESSAGE'));
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.whatsapp-settings--content {
  ::v-deep input {
    margin-bottom: 0;
  }

  .checkbox {
    margin: 0px 4px;
  }
}

.switch {
  flex: 0 0 auto;
  margin-right: 10px;
}

.switch-label {
  display: flex;
  align-items: center;
}

.flex-shrink div .messagingServiceHelptext {
  width: 343px;
  max-width: 343px;
  margin-bottom: 8px;
}

.flex-shrink div .w-1\/4 {
  min-width: 700px;
  height: 77px;
}

#app .flex .w-full {
  transform: translatex(0px) translatey(0px);
}

#app .flex-grow-0 .overflow-hidden .justify-between .flex-shrink div .text-base .flex-col .config-helptext {
  width: 100% !important;
}

.flex-shrink div .config-helptext {
  min-height: 2px;
  height: 30px;
}

.flex-shrink .messagingServiceHelptext label {
  width: 204%;
  transform: translatex(0px) translatey(0px);
  position: relative;
  top: 6px;
}

.flex-shrink .config-helptext div {
  margin-top: 10px;
}

.flex-shrink div img {
  transform: translatex(407px) translatey(-347px);
  width: 300px;
  height: 300px;
}

.flex-shrink div .message {
  margin-top: -20px;
  font-size: 11px;
}

.webhook-table {
  width: 100%;
  th,
  td {
    padding: 8px;
    text-align: left;
  }
}

#app .flex-grow-0 .overflow-hidden .justify-between .flex-shrink div .text-base > div {
  width: 63% !important;
}

.flex-shrink modal h3 {
  background-color: #369eff;
  color: #369eff;
}

#app .overflow-hidden .flex-shrink {
  transform: translatex(0px) translatey(0px);
}
</style>
