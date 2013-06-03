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
        vendor: 'vendor/**/*.js',
        template: require('grunt-template-jasmine-istanbul'),
        templateOptions: {
          coverage: 'coverage/coverage.json',
          report: 'coverage',
          thresholds: {
            lines: 44,
            statements: 43,
            branches: 28,
            functions: 27
          }
        }
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
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> | Copyright <%= pkg.author %> | <%= pkg.license %> */\n'
      },
      regular: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          preserveComments: 'all'
        },
        src: ['src/xivelyjs.js', 'src/**/*.js'],
        dest: 'xivelyjs-<%= pkg.version %>.js'
      },
      minify: {
        src: ['src/xivelyjs.js', 'src/**/*.js'],
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
