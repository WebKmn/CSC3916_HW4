const envPath = __dirname + "/../.env";
require('dotenv').config({path:envPath});

const User = require('../schemas/Users'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server');


chai.should();
chai.use(chaiHttp);

let register_details = {
    name: 'test',
    username: 'email@mail.com',
    password: 'password'
};

let login_details = {
    username: 'email@mail.com',
    password: 'password'
};

let movie_details = {
    title: 'Test Movie',
    releaseDate: '2011-05-10',
    genre: 'Drama',
    imgUrl: 'Test movie image url',
    actors: [
        {
            actorName: 'Actor1',
            characterName: 'Galaxy Man'
        },
        {
            actorName: 'Actor2',
            characterName: 'Pixel Man'
        },
        {
            actorName: 'Actor3',
            characterName: 'iPhone Man'
        }
    ]
};

let update_movie = {
    title: 'Test Movie',
    releaseDate: '2002-09-31',
    genre: 'Romance',
    imgUrl: 'Test movie image url 2',
    actors: [
        {
            actorName: 'Actor',
            characterName: 'Ip Man'
        },
        {
            actorName: 'Actor1',
            characterName: 'Bruce Lee'
        },
        {
            actorName: 'Actor2',
            characterName: 'Chris Rock'
        }
    ]
};

let review_details = {
    user: '',
    movie: 'Test Movie',
    rating: 4,
    review: 'Not bad.'
}

describe('Server CRUD Testing', () =>{
    after((done) =>{
        User.deleteOne({name: 'test'}, (err) =>{
            if(err) throw err;
        })
        done();
    });

    describe('Register',()=> {
        it('Should signup a new User and save to DB.', (done) => {
           // signup
            chai.request(server)
                .post('/signup')
                .send(register_details)
                .end((err, res) => {
                   res.should.have.status(200);
                   res.body.success.should.eql(true);
                   done();
                });
        });
    });

    describe('Sign in', () => {
        it('Should login a saved User and save JWT Token.', (done) => {
            // sign in
            chai.request(server)
                .post('/signin')
                .send(login_details)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    this.token = res.body.token;
                    done();
                });
        });

    });

    describe('Post A Movie', ()=> {
        it('Should post a new Movie to DB.', (done) => {
            chai.request(server)
                .post('/movies')
                .set('Authorization', this.token)
                .send(movie_details)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    done();
                });
        });
    });

    describe('Update A Movie', () => {
        it('Should find and update a saved Movie in DB.', (done) => {
            chai.request(server)
                .put('/movies')
                .set('Authorization', this.token)
                .send(update_movie)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    done();
                });
        });
    });

    describe('Post A Review', ()=> {
        it('Should post a new Review for a movie in DB.', (done) => {
            chai.request(server)
                .post('/reviews')
                .set('Authorization', this.token)
                .send(review_details)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    done();
                });
        });
    });

    describe('Get A Movie', () => {
        it('Should get a Movie from DB.', (done) => {
            // Read all movies
            chai.request(server)
                .get('/movies/Test Movie')
                .query({reviews: true})
                .set('Authorization', this.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    res.body.should.have.property('movie');
                    done();
                });
        });
    });

    describe('Get All Movies', () => {
        it('Should get all Movies from DB.', (done) => {
            // Read all movies
            chai.request(server)
                .get('/movies')
                .query({reviews: true})
                .set('Authorization', this.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    res.body.should.have.property('movies');
                    done();
                });
        });
    });

    describe('Get All Reviews', () => {
        it('Should get all Reviews from DB.', (done) => {
            // Read all movies
            chai.request(server)
                .get('/reviews')
                .set('Authorization', this.token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    res.body.should.have.property('reviews');
                    done();
                });
        });
    });

    describe('Delete A Movie', () => {
        it('Should find and delete a saved Movie in DB', (done) => {
            chai.request(server)
                .delete('/movies')
                .set('Authorization', this.token)
                .send({title: 'Test Movie'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    done();
                });
        });
    });
});