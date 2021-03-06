<template>
  <div class="chatbot">
    <figure class="chatbot-icon" @click="openModal()">
      <img src="~/assets/img/chatbot.svg" alt="Bobby">
    </figure>
    <div
      v-if="messages"
      ref="chatbotMessages"
      class="chatbot-messages is--animating"
    >
      <transition-group
        key="messageList"
        :name="'slide-fade'"
        mode="out-in"
        tag="ul"
        :style="{'--item-count': messages.length }"
        class="list-unstyled chatbot-messages__list"
      >
        <li
          v-for="(message, i) in messages"
          :key="message.substring(0, 4)"
          class="chatbot-messages__list__item chatbot-text-message"
          :class="{ 'skip-animation' : skipDelay }"
          :style="{'--item-index': i, '--item-delay': messageDelay(messages, i) }"
          @click="checkAction(storyId)"
          v-html="$md.render(message)"
        />
        <li
          v-if="actions && actions[0]"
          :key="actions[0].text || 'none'"
          class="chatbot-messages__list__item chatbot-actions"
          :style="{'--item-index': messages.length + 1, '--item-delay': actionDelay(messages.length) }"
        >
          <button
            v-for="(action, i) in actions"
            :key="i"
            class="button button--sm"
            :class="action.type"
            @click="bindScope(action)"
          >
            {{ action.text }}
          </button>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      skipDelay: false,
      animating: false
    }
  },

  computed: {
    ...mapState({
      messages: state => state.chatbot.activeMessages,
      actions: state => state.chatbot.activeActions,
      timer: state => state.chatbot.timer,
      storyId: state => state.chatbot.storyId
    })
  },

  watch: {
    timer (newValue) {
      if (newValue > 0) {
        this.setTimer(newValue)
      }
    }
  },

  methods: {
    messageDelay (messages, i) {
      if (this.skipDelay) {
        if (i !== messages.length) { return i * 0.2 }
      }

      const message = i > 0 ? messages[i - 1] : messages[i]

      if (message.length < 20) {
        return i
      } else if (message.length < 100) {
        return i + 0.2
      } else if (message.length < 150) {
        return i + 0.5
      }

      return i + 0.8
    },

    actionDelay (messagesLength) {
      if (this.skipDelay) { return messagesLength * 0.2 + 0.2 }
      return messagesLength + 0.5
    },

    bindScope (inputAction) {
      if (inputAction.action === 'moreInfo') {
        this.$router.push('/info')
      }

      this.$store.commit('chatbot/setAction', inputAction.action)
    },

    setTimer (time) {
      const that = this

      setTimeout(function () {
        that.$store.commit('chatbot/setToIdle')
      }, time)
    },

    openModal () {
      this.$store.dispatch('modal/setActiveModal', 'bobby')
    },

    checkAction (id) {
      if (id === 999999) { this.openModal() }
    }
  }
}
</script>

<style lang="scss">
$chatbot-message-icon-size: 10px;
$chatbot-icon-size: 60px;

.chatbot-icon {
  border-radius: 100px;
  box-shadow: 1px 5px 16px 0 rgba(28,43,73,0.03);
  cursor: pointer;
  background: #fff;
  transition: all .2s;
  border: 3px solid transparent;
  width: rem($chatbot-icon-size);

  &:hover {
    border-color: theme-color(secondary)
  }

  img {
    width: 100%;
  }
}

.chatbot {
  position: relative;
  display: flex;
  left: 0;
  right: 0;
  margin-top: 20px;
  align-items: flex-start;
  z-index: 20;
  width: 100%;
  max-width: 50%;
}

.chatbot-messages {
  position: absolute;
  margin-left: rem($chatbot-icon-size);
  width: calc(100% - #{$chatbot-icon-size});
}

@keyframes fadeUp {
  from { transform: translate(0, 20px); opacity: 0; }
  to { transform: translate(0, 0); opacity: 1; }
}

.chatbot-messages__list {
  padding: 20px;
  display: flex;
  flex-flow: column;
  align-items: flex-start;

  .is--animating &__item {
    margin-bottom: rem(7px);
  }
}

.chatbot-text-message {
  background: theme-color(primary);
  box-shadow: 1px 5px 16px 0 rgba(28,43,73,0.03);
  border-radius: 22px;
  padding: 10px 20px;
  position: relative;
  display: inline-block;
  max-width: 300px;
  color: #fff;
  font-weight: 700;

  *:last-child {
    margin-bottom: 0;
  }

  &:after {
    content: '';
    position: absolute;
    background: theme-color(primary);
    transform: rotate(45deg);
    width: $chatbot-message-icon-size;
    height: $chatbot-message-icon-size;
    left: -3px;
    top: 18px;
  }
}

.chatbot-actions {
  margin-top: 7px;
}

$temp-duration: .25s;
.slide-fade-enter-active {
  transition: all $temp-duration ease;
  transition-delay: calc(1s * var(--item-delay));

  + .chatbot-actions {
    transition: opacity $temp-duration ease;
    transition-delay: calc(1s * var(--item-delay));
  }
}
.slide-fade-leave-active {
  transition: all $temp-duration ease;
  display: none;
}
.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;

  + .chatbot-actions {
    transform: translateX(10px);
    opacity: 0;
  }
}

.slide-fade-leave-to {
  opacity: 0;

  + .chatbot-actions {
    opacity: 0;
  }
}
</style>
