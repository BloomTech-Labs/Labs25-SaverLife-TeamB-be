var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *    description: root path returning status
 *    tags:
 *      - status
 *    produces:
 *      - applicaiton/json
 *    responses:
 *      200:
 *        description: status is up
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - api
 *              properties:
 *                api:
 *                  type: boolean
 *                  example: true
 */
router.get('/', function (req, res) {
  res.status(200).json({ api: 'up', timestamp: Date.now() });
});

const cors = require('cors');

router.use(cors()); 

var dotenv = require('dotenv');

router.get('/refer', (req, res) => {
  res.render('refer');
});

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post('/refer', async (req, res) => {
  const msg = {
    to: req.body.to,
    from: 'Saverlifemail@gmail.com',
    subject: 'You have been invited to join SaverLife',
    text: 'Please checkout SaverLife and signup! https://b.saverlife.dev/login',
    html: '<strong>Please checkout SaverLife and signup! https://b.saverlife.dev/login</strong>',
  };
  try {
    await sgMail.send(msg);
} catch (error) {
    console.error(error);

    if (error.response) {
        console.error(error.response.body)
    }
}

  });

module.exports = router;
