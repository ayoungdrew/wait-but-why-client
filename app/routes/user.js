<<<<<<< HEAD
import Route from '@ember/routing/route'
=======
import { alias } from '@ember/object/computed'
import Route from '@ember/routing/route'
import Component from '@ember/component'
import { inject as service } from '@ember/service'
>>>>>>> add-follows
import RSVP from 'rsvp'

export default Route.extend({
  auth: service(),
  isFollowing: true,
  currentUser: alias('auth.credentials.email'),
  userId: alias('auth.credentials.id'),

  model (params) {
    const currentUserEmail = this.get('auth.credentials.email')
    return RSVP.hash({
      // return FIRST key-value 'posts' to load user's event posts
      posts: this.get('store').findAll('event')
<<<<<<< HEAD
        .then(results => results.filter((x) => {
          return x.get('user_id').toString() === params.user_id
        }))
        .then(events => events.sortBy('date').reverse()),
      // return SECOND key-value 'fellowUser' to load user's 'email'/username
      fellowUser: this.get('store').findRecord('user', params.user_id)
        .then((data) => data.get('email'))
=======
      .then(results => results.filter((x) => {
        return x.get('user_id').toString() === params.user_id
      }))
        .then(events => events.sortBy('date').reverse()),
      currentUserId: this.get('auth.credentials.id'),
      fellowUser: this.get('store').findRecord('user', params.user_id)
        .then((data) => data.get('email')),
      fellowUserId: this.get('store').findRecord('user', params.user_id)
        .then((data) => Number(data.get('id'))),
      activeRelationships: this.get('store').findAll('relationship')
        .then(results => results.filter((x) => {
          return x.get('follower_id') === Number(params.user_id)
        })),
      passiveRelationships: this.get('store').findAll('relationship')
        .then(results => results.filter((x) => {
          return x.get('followed_id') === Number(params.user_id)
        })),
        // This finds the relationship object that represents the signed in
        // user following the current viewed user if it exists
      thisRelationship: this.get('store').findAll('relationship')
          .then(results => results.find((x) => {
            return x.get('followed_id') === Number(params.user_id) && x.get('follower_id') === this.get('auth.credentials.id')
          }))
>>>>>>> add-follows
    })
  },

  actions: {
    destroyEvent (event) {
<<<<<<< HEAD
      // End of action chain; destroys event post & comments
=======
>>>>>>> add-follows
      event.destroyRecord()
        .then(() => { this.toast.success('Killed that event!', '', { positionClass: 'toast-bottom-right' }) })
        .then(() => this.refresh())
        .catch((error) => { this.toast.error('Error is', error, { positionClass: 'toast-bottom-right' }) })
    },
    // End of action chain; destroys individual comment
    destroyComment (commentObj) {
      this.get('store').findRecord('comment', commentObj.get('id'))
        .then((comment) => comment.destroyRecord())
        .then(() => { this.toast.success('Deleted!', '', { positionClass: 'toast-bottom-right' }) })
        .catch((error) => { this.toast.error('You broke it!', error, { positionClass: 'toast-bottom-right' }) })
    },
    // End of action chain; creates comment associated with event post
    createComment (commentPojo) {
      const comment = this.get('store').createRecord('comment', commentPojo)
      return comment.save()
        .then(() => { this.toast.success('Done!', '', { positionClass: 'toast-bottom-right' }) })
        .then(() => this.refresh())
        .catch((error) => { this.toast.error('Something wrong...', error, { positionClass: 'toast-bottom-right' }) })
    },
    // End of action chain; updates comment
    updateComment (editedComment) {
      const comment = editedComment
      comment.save()
<<<<<<< HEAD
        .then(() => { this.toast.success('Update great success!', '', { positionClass: 'toast-bottom-right' }) })
        .catch((error) => { this.toast.error('Something wrong...', error, { positionClass: 'toast-bottom-right' }) })
=======
      .then(() => { this.toast.success('Update great success!', '', { positionClass: 'toast-bottom-right' }) })
      .catch((error) => { this.toast.error('Something wrong...', error, { positionClass: 'toast-bottom-right' }) })
    },
    createRelationship (friendId) {
      // friendId is the one who current user is trying to follow
      console.log(this.get('auth.credentials.id').toString())
      const newRelObj = {}
      newRelObj.follower_id = this.get('auth.credentials.id')
      newRelObj.followed_id = Number(friendId)
      const relationship = this.get('store').createRecord('relationship', newRelObj)
      if (newRelObj.followed_id !== this.get('auth.credentials.id')) {
        return relationship.save()
        .then(() => this.refresh())
        .then(() => { this.toast.success('Following!', '', { positionClass: 'toast-bottom-right' }) })
      }
    },
    destroyRelationship (relationshipId) {
      this.get('store').findRecord('relationship', relationshipId, {reload: true})
        .then((data) => data.destroyRecord())
        .then(() => this.refresh())
        .then(() => { this.toast.success('Unfollowed...', '', { positionClass: 'toast-bottom-right' }) })
    },
    destroyThisRelationship (relationshipObj) {
      console.log('logging', relationshipObj)
      const target = relationshipObj
      target.destroyRecord()
        .then(() => this.refresh())
        .then(() => { this.toast.success('Unfollowed...', '', { positionClass: 'toast-bottom-right' }) })
>>>>>>> add-follows
    }
  }
})
