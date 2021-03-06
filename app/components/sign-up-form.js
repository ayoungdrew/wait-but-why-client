import Component from '@ember/component'

export default Component.extend({
  tagName: 'form',
  classNames: ['form-horizontal'],

  actions: {
    submit () {
      // console.log(this.get('credentials'))
      this.sendAction('submit', this.get('credentials'))
    },

    reset () {
      this.set('credentials', {})
    }
  }
})
