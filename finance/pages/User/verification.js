
export default function VerifyUser(UserPackage, VerificationError)
{
    console.log(UserPackage);
    const UsernameVerification = /^([A-z\d!-/:-@]){6,}/;
    const PasswordVerification = /'^(?=.*[A-Z])(?=.*[!-/:-@])(?=.*\d)([A-z\d!-/:-@]){8,}/;
    const PasswordTest = PasswordVerification.test(UserPackage.password);
    console.log(PasswordTest);
    
    return PasswordTest;
}