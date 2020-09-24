const express = require('express');
const router = express.Router();
const dsModel = require('./dsModel');
const authRequired = require('../middleware/authRequired');
const checkCache = require('../middleware/checkCache');
const checkGetCache = require('../middleware/checkGetCache');
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

router.post('/moneyflow', authRequired, checkCache, async (req, res) => {
  try {
    const originalRequest = JSON.stringify(req.body);

    // getting Bank Account Id from database with user id as an argument
    const { bank_account_id } = await Profiles.getBankAccountId(
      req.body.user_id
    );
    req.body.bank_account_id = bank_account_id;

    // Sending the request body that is now updated with the bank_account_id
    const response = await dsModel.moneyFlowPost(req.body);

    saveDataToCache(originalRequest, response.data);

    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/spending', authRequired, checkCache, async (req, res) => {
  try {
    const originalRequest = JSON.stringify(req.body);

    // getting Bank Account Id from database with user id as an argument
    const { bank_account_id } = await Profiles.getBankAccountId(
      req.body.user_id
    );
    req.body.bank_account_id = bank_account_id;

    // Sending the request body that is now updated with the bank_account_id
    const response = await dsModel.spendingPost(req.body);

    saveDataToCache(originalRequest, response.data);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/futureBudget', authRequired, async (req, res) => {
  try {
    const categories = [];

    const { bank_account_id } = await Profiles.getBankAccountId(
      req.body.user_id
    );
    req.body.bank_account_id = bank_account_id;

    const maxSpendingRes = await dsModel.futureBudgetPost(req.body);

    for (const key in maxSpendingRes.data) {
      categories.push(key);
    }

    const monthly_savings_goal = req.body.monthly_savings_goal;

    if (maxSpendingRes) {
      // Updating the monthly_savings_goal and placeholder(discretionary_categories) column in database
      const changes_to_goal = await Profiles.updateProfileById(
        req.body.user_id,
        { monthly_savings_goal }
      );
      const changes_to_categories = await Profiles.updateProfileById(
        req.body.user_id,
        { categories }
      );

      res
        .status(201)
        .json(
          `${changes_to_goal} monthly savings goal column updated and ${changes_to_categories} categories column updated`
        );
    } else {
      res.status(400).json('Could not retrieve budget information');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get('/futureBudget', authRequired, checkGetCache, async (req, res) => {
  try {
    let data = {};
    //Budget info is the integer monthly_saving_goal and a string placeholder
    // e.g {monthly_saving_goal: 400, placeholder: 'Auto, Financial, Food'}
    const budgetInfo = await Profiles.getBudgetInfoByUserId(
      req.headers.user_id
    );
    // getting Bank Account Id from database with user id as an argument
    const { bank_account_id } = await Profiles.getBankAccountId(
      req.headers.user_id
    );
    // adding bank account id to budget info object
    const budgetInfoAndId = {
      ...budgetInfo,
      bank_account_id,
      placeholder: 'banjo',
    };

    const maxSpendingRes = await dsModel.futureBudgetPost(budgetInfoAndId);

    const currSpendingRes = await dsModel.getCurrentMonthSpending(
      bank_account_id,
      budgetInfo.categories
    );
    // Creating a object with categories as the key and objects as values
    // The objects have max spending and current spending as keys with respective values
    // e.g. { Auto: { maxSpending: 55, currSpending: 0 },
    //        Financial: { maxSpending: 265, currSpending: 151.42 }, ... etc }

    for (const key in maxSpendingRes.data) {
      data[key] = {
        maxSpending: maxSpendingRes.data[key],
        currSpending: currSpendingRes.data[key],
      };
    }

    const stringRequest = JSON.stringify(budgetInfoAndId);
    const response = data;

    saveDataToCache(stringRequest, response);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/budgetGoal', authRequired, async (req, res) => {
  try {
    const budgetInfo = await Profiles.getBudgetInfoByUserId(
      req.headers.user_id
    );
    if (budgetInfo) {
      res.status(200).json(budgetInfo.monthly_savings_goal);
    } else {
      res.status(404).json(budgetInfo);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
