import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import axios from 'axios';


const superagent = superagentPromise(_superagent, global.Promise);

var isDevelopment = process.env.NODE_ENV === 'development';
var API_ROOT = 'https://viewtent.com/api'
if (isDevelopment) {
  API_ROOT = 'http://localhost:3000/api'
}

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (email, password) =>
    requests.post('/users', { user: {email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Tags = {
  getAll: () => requests.get('/tags')
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = interview => Object.assign({}, interview, { slug: undefined })
const Interviews = {
  all: page =>
    requests.get(`/interviews?${limit(10, page)}`),
  byAuthor: (author, page) =>
    requests.get(`/interviews?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/interviews?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/interviews/${slug}`),
  favorite: slug =>
    requests.post(`/interviews/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/interviews?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/interviews/feed?limit=10&offset=0'),
  get: slug =>
    requests.get(`/interviews/${slug}`),
  unfavorite: slug =>
    requests.del(`/interviews/${slug}/favorite`),
  update: interview =>
    requests.put(`/interviews/${interview.slug}`, { interview: omitSlug(interview) }),
  create: interview =>
    requests.post('/interviews', { interview }),
  upload: (data) =>
    axios.post(API_ROOT+'/interviews/upload', data), 
  createApplier : (slug, applier)  => 
    requests.post(`/interviews/${slug}/appliers`, { applier }),
  appliersForInterview: slug =>
    requests.get(`/interviews/${slug}/appliers`)
};

const Questions = {
  create: (slug, question) =>
    requests.post(`/interviews/${slug}/questions`, { question }),
  delete: (slug, questionId) =>
    requests.del(`/interviews/${slug}/questions/${questionId}`),
  forInterview: slug =>
    requests.get(`/interviews/${slug}/questions`)
};

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  get: username =>
    requests.get(`/profiles/${username}`),
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`)
};

export default {
  Interviews,
  Auth,
  Questions,
  Profile,
  Tags,
  setToken: _token => { token = _token; }
};
