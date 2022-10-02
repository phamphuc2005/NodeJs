const path = require('path');
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const app = express();
const port = 3002;

const route = require('./routes');
const db = require('./config/db');
const SortMiddleware = require('./app/middlewares/SortMiddleware');

db.connect();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'));

app.use(morgan('combined'));

// app.get(
//     '/middleware',
//     function(req, res, next) {
//         if(['vethuong', 'vevip'].includes(req.query.ve)) {
//             req.face = '|||';
//             return next();
//         }
//         res.status(403).json({message: "Access denied!"});
//     },
//     function(req, res, next) {
//         res.json({
//             message: 'Successfully!',
//             face: req.face
//         });
//     }
// );

app.use(SortMiddleware);

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        helpers: {
            sum: (a, b) => a + b,
            sortable:(field, sort) => {
                const sortType = field ===sort.column ? sort.type : 'default';
                const icons = {
                    default:'fa-solid fa-sort',
                    asc:'fa-solid fa-arrow-down-short-wide',
                    desc:'fa-solid fa-arrow-down-wide-short'
                };
                const types = {
                    default: 'asc',
                    asc: 'desc',
                    desc: 'asc',
                };
                const icon = icons[sortType];
                const type = types[sortType];

                return `<a href="?_sort&column=${field}&type=${type}">
                <i class="${icon}"></i>
              </a>`;
            }
        },
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
