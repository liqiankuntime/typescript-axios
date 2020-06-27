const fs = require('fs');
const path = require('path');
const webpack = require('webpack');


module.exports ={
    mode: 'development',
    /** 会在examples目录下创建多个子目录
    * 把不同章节的demo放到不同的子目录中
    * 每个子目录下创建一个app.ts
    * app.ts 作为webpack构建的入口问题
    * entries 搜集了多个目录入口文件，并且每个入口都引入了一个用于热更新的文件
    * entries 是一个对象，key为目录名
    */
   //readFileSync 是同步获取文件
   entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    	console.log('dir:', entries, dir, fs.readFileSync(__dirname));
    	const fullDir = path.join(__dirname, dir);
		const entry = path.join(fullDir, 'app.ts');
		if(fs.statSync(fullDir).isDirectory() && fs.existsSync(entry) ){
			entries[dir]=['webpack-hot-middleware/client', entry];
		}
		return entries;
   }, {}),
   /**
	* 根据不同的目录名称，打包生成目标js，名称和目录值一致
   */
  output: {
	path: path.join(__dirname, '__build__'),
	filename: '[name].js',
	publicPath: '/__build__/'
  },
  module:{
	  rules: [
		  {
			test: '\.ts$',
			enforce: 'pre',
			use: [
				{loader: 'tslint-loader'}
			]
		  },
		  {
			  test: '\.tsx?$',
			  use: [
				  {
					loader: 'ts-loader',
					options: {
						transpileOnly: true
					}
				  }
			  ]
		  }
	  ]
  },
  resolve: {
	extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
	new webpack.HotModuleReplacementPlugin(),
	new webpack.NoEmitOnErrorsPlugin()
  ]
}