module.exports = {
    defaultServerResponse: {
        status: 400,
        message: '',
        body: {}
    },
    productMessage: {
        PRODUCT_CREATED: 'Product created successfully',
        PRODUCT_FETCHED: 'Product fetched successfully',
        PRODUCT_UPDATED: 'Product updated successfully',
        PRODUCT_DELETED: 'Product deleted successfully',
        PRODUCT_NOT_FOUND: 'Product not found'
    },
    userMessage: {
        SIGNUP_SUCCESS: 'Sign up success',
        LOGIN_SUCCESS: 'Login success',
        DUPLICATE_EMAIL: 'Email address already exists',
        USER_NOT_FOUND: 'User not found',
        INVALID_PASSWORD: 'Incorrect password',
        PROFILE_INVALID_SAVE: 'Error saving profile',
        PROFILE_VALID_SAVE: 'Profile saved successfully'
    },
    requestValidationMessage: {
        BAD_REQUEST: 'Invalid fields',
        TOKEN_MISSING: 'Token missing from header'
    },
    databaseMessage: {
        INVALID_ID: 'Invalid ID'
    }
};
