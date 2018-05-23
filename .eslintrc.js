// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: ['standard', 'plugin:flowtype/recommended', 'vue'],
    // required to lint *.vue files
    plugins: [
        'html',
        'flowtype'
    ],
    // add your custom rules here
    rules: {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        'indent': ['warn', 4, { "SwitchCase": 1 }],

        'space-before-function-paren': 0,

        'curly': 0,

        'jsx-quotes': 0,

        'eol-last': 0,

        'object-curly-spacing': 0,

        'no-return-assign': 0
    },
    settings: {}
}
