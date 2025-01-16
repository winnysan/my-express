import ApiClient, { ApiResponse } from './ApiCLient'
import CategoryHandler from './CategoryHandler'
import CategorySelectHandler from './CategorySelectHandler'
import FilterFormHandler from './FilterFormHandler'
import FormHandler from './FormHandler'
import Helper from './Helper'
import SimpleEditor from './SimpleEditor'

/**
 * Bootstrap class responsible for initializing various components and handling UI interactions
 */
class Bootstrap {
  private static toastEl: HTMLUListElement | undefined = Helper.makeToast('#toast')

  static initialize(): void {
    /**
     * Navigation elements
     */
    const hamburgerButtonEl = Helper.selectElement<HTMLButtonElement>('#hamburger')
    const navigationEl = Helper.selectElement<HTMLUListElement>('.navigation')
    const headerOverlayEl = Helper.selectElement<HTMLDivElement>('#header-overlay')

    /**
     * Mobile menu toggle
     */
    hamburgerButtonEl?.addEventListener('click', () => {
      navigationEl?.classList.toggle('active')
      headerOverlayEl?.classList.toggle('active')
    })

    headerOverlayEl?.addEventListener('click', () => {
      navigationEl?.classList.remove('active')
      headerOverlayEl?.classList.remove('active')
    })

    /**
     * The current year in the footer
     */
    const yearEl = Helper.selectElement<HTMLSpanElement>('#year')
    if (yearEl) yearEl.innerText = String(new Date().getFullYear())

    /**
     * Form handlers
     */
    const editor = SimpleEditor.create('#form')

    new FormHandler('#form', editor)
    new FormHandler('#form-logout')
    new FormHandler('#form-account')
    new FormHandler('#form-password')

    new FilterFormHandler('#form-filter', ['categories', 'locales'])

    /**
     * Categories
     */
    const categoryHandler = CategoryHandler.getInstance('#categories')
    categoryHandler.refresh()

    /**
     * Categories select
     */
    new CategorySelectHandler('#categories-select')

    /**
     * Scroll to top
     */
    Helper.makeScrollButton('#scroll-to-top')

    /**
     * Delete posts
     */
    type DeleteResponse = ApiResponse & { data: { total: number } }

    const apiDeletePost = new ApiClient<DeleteResponse>(`${window.location.protocol}//${window.location.host}/api`)
    const totalUserPostsEl = Helper.selectElement<HTMLSpanElement>('#totalUserPosts')

    document.querySelectorAll<HTMLButtonElement>('.delete-post').forEach(button => {
      button.addEventListener('click', async (e: MouseEvent) => {
        const postId = button.getAttribute('data-id')

        if (postId && confirm(window.localization.getLocalizedText('postDeleteConfirm'))) {
          apiDeletePost
            .fetch({}, `posts/${postId}`, 'delete')
            .then(response => {
              const row = button.closest('tr')

              if (row) row.remove()
              if (totalUserPostsEl) totalUserPostsEl.textContent = String(response.data.total)

              Helper.addToastMessage(Bootstrap.toastEl, response.message, 'success')
            })
            .catch(err => {
              Helper.addToastMessage(
                Bootstrap.toastEl,
                window.localization.getLocalizedText('somethingWentWrong'),
                'danger'
              )

              console.error(err)
            })
        }
      })
    })

    /**
     * Handle likes
     */
    enum LikesActions {
      LIKE = 'like',
      UNLIKE = 'unlike',
    }

    type LikeData = {
      action?: LikesActions
      id?: string | null
    }

    type LikesResponse = ApiResponse & { data: { likes: string[] } }

    const apiHandleLikes = new ApiClient<LikesResponse>(`${window.location.protocol}//${window.location.host}/api`)

    document.querySelectorAll<HTMLButtonElement>('#likes button').forEach(button => {
      button.addEventListener('click', async (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('button')
        const postId = target?.getAttribute('data-id')
        let data: LikeData = { id: postId }

        if (target?.id === 'like') data.action = LikesActions.LIKE
        if (target?.id === 'unlike') data.action = LikesActions.UNLIKE

        if (data.id && data.action) {
          apiHandleLikes
            .fetch(data, `posts/${postId}`, 'put')
            .then(response => {
              const likes = response.data.likes

              const likesContainer = Helper.selectElement<HTMLDivElement>('#likes')

              if (likesContainer) {
                const likesCount = likesContainer.querySelector('span')

                if (likesCount) likesCount.textContent = String(likes.length)

                const userId = likesContainer.getAttribute('data-user-id')

                if (userId) {
                  likesContainer.querySelector('#like')?.classList.toggle('hidden', likes.includes(userId))
                  likesContainer.querySelector('#unlike')?.classList.toggle('hidden', !likes.includes(userId))
                }
              }

              Helper.addToastMessage(Bootstrap.toastEl, response.message, 'success')
            })
            .catch(err => {
              Helper.addToastMessage(
                Bootstrap.toastEl,
                window.localization.getLocalizedText('somethingWentWrong'),
                'danger'
              )

              console.error(err)
            })
        }
      })
    })
  }
}

export default Bootstrap
