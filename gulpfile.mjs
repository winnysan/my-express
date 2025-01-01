import { exec } from 'child_process'
import { deleteAsync } from 'del'
import fs from 'fs'
import { dest, series, src, task } from 'gulp'
import gulpTypescript from 'gulp-typescript'
import minimist from 'minimist'

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
 * Copy views to target folder
 */
task('views-copy', () => src('./src/views/**/*.ejs').pipe(dest('./dist/views')))

/**
 * Frontend processing by webpack
 */
task('webpack-build', done => {
  const argv = minimist(process.argv.slice(1))
  const env = argv.env || 'development'

  exec(`npx webpack --env=${env}`, err => {
    if (err) return done(err)

    done()
  })
})

/**
 * Update ejs
 */
task('ejs-update', done => {
  const manifestPath = './dist/manifest.json'
  const ejsFilePath = './dist/views/layouts/main.ejs'

  fs.readFile(manifestPath, 'utf-8', (err, data) => {
    if (err) return done(err)

    const manifest = JSON.parse(data)
    const scriptTag = `<script type="text/javascript" src="${manifest['/js/script.js']}" defer></script>`
    const styleTag = `<link rel="stylesheet" href="${manifest['/css/style.css']}" />`

    fs.readFile(ejsFilePath, 'utf-8', (err, fileData) => {
      if (err) return done(err)

      const updatedFileData = fileData
        .replace(/<script type="text\/javascript" src="\/js\/.*\.js" defer><\/script>/, scriptTag)
        .replace(/<link rel="stylesheet" href="\/css\/.*\.css" \/>/, styleTag)

      fs.writeFile(ejsFilePath, updatedFileData, 'utf-8', err => {
        if (err) return done(err)

        done()
      })
    })
  })
})

/**
 * Default task
 */
task('default', series('build-clean', 'typescript-transpile', 'views-copy', 'webpack-build', 'ejs-update'))
