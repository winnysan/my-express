import Bootstrap from './lib/Bootstrap'
import SpaRouter from './lib/SpaRouter'
import './localization'

/**
 * Main entry point of the application
 */
console.log(
  `%c${window.localization.getLocalizedText('scriptLoadedSuccessfully')}`,
  'color: white; background-color: green; font-weight: bold; padding: 2px 4px; border-radius: 3px;'
)

/**
 * Initializes the SPA router with callback to initialize the bootstrap class
 */
new SpaRouter(() => Bootstrap.initialize())
