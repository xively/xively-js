/*jshint node: true */

'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      src: 'src/**/*.js',
      options: {
        specs: 'spec/*Spec.js',
        helpers: 'spec/*Helper.js',
        vendor: 'vendor/**/*.js'
      }
    },
    jshint: {
      files: [
        'Gruntfile.js',
        'src/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | <%= pkg.license %> */\n'
      },
      build: {
        src: 'src/**/*.js',
        dest: 'xivelyjs-<%= pkg.version %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jshint', 'jasmine']);
  grunt.registerTask('ci', ['default']);
  grunt.registerTask('build', ['uglify']);
};
