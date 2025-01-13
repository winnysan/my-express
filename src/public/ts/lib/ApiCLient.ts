export type ApiResponse = {
  message: string
  data?: object
}

/**
 * Client for interacting with the API
 */
class ApiClient<TResponse = ApiResponse> {
  private baseEndpoint: string

  /**
   * Create a new instance of ApiClient with the given base endpoint
   * @param baseEndpoint
   */
  constructor(baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint
  }

  /**
   * Retrieves the CSRF token from the server
   * @returns
   */
  private async getCsrfToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseEndpoint}/csrf-token`, {
        method: 'get',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const data = await response.json()

      if (!data.csrfToken) throw new Error(data.message)

      return data.csrfToken
    } catch (err) {
      throw err
    }
  }

  /**
   * Sends a POST request to the speciefied endpoint with CSRF protection and returns the response from the API
   * @param data
   * @param endpoint
   * @param method
   * @returns
   */
  public async fetch<U>(
    data: U,
    endpoint: string,
    method: 'post' | 'get' | 'put' | 'delete' = 'post'
  ): Promise<TResponse> {
    try {
      const csrfToken = await this.getCsrfToken()

      const response = await fetch(`${this.baseEndpoint}/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ data }),
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      return response.json() as Promise<TResponse>
    } catch (err) {
      throw err
    }
  }
}

export default ApiClient
