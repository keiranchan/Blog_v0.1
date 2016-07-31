var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);



var routes = require('./routes/index');
var settings = require('./setting');
var flash = require('connect-flash');
var app = express();

app.set('port', process.env.PORT || 3000);
//设置了模板文件的存储位置和使用的模板引擎.express -e blog 只是初始化了一个使用 ejs 模板引擎的工程,
// 真正指定使用哪个模板引擎的是 app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//设置了静态文件目录为 public 文件夹
app.use(express.static(path.join(__dirname, 'public')));

//使用 express-session 和 connect-mongo 模块实现了将会化信息存储到mongoldb中。
// 通过设置 cookie 的 maxAge 值设定 cookie 的生存期，这里我们设置 cookie 的生存期为 30 天，
// 设置它的 store 参数为 MongoStore 实例，把会话信息存储到数据库中，以避免丢失
//可通过 req.session 获取当前用户的会话对象
app.use(session({
  secret: settings.cookieSecret, // secret 用来防止篡改 cookie，key 的值为 cookie 的名字，
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));

routes(app);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});