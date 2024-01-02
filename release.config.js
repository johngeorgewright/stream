// @ts-check

/**
 * @type {import('semantic-release').Options}
 */
module.exports = {
  branches: ['main'],
  extends: [require.resolve('semantic-release-monorepo')],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: require.resolve('conventional-changelog-conventionalcommits'),
      },
    ],
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/exec',
      {
        verifyConditionsCmd: 'yarn npm whoami --publish',
        prepareCmd:
          "yarn version ${nextRelease.version} && echo 'version=${nextRelease.version}' >> $GITHUB_OUTPUT",
        publishCmd: 'yarn npm publish --access public',
      },
    ],
    [
      '@semantic-release/git',
      {
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
    '@semantic-release/github',
  ],
}
