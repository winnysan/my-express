import { deleteAsync } from 'del'
import { dest, series, task } from 'gulp'
import gulpTypescript from 'gulp-typescript'

/**
 * Clear previous build
 */
task('build-clean', () => deleteAsync(['./dist']))

/**
 * Transpile backend to target folder
 */
task('typescript-transpile', () => {
  const tsProject = gulpTypescript.createProject('tsconfig.json')
  tsProject.config['exclude'] = ['./src/public/ts/**/*']

  return tsProject.src().pipe(tsProject()).js.pipe(dest('dist'))
})

/**
 * Default task
 */
task('default', series('build-clean', 'typescript-transpile'))
