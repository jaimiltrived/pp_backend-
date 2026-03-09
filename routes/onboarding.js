const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');

router.post('/organization', onboardingController.storeOrganization);
router.post('/send-otp', onboardingController.sendOtp);
router.post('/verify-otp', onboardingController.verifyOtp);
router.post('/create-user', onboardingController.createUser);
router.post('/organization-info', onboardingController.storeOrganizationInfo);
router.post('/personal-info', onboardingController.storePersonalInfo);
router.get('/industry-codes', onboardingController.getIndustryCodes);
router.post('/select-industry', onboardingController.selectIndustry);
router.post('/payment-method', onboardingController.storePaymentMethod);

module.exports = router;
