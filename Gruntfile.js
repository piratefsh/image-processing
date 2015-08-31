module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            files: ['**/*.html', '**/*.js', '**/*.css'],
            options: {
                livereload: {
                    port: 9011
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-serve');

    grunt.registerTask('watch', ['watch'])
}