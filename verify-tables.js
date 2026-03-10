const { User, Organization, OrganizationInfo, PersonalInfo, IndustryCode, UserIndustry, PaymentMethod, OTP } = require('./config/db');

async function verify() {
  try {
    const userCount = await User.count();
    const orgCount = await Organization.count();
    const orgInfoCount = await OrganizationInfo.count();
    const personalInfoCount = await PersonalInfo.count();
    const industryCodeCount = await IndustryCode.count();
    const userIndustryCount = await UserIndustry.count();
    const paymentMethodCount = await PaymentMethod.count();
    const otpCount = await OTP.count();

    console.log('--- Database Table Verification ---');
    console.log('Users:', userCount);
    console.log('Organizations:', orgCount);
    console.log('OrganizationInfos:', orgInfoCount);
    console.log('PersonalInfos:', personalInfoCount);
    console.log('IndustryCodes:', industryCodeCount);
    console.log('UserIndustries:', userIndustryCount);
    console.log('PaymentMethods:', paymentMethodCount);
    console.log('OTPs (recent):', otpCount);
    console.log('-----------------------------------');

    if (userCount > 0 && orgCount > 0 && orgInfoCount > 0 && personalInfoCount > 0 && userIndustryCount > 0 && paymentMethodCount > 0) {
      console.log('SUCCESS: All onboarding tables have data.');
    } else {
      console.log('FAILURE: Some tables are empty.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
}

verify();
