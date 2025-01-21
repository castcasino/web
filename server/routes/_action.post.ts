export default defineEventHandler((event) => {
    /* Initialize locals. */
    let action
    let form

    /* Build form. */
    form = {
        type: 'form',
        title: 'Game Creator',
        url: 'https://cast.casino/app/creator',
    }

    /* Return form. */
    return form
})
