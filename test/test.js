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
    title: 'testMovie',
    releaseDate: '2011-05-10',
    genre: 'Drama',
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
    title: 'testMovie',
    releaseDate: '2002-09-31',
    genre: 'Romance',
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
    movie: 'testMovie',
    rating: 2,
    review: 'Test Movie Review1'
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

    describe('Get Movies', () => {
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

    describe('Post Movie', ()=> {
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

    describe('Update Movie', () => {
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

    describe('Delete Movie', () => {
        it('Should find and delete a saved Movie in DB', (done) => {
            chai.request(server)
                .delete('/movies')
                .set('Authorization', this.token)
                .send({title: 'testMovie'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    done();
                });
        });
    });

    describe('Post Review', ()=> {
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

    describe('Get Reviews', () => {
        it('Should get all Reviews from DB.', (done) => {
            // Read all movies
            chai.request(server)
                .get('/reviews')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.eql(true);
                    res.body.should.have.property('reviews');
                    done();
                });
        });
    });
});