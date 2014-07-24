module.exports = function (grunt) {
	
	var pkg = require('./package.json');

	grunt.registerTask('default', ['clean', 'sass', 'csslint:lax', 'jshint', 'concat', 'autoprefixer', 'mincss', 'uglify', 'copy']);
	grunt.registerTask('doc', ['jsdoc']);
	grunt.registerTask('watch', ['watch']);

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-mincss');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		'clean': {
			all: ['build', 'assets']
		},
		'sass': {
			assets: {
				files: [{
					expand: true,
					cwd: 'src/scss',
					src: ['*.scss'],
					dest: 'src/css',
					ext: '.css'
				}]
			}
		},
		'csslint': {
			strict: {
				options: {
					'import': 2
				},
				src: ['src/css/*.css']
			},
			lax: {
				options: {
					'adjoining-classes': false,
					'box-sizing': false,
					'box-model': false,
					'floats': false,
					'font-sizes': false,
					'ids': false,
					'import': false,
					'known-properties': false,
					'outline-none': false,
					"qualified-headings": false,
					'unique-headings': false,
					'universal-selector': false,
					'unqualified-attributes': false
				},
				src: ['src/css/*.css']
			}
		},
		'jshint': {
			all: [
				'Gruntfile.js',
				'src/js/*.js'
			]
		},
		'mochaTest': {
			test: {
				options: {
					reporter: 'spec'
				},
				src: ['test/*.js']
			}
		},
		'jsdoc': {
			assets: {
				src: ['src/js/*.js'],
				options: {
					destination: 'doc'
				}
			}
		},
		'concat': {
			css: {
				src: 'src/css/*.css',
				dest: 'build/css/base.css'
			},
			js: {
				src: [
					'src/js/app/*.js'
				],
				dest: 'build/js/app.js'
			}
		},
		'autoprefixer': {
			no_dest: {
				src: 'build/css/base.css'
			}
		},
		'mincss': {
			compress: {
				files: {
					'assets/css/base.min.css': [
						'build/css/base.css'
					]
				}
			}
		},
		'uglify': {
			js: {
				files: {
					'assets/js/app.min.js': [
						'build/js/app.js'
					]
				}
			}
		},
		'copy': {
			main: {
				files: [
					{
						expand: true,
						cwd: 'src/img',
						src: ['**'],
						dest: 'assets/img/'
					},
					{
						expand: true,
						cwd: 'src/fonts',
						src: ['**'],
						dest: 'assets/fonts/'
					},
					{
						expand: true,
						cwd: 'src/js',
						src: ['main.js'],
						dest: 'assets/js/'
					}
				]
			}
		},
		'watch': {
			files: ['src/**'],
			tasks: ['default']
		}
	});

};