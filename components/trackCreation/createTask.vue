<template>
  <input-panel
    :title="title"
    :description="description"
  >
    <div
      slot="body"
      class="input-panel__large input-panel__large--primary"
    >
      <energy-slider @energyLevel="getEnergyLevel" />
    </div>
    <div
      slot="body"
      class="form-fields"
    >
      <div class="form-field">
        <div class="form-field__label">
          Kies een categorie
        </div>
        <div class="form-field__checkboxes">
          <label
            v-for="(checkbox, i) in checkboxes"
            :key="i"
            class="checkbox"
          >{{ checkbox }}
            <input
              type="radio"
              :checked="selectedCategory === checkbox"
              :value="checkbox"
              name="radio"
              @input="selectedCategory = $event.target.value"
            >
          </label>
        </div>
      </div>
      <div class="form-field">
        <label for="note">
          Waar ga je mee bezig?
        </label>
        <input
          id="title"
          v-model="taskTitle"
          placeholder="Wil je een korte titel toevoegen?"
          type="text"
          name="title"
        >
      </div>
      <div class="form-field">
        <label for="note">
          Hoe lang ga je ermee bezig? <small>(In minuten)</small>
        </label>
        <input
          id="title"
          v-model="duration"
          placeholder="90 min"
          type="number"
          name="title"
        >
      </div>
    </div>
    <div slot="footer">
      <button
        @click="saveTrackPart()"
        class="button button--primary"
      >
        Opslaan
      </button>
    </div>
  </input-panel>
</template>

<script>
import { trackViewStates } from '~/helpers/trackHelpers'
import inputPanel from '~/components/inputPanel'
import energySlider from '~/components/energySlider'

export default {
  components: {
    inputPanel,
    energySlider
  },

  data () {
    return {
      title: 'Taak toevoegen',
      description: 'Waar ga je mee bezig? Vul het hieronder in, en een stukje baan wordt voor je uitgezocht!',
      checkboxes: [
        'Werkblok',
        'Meeting',
        'Losse taken',
        'Administratie'
      ],
      energyLevel: null,
      selectedCategory: null,
      taskTitle: '',
      duration: 0
    }
  },

  methods: {
    getEnergyLevel ($event) {
      this.energyLevel = $event
    },

    saveTrackPart () {
      this.$store.commit('track/viewState', trackViewStates.OVERVIEW)
      this.$store.dispatch('track/setTrackPart', {
        type: 'task',
        category: this.selectedCategory,
        energy: this.energyLevel,
        title: this.taskTitle,
        duration: this.duration
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-field__checkboxes {
  display: flex;
}
</style>