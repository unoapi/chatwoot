import * as types from '../mutation-types';
import InboxAPI from '../../api/inboxes';
import JsSIP from 'jssip';

export const state = {
  records: [],
  uiFlags: {
    isFetching: false,
    isConnected: false,
    isConnnecting: false,
  },
};

export const getters = {
  get($state) {
    return $state.records;
  },
};

export const actions = {
  connect: async ({ commit }) => {
    commit(types.default.SET_EXTENSION_FETCHING_STATUS, true);
    commit(types.default.SET_EXTENSION_CONNECTED_STATUS, false);
    try {
      const { data } = await InboxAPI.getExtensions();
      commit(types.default.SET_EXTENSION_CONNECTING_STATUS, true);
      commit(types.default.SET_EXTENSION_FETCHING_STATUS, false);
      const extensions = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0, j = data.length; i < j; i++) {
        const extension = { ...data[i] };
        const socket = new JsSIP.WebSocketInterface(extension.url);
        const configuration = {
          sockets: [socket],
          uri: `sip:${extension.user}`,
          password: extension.password,
        };
        extension.status = 'offline';
        extension.call = {};
        extension.error = '';
        extension.handlers = {
          progress: e => {
            extension.call.event = e;
            extension.call.progress = true;
          },
          failed: e => {
            extension.call.event = e;
            extension.call.progress = false;
          },
          ended: e => {
            extension.call.event = e;
            extension.call.progress = false;
          },
          confirmed: e => {
            extension.call.event = e;
            extension.call.progress = true;
          },
          connected: e => {
            extension.call.event = e;
            extension.status = 'online';
          },
          disconnected: e => {
            extension.call.event = e;
            extension.status = 'offline';
          },
          registered: e => {
            extension.call.event = e;
            extension.status = 'online';
          },
        };
        try {
          extension.phone = new JsSIP.UA(configuration);
          extension.phone.start();
        } catch (e) {
          extension.error = e;
        }
        extensions.push(extension);
      }
      commit(types.default.SET_EXTENSIONS, extensions);
    } catch (error) {
      commit(types.default.SET_EXTENSION_FETCHING_STATUS, false);
      commit(types.default.SET_EXTENSION_CONNECTED_STATUS, false);
      commit(types.default.SET_EXTENSION_CONNECTING_STATUS, false);
    }
  },
};

export const mutations = {
  [types.default.SET_EXTENSION_FETCHING_STATUS]($state, status) {
    $state.uiFlags.isFetching = status;
  },
  [types.default.SET_EXTENSION_CONNECTING_STATUS]($state, status) {
    $state.uiFlags.isConnnecting = status;
  },
  [types.default.SET_EXTENSION_CONNECTED_STATUS]($state, status) {
    $state.uiFlags.isConnnected = status;
  },
  [types.default.SET_EXTENSIONS]($state, records) {
    $state.records = records;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
