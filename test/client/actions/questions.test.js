import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { mockStore } from '../client_test_helpers';
import createQuestion from '../../../public/src/actions/questions';

describe('Questions actions', () => {
  const history = { goBack: jest.fn() }
  const question = {
    title: 'Hi',
    description: 'why',
    type: 'paragraph'
  };
  const question2 = {
    title: 'Hi',
    description: 'whaaat',
    type: 'multiselect',
    responses: {
      'option1':'hi',
      'option32':'no',
      'option4':'yes',
      'option31':'ok',
    }
  };
  let mock;
  let store;
  beforeEach(() => {
    mock = new MockAdapter(axios);
    store = mockStore();
  });
  describe('createQuestion ', () => {
    beforeEach(() => {
      mock.onPost('/questions').reply(201, question);
    });
    afterEach(() => {
      mock.reset();
    });
    describe('axios POST request: ', () => {
      it('should call history.goBack() on successful submit ', () => {
        return store.dispatch(createQuestion(question, history))
          .then((response) => {
            expect(history.goBack).toBeCalled();
          });
      });
      it('should dispatch redux form DESTROY type ', () => {
        return store.dispatch(createQuestion(question, history))
          .then((response) => {
            expect(store.getActions()[0].type).toBe('@@redux-form/DESTROY');
          });
      });
      it('should return 201 for status', () => {
        return store.dispatch(createQuestion(question, history))
          .then((response) => {
            expect(response.status).toBe(201);
          });
      });
      it('should return empty responses for question.type="paragraph"', () => {
        return store.dispatch(createQuestion(question, history))
          .then((response) => {
            expect(response.config.data).toContain('"responses":""');
          });
      });
      it('should return responses for question with options', () => {
        return store.dispatch(createQuestion(question2, history))
          .then((response) => {
            expect(response.config.data).toContain('"responses":"hi,no,yes,ok"');
          });
      });
    });
  });
});
