/**
 * Base controller class to provide a standardized structure for controllers
 */
class BaseController {
  /**
   * Generate a pagination URL
   * @param baseUrl
   * @param page
   * @param query
   */
  protected generatePaginationUrl(baseUrl: string, page: number | undefined, query: Record<string, any>): string {
    const queryParams = new URLSearchParams(query)

    if (page) queryParams.set('page', page.toString())

    return `${baseUrl}?${queryParams.toString()}`
  }
}

export default BaseController
