import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp'

export default Route.extend({
  auth: service(),
  ajax: service(),

  model (params) {
    const currentUserEmail = this.get('auth.credentials.email')
    return RSVP.hash({
      posts: this.get('store').findAll('event')
      .then(results => results.filter((x) => {
        return x.get('user_id').toString() === params.user_id
      }))
        .then(events => events.sortBy('date').reverse()),
      fellowUser: this.get('store').findRecord('user', params.user_id)
        .then((data) => data.get('email')),
      fellowUserId: this.get('store').findRecord('user', params.user_id)
        .then((data) => data.get('id')),
      following: this.get('store').findRecord('user', params.user_id)
        .then((data) => data.get('following')),
      followers: this.get('store').findRecord('user', params.user_id)
        .then((data) => data.get('followers')),
      activeRelationships: this.get('store').findRecord('user', params.user_id)
        .then((data) => data.get('active_relationships')),
      actRelationships: this.get('store').findAll('relationship')
        .then(results => results.filter((x) => {
          return x.get('follower_id') === Number(params.user_id)
        })),
      passiveRelationships: this.get('store').findAll('relationship')
        .then(results => results.filter((x) => {
          return x.get('followed_id') === Number(params.user_id)
        }))
    })
  },

  actions: {
    destroyEvent (event) {
      event.destroyRecord()
        .then(() => { this.toast.success('Killed that event!', '', { positionClass: 'toast-bottom-right' }) })
        .then(() => this.refresh())
        .catch((error) => { this.toast.error('Error is', error, { positionClass: 'toast-bottom-right' }) })
    },
    destroyComment (commentObj) {
      this.get('store').findRecord('comment', commentObj.get('id'))
        .then((comment) => comment.destroyRecord())
        .then(() => { this.toast.success('Deleted!', '', { positionClass: 'toast-bottom-right' }) })
        .catch((error) => { this.toast.error('You broke it!', error, { positionClass: 'toast-bottom-right' }) })
    },
    createComment (commentPojo) {
      console.log('pojo is', commentPojo)
      const comment = this.get('store').createRecord('comment', commentPojo)
      return comment.save()
        .then(() => { this.toast.success('Done!', '', { positionClass: 'toast-bottom-right' }) })
        .then(() => this.refresh())
        .catch((error) => { this.toast.error('Something wrong...', error, { positionClass: 'toast-bottom-right' }) })
    },
    updateComment (editedComment) {
      // console.log('last stop', editedComment)
      const comment = editedComment
      comment.save()
      .then(() => { this.toast.success('Update great success!', '', { positionClass: 'toast-bottom-right' }) })
      .catch((error) => { this.toast.error('Something wrong...', error, { positionClass: 'toast-bottom-right' }) })
    },
    createRelationship (friendId) {
      // friendId is the one who current user is trying to follow
      const newRelObj = {}
      newRelObj.follower_id = this.get('auth.credentials.id')
      newRelObj.followed_id = Number(friendId)
      console.log('logging', newRelObj)
      const relationship = this.get('store').createRecord('relationship', newRelObj)
      return relationship.save()
        .then(() => this.refresh())
        .then(() => this.transitionTo('user', friendId))
        .then(() => { this.toast.success('Following!', '', { positionClass: 'toast-bottom-right' }) })
    },
    destroyRelationship (relId) {
      // console.log('made it!', relId)
      // console.log(this.get('store').findRecord('relationship', relId))
      this.get('store').findRecord('relationship', relId)
        .then((data) => data.destroyRecord())
        // .then(() => this.refresh())
        // .then(() => this.transitionTo('user', friendId))
        // .then(() => { this.toast.success('Following!', '', { positionClass: 'toast-bottom-right' }) })
    }
  }
})
