from pydantic import BaseModel

# Create Password Reset Request
class CreatePasswordResetRequest(BaseModel):
    email: str
# Create Password Reset Code
class CreatePasswordResetCodeRequest(BaseModel):
    email: str


# Verify Password Reset Code
class VerifyPasswordResetCodeRequest(BaseModel):
    code: str


# Reset Password
class ResetPasswordRequest(BaseModel):
    password: str

class UpdatePasswordResetRequest(BaseModel):
    code: str
    new_password: str

# Create Password Reset Code
class CreatePasswordResetCodeResponse(BaseModel):
    message: str


# Verify Password Reset Code
class VerifyPasswordResetCodeResponse(BaseModel):
    verified: bool


# Reset Password
class ResetPasswordResponse(BaseModel):
    message: str