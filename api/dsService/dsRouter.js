const express = require('express');
const router = express.Router();
const dsModel = require('./dsModel');
const authRequired = require('../middleware/authRequired');
const checkCache = require('../middleware/checkCache');
const saveDataToCache = require('../utils/saveDataToCache');
const Profiles = require('../profile/profileModel');
/**
 * @swagger
 * /data/predict/{x1}/{x2}/{x3}:
 *  get:
 *    description: Get prediction for 3 inputs
 *    summary: Returns a prediction result
 *    security:
 *      - okta: []
 *    tags:
 *      - data
 *    parameters:
 *      - x1:
 *        name: x1
 *        in: path
 *        description: a positive number
 *        required: true
 *        example: 3.14
 *        schema:
 *          type: number
 *      - x2:
 *        name: x2
 *        in: path
 *        description: a number
 *        required: true
 *        example: -42
 *        schema:
 *          type: number
 *      - x3:
 *        name: x3
 *        in: path
 *        description: label for prediction
 *        required: true
 *        example: banjo
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A predition result object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                prediction:
 *                  type: boolean
 *                  description: is prediction true or false
 *                probability:
 *                  type: number
 *                  description: the probability between 0 and 1
 *              example:
 *                prediction: true
 *                probability: 0.9479960541387882
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Error making prediction'
 */

router.get('/predict/:x1/:x2/:3', authRequired, function (req, res) {
  const x1 = String(req.params.x1);
  const x2 = String(req.params.x2);
  const x3 = String(req.params.x3);

  dsModel
    .getPrediction(x1, x2, x3)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      // console.error(error);
      res.status(500).json(error);
    });
});

/**
 * @swagger
 * /data/viz/{state}:
 *  get:
 *    description: plotly vizualization data
 *    summary: Returns a plotly data
 *    security:
 *      - okta: []
 *    tags:
 *      - data
 *    parameters:
 *      - state:
 *        name: state
 *        in: path
 *        description: get viz data for state
 *        required: true
 *        example: UT
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: A plotly result object. See [DS service](https://ds-bw-test.herokuapp.com/#/default/viz_viz__statecode__get) for detailed docs.
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      500:
 *        description: 'Error making prediction'
 */
router.get('/viz/:state', authRequired, function (req, res) {
  const state = String(req.params.state);

  dsModel
    .getViz(state)
    .then(async (response) => {
      await dsModel.add(response.data[0]);
      res.status(200).json(response.data[0]);
    })
    .catch((error) => {
      // console.error(error);
      res.status(500).json(error);
    });
});

router.post('/moneyflow', authRequired, checkCache, async (req, res) => {
  try {
    // Calling getId method from profileModel to get ds_id from postgres
    // The getId method returns an object e.g.{ds_id: '...'}
    // Dot notation is needed to access it
    const originalRequest = JSON.stringify(req.body);
    const id = await Profiles.getId(req.body.user_ID);
    req.body.user_ID = id.ds_id;

    // Calling moneyflowPost method from dsModel
    // Sending the request body now updated with the ds_id as a parameter
    const response = await dsModel.moneyflowPost(req.body);
    res.status(201).json(response.data);
    saveDataToCache(originalRequest, response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/spending', authRequired, checkCache, async (req, res) => {
  try {
    // Calling getId method from profileModel to get ds_id from postgres
    // The getId method returns an object e.g.{ds_id: '...'}
    // Dot notation is needed to access it
    const originalRequest = JSON.stringify(req.body);
    const id = await Profiles.getId(req.body.user_ID);
    req.body.user_ID = id.ds_id;

    // Calling spendingPost method from dsModel
    // Sending the request body now updated with the ds_id as a parameter
    const response = await dsModel.spendingPost(req.body);
    res.status(201).json(response.data);
    saveDataToCache(originalRequest, response);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error);
  }
});

router.post('/futureBudget', authRequired, async (req, res) => {
  try {
    // Calling getId method from profileModel to get ds_id from postgres
    // The getId method returns an object e.g.{ds_id: '...'}
    // Dot notation is needed to access it
    // console.log(req.body);
    const id = await Profiles.getId(req.body.user_id);
    // console.log(id.ds_id);
    // Setting user_Id in request body to ds_id
    req.body.user_id = id.ds_id;
    // Declaring variables from body
    const monthly_savings_goal = req.body.monthly_savings_goal;
    const user_categories = req.body.placeholder;

    // Updating the monthly_savings_goal and user_categories column in postgres
    // Using add method from profileModel to update the columns by ds_id
    // And declaring changes_to... variable to track if the columns were updated
    const changes_to_goal = await Profiles.add(id.ds_id, {
      monthly_savings_goal,
    });
    // console.log(changes_to_goal);

    const changes_to_categories = await Profiles.add(id.ds_id, {
      user_categories,
    });
    // console.log(changes_to_categories);

    // Calling futurebudgetPost method from dsModel
    // Sending the request body now updated with the ds_id as a parameter
    const response = await dsModel.futurebudgetPost(req.body);
    res.status(201).json(response.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error);
  }
});
router.get('/futureBudget', authRequired, async (req, res) => {
  try {
    const budget = await Profiles.getById(req.headers.user_id);
    const id = await Profiles.getId(req.headers.user_id);
    const user_id = id.ds_id;
    budget['placeholder'] = budget['user_categories'];
    delete budget['user_categories'];
    const body = { ...budget, user_id };
    const response = await dsModel.futurebudgetPost(body);
    const modResponse = Object.entries(response.data);
    res.status(201).json(modResponse);
  } catch (error) {
    // console.error(error);
    res.status(500).json(error);
  }
});
router.get(`/currentMonthSpending`, authRequired, async (req, res) => {
  try {
    const id = await Profiles.getId(req.headers.user_id);
    const user_id = id.ds_id;
    const response = await dsModel.getCurrentMonthSpending(user_id);
    const modResponse = Object.entries(response.data);
    res.status(200).json(modResponse);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
