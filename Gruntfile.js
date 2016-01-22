module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    baseUrl: 'client',
                    name: 'main',
                    out: 'dist/main.js',
                    fileExclusionRegExp: /^(r|build)\$/,
                    optimizeCss: 'standard',
                    removeCombined: true,
                    mainConfigFile: 'client/main.js'
                }
            }
        },
        nodemon: {
            dev: {
                script: 'bin/www'
            }
        },
        cssmin: {
            dist: {
                files: {
                    'dist/css/styles.min.css': 'client/css/styles.css'
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'client/src/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }
    });
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('default', ['jshint', 'requirejs', 'cssmin']);
    grunt.registerTask('run', ['concurrent']);
};