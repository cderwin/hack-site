module.exports = {
    files: {
        javascripts: {
            joinTo: 'app.js'
        },
        stylesheets: {
            joinTo: 'app.css'
        },
        templates: {
            joinTo: 'app.js'
        }
    },
    plugins: {
        babel: {
            presets: ['es2015']
        },
        sass: {
            options: {
                includePaths: ['app', 'vendor/styles']
            }
        }
    }
};
